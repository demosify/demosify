// 监控demos文件夹的demo添加，用以生成sidebar中的导航

import chokidar from 'chokidar';
import { readFileSync, writeFileSync } from 'fs';
const demoListPath = './src/.demoList.json';

function readFile() {
  return new Promise(res => {
    const demoList = readFileSync(demoListPath, 'utf-8');
    res(JSON.parse(demoList));
  });
}

async function addDemo(demoName) {
  const demoList = await readFile();
  const targetDemoIndex = demoList.findIndex(demo => demo === demoName);
  if (targetDemoIndex === -1) demoList.push(demoName);
  writeFileSync(demoListPath, JSON.stringify(demoList));
}

async function deleteDemo(demoName) {
  const demoList = await readFile();
  const targetDemoIndex = demoList.findIndex(demo => demo === demoName);
  if (targetDemoIndex > -1) {
    demoList.splice(targetDemoIndex, 1);
  }
  writeFileSync(demoListPath, JSON.stringify(demoList));
}

const watcher = chokidar.watch('./src/demos/*');

watcher
  .on('addDir', path => {
    const demoName = path.split('/').pop();
    // console.log('addDir', demoName);
    addDemo(demoName);
  })
  .on('unlinkDir', path => {
    const demoName = path.split('/').pop();
    // console.log('deleteDir', demoName);
    deleteDemo(demoName);
  });
