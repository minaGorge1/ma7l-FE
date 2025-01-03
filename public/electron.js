import express from 'express';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let server; // To keep track of the Express server instance

const createServer = () => {
    const expressApp = express();

    if (app.isPackaged) {
        // Serve the React production build in production
        expressApp.use(express.static(path.join(__dirname, '../build')));
        expressApp.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../build/index.html'));
        });
    } else {
        // In development, assume React's dev server is running at localhost:3000
        console.log('Running in development mode. Ensure React dev server is running at http://localhost:3000');
    }

    server = expressApp.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    if (app.isPackaged) {
        // Load the production server URL
        mainWindow.loadURL('http://localhost:3000');
    } else {
        // Load the React dev server
        mainWindow.loadURL('http://localhost:3000');
    }
};

// Start the server and create the window when Electron is ready
app.on('ready', () => {
    createServer();
    createWindow();
});

// Stop the server when the app is closed
app.on('window-all-closed', () => {
    if (server) {
        server.close(() => {
            console.log('Express server stopped.');
        });
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
