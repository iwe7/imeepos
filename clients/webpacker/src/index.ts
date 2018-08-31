
const updater = require('update-electron-app');
const electronLog = require('electron-log');
updater({
    logger: electronLog
});

// ipcMain.on('open-file-dialog', (...args: any[]) => {
//     dialog.showOpenDialog({
//         properties: ['openFile', 'openDirectory']
//     }, (filePaths: string[], bookmarks: string[]) => {
//         console.log(filePaths);
//         console.log(bookmarks);
//     })
// })
