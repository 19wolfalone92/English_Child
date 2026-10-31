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
  trigger(type){if(this.events[type])this.events[type]({target:this});},
  set innerHTML(x){this._html=x;this.nodes=new Map();this.selectors=new Map();},
  get innerHTML(){return this._html;},
  querySelector(sel){
   this.nodes??=new Map();
   if(!this.nodes.has(sel))this.nodes.set(sel,fakeElement());
   return this.nodes.get(sel);
  },
  querySelectorAll(sel){
    if(!/^\[data-/.test(sel))return [];
    this.selectors??=new Map();
    if(!this.selectors.has(sel)){
      const key=sel.slice(6,-1),camel=key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
      const pattern=new RegExp('data-'+key+'="([^"]+)"','g');
      this.selectors.set(sel,[...this.innerHTML.matchAll(pattern)].map(x=>fakeElement({[camel]:x[1]})));
    }
    return this.selectors.get(sel);
  }
 };
}
const buttons=['home','play','stories','rewards'].map(tab=>fakeElement({tab}));
const elem=new Map();
const get=id=>{if(!elem.has(id))elem.set(id,fakeElement());return elem.get(id);};
const view=fakeElement();
Object.defineProperty(view,'innerHTML',{get(){return this._html||'';},set(html){
 this._html=html;
 this.nodes=new Map();
 this.options=[...html.matchAll(/data-answer="([^"]+)"/g)].map(match=>fakeElement({answer:match[1]}));
 this.dataNodes=new Map();
}});
view.querySelectorAll=function(sel){
 if(sel==='[data-answer]')return this.options;
 const match=/^\[data-([a-z-]+)\]$/.exec(sel);
 if(!match)return [];
 if(!this.dataNodes.has(sel)){
  const key=match[1],camel=key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
  const regex=new RegExp('data-'+key+'="([^"]+)"','g');
  const nodes=[...this.innerHTML.matchAll(regex)].map(x=>fakeElement({[camel]:x[1]}));
  this.dataNodes.set(sel,nodes);
 }
 return this.dataNodes.get(sel);
};
const root={dataset:{},style:{setProperty(key,value){this[key]=value;},removeProperty(key){delete this[key];}}};
const doc={documentElement:root,addEventListener(){},getElementById(id){return id==='view'?view:get(id);},
 querySelectorAll(sel){return sel==='.bottom button'?buttons:[];}};
let storage=null;
const localStorage={getItem:()=>storage,setItem:(_,x)=>{storage=x;}};
vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},SpeechSynthesisUtterance:function(){}
},{filename:'app.js'});

assert.match(view.innerHTML,/Привет,<br>солнышко!/);
assert.equal(root.dataset.theme,'lilac','storybook theme booted');
assert.match(read('index.html'),/theme-open/);
assert.match(read('index.html'),/theme-overlay/);
get('theme-open').click();
assert.match(get('theme-overlay').innerHTML,/Сиреневое чудо/);
const mint=get('theme-overlay').querySelectorAll('[data-palette]').find(b=>b.dataset.palette==='mint');
assert.ok(mint,'mint selectable');
mint.click();
assert.equal(root.dataset.theme,'mint','theme visibly changes');
assert.equal(JSON.parse(storage).theme,'mint','theme saved locally');
const mainColor=get('theme-overlay').querySelector('#custom-main');
const magicColor=get('theme-overlay').querySelector('#custom-accent');
mainColor.value='#34618f';magicColor.value='#f3c277';
mainColor.trigger('input');
assert.equal(root.dataset.theme,'custom','custom theme activated');
assert.equal(root.style['--ui-primary'],'#34618f');
assert.equal(JSON.parse(storage).customAccent,'#f3c277');
get('theme-overlay').querySelector('#theme-close').click();
assert.equal(get('theme-overlay').hidden,true);
get('family-open').click();
assert.match(view.innerHTML,/Только для взрослых/);
assert.doesNotMatch(view.innerHTML,/id="reset-progress"/,'progress deletion unavailable without parent check');
const gate=view.innerHTML.match(/Сколько будет (\d+) \+ (\d+)\?/);
assert.ok(gate,'adult multiplication? addition challenge present');
view.querySelector('#parent-answer').value=String(Number(gate[1])+Number(gate[2]));
view.querySelector('#parent-check').click();
assert.match(view.innerHTML,/id="reset-progress"/);
view.querySelector('#family-back').click();
assert.match(view.innerHTML,/Твой следующий шаг/);
assert.match(view.innerHTML,/Карта приключений/);
assert.match(view.innerHTML,/Приключения Волчонка/);
assert.match(view.innerHTML,/Картинки/);
view.querySelector('#stories-home').click();
assert.match(view.innerHTML,/Сказки и тайны/);
view.querySelector('#quest-back').click();
view.querySelector('#dialogues-play').click();
assert.match(view.innerHTML,/Говорим с героями/);
view.querySelector('#quest-back').click();
view.querySelector('#memory-play').click();
assert.match(view.innerHTML,/Мастер памяти/);
view.querySelector('#memory-back').click();
view.querySelector('#pictures-play').click();
assert.match(view.innerHTML,/Угадай картинку/);
view.querySelector('#pictures-exit').click();
buttons[0].click();
assert.match(view.innerHTML,/Карта приключений/);
assert.equal((view.innerHTML.match(/class="module"/g)||[]).length,30,'30 course modules rendered');
assert.equal((view.innerHTML.match(/data-start="/g)||[]).length,300,'300 session buttons rendered');
assert.match(view.innerHTML,/day-num/);
assert.match(view.innerHTML,/data-hop="0"/,'current steps must be visible');
assert.match(read('index.html'),/storybook.css/);
assert.match(read('index.html'),/wolfie.svg/);
assert.match(read('index.html'),/data-tab="rewards"/);

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
// Exercise the story reader, comprehension scoring and persistent one-time star reward.
buttons[1].click();
view.querySelector('#stories-play').click();
assert.equal(view.querySelectorAll('[data-story]').length,3);
view.querySelectorAll('[data-story]')[0].click();
assert.match(view.innerHTML,/Котёнок и мяч/);
view.querySelector('#story-questions').click();
for(const question of window.KIDS_STORIES[0].questions){
 const good=view.querySelectorAll('[data-q-answer]')[question.correct];
 assert.ok(good,'story correct option exists');
 good.click();
 assert.match(view.querySelector('#quest-notice').innerHTML,/Верно/);
 view.querySelector('#quest-notice').querySelector('#quest-next').click();
}
assert.match(view.innerHTML,/История разгадана/);
assert.equal(JSON.parse(storage).storyScores['story-01'].best,3);
assert.equal(JSON.parse(storage).xp,115);
view.querySelector('#quest-list').click();
view.querySelector('#quest-back').click();
// Exercise a complete three-turn conversation.
view.querySelector('#dialogues-play').click();
assert.equal(view.querySelectorAll('[data-dialogue]').length,2);
view.querySelectorAll('[data-dialogue]')[0].click();
for(const step of window.KIDS_DIALOGUES[0].steps){
 const good=view.querySelectorAll('[data-dialogue-option]')[step.correct];
 assert.ok(good);
 good.click();
 assert.match(view.querySelector('#dialogue-notice').innerHTML,/Здорово/);
 view.querySelector('#dialogue-next').click();
}
assert.match(view.innerHTML,/Разговор завершён/);
assert.equal(JSON.parse(storage).dialogueScores['dialogue-01'].best,3);
assert.equal(JSON.parse(storage).xp,130);
view.querySelector('#dialogue-list').click();
view.querySelector('#quest-back').click();
// Picture game reveals the target and awards stars once upon clearing 8 questions.
view.querySelector('#pictures-play').click();
view.querySelector('#pictures-start').click();
for(let n=0;n<8;n++){
 const en=view.innerHTML.match(/Найди: <span lang="en">([^<]+)</)?.[1];
 assert.ok(en,'picture target rendered');
 const good=view.querySelectorAll('[data-picture]').find(b=>b.dataset.picture===en);
 assert.ok(good,'matching picture exists');
 good.click();
 assert.match(view.querySelector('#picture-feedback').innerHTML,/Ты нашёл/);
 view.querySelector('#picture-next').click();
}
assert.match(view.innerHTML,/Художник-исследователь/);
assert.equal(JSON.parse(storage).xp,140);
// Memory game presents ten cards; child can leave without a penalty.
view.querySelector('#pictures-done').click();
view.querySelector('#pictures-exit').click();
view.querySelector('#memory-play').click();
view.querySelector('#begin-memory').click();
assert.equal(view.querySelectorAll('[data-memory-card]').length,10);
view.querySelector('#memory-exit').click();
assert.match(view.innerHTML,/Мастер памяти/);
buttons[3].click();
assert.match(view.innerHTML,/Мой волшебный сад/);
const firstSticker=view.querySelectorAll('[data-sticker]').find(b=>b.dataset.sticker==='👣');
assert.ok(firstSticker,'first lesson unlocks a sticker');
firstSticker.click();
view.querySelectorAll('[data-garden-slot]')[0].click();
assert.equal(JSON.parse(storage).garden[0],'👣','chosen sticker saved into first garden slot');
assert.equal(JSON.parse(storage).theme,'custom','theme remains after session changes');
console.log('PASS: 300 lessons, 15 stories/45 Q, 10 dialogues/30 replies, full story + dialogue + picture flows and memory cards');
