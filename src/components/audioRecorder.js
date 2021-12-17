const recordAudio = () => {
  return new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {echoCancellation: true},
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        const start = () => {
          mediaRecorder.start();
        };

        const stop = () => {
          return new Promise((resolve) => {
            mediaRecorder.addEventListener("stop", () => {
              console.log(audioChunks);
              const audioBlob = new Blob(audioChunks, { type: "audio/webm;codecs=opus" });//audio/webm;codecs=opus //audio/mpeg
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              const play = () => {
                audio.play();
              };

              resolve({ audioBlob, audioUrl, play, audio });
            });

            mediaRecorder.stop();
          });
        };

        resolve({ start, stop });
      });
  });
};

export default recordAudio;
