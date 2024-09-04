import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'   //文件系统操作
import readline from 'readline'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  //用默认浏览器打开url
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
 // 如果是开发模式，并且设置了 ELECTRON_RENDERER_URL 环境变量，加载 URL
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
     // 否则，加载本地的 HTML 文件
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  //处理'start-processing'函数，读取文件并处理数据
  ipcMain.handle('start-processing', async (event, filePath) => {
    const results = [];
    const fileStream = fs.createReadStream(filePath);
    console.log("==========filepath",filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      //逐行读取
      const parts = line.split('，');
      const timestamp = parts[0].trim();//提取时间戳
      const values = parts.slice(1).map(v => parseFloat(v.trim()));// 提取数值并转换为浮点数
      results.push({ timestamp, values }); // 将数据推入结果数组
    }

    return results;
  });

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
