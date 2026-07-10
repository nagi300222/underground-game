const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('game.js','utf8') + `\n;globalThis.__dbg={getState:()=>state, fns:{startNewGameInSlot,render,runCommandTurn,performLive,showLiveResultAfterProgress,closeLiveResultModal,closeActionResultModal,closeActivePopup,skipAfterparty,resolveAfterpartyChoice,skipStoryEvent,finishPendingTurnAdvance,devEnsureSongs,scheduleNextLive,stripEphemeralState,hasUnsafeEphemeralStateForSave,clearEphemeralStateAfterLoad,formatGrandConditionSnapshot}};`;
function makeEl(){return{innerHTML:'',value:'',checked:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},removeEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},focus(){},click(){},closest(){return null},scrollLeft:0,offsetLeft:0,clientWidth:360,offsetWidth:360,textContent:''};}
const app=makeEl();
const store=new Map();
const sb={console,document:{getElementById:(id)=>id==='app'?app:makeEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>makeEl(),body:makeEl()},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},navigator:{serviceWorker:null},location:{reload(){}},setTimeout:(fn)=>{ return 1;},clearTimeout(){},requestAnimationFrame:(fn)=>{try{fn()}catch(e){}},alert(){},confirm:()=>true,prompt:()=>null,Date,Math,JSON,Object,Array,Number,String,Boolean,RegExp,Set,Map,Promise,Error};
sb.window=sb; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(code,sb,{filename:'game.js'});
const d=sb.__dbg, F=d.fns;
function fail(msg){ console.error('[NG]', msg); process.exitCode=1; throw new Error(msg); }
function ok(c,msg){ if(!c) fail(msg); else console.log('[OK]',msg); }
function clearFlow(max=80){
  const s=d.getState();
  for(let i=0;i<max;i++){
    if(s.activeStoryEvent){ F.skipStoryEvent(); continue; }
    if(s.liveProgressModal){ F.showLiveResultAfterProgress(); continue; }
    if(s.liveResultModal){ F.closeLiveResultModal(); continue; }
    if(s.pendingAfterpartyEvent){ F.resolveAfterpartyChoice('leave'); continue; }
    if(s.pendingAfterparty){ F.skipAfterparty(); continue; }
    if(s.actionResultModal){ F.closeActionResultModal(); continue; }
    if(s.activePopup){ F.closeActivePopup(); continue; }
    if(Array.isArray(s.popupQueue)&&s.popupQueue.length){ F.render(); if(s.activePopup) continue; s.popupQueue=[]; continue; }
    if(s.bandNamePrompt || s.renameBandNamePrompt){ s.band.name=s.band.name||'監査バンド'; s.bandNamePrompt=false; s.renameBandNamePrompt=false; continue; }
    if(s.pendingTurnAdvance){ F.finishPendingTurnAdvance(); continue; }
    if(s.turnNotice){ s.turnNotice=null; continue; }
    return true;
  }
  fail('flow did not clear: '+JSON.stringify({turn:s.turn,activePopup:!!s.activePopup,queue:s.popupQueue?.length,story:!!s.activeStoryEvent,action:!!s.actionResultModal,liveProgress:!!s.liveProgressModal,liveResult:!!s.liveResultModal,afterparty:!!s.pendingAfterparty,afterpartyEvent:!!s.pendingAfterpartyEvent,pendingTurn:s.pendingTurnAdvance}));
}
function playTo50(profile='normal'){
  F.startNewGameInSlot(1); const s=d.getState();
  s.introSeen=true; s.tutorialStage='done'; s.scheduleTutorialStage='done'; s.band.name='RC監査バンド'; s.view='home'; s.activePopup=null; s.popupQueue=[]; s.band.funds=250000;
  F.devEnsureSongs(7);
  F.scheduleNextLive();
  const commands = profile==='low' ? ['rest','practice','promo','parttime'] : profile==='high' ? ['practice','promo','talk','practice','promo','recruit'] : ['practice','promo','parttime','talk'];
  let guard=0;
  while(s.turn < 50 && guard++ < 120){
    clearFlow();
    if(s.liveEvents.some(e=>e.turn===s.turn && !e.cancelled)){
      F.devEnsureSongs(7);
      s.livePrepSetlist=null;
      F.performLive();
      clearFlow();
    } else {
      const cmd=commands[(s.turn + guard) % commands.length];
      F.runCommandTurn(cmd);
      clearFlow();
    }
    if(s.turn > 50) fail('turn exceeded 50');
  }
  ok(s.turn===50, profile+' reaches T50');
  clearFlow();
  F.devEnsureSongs(7);
  F.performLive();
  clearFlow();
  ok(s.ended===true || s.turn===50, profile+' GRAND flow finishes or stays safely at T50');
  ok(!F.hasUnsafeEphemeralStateForSave(true), profile+' has no unsafe ephemeral state after drain');
  ok(Array.isArray(s.liveResultHistory) && s.liveResultHistory.length>=3, profile+' has at least 3 live results');
  return {profile, turn:s.turn, ended:s.ended, liveCount:s.liveResultHistory.length, last:s.liveResultHistory[s.liveResultHistory.length-1]?.rank, fans:s.band.fans, fame:s.band.fame, industry:s.band.industry};
}
const results=[playTo50('low'), playTo50('normal'), playTo50('high')];
console.log('RC_FULL_RESULTS', JSON.stringify(results,null,2));
console.log('AUDIT40RC FULL FLOW PASSED');
