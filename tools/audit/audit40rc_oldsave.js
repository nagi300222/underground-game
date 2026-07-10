const fs=require('fs'), vm=require('vm');
const code=fs.readFileSync('game.js','utf8')+`\n;globalThis.__dbg={getState:()=>state,setState:(x)=>{state=x},setUiMode:(x)=>{uiMode=x},fns:{render,normalizeState,stripEphemeralState,hasUnsafeEphemeralStateForSave,clearEphemeralStateAfterLoad}};`;
function makeEl(){return{innerHTML:'',value:'',checked:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},focus(){},scrollLeft:0,offsetLeft:0,clientWidth:360};}
const app=makeEl(); const store=new Map();
const sb={console,document:{getElementById:id=>id==='app'?app:makeEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>makeEl(),body:makeEl()},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},navigator:{serviceWorker:null},location:{reload(){}},setTimeout(){},clearTimeout(){},requestAnimationFrame(fn){try{fn()}catch(e){}},alert(){},confirm:()=>true,prompt:()=>null,Date,Math,JSON,Object,Array,Number,String,Boolean,RegExp,Set,Map,Promise,Error}; sb.window=sb; sb.globalThis=sb; vm.createContext(sb); vm.runInContext(code,sb);
const F=sb.__dbg.fns; function ok(c,m){if(!c){console.error('[NG]',m);process.exit(1)}else console.log('[OK]',m)}
const old={turn:12,maxTurn:50,introSeen:true,band:{name:'旧セーブ',funds:50000,fans:12,fame:8,industry:6,trust:20,fatigue:10},player:{id:'player',name:'主人公',part:'Vo',stats:{stamina:20,technique:20,knowledge:20,sense:20,mental:20,teamwork:20,rhythm:20,charisma:20}},members:[],songs:[],liveEvents:[],liveOffers:[],phoneMails:[],snsPosts:[],view:'home',storyFlags:{},bandBook:{},ownedBandSkills:null,livePrepSupportIds:['sup_guitar','support_yurika'],pendingAfterpartyEvent:{},pendingMailAction:{},activePopup:{title:'old',body:'old'},popupQueue:[{title:'q'}]};
sb.__dbg.setState(old); sb.__dbg.setUiMode('game'); F.normalizeState(); let s=sb.__dbg.getState();
ok(Array.isArray(s.phoneMails),'phoneMails normalized');
ok(Array.isArray(s.snsPosts),'snsPosts normalized');
ok(s.snsWorldSeen && typeof s.snsWorldSeen==='object','snsWorldSeen normalized');
ok(s.bandBookDetailTab==='profile','bandBookDetailTab normalized');
ok(Array.isArray(s.livePrepSupportIds),'support ids normalized');
ok(!s.livePrepSupportIds.includes('sup_guitar'),'legacy generic support removed');
ok(s.liveEvents.some(e=>e.turn===30) && s.liveEvents.some(e=>e.turn===50),'fixed fes restored');
F.clearEphemeralStateAfterLoad();
ok(!F.hasUnsafeEphemeralStateForSave(true),'unsafe ephemerals clear after load');
F.render();
ok(app.innerHTML.includes('app-shell') || app.innerHTML.includes('UNDERGROUND'),'old save renders after normalize');
console.log('AUDIT40RC OLDSAVE PASSED');
