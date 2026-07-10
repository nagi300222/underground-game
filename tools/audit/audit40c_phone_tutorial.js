const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('game.js','utf8') + `\n;globalThis.__dbg={getState:()=>state, fns:{startNewGameInSlot,render,renderPhoneScreen,renderHomeScreen,runCommandTurn,acceptLiveOffer,stripEphemeralState,clearEphemeralStateAfterLoad,hasUnsafeEphemeralStateForSave}};`;
function makeEl(){return{innerHTML:'',value:'',checked:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},removeEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},focus(){},click(){},closest(){return null},scrollLeft:0,offsetLeft:0,clientWidth:360};}
const app=makeEl();
const store=new Map();
const sb={console,document:{getElementById:(id)=>id==='app'?app:makeEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>makeEl(),body:makeEl()},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},navigator:{serviceWorker:null},location:{reload(){}},setTimeout:(fn)=>{ return 1;},clearTimeout(){},requestAnimationFrame:(fn)=>{try{fn()}catch(e){}},alert(){},confirm:()=>true,prompt:()=>null,Date,Math,JSON,Object,Array,Number,String,Boolean,RegExp,Set,Map,Promise,Error};
sb.window=sb; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(code,sb,{filename:'game.js'});
const d=sb.__dbg, F=d.fns;
function ok(c,msg){ if(!c){ console.error('[NG]',msg); process.exitCode=1; } else console.log('[OK]',msg); }
F.startNewGameInSlot(1);
let state=d.getState();
state.introSeen=true;
state.tutorialStage='needSong';
state.scheduleTutorialStage='done';
state.view='home';
F.render();
let html=app.innerHTML;
ok(html.includes('tutorial-flow-card'),'T1 tutorial card rendered');
ok(html.includes('作詞・作曲へ'),'T1 songcraft action rendered');
state.activePopup=null; state.popupQueue=[];
ok(!F.hasUnsafeEphemeralStateForSave(false),'tutorial card itself is not unsafe ephemeral');

state.tutorialStage='done';
state.view='phone';
state.phoneSubView='menu';
const offer={id:'audit_offer_40c',turn:8,venueId:'garage',liveType:'booking_house',invitedBandIds:['triple_arrows'],accepted:false,expired:false,status:'open',storyInvite:true};
state.liveOffers.unshift(offer);
state.phoneMails.unshift({id:'audit_mail_40c',turn:state.turn,subject:'出演依頼',sender:'監査ライブハウス',body:'出ませんか',kind:'live_offer',read:false,payload:{offerId:offer.id,offerTurn:offer.turn,status:'open'}});
F.render();
html=app.innerHTML;
ok(html.includes('要返信'),'phone menu has actionable section');
ok(html.includes('data-phone-mode="bandbook"'),'phone menu has bandbook app');
ok(html.includes('未読'),'phone menu preserves unread badge');

state.phoneSubView='bandbook';
F.render();
html=app.innerHTML;
ok(html.includes('バンド図鑑'),'bandbook opens inside phone');
ok(html.includes('← 携帯メニュー'),'bandbook has back to phone menu');

state.turn=3;
state.phoneSubView='menu';
state.view='command';
state.snsPosts=[];
state.tutorialLastPhonePromptTurn=0;
F.runCommandTurn('promo');
ok(state.snsPosts.some(p=>String(p.author||'').includes('livehouse_staff')),'T3 promo seeds SNS tutorial reaction');

state.pendingTurnAdvance=null;
state.actionResultModal=null;
state.activePopup=null;
state.popupQueue=[];
state.turn=1;
state.view='phone';
state.phoneSubView='mail';
state.activeMailId='audit_mail_40c';
F.acceptLiveOffer('audit_offer_40c');
ok(state.view==='schedule','accepting offer moves to schedule');
ok(state.phoneSubView==='menu','accepting offer clears phone subview');
ok(state.activeMailId===null,'accepting offer clears active mail modal');
ok(state.liveEvents.some(e=>e.offerId==='audit_offer_40c'),'accepted offer added to live events');
const stripped=F.stripEphemeralState(state);
ok(!('pendingMailAction' in stripped),'pendingMailAction stripped');
console.log('AUDIT40C PHONE/TUTORIAL SMOKE PASSED');
