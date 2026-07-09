const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('game.js','utf8') + `\n;globalThis.__dbg={getState:()=>state, fns:{startNewGameInSlot,maybeSeedWorldReactionPosts,normalizeBandSystemState}};`;
function makeEl(){return{innerHTML:'',value:'',checked:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},removeEventListener(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},focus(){},click(){},closest(){return null}};}
const store=new Map();
const sb={console,document:{getElementById:()=>makeEl(),querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>makeEl(),body:makeEl()},localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},navigator:{serviceWorker:null},location:{reload(){}},setTimeout:(fn)=>1,clearTimeout(){},requestAnimationFrame:(fn)=>{try{fn()}catch(e){}},alert(){},confirm:()=>true,prompt:()=>null,Date,Math,JSON,Object,Array,Number,String,Boolean,RegExp,Set,Map,Promise,Error};
sb.window=sb; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(code,sb,{filename:'game.js'});
const F=sb.__dbg.fns, state=sb.__dbg.getState();
function ok(c,msg){ if(!c){ console.error('[NG]',msg); process.exitCode=1; } else console.log('[OK]',msg); }
F.startNewGameInSlot(1);
const s=sb.__dbg.getState();
s.turn=10; s.snsPosts=[]; s.snsWorldSeen={};
s.bandBook={bands:{triple_arrows:{state:'met',battleCount:1},carbons:{state:'discovered',battleCount:1},kiwi:{state:'unknown',battleCount:0}},seenEvents:{},flags:{},lastBattle:null,lastStoryEventTurn:0};
F.normalizeBandSystemState();
F.maybeSeedWorldReactionPosts();
ok(s.snsPosts.some(p=>p.author==='@triple_arrows'), 'met band voice seeded from bandBook.bands');
ok(s.snsPosts.some(p=>p.author==='@carbons_noise'), 'discovered band voice seeded from bandBook.bands');
ok(!s.snsPosts.some(p=>p.author==='@kiwi_room'), 'unknown band voice is not seeded');
const n=s.snsPosts.length;
F.maybeSeedWorldReactionPosts();
ok(s.snsPosts.length===n, 'band voice seed is deduplicated');
console.log('AUDIT40RC2 BAND VOICE FIX PASSED');
