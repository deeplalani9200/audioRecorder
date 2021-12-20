import "./App.css";
import React, { useEffect, useState } from "react";
// import Test from "./components/test";
// import YtTest01 from "./components/ytTest_01";
// import YtTest02 from "./components/ytTest_02";
// import GsTest01 from "./components/gsTest_01";
// import GsTest02 from "./components/gsTest_02";
// import GsTest03 from "./components/gsTest_03";
import FinalAudioRecording from "./components/finalAudioRecording";

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    window.myAPI.ipcRendererOn((event, ...args) => {
      setCount((count) => count + 1);
    });
  }, []);

  return (
    <div className="App">
      <h1>{count}</h1>
      {/* <GsTest01/> */}
      {/* <YtTest02 /> */}
      <FinalAudioRecording />
      {/* <GsTest02 /> */}
      {/* <GsTest03 /> */}
      {/* <Test /> */}
      {/* <YtTest01/> */}
    </div>
  );
}

export default App;
