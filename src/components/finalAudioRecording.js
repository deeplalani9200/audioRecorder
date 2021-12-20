import React, { useEffect, useState } from "react";
const { desktopCapturer, ipcRenderer } = window.myAPI;

const FinalAudioRecording = () => {
  const [multiMediaRecorder, setMultiMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedFiles, setRecordedFiles] = useState([]);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [systemAudioList, setSystemAudioList] = useState([]);
  const [systemPlayingAudio, setSystemPlayingAudio] = useState(null);

  let recordedChunks = [];

  useEffect(() => {
    if (systemPlayingAudio) {
      systemPlayingAudio.play();
    }
  }, [systemPlayingAudio]);

  useEffect(() => {
    if (playingAudio) {
      playingAudio.play();
    }
  }, [playingAudio]);

  const getRecordedFiles = () => {
    ipcRenderer.invoke("get-recorded-file-name").then((result) => {
      setRecordedFiles(result);
    });
  };

  const getSystemAudioFiles = () => {
    ipcRenderer.invoke("get-audio-file-name").then((result) => {
      setSystemAudioList(result);
    });
  };

  useEffect(() => {
    getRecordedFiles();
    getSystemAudioFiles();
  }, []);

  useEffect(() => {
    if (multiMediaRecorder) {
      multiMediaRecorder.start();
      multiMediaRecorder.ondataavailable = (e) => handleDataAvailable(e);
      multiMediaRecorder.onstop = async () => handleStop();
      setIsRecording(true);
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
      desktopGain.gain.value = 0.4;
      source1.connect(desktopGain).connect(destination);
      hasDesktop = true;
    }

    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 1;
      source2.connect(voiceGain).connect(destination);
      hasVoice = true;
    }

    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  };

  const muitiStreamCombine = (desktopStream, voiceStream) => {
    const tracks = [...mergeAudioStreams(desktopStream, voiceStream)];
    const stream = new MediaStream(tracks);
    setMultiMediaRecorder(new MediaRecorder(stream));
  };

  const start = async () => {
    // const inputSources = desktopCapturer.getSources({
    //   types: ["window", "screen"],
    // });
    // const source = inputSources.find((source) => (source.name = "React App"));

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
    muitiStreamCombine(stream, audioStream);
  };

  async function handleStop(e) {
    const blob = new Blob(recordedChunks);
    const audioBuffer = Buffer.from(await blob.arrayBuffer());
    ipcRenderer
      .invoke("save-recorded-file", {
        audioBuffer: audioBuffer,
        filename:
          "./src/assets/recordedTracks/track-" +
          (recordedFiles.length > 8
            ? recordedFiles.length + 1
            : `0${recordedFiles.length + 1}`) +
          ".mp3",
      })
      .then((result) => {});
    // let url = URL.createObjectURL(blob);
    // const audio = new Audio(url);
    // audio.play();
    setIsRecording(false);
    getRecordedFiles();
  }

  function handleDataAvailable(e) {
    recordedChunks.push(e.data);
  }

  const stop = () => {
    multiMediaRecorder.stop();
  };

  const playAudioByFilename = async (filename) => {
    setIsPlaying(true);
    const data = await ipcRenderer
      .invoke("get-recorded-file-data", { filename: filename })
      .then((result) => {
        return result;
      });
    const arraybuffer = Uint8Array.from(data).buffer;
    const blob = new Blob([new Uint8Array(arraybuffer)]);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    setPlayingAudio(audio);
  };

  const stopAudioPlaying = () => {
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
      setIsPlaying(false);
    }
  };

  const playSystemAudioByFilename = async (filename) => {
    const data = await ipcRenderer
      .invoke("get-audio-file-data", { filename: filename })
      .then((result) => {
        return result;
      });
    const arraybuffer = Uint8Array.from(data).buffer;
    const blob = new Blob([new Uint8Array(arraybuffer)]);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    setSystemPlayingAudio(audio);
  };

  const stopSystemAudioPlaying = () => {
    if (systemPlayingAudio) {
      systemPlayingAudio.pause();
      setSystemPlayingAudio(null);
    }
  };

  return (
    <React.Fragment>
      <div>
        <div>System Audio</div>
        <div>
          <button onClick={() => stopSystemAudioPlaying()}>
            Pause Audio Playing
          </button>
          {systemAudioList.map((filename) => (
            <h5
              style={{
                cursor: "pointer",
                marginBottom: "0px",
                marginTop: "12px",
              }}
              onClick={() => playSystemAudioByFilename(filename)}
            >
              {filename}
            </h5>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>Audio Recorder</div>
      <div>
        {!isRecording ? (
          <button onClick={() => start()}>Start Recording</button>
        ) : (
          <button onClick={() => stop()}>Stop Recording</button>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <div>Audio Player</div>
        <button onClick={() => stopAudioPlaying()}>Pause Audio Playing</button>
      </div>
      <div>
        {recordedFiles.map((filename) => (
          <h5
            style={{
              cursor: "pointer",
              marginBottom: "0px",
              marginTop: "12px",
            }}
            onClick={() => playAudioByFilename(filename)}
          >
            {filename}
          </h5>
        ))}
      </div>
    </React.Fragment>
  );
};

export default FinalAudioRecording;
