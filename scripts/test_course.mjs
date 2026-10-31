import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const assets=new URL('../app/src/main/assets/',import.meta.url);
const read=(p)=>fs.readFileSync(new URL(p,assets),'utf8');
const window={};
vm.runInNewContext(read('content.js'),{window},{filename:'content.js'});
vm.runInNewContext(read('phonics.js'),{window},{filename:'phonics.js'});
assert.equal(window.KIDS_ALPHABET.length,26,'full English alphabet');
assert.equal(window.KIDS_ALPHABET.map(x=>x.letter).join(''),'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const modules=window.KIDS_MODULES;
assert.equal(modules.length,30,'30 curated themed modules');
const levels=['Pre-A1','A1','A2','B1','B2'];
const all=modules.flatMap(m=>m.items);
assert.equal(all.length,300,'300 authored bilingual pairs');
assert.equal(new Set(all.map(x=>x.id)).size,all.length,'unique stable item IDs');
assert.equal(new Set(modules.map(m=>m.id)).size,30,'unique module IDs');
for(const level of levels)assert.equal(modules.filter(m=>m.level===level).length,6,'six themes for '+level);
for(const [index,m] of modules.entries()){
 assert.equal(m.id,'module-'+String(index+1).padStart(2,'0'));
 assert.ok(m.title.length>=4 && m.rule.length>=20 && m.mission.length>=20);
 assert.equal(m.items.length,10,m.id);
 for(const [j,item] of m.items.entries()){
  assert.equal(item.id,'kid-'+String(index+1).padStart(2,'0')+'-'+String(j+1).padStart(2,'0'));
  assert.ok(/[a-z]/i.test(item.en) && /[а-яё]/i.test(item.ru),'both languages: '+item.id);
  assert.ok(item.en.trim() && item.ru.trim());
 }
}
assert.match(read('index.html'),/content.js/);
assert.match(read('index.html'),/app.js/);
assert.match(read('index.html'),/phonics.js/);
assert.doesNotMatch(read('index.html'),/https?:\/\//,'offline HTML has no remote resources');
assert.match(read('app.js'),/KidsAndroid/);
assert.match(read('app.js'),/speakAvailable/);
assert.match(read('app.js'),/localStorage/);

function fakeElement(dataset={}){
 return {dataset,disabled:false,textContent:'',_html:'',events:{},classList:{toggle(){},add(){}},
  addEventListener(kind,fn){this.events[kind]=fn;},
  click(){if(this.events.click)this.events.click({target:this});},
  set innerHTML(x){this._html=x;this.nodes=new Map();},
  get innerHTML(){return this._html;},
  querySelector(sel){
   this.nodes??=new Map();
   if(!this.nodes.has(sel))this.nodes.set(sel,fakeElement());
   return this.nodes.get(sel);
  },
  querySelectorAll(){return [];}
 };
}
const buttons=['home','play','review','family'].map(tab=>fakeElement({tab}));
const elem=new Map();
const get=id=>{if(!elem.has(id))elem.set(id,fakeElement());return elem.get(id);};
const view=fakeElement();
Object.defineProperty(view,'innerHTML',{get(){return this._html||'';},set(html){
 this._html=html;
 this.nodes=new Map();
 this.options=[...html.matchAll(/data-answer="([^"]+)"/g)].map(match=>fakeElement({answer:match[1]}));
}});
view.querySelectorAll=function(sel){return sel==='[data-answer]'?this.options:[];};
const doc={getElementById(id){return id==='view'?view:get(id);},
 querySelectorAll(sel){return sel==='.bottom button'?buttons:[];}};
let storage=null;
const localStorage={getItem:()=>storage,setItem:(_,x)=>{storage=x;}};
vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},SpeechSynthesisUtterance:function(){}
},{filename:'app.js'});

assert.match(view.innerHTML,/Привет, исследователь/);
assert.match(view.innerHTML,/Карта приключений/);
assert.equal((view.innerHTML.match(/class="module"/g)||[]).length,30,'30 course modules rendered');
assert.equal((view.innerHTML.match(/data-start="/g)||[]).length,300,'300 session buttons rendered');
assert.match(view.innerHTML,/day-num/);

// End-to-end DOM-light UI smoke: first lesson, 10 correct choices, completion unlocks next day.
view.querySelector('#continue').click();
assert.match(view.innerHTML,/Выбери перевод/);
const first=modules[0].items.slice(1).concat(modules[0].items.slice(0,1));
for(const item of first){
 const btn=view.options.find(b=>b.dataset.answer===item.id);
 assert.ok(btn,'correct answer is offered: '+item.id);
 btn.click();
 const notice=view.querySelector('#feedback');
 assert.match(notice.innerHTML,/Верно!/);
 notice.querySelector('#next-question').click();
}
assert.match(view.innerHTML,/Следующий урок открыт/);
view.querySelector('#back-home').click();
assert.match(view.innerHTML,/1\/300/);
const persisted=JSON.parse(storage);
assert.equal(persisted.done['day-001'].passed,true);
assert.equal(persisted.done['day-001'].best,10);
assert.equal(persisted.correct,10);
assert.equal(persisted.items[first[0].id].stage,1);
assert.equal(persisted.xp,100);
console.log('PASS: 30 themes; 300 authentic bilingual pairs; 300 sessions; first course session unlocks correctly');
