import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';
import fetch from 'node-fetch';
import path from 'node:path';

let reactProcess;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const devServerUrl = 'http://localhost:3000';

    const checkDevServer = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        try {
            const response = await fetch(devServerUrl);
            return response.ok;
        } catch (error) {
            console.error('Error checking dev server:', error);
            return false;
        }
    };

    const loadApp = async () => {
        const isDevServerRunning = await checkDevServer();

        if (isDevServerRunning) {
            mainWindow.loadURL(devServerUrl);
        } else {
            console.error('React server not running. Please start the server.');
            app.quit();
        }
    };

    loadApp();

    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
};

const startReactServer = () => {
    const reactServer = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'path-to-your-react-app'), // Change this to your React app's directory
        shell: true,
        stdio: 'inherit',
    });

    reactServer.on('error', (error) => {
        console.error('Failed to start React server:', error);
    });

    reactServer.on('close', (code) => {
        console.log(`React server stopped with code ${code}`);
    });

    return reactServer;
};

app.whenReady().then(() => {
    reactProcess = startReactServer();
    createWindow();
});

// Stop React server when Electron exits
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('quit', () => {
    if (reactProcess) {
        reactProcess.kill();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});