import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { DatabaseService } from './services/database';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow;
let dbService: DatabaseService;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    minHeight: 600,
    minWidth: 800,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#ffffff',
      symbolColor: '#000000',
      height: 30
    },    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  
  // and load the index.html of the app.
  if (MAIN_WINDOW_WEBPACK_ENTRY) {
    console.log('Loading URL:', MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  } else {
    console.error('MAIN_WINDOW_WEBPACK_ENTRY is not defined');
  }

  // Force open DevTools for debugging
  mainWindow.webContents.openDevTools();

  // Add more detailed error handlers
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer console [${level}]:`, message);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Initialize database
  dbService = new DatabaseService();
  dbService.initialize();

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('db:getTasks', async () => {
  return dbService.getTasks();
});

ipcMain.handle('db:createTask', async (_, task) => {
  return dbService.createTask(task);
});

ipcMain.handle('db:updateTask', async (_, id, updates) => {
  return dbService.updateTask(id, updates);
});

ipcMain.handle('db:deleteTask', async (_, id) => {
  return dbService.deleteTask(id);
});

ipcMain.handle('db:getProjects', async () => {
  return dbService.getProjects();
});

ipcMain.handle('db:createProject', async (_, project) => {
  return dbService.createProject(project);
});

ipcMain.handle('db:updateProject', async (_, id, updates) => {
  return dbService.updateProject(id, updates);
});

ipcMain.handle('db:deleteProject', async (_, id) => {
  return dbService.deleteProject(id);
});

// Window control handlers
ipcMain.handle('app:minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('app:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('app:close', () => {
  mainWindow.close();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
