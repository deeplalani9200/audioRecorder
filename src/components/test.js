import React, { useEffect } from "react";
// const electron = window.require("electron");

const Test = () => {
  const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
  console.log("start audio recording");

  const recorder = await recordAudio();
  // const actionButton = document.getElementById("action");
  // actionButton.disabled = true;
  recorder.start();
  await sleep(4000);
  const audio = await recorder.stop();
  console.log('playing');
  audio.play();
  await sleep(4000);
  // actionButton.disabled = false;
};

  useEffect(() => {
    handleAction();
  }, []);

  return (
    <React.Fragment>
      <h1>Hello World</h1>
    </React.Fragment>
  );
};

export default Test;
