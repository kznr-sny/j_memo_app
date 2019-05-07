const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
    // 相対パスに変換
    protocol.interceptFileProtocol('file', (req, callback) => {
        const requestedUrl = req.url.substr(7);
    
        if (path.isAbsolute(requestedUrl)) {
            callback(path.normalize(path.join(__dirname, requestedUrl)));
        } else {
            callback(requestedUrl);
        }
    });

    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 500,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: false
        },
    });
    mainWindow.loadURL(url.format({
        pathname: '/index.html',
        protocol: 'file',
        slashes: true,
    }));

    mainWindow.on('closed', function() {
    mainWindow = null;
    });
});