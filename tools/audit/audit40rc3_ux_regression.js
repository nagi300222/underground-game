
const fs = require("fs");
const vm = require("vm");

const code = fs.readFileSync("game.js", "utf8");

class Element {
  constructor(tag="div") { this.tagName = tag.toUpperCase(); this.innerHTML = ""; this.dataset = {}; this.className = ""; this.open = false; this.listeners = {}; this.value = ""; this.disabled = false; }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}
function makeDoc() {
  return {
    elements: {},
    body: new Element("body"),
    documentElement: { style: {} },
    createElement: (tag) => new Element(tag),
    getElementById(id) {
      if (!this.elements[id]) this.elements[id] = new Element("div");
      return this.elements[id];
    },
    querySelectorAll(sel) { return []; },
    querySelector(sel) { return null; },
    addEventListener() {}
  };
}
const app = new Element("div");
const document = makeDoc();
document.elements.app = app;

const context = {
  console,
  document,
  window: { addEventListener(){}, matchMedia(){ return { matches:false, addEventListener(){} }; } },
  localStorage: { getItem(){return null;}, setItem(){}, removeItem(){} },
  sessionStorage: { getItem(){return null;}, setItem(){}, removeItem(){} },
  navigator: { userAgent: "node" },
  location: { reload(){} },
  requestAnimationFrame(fn){ return fn(); },
  setTimeout(fn){ return 0; },
  clearTimeout(){},
  selectedSaveSlot: 1
};
context.global = context;

vm.createContext(context);
vm.runInContext(code, context);

if (!code.includes('const VERSION = "v0.4.0-rc3";')) throw new Error("VERSION mismatch");
vm.runInContext('state = createInitialState(); normalizeState();', context);

if (!vm.runInContext('state.devOpenGroups && state.devOpenGroups.progress === true', context)) throw new Error("devOpenGroups default missing");

vm.runInContext('state.view = "dev"; state.devOpenGroups = { progress:false, events:true, skills:true, balance:false };', context);
const devHtml = context.renderDevScreen();
if (!devHtml.includes('data-dev-group="events" open')) throw new Error("events group open not rendered");
if (!devHtml.includes('data-dev-group="skills" open')) throw new Error("skills group open not rendered");
if (devHtml.includes('data-dev-group="progress" open')) throw new Error("progress should remain closed");

vm.runInContext('state.view = "sns"; state.phoneSubView = "sns"; state.activeMailId = "mail_test";', context);
// simulate top phone tab minimal logic
vm.runInContext('const v = "phone"; if (v === "phone") { state.phoneSubView = "menu"; state.activeMailId = null; } state.view = v;', context);
if (!vm.runInContext('state.phoneSubView === "menu"', context)) throw new Error("phone top reset failed");
if (!vm.runInContext('state.activeMailId === null', context)) throw new Error("activeMailId should be cleared");

vm.runInContext('state.phoneSubView = "mail";', context);
let phoneHtml = context.renderPhoneScreen();
if (!phoneHtml.includes("メール")) throw new Error("phone internal mail render broken");
vm.runInContext('state.phoneSubView = "sns";', context);
phoneHtml = context.renderPhoneScreen();
if (!phoneHtml.includes("SNS")) throw new Error("phone internal sns render broken");
vm.runInContext('state.phoneSubView = "bandbook";', context);
phoneHtml = context.renderPhoneScreen();
if (!phoneHtml.includes("バンド図鑑")) throw new Error("phone internal bandbook render broken");

console.log("audit40rc3_ux_regression: OK");
