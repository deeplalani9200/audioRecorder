const { contextBridge, ipcRenderer, desktopCapturer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  ipcRendererOn: (menfun) => ipcRenderer.on("on-click-print", menfun),
  ipcRenderer: ipcRenderer,
  desktopCapturer: desktopCapturer,
});
