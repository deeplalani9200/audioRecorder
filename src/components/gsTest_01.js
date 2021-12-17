import React, { useState, useEffect } from "react";
import AudioRecorder from "./audioRecorder";
const ipcRenderer = window.myAPI.ipcRenderer;
// var ffmpeg = require('fluent-ffmpeg');
// var command = ffmpeg();

const GsTest01 = () => {
  const [recorder, setRecorder] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // useEffect(() => {
  //   var command1 = ffmpeg('/path/to/file.avi');
  // },[]);

  const saveBlob = async () => {
    const blob = audioList[0].audioBlob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer =  Buffer.from(arrayBuffer);
    ipcRenderer.invoke("save-file", {arrayBuffer: buffer }).then(result => {
      console.log(result, 'file-saved');
    });
  };

  const readBlob = async () => {
    const Data =  await ipcRenderer.invoke("read-file").then(result => {
      console.log(result, 'file-read');
      return result;
    });
    console.log(Data);
    const arraybuffer = Uint8Array.from(Data).buffer;
    console.log(arraybuffer);
    const blob = new Blob([new Uint8Array(arraybuffer)], {type: 'audio/webm;codecs=opus'});
    const url = URL.createObjectURL(blob);
     console.log(url);
    const audio = new Audio(url);
    console.log(audio.controller);
    audio.play();
  }

  const startRecording = async () => {
    setIsRecording(true);
    const tempRecorder = await AudioRecorder();
    setRecorder(tempRecorder);
    tempRecorder.start();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recorder) {
      const audio = await recorder.stop();
      setAudioList([...audioList, audio]);
    }
  };

  const playAudio = () => {
    if (audioList.length > 0) audioList[audioList.length - 1].audio.play();
  };

  const stopAudio = () => {
    if (audioList.length > 0) audioList[audioList.length - 1].audio.pause();
  };

  useEffect(() => {
   
    console.log(currentPlayingAudio);
    if (currentPlayingAudio && currentPlayingAudio.audio)
      currentPlayingAudio.audio.play();
  }, [currentPlayingAudio]);

  const playAudioById = (index) => {
    const audio = audioList[index];
    if (currentPlayingAudio && currentPlayingAudio == audio) {
      currentPlayingAudio.audio.play();
    } else {
      setCurrentPlayingAudio(audio);
    }
  };

  const stopPlayingAudio = () => {
    if (currentPlayingAudio && currentPlayingAudio.audio)
      currentPlayingAudio.audio.pause();
    setCurrentPlayingAudio(null);
  };

  return (
    <React.Fragment>
      <div>
        {isRecording ? (
          <button onClick={() => stopRecording()}>Stop Recording</button>
        ) : (
          <button onClick={() => startRecording()}>Start Recording</button>
        )}
        {/* <button onClick={() => playAudio()}>Start Playing</button>
        <button onClick={() => stopAudio()}>Stop Playing</button> */}
      </div>
      <div>
        {audioList.map((audio, index) => (
          <div key={index}>
            <button onClick={() => playAudioById(index)}>Play</button>
            <span>{index}</span>
          </div>
        ))}
        {audioList.length > 0 && (
          <div>
            <button onClick={() => stopPlayingAudio()}>Stop</button>
            <button onClick={() => saveBlob()}>Save Blob</button>
          </div>
        )}
        <button onClick={() => readBlob()}>Read Audio</button>
      </div>
    </React.Fragment>
  );
};

export default GsTest01;
