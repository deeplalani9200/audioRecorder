import "./App.css";
import Test from "./components/test";
import YtTest01 from "./components/ytTest_01";
import YtTest02 from "./components/ytTest_02";
import GsTest01 from "./components/gsTest_01";
import React, { useEffect, useState } from "react";

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
      <GsTest01/>
      <YtTest02/>
      {/* <Test /> */}
      {/* <YtTest01/> */}
    </div>
  );
}

export default App;
