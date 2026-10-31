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
vm.runInNewContext(read('stories.js'),{window},{filename:'stories.js'});
vm.runInNewContext(read('dialogues.js'),{window},{filename:'dialogues.js'});
vm.runInNewContext(read('adventures.js'),{window,Date,Math,setTimeout:(cb)=>0},{filename:'adventures.js'});
assert.equal(window.KIDS_STORIES.length,15,'15 authored original readers');
assert.equal(window.KIDS_DIALOGUES.length,10,'10 scripted speaking tasks');
for(const level of ['Pre-A1','A1','A2','B1','B2']){
 assert.equal(window.KIDS_STORIES.filter(x=>x.level===level).length,3,'three graded stories: '+level);
 assert.equal(window.KIDS_DIALOGUES.filter(x=>x.level===level).length,2,'two dialogues: '+level);
}
for(const story of window.KIDS_STORIES){
 assert.ok(story.text.length>120,story.id+' has enough narrative');
 assert.equal(story.questions.length,3,story.id);
 for(const q of story.questions){
  assert.equal(q.options.length,4,q.id);
  assert.ok(Number.isInteger(q.correct) && q.correct>=0 && q.correct<4,q.id);
  assert.equal(new Set(q.options).size,4,'non-identical distractors: '+q.id);
  assert.ok(q.explain.length>12,q.id+' must explain the answer');
 }
}
for(const dialogue of window.KIDS_DIALOGUES){
 assert.equal(dialogue.steps.length,3,dialogue.id);
 for(const step of dialogue.steps){
  assert.equal(step.options.length,4,dialogue.id);
  assert.ok(step.correct>=0 && step.correct<4);
  assert.equal(new Set(step.options).size,4);
 }
}
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
for(const file of ['stories.js','dialogues.js','adventures.js','extras.css'])assert.ok(read('index.html').includes(file),'asset linked: '+file);
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
assert.match(view.innerHTML,/Приключения Волчонка/);
view.querySelector('#stories-home').click();
assert.match(view.innerHTML,/Сказки и тайны/);
view.querySelector('#quest-back').click();
view.querySelector('#dialogues-play').click();
assert.match(view.innerHTML,/Говорим с героями/);
view.querySelector('#quest-back').click();
view.querySelector('#memory-play').click();
assert.match(view.innerHTML,/Мастер памяти/);
view.querySelector('#memory-back').click();
buttons[0].click();
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
console.log('PASS: 300 sessions, 15 stories/45 questions, 10 dialogues/30 turns, memory game, offline UI and first lesson');
