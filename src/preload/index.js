import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import fs from 'fs';
import path from 'path';

// 定义下api
const api = {
  startProcessing: async (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf-16');
      console.log("=========data",data);
      const parsedData = parseData(data);
      return parsedData;
    } catch (error) {
      console.error('错误读取文件或解析文件失败', error);
      return [];
    }
  }
};

// 解析文件data
function parseData(data) {
  const lines = data.split('\n');
  const headers = lines[0].split('，').map(header => header.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split('，').map(value => value.trim());
    return headers.reduce((acc, header, index) => {
      //把每个表头和对应的值匹配上
      acc[header] = values[index];
      return acc;
    }, {});
  });
//数据行
  return rows;
}

// 用contextBridge 把这个API暴露给renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api;
}
