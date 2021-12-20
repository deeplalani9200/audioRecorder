// import React, {useState} from "react";

// const DummyAudioRecorder = () => {
//     const [shouldStop, setShouldStop] = useState(false);
//     const [stopped, setStopped] = useState(false);
//     // const stopButton = document.getElementById("stop");

//     const audioRecordConstraints = {
//       echoCancellation: true,
//     };

//     const stopVideoRecord = () => {
//     console.log('here stop');
//     setShouldStop(true);
//     };

//     const handleRecord = function ({ stream, mimeType }) {
//       console.log("handle record");
//       let recordedChunks = [];
//       setStopped(false);
//       const mediaRecorder = new MediaRecorder(stream);

//       mediaRecorder.ondataavailable = function (e) {
//         if (e.data.size > 0) {
//           recordedChunks.push(e.data);
//         }

//         if (shouldStop === true && stopped === false) {
//           mediaRecorder.stop();
//           setStopped(true);
//         }
//       };

//       mediaRecorder.onstop = function () {
//         const blob = new Blob(recordedChunks, {
//           type: mimeType,
//         });
//       };

//       mediaRecorder.start(200);
//     };

//     async function recordAudio() {
//       const mimeType = "audio/webm";
//       setShouldStop(false);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: audioRecordConstraints,
//       });
//       handleRecord({ stream, mimeType });
//     }

//     async function recordScreen() {
//       console.log("satrt");
//       const mimeType = "audio/webm";
//       setShouldStop(false);
//       let stream = null;

//       console.log("1");
//       const displayStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: { echoCancellation: true },
//       });

//       const audioContext = new AudioContext();
//       const voiceStream = await navigator.mediaDevices.getUserMedia({
//         audio: { echoCancellation: true },
//         video: false,
//       });
//       const userAudio = audioContext.createMediaStreamSource(voiceStream);

//       const audioDestination = audioContext.createMediaStreamDestination();
//       userAudio.connect(audioDestination);

//       if (displayStream.getAudioTracks().length > 0) {
//         const displayAudio =
//           audioContext.createMediaStreamSource(displayStream);
//         displayAudio.connect(audioDestination);
//       }

//       const tracks = [
//         ...displayStream.getVideoTracks(),
//         ...audioDestination.stream.getTracks(),
//       ];
//       stream = new MediaStream(tracks);
//       handleRecord({ stream, mimeType });
//     }
//     return({ recordScreen, stopVideoRecord });
// };

// export default DummyAudioRecorder;
