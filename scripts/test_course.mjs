import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const assets=new URL('../app/src/main/assets/',import.meta.url);
const read=(p)=>fs.readFileSync(new URL(p,assets),'utf8');
const window={};
vm.runInNewContext(read('identity.js'),{window},{filename:'identity.js'});
assert.equal(window.KIDS_IDENTITY.name,'Ева');
assert.equal(window.KIDS_IDENTITY.genitive,'Евы');
assert.equal(window.KIDS_IDENTITY.englishName,'Eva');
vm.runInNewContext(read('content.js'),{window},{filename:'content.js'});
vm.runInNewContext(read('phonics.js'),{window},{filename:'phonics.js'});
assert.equal(window.KIDS_ALPHABET.length,26,'full English alphabet');
assert.equal(window.KIDS_ALPHABET.map(x=>x.letter).join(''),'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
vm.runInNewContext(read('stories.js'),{window},{filename:'stories.js'});
vm.runInNewContext(read('dialogues.js'),{window},{filename:'dialogues.js'});
vm.runInNewContext(read('adventures.js'),{window,Date,Math,setTimeout:(cb)=>0},{filename:'adventures.js'});
vm.runInNewContext(read('soundgarden.js'),{window,Date,Math},{filename:'soundgarden.js'});
assert.equal(window.KIDS_SOUND_GARDEN.worlds.length,8,'8 fairy listening worlds');
assert.equal(window.KIDS_SOUND_GARDEN.worlds.reduce((sum,w)=>sum+w.words.length,0),48,'48 original picture-word matches');
for(const world of window.KIDS_SOUND_GARDEN.worlds){
 assert.equal(world.words.length,6,'6 different cards for '+world.id);
 assert.equal(new Set(world.words.map(w=>w[0])).size,6,'no repeated targets '+world.id);
 for(const [en,ru,emoji] of world.words){
  assert.ok(/^[a-z ]+$/.test(en),'English sound target '+en);
  assert.ok(/[а-яё]/i.test(ru),'Russian label '+ru);
  assert.ok(emoji.length>0,'picture available');
 }
}
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
assert.match(read('index.html'),/identity.js/);
assert.ok(read('index.html').indexOf('identity.js')<read('index.html').indexOf('app.js'),'identity must load first');
assert.match(read('index.html'),/brand-title/);
assert.match(read('index.html'),/app.js/);
assert.match(read('index.html'),/phonics.js/);
for(const file of ['stories.js','dialogues.js','adventures.js','soundgarden.js','magic-world.css','extras.css'])assert.ok(read('index.html').includes(file),'asset linked: '+file);
assert.doesNotMatch(read('index.html'),/https?:\/\//,'offline HTML has no remote resources');
assert.match(read('app.js'),/KidsAndroid/);
assert.match(read('app.js'),/speakAvailable/);
assert.match(read('app.js'),/localStorage/);
const java=fs.readFileSync(new URL('../app/src/main/java/com/wolfie/kids/MainActivity.java',import.meta.url),'utf8');
const manifest=fs.readFileSync(new URL('../app/src/main/AndroidManifest.xml',import.meta.url),'utf8');
assert.match(java,/ACTION_CREATE_DOCUMENT/,'backup export via Android document picker');
assert.match(java,/ACTION_OPEN_DOCUMENT/,'backup import via Android document picker');
assert.match(java,/\.commit\(\)/,'progress saved synchronously');
assert.match(java,/onBackPressed/,'Android Back override exists');
assert.match(java,/WebChromeClient/,'confirm dialogs supported');
assert.match(manifest,/allowBackup="false"/,'Android system backup not used without user choice');
assert.doesNotMatch(manifest,/android\.permission\.INTERNET/,'children app requires no Internet permission');

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

assert.match(view.innerHTML,/Привет,<br>Ева!/);
assert.equal(get('brand-title').textContent,'Eva English Kids');
assert.match(get('brand-subtitle').textContent,/Ева/);
assert.match(doc.title,/Евы/);
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
assert.match(view.innerHTML,/id="export-progress"/);
assert.match(view.innerHTML,/id="import-progress"/);
assert.match(view.innerHTML,/Прогресс Евы/);
view.querySelector('#family-back').click();
assert.match(view.innerHTML,/Следующий шаг Евы/);
assert.match(view.innerHTML,/Карта Евы/);
assert.match(view.innerHTML,/Волшебный мир Евы/);
assert.match(view.innerHTML,/world-sound/);
assert.match(view.innerHTML,/Ева и Вулфи/);
assert.match(view.innerHTML,/Картинки/);
view.querySelector('#stories-home').click();
assert.match(view.innerHTML,/Сказки для Евы/);
view.querySelector('#quest-back').click();
view.querySelector('#dialogues-play').click();
assert.match(view.innerHTML,/Ева разговаривает с героями/);
view.querySelector('#quest-back').click();
view.querySelector('#memory-play').click();
assert.match(view.innerHTML,/Ева — мастер памяти/);
view.querySelector('#memory-back').click();
view.querySelector('#pictures-play').click();
assert.match(view.innerHTML,/Ева, угадай картинку/);
view.querySelector('#pictures-exit').click();
buttons[0].click();
assert.match(view.innerHTML,/Карта Евы/);
assert.equal((view.innerHTML.match(/class="module"/g)||[]).length,30,'30 course modules rendered');
assert.equal((view.innerHTML.match(/data-start="/g)||[]).length,300,'300 session buttons rendered');
assert.match(view.innerHTML,/day-num/);
assert.match(view.innerHTML,/data-hop="0"/,'current steps must be visible');
assert.match(read('index.html'),/storybook.css/);
assert.match(read('index.html'),/wolfie.svg/);
assert.match(read('magic-world.css'),/eva-valley\\.svg/,'scene bundled in CSS');
assert.match(read('app.js'),/world-sound/,'scene hotspots wired');
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
assert.match(view.innerHTML,/Ева, получилось!/);
assert.match(view.innerHTML,/Звёздный результат Евы!/);
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
assert.match(view.innerHTML,/Ева, история разгадана/);
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
assert.match(view.innerHTML,/Ева, разговор завершён/);
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
 assert.match(view.querySelector('#picture-feedback').innerHTML,/Ты нашла/);
 view.querySelector('#picture-next').click();
}
assert.match(view.innerHTML,/Ева, ты художница-исследователь/);
assert.equal(JSON.parse(storage).xp,140);
// Complete an entire sound-garden round without an English TTS engine; test its accessible fallback.
view.querySelector('#pictures-done').click();
view.querySelector('#pictures-exit').click();
view.querySelector('#sound-play-game').click();
assert.match(view.innerHTML,/Звуковой лес Евы/);
assert.equal(view.querySelectorAll('[data-sound-world]').length,8);
view.querySelectorAll('[data-sound-world]')[0].click();
for(let n=0;n<6;n++){
 const target=view.innerHTML.match(/class="sound-fallback"><b lang="en">([^<]+)</)?.[1];
 assert.ok(target,'visible alternative for no TTS');
 const correct=view.querySelectorAll('[data-sound-answer]').find(b=>b.dataset.soundAnswer===target);
 assert.ok(correct,'matching picture accessible '+target);
 correct.click();
 assert.match(view.querySelector('#sound-feedback').innerHTML,/Ура, Ева!/);
 view.querySelector('#sound-next').click();
}
assert.match(view.innerHTML,/Полянка расцвела, Ева!/);
assert.equal(JSON.parse(storage).soundScores.pets.best,6);
assert.equal(JSON.parse(storage).xp,152,'a one-time listening reward earned');
view.querySelector('#sound-all').click();
assert.match(view.innerHTML,/Собрано!/);
view.querySelector('#sound-exit').click();
// Memory game presents ten cards; child can leave without a penalty.
view.querySelector('#memory-play').click();
view.querySelector('#begin-memory').click();
assert.equal(view.querySelectorAll('[data-memory-card]').length,10);
view.querySelector('#memory-exit').click();
assert.match(view.innerHTML,/Ева — мастер памяти/);
buttons[3].click();
assert.match(view.innerHTML,/Волшебный сад Евы/);
const firstSticker=view.querySelectorAll('[data-sticker]').find(b=>b.dataset.sticker==='👣');
assert.ok(firstSticker,'first lesson unlocks a sticker');
firstSticker.click();
view.querySelectorAll('[data-garden-slot]')[0].click();
assert.equal(JSON.parse(storage).garden[0],'👣','chosen sticker saved into first garden slot');
assert.equal(JSON.parse(storage).theme,'custom','theme remains after session changes');
assert.equal(JSON.parse(storage).soundScores.pets.best,6,'sound-world progress is stored');
// Verify native Back integration from an active modal and a child route.
get('theme-open').click();
assert.equal(get('theme-overlay').hidden,false);
assert.equal(window.KidsBack(),true);
assert.equal(get('theme-overlay').hidden,true);
assert.equal(window.KidsBack(),true);
assert.match(view.innerHTML,/Привет,<br>Ева!/);
assert.equal(window.KidsBack(),false,'back at home should return control to Android');

// Resume from saved progress without discarding valid achievements or selected colors.
const preserved=storage;
vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},alert(){},
 SpeechSynthesisUtterance:function(){}
},{filename:'reload-app.js'});
assert.match(view.innerHTML,/1\/300/,'a successful lesson survives a WebView reload');
assert.equal(root.dataset.theme,'custom','custom palette survives restart');
assert.equal(JSON.parse(storage).garden[0],'👣','sticker placement survives restart');
assert.equal(JSON.parse(storage).soundScores.pets.best,6,'sound learning remains after restart');

// Fail gracefully on partially corrupted progress, avoiding crashes and HTML injection.
storage=JSON.stringify({done:[],items:null,days:"broken",level:"invalid",theme:"<img src=x>",
 xp:"<script>alert(1)</script>",storyScores:{"story-01":null},alphabetHeard:42,
 garden:[{"bad":"value"}],pictureWins:{"2026-10-31":null}});
vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},alert(){},
 SpeechSynthesisUtterance:function(){}
},{filename:'corrupt-progress-app.js'});
assert.match(view.innerHTML,/Привет,<br>Ева!/);
assert.equal(root.dataset.theme,'lilac','invalid theme falls back safely');
assert.doesNotMatch(view.innerHTML,/<script>alert\(1\)<\/script>/);
assert.match(view.innerHTML,/0\/300/);
buttons[3].click();
assert.match(view.innerHTML,/Волшебный сад Евы/);

// Play all 300 sequential lessons using the DOM harness: MCQ, reorder, text entry and offline listening fallback.
storage=null;
vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},alert(){},
 SpeechSynthesisUtterance:function(){}
},{filename:'complete-curriculum.js'});
// A lesson interrupted by phone rotation or Android Back resumes at the next unanswered question.
view.querySelector('#continue').click();
for(let q=0;q<2;q++){
 const item=modules[0].items[q+1];
 const correct=view.options.find(b=>b.dataset.answer===item.id);
 assert.ok(correct,'first checkpoint question exists');
 correct.click();
 view.querySelector('#feedback').querySelector('#next-question').click();
}
assert.equal(JSON.parse(storage).activeCourse.index,2);
assert.equal(JSON.parse(storage).activeCourse.correct,2);
view.querySelector('#leave').click();
assert.match(view.innerHTML,/Продолжить занятие/);
vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},alert(){},
 SpeechSynthesisUtterance:function(){}
},{filename:'resume-checkpoint.js'});
assert.match(view.innerHTML,/Продолжить занятие/,'Android rotation or restart keeps pending lesson');
view.querySelector('#continue').click();
for(let q=2;q<10;q++){
 const item=modules[0].items[(q+1)%10];
 const correct=view.options.find(b=>b.dataset.answer===item.id);
 assert.ok(correct,'remaining checkpoint answer '+q);
 correct.click();
 view.querySelector('#feedback').querySelector('#next-question').click();
}
assert.match(view.innerHTML,/Следующий урок открыт/);
view.querySelector('#back-home').click();
assert.equal(JSON.parse(storage).done['day-001'].passed,true);
assert.ok(!JSON.parse(storage).activeCourse,'checkpoint cleaned after completion');
assert.equal(JSON.parse(storage).answers,10,'no duplicate answers after resuming');

for(let dayIndex=1;dayIndex<300;dayIndex++){
 assert.ok(view.innerHTML.includes('id="continue"'),'next lesson reachable: '+dayIndex);
 view.querySelector('#continue').click();
 const module=modules[Math.floor(dayIndex/10)];
 for(let q=0;q<10;q++){
  const item=module.items[((dayIndex%10)+1+q)%10];
  if(view.innerHTML.includes('id="check-words"')){
   const tokens=view.querySelectorAll('[data-token]').slice().sort((a,b)=>Number(a.dataset.token)-Number(b.dataset.token));
   assert.equal(tokens.length,item.en.split(/\s+/).length,'all word tokens offered');
   for(const token of tokens)token.click();
   view.querySelector('#check-words').click();
  }else if(view.innerHTML.includes('id="check-type"')){
   view.querySelector('#type-answer').value=item.en;
   view.querySelector('#check-type').click();
  }else{
   const btn=view.options.find(b=>b.dataset.answer===item.id);
   assert.ok(btn,'correct option exists day '+dayIndex+' question '+q);
   btn.click();
  }
  assert.match(view.querySelector('#feedback').innerHTML,/Верно!/,'correct feedback day '+dayIndex+' question '+q);
  view.querySelector('#feedback').querySelector('#next-question').click();
 }
 assert.match(view.innerHTML,/Следующий урок открыт/,'lesson '+(dayIndex+1)+' passed');
 view.querySelector('#back-home').click();
}
assert.match(view.innerHTML,/300\/300/,'all 300 lessons complete');
const full=JSON.parse(storage);
assert.equal(Object.keys(full.done).length,300);
assert.ok(Object.values(full.done).every(v=>v.passed),'no hidden locked lessons');
assert.equal(full.answers,3000);
assert.equal(full.correct,3000);
console.log('PASS: 300/300 lessons completed, checkpoint recovery, backup UI, safe corruption recovery, Android Back and full child activity suite.');
