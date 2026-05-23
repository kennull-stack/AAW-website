const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9223;
const width = 1440;
const height = 1000;
const url = 'http://127.0.0.1:8765/exports/z05-taobao-longshot-preview.html';
const out = path.resolve('exports/z05-taobao-longshot-zh.png');
const userDataDir = path.resolve('exports/chrome-shot-profile');
fs.mkdirSync(userDataDir, { recursive: true });
const proc = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  `--remote-debugging-port=${port}`,
  `--window-size=${width},${height}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
async function getJson(u){
  const res = await fetch(u);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}
async function waitVersion(){
  for (let i=0;i<80;i++) {
    try { return await getJson(`http://127.0.0.1:${port}/json/version`); } catch(e) { await sleep(250); }
  }
  throw new Error('Chrome debugging endpoint did not start');
}
const version = await waitVersion();
const ws = new WebSocket(version.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
let loadedResolve;
const loaded = new Promise(resolve => { loadedResolve = resolve; });
ws.onmessage = event => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
  if (msg.method === 'Page.loadEventFired') loadedResolve();
};
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
function send(method, params={}){
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
}
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url });
await Promise.race([loaded, sleep(15000)]);
await sleep(1200);
const prep = await send('Runtime.evaluate', {
  awaitPromise: true,
  returnByValue: true,
  expression: `(async()=>{
    try{localStorage.setItem('z05ProductLang','zh')}catch(e){}
    document.querySelectorAll('img').forEach(img=>{img.loading='eager';});
    window.scrollTo(0,0);
    await Promise.all(Array.from(document.images).map(img=>img.complete ? Promise.resolve() : new Promise(r=>{img.onload=r; img.onerror=r;})));
    await new Promise(r=>setTimeout(r,600));
    const height = Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    const width = Math.ceil(Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, ${width}));
    return {height,width,title:document.title};
  })()`
});
const dims = prep.result.value;
console.log(JSON.stringify(dims));
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  fromSurface: true,
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: width, height: dims.height, scale: 1 }
});
fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(out);
ws.close();
proc.kill();
