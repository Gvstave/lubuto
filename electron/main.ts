import { app, BrowserWindow } from "electron";
import path from "path";
import net from "net";
import { fork, type ChildProcess } from "child_process";

let mainWindow: BrowserWindow | null = null;
let lessonServer: ChildProcess | null = null;

function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({
      host: "127.0.0.1",
      port: 5000,
    });

    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });

    socket.once("error", () => {
      resolve(false);
    });
  });
}

function getLessonsDirectory(): string {
  // Development reads directly from the repository.
  if (!app.isPackaged) {
    return path.join(app.getAppPath(), "LUBUTO LITERACY LESSONS");
  }

  // Portable executables unpack to a temporary location. This variable points
  // back to the directory containing the EXE, where lesson content must live.
  const executableDirectory =
    process.env.PORTABLE_EXECUTABLE_DIR ?? path.dirname(process.execPath);

  return path.join(executableDirectory, "lessons");
}

async function startLessonServer(): Promise<void> {
  if (await isServerRunning()) {
    console.log("Lesson server is already running.");
    return;
  }

  const serverDirectory = app.isPackaged
    ? path.join(process.resourcesPath, "server")
    : path.join(app.getAppPath(), "server");

  const lessonsDirectory = getLessonsDirectory();

  console.log("Server directory:", serverDirectory);
  console.log("Lessons directory:", lessonsDirectory);

  await new Promise<void>((resolve, reject) => {
    lessonServer = fork(
      path.join(serverDirectory, "server.js"),
      [],
      {
        cwd: serverDirectory,
        env: {
          ...process.env,
          PORT: "5000",
          LESSONS_DIR: lessonsDirectory,
          ELECTRON_RUN_AS_NODE: "1",
        },
      }
    );

    lessonServer.once("message", (message) => {
      if (message === "ready") {
        console.log("Lesson server is ready.");
        resolve();
      }
    });

    lessonServer.once("error", (error) => {
      console.error("Lesson server error:", error);
      reject(error);
    });

    lessonServer.once("exit", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Lesson server exited with code ${code}`
          )
        );
      }
    });
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = path.join(
    __dirname,
    "../client/dist/index.html"
  );

  console.log("Loading:", indexPath);

  mainWindow.loadFile(indexPath).catch((error) => {
    console.error(
      "Failed to load React app:",
      error
    );
  });
}

app.whenReady().then(async () => {
  try {
    await startLessonServer();
  } catch (error) {
    console.error(
      "Failed to start the lesson server:",
      error
    );
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (lessonServer) {
    lessonServer.kill();
    lessonServer = null;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
