// Run against a local production preview (4173) and a dedicated Chromium CDP session (9224).
// No dependencies; requires Node with built-in WebSocket. Closes the dedicated browser on completion.
import {mkdir, writeFile} from 'node:fs/promises';
await mkdir('.tools', {recursive:true});
const targets = await (await fetch('http://127.0.0.1:9224/json')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, {once:true}));
let id = 0;
const pending = new Map();
const requests = [];
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.method === 'Network.requestWillBeSent') requests.push(data.params.request.url);
  if (data.id) {const p = pending.get(data.id); pending.delete(data.id); data.error ? p.reject(data.error) : p.resolve(data.result);}
});
function call(method, params={}) {return new Promise((resolve,reject) => {const key=++id; pending.set(key,{resolve,reject}); ws.send(JSON.stringify({id:key,method,params}));});}
const evaluate = async expression => (await call('Runtime.evaluate',{expression,returnByValue:true})).result.value;

const key=async(key,code,n)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n});};
try {
 await call('Page.enable');await call('Network.enable');await call('Page.navigate',{url:'http://127.0.0.1:4173/'});
 for(let i=0;i<30;i++){if(await evaluate('!!document.querySelector(".contact-cards")'))break;await new Promise(r=>setTimeout(r,100));}
 for(const theme of ['light','dark'])for(const width of [1440,768,320]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===320});await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]});await call('Page.reload'); await new Promise(r=>setTimeout(r,300)); await call('Emulation.setPageScaleFactor',{pageScaleFactor:1});
  const result=await evaluate('(()=>{const t=document.querySelector(".contact-cards");return {overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,inner:innerWidth,client:document.documentElement.clientWidth,visual:visualViewport.width,trackWidth:t.clientWidth,scrollWidth:t.scrollWidth,cardWidths:[...t.children].map(c=>c.getBoundingClientRect().width),navigation:!!document.querySelector(".card-navigation"),internalOverflow:[...t.children].some(c=>c.scrollWidth>c.clientWidth)}})()');
  console.log({theme,width,...result});if(result.overflow||result.internalOverflow)throw new Error('Overflow');
  if(width===1440&&result.scrollWidth>result.trackWidth+1)throw new Error('Desktop should fit three cards');
  if(width<1100&&!result.navigation)throw new Error('Overflow controls missing');
  await evaluate('document.querySelector(".contact-cards").focus()');await key('End','End',35);await new Promise(r=>setTimeout(r,100));
  if(result.scrollWidth>result.trackWidth+1&&!(await evaluate('document.querySelector(".contact-cards").scrollLeft>0')))throw new Error('Keyboard scrolling failed');
  await key('Home','Home',36);
  const focusCheck=await evaluate('(()=>{const before=visualViewport.scale;const control=document.querySelector(".recipient-message textarea");control.focus();return {before,after:visualViewport.scale,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,fonts:[...document.querySelectorAll("input,select,textarea")].map(c=>parseFloat(getComputedStyle(c).fontSize)),viewport:document.querySelector("meta[name=viewport]").content}})()');
  if(focusCheck.fonts.some(n=>n<16)||focusCheck.overflow||focusCheck.before!==focusCheck.after||/maximum-scale|user-scalable/.test(focusCheck.viewport))throw new Error('Mobile font, focus or viewport check failed');
  console.log({focusCheck});
  await evaluate('document.querySelector(".contact-cards").focus()');await key('Home','Home',36);
  const rect=await evaluate('(()=>{const s=document.querySelector(".multi-office");s.scrollIntoView();const r=s.getBoundingClientRect();return {x:0,y:r.y+scrollY,width:document.documentElement.clientWidth,height:r.height,scale:1}})()');
  const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:rect});await writeFile('.tools/recipient-editors-'+theme+'-'+width+'.png',Buffer.from(shot.data,'base64'));
 }
 await evaluate('document.querySelector(".contact-card .contact-details summary").click()');
 const detailResult=await evaluate('({pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,verticalScroll:document.querySelector(".contact-cards").scrollHeight>document.querySelector(".contact-cards").clientHeight+1})');console.log({expandedDetails:detailResult});if(detailResult.pageOverflow||detailResult.verticalScroll)throw new Error('Expanded details overflow');
 await evaluate('document.querySelector(".office-choices summary").click();document.querySelector(".office-choices button").click()');
 const all=await evaluate('({editors:document.querySelectorAll(".recipient-message textarea").length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})');if(all.editors!==8||all.overflow)throw new Error('All-office layout failed');
 console.log('External requests:',requests.filter(u=>!u.startsWith('http://127.0.0.1:4173/')));
}finally{await call('Browser.close');ws.close();}
