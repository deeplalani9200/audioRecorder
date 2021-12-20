import React, { useEffect, useState } from "react";
const desktopCapturer = window.myAPI.desktopCapturer;

const GsTest03 = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [voiceMediaRecorder, setVoiceMediaRecorder] = useState(null);
  const [multiMediaRecorder, setMultiMediaRecorder] = useState(null);

  let recordedChunks = [];
  let blobs = [];
  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;
    }
  }, [mediaRecorder]);

  useEffect(() => {
    if (multiMediaRecorder) {
      multiMediaRecorder.ondataavailable = (e) => blobs.push(e.data);
      multiMediaRecorder.onstop = async () => {
        const blob = new Blob(blobs, { type: "video/webm" });
        let url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        console.log(audio);
      };

      
    }
  }, [multiMediaRecorder]);

  const mergeAudioStreams = (desktopStream, voiceStream) => {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      // If you don't want to share Audio from the desktop it should still work with just the voice.
      const source1 = context.createMediaStreamSource(desktopStream);
      const desktopGain = context.createGain();
      desktopGain.gain.value = 0.7;
      source1.connect(desktopGain).connect(destination);
      hasDesktop = true;
    }

    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.7;
      source2.connect(voiceGain).connect(destination);
      hasVoice = true;
    }

    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  };

  const muitiStreamCombine = (desktopStream, voiceStream) => {
    const tracks = [
      // ...desktopStream.getVideoTracks(),
      ...mergeAudioStreams(desktopStream, voiceStream),
    ];

    console.log("Tracks to add to stream", tracks);
    const stream = new MediaStream(tracks);
    console.log("Stream", stream);

    setMultiMediaRecorder(
      new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp8,opus" })
    );
  };

  const getVideoSource = async () => {
    const inputSources = await window.myAPI.desktopCapturer.getSources({
      types: ["window", "screen"],
    });

    console.log(inputSources); //React App
    const source = inputSources.find((source) => (source.name = "React App"));
    console.log(source);

    const constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: "desktop",
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    console.log("1");

    console.log("2");

    // Create the Media Recorder
    const options = { mimeType: "video/webm; codecs=vp9" };
    // setMediaRecorder(new MediaRecorder(stream, options));
    // setVoiceMediaRecorder(new MediaRecorder(audioStream, options));
    muitiStreamCombine(stream, audioStream);

    // mediaRecorder = new MediaRecorder(stream, options);
  };

  async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    var url = URL.createObjectURL(blob);
    const videoElement = document.getElementById("elVid");
    videoElement.src = url;
    videoElement.play();
    console.log(blob);
  }

  function handleDataAvailable(e) {
    console.log(e);

    console.log("video data available");
    recordedChunks.push(e.data);
  }

  const stop = () => {
    multiMediaRecorder.stop();
    // mediaRecorder.stop();
  };

  const start = () => {
    multiMediaRecorder.start();
    // mediaRecorder.start();
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "32px" }}>GsTest03</div>
      <div>
        <button onClick={() => getVideoSource()}>Get Video Sources</button>
        <button onClick={() => start()}>Start</button>
        <button onClick={() => stop()}>Stop</button>
      </div>
      <video id="elVid"></video>
    </React.Fragment>
  );
};

export default GsTest03;
