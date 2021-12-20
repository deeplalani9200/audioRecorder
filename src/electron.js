const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "/preload.js"),
    },
  });
  mainWindow.loadURL("http://localhost:3000");
  // mainWindow.loadFile('loadIndex.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  const menuTemplate = [
    {
      label: "View",
      submenu: [
        {
          label: "print",
          click() {
            mainWindow.webContents.send("on-click-print", "nhsdhjk");
          },
          accelerator: "Ctrl+P",
        },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  // Menu.setApplicationMenu(null);
}

ipcMain.handle("print-name", async (event, someArgument) => {
  const pathToFolder = path.join(__dirname, "/");
  fs.readdir(pathToFolder, (err, files) => {
    console.log(files);
  });
  const files = fs.readdirSync(pathToFolder);
  console.log(files);
  return;
});

ipcMain.handle("save-file", (event, arg) => {
  let fileData = arg.arrayBuffer;
  fs.writeFileSync("filepath.mp3", fileData);
  return "save";
});

ipcMain.handle("read-file", async (event, arg) => {
  const fileData = await fs.readFileSync("filepath.mp3");
  return fileData;
});

app.on("ready", createWindow);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("save-recorded-file", (event, argument) => {
  fs.writeFileSync(argument.filename, argument.audioBuffer);
  return;
});

ipcMain.handle("get-recorded-file-name", (event, argument) => {
  const files = fs.readdirSync(path.join(__dirname, "/assets/recordedTracks"));
  return files;
});

ipcMain.handle("get-recorded-file-data", async (event, argument) => {
  const fileData = await fs.readFileSync(
    "./src/assets/recordedTracks/" + argument.filename
  );
  return fileData;
});

ipcMain.handle("get-audio-file-name", (event, argument) => {
  const files = fs.readdirSync(path.join(__dirname, "/assets/audio"));
  return files;
});

ipcMain.handle("get-audio-file-data", async (event, argument) => {
  const fileData = await fs.readFileSync(
    "./src/assets/audio/" + argument.filename
  );
  return fileData;
});
