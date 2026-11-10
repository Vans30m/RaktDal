const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    title: "RaktDal - Blood Donation & Donor Coordination",
    icon: path.join(__dirname, "../frontend/assets/logo-removebg.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // Load the web app from production Render URL (or fallback to local index.html if offline)
  const isOnline = true;
  const startUrl = "https://raktdal.onrender.com";

  mainWindow.loadURL(startUrl).catch(() => {
    // Fallback to local files if network is not available
    mainWindow.loadFile(path.join(__dirname, "../frontend/index.html"));
  });

  // Open external links securely in the default browser (e.g. Google OAuth)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

