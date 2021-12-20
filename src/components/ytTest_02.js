import React, { useState, useRef, useEffect } from "react";
const ipcRenderer = window.myAPI.ipcRenderer;
const YtTest02 = () => {

  const audioPlayer = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  let audio;

  useEffect(() => {
    // console.log(ipcRenderer);
    // ipcRenderer.invoke('print-name', "Deep Lalani").then((result) => {
    //   console.log('result', result); 
    // })
    audio = document.getElementById('audio');
    audio.src = 'file:///E:/Project/ElectronJs/electron-react-test-01/src/components/aud01.mp3';
    audio.load();
  },[]);


  const togglePlaying = () => {
    try {
      console.log(audioPlayer.current.src);
      if (isPlaying) {
        audioPlayer.current.pause();
      } else {
        audioPlayer.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (e) {
      console.log(e);
    } 
  };

  return (
    <React.Fragment>
      <audio
        id="audio"
        ref={audioPlayer}
        preload={'metadata'}
      />
      <button onClick={togglePlaying}>{isPlaying ? "pause" : "play"} system audio</button>
    </React.Fragment>
  );
};

export default YtTest02;
