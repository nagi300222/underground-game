const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('game.js','utf8') + `\n;globalThis.__dbg={getState:()=>state, fns:{startNewGameInSlot,render,renderNav,renderHomeScreen,parentViewForNav,nextActionSuggestion}};`;
function makeEl(){return{innerHTML:'',value:'',checked:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},removeEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},focus(){},click(){},closest(){return null},scrollLeft:0,offsetLeft:0,clientWidth:360};}
const app=makeEl();
const store=new Map();
const sb={console,document:{getElementById:(id)=>id==='app'?app:makeEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>makeEl(),body:makeEl()},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},navigator:{serviceWorker:null},location:{reload(){}},setTimeout:(fn)=>{ if(typeof fn==='function'){} return 1;},clearTimeout(){},requestAnimationFrame:(fn)=>{try{fn()}catch(e){}},alert(){},confirm:()=>true,prompt:()=>null,Date,Math,JSON,Object,Array,Number,String,Boolean,RegExp,Set,Map,Promise,Error};
sb.window=sb; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(code,sb,{filename:'game.js'});
const d=sb.__dbg, F=d.fns;
F.startNewGameInSlot(1);
const state=d.getState(); state.introSeen=true; state.tutorialStage='done'; state.scheduleTutorialStage='done';
F.render();
const html=app.innerHTML;
function ok(c,msg){ if(!c){ console.error('[NG]',msg); process.exitCode=1; } else console.log('[OK]',msg); }
ok(html.includes('tabbar-v040a'),'5タブclass描画');
ok((html.match(/class="tabBtn/g)||[]).length===5,'tabBtnが5個');
ok(html.includes('home-primary-action'),'ホーム主ボタン描画');
ok(html.includes('予定ミニライン'),'予定ミニライン描画');
ok(html.includes('管理メニュー'),'管理メニュー描画');
ok(html.includes('openSongEditorBtn'),'文脈ボタン 曲エディタ');
['data-view="shop"','data-view="library"','data-view="log"'].forEach(x=>ok(html.includes(x),`文脈ボタン ${x}`));
ok(F.parentViewForNav('songs')==='command','songs親=活動');
ok(F.parentViewForNav('bandbook')==='phone','bandbook親=携帯');
ok(F.parentViewForNav('dev')==='band','dev親=バンド');
console.log('AUDIT40A SMOKE PASSED');
