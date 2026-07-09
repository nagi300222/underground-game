const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('game.js','utf8') + `\n;globalThis.__dbg={getState:()=>state, fns:{startNewGameInSlot,render,renderTopStats,renderTimeline,renderHomeScreen,renderGlobalPhoneButton,renderLivePrep,performLive}};`;
function makeEl(){return{innerHTML:'',value:'',checked:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},removeEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},focus(){},click(){},closest(){return null},scrollLeft:0,offsetLeft:0,clientWidth:360,offsetWidth:360,textContent:''};}
const app=makeEl();
const store=new Map();
const sb={console,document:{getElementById:(id)=>id==='app'?app:makeEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>makeEl(),body:makeEl()},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},navigator:{serviceWorker:null},location:{reload(){}},setTimeout:(fn)=>1,clearTimeout(){},requestAnimationFrame:(fn)=>{try{fn()}catch(e){}},alert(){},confirm:()=>true,prompt:()=>null,Date,Math,JSON,Object,Array,Number,String,Boolean,RegExp,Set,Map,Promise,Error};
sb.window=sb; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(code,sb,{filename:'game.js'});
const d=sb.__dbg, F=d.fns;
function fail(msg){ console.error('[NG]', msg); process.exitCode=1; throw new Error(msg); }
function ok(c,msg){ if(!c) fail(msg); else console.log('[OK]',msg); }
F.startNewGameInSlot(1);
const state=d.getState();
state.introSeen=true; state.tutorialStage='done'; state.scheduleTutorialStage='done'; state.view='home'; state.activePopup=null; state.popupQueue=[];
F.render();
let html=app.innerHTML;
ok(html.includes('v041-status-board'), 'v0.4.1a status board rendered');
ok(html.includes('資金') && html.includes('ファン') && html.includes('疲労'), 'funds/fans/fatigue visible in top status');
ok(html.includes('v041-turn-rail') && html.includes('週の流れ'), 'one-line turn rail rendered');
ok(html.includes('globalPhoneBtn') && html.includes('global-phone-btn'), 'global phone button rendered');
ok(html.includes('home-v041a') && html.includes('今週どうする？'), 'home v041a primary copy rendered');
ok(html.includes('v041-more-menu'), 'extra home menu is still reachable');
ok(html.includes('data-view="shop"') && html.includes('data-view="library"') && html.includes('data-view="log"'), 'legacy home routes remain reachable');
state.phoneMails = state.phoneMails || [];
state.phoneMails.unshift({id:'test_unread', from:'tester', subject:'未読テスト', body:'test', read:false, kind:'info', turn:state.turn});
F.render(); html=app.innerHTML;
ok(/global-phone-btn[\s\S]*<em>/.test(html), 'global phone unread badge rendered');
state.view='phone'; F.render(); html=app.innerHTML;
ok(html.includes('phone-card') || html.includes('携帯'), 'phone view still renders');
state.view='home';
// live prep DOM should remain intact on live turn
state.turn=5;
if (!state.liveEvents.some(e=>e.turn===5 && !e.cancelled)) state.liveEvents.push({id:'audit_live', turn:5, venueId:'basement_box', fixed:true, liveType:'first_live'});
F.render(); html=app.innerHTML;
ok(html.includes('setlistSelect') && html.includes('positionSelect') && html.includes('chorusSelect'), 'live prep DOM selectors preserved');
console.log('AUDIT41A VISUAL FOUNDATION PASSED');
