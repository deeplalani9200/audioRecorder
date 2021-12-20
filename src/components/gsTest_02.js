import React from "react";

const GsTest02 = () => {
  let blobs;
  let blob;
  let rec;
  let stream;
  let voiceStream;
  let desktopStream;
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
      
    return (hasDesktop || hasVoice) ? destination.stream.getAudioTracks() : [];
  };

  const capture = async () => {
    
    desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: true });

    voiceStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    
  
    const tracks = [
      ...desktopStream.getVideoTracks(), 
      ...mergeAudioStreams(desktopStream, voiceStream)
    ];
    
    console.log('Tracks to add to stream', tracks);
    stream = new MediaStream(tracks);
    console.log('Stream', stream)
      
    blobs = [];
  
    rec = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp8,opus'});
    rec.ondataavailable = (e) => blobs.push(e.data);
    rec.onstop = async () => {
      
      //blobs.push(MediaRecorder.requestData());
      blob = new Blob(blobs, {type: 'video/webm'});
      let url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      console.log(audio);
    };
  }

  const start = () => {
    rec.start();
  }

  const stop = () => {
    rec.stop();
    stream.getTracks().forEach(s=>s.stop())
  }

  return <React.Fragment>
    <div>
      <button onClick={() => capture()}>Capture</button>
      <button onClick={() => start()}>Start</button>
      <button onClick={() => stop()}>Stop</button>
    </div>
  </React.Fragment>
}

export default GsTest02;