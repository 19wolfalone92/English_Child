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
vm.runInNewContext(read('firststeps.js'),{window,Date,Math},{filename:'firststeps.js'});
vm.runInNewContext(read('alphabetquest.js'),{window,Date,Math},{filename:'alphabetquest.js'});
vm.runInNewContext(read('wordmemory.js'),{window,Date,Math},{filename:'wordmemory.js'});
vm.runInNewContext(read('teacherpath.js'),{window,Date,Math},{filename:'teacherpath.js'});
vm.runInNewContext(read('littlebooks.js'),{window,Date,Math},{filename:'littlebooks.js'});
vm.runInNewContext(read('firstsounds.js'),{window,Date,Math},{filename:'firstsounds.js'});
vm.runInNewContext(read('learningpassport.js'),{window,Date,Math},{filename:'learningpassport.js'});
const initialPassport=window.KIDS_LEARNING_PASSPORT.snapshot({seedDone:{},seedMemory:{}},1000);
assert.equal(initialPassport.counts.words,120,'real data has 120 first vocabulary items');
assert.equal(initialPassport.counts.seen,0,'no invented mastery for a new child');
assert.equal(initialPassport.counts.familiar,0,'no fictitious fluent words');
assert.equal(initialPassport.counts.due,0,'no fake overdue homework');
const advancedPassport=window.KIDS_LEARNING_PASSPORT.snapshot({
 seedDone:{'seed-01':true},alphaDone:{'letters-0':true},
 miniBooks:{'book-01':true},soundFamilies:{'sound-0':true},phraseDone:{'phrase-0':true},
 seedMemory:{
  'seedword-01-1':{stage:0,seen:2,correct:0,due:1},
  'seedword-01-2':{stage:3,seen:5,correct:5,due:10000},
  'seedword-01-3':{stage:1,seen:2,correct:1,due:800}
 }},1000);
assert.equal(advancedPassport.counts.seen,3,'only recorded exposures count');
assert.equal(advancedPassport.counts.familiar,1,'three review stages counted but not certified');
assert.equal(advancedPassport.counts.practice,1,'child mistakes remain visible to adult');
assert.equal(advancedPassport.counts.due,2,'exact due count from genuine review dates');
assert.equal(advancedPassport.counts.letters,1);
assert.equal(advancedPassport.counts.books,1);
assert.equal(advancedPassport.counts.sound,1);
assert.equal(advancedPassport.counts.phrases,1);

assert.equal(window.KIDS_MINI_READERS.books.length,20,'20 new three-panel early readers');
assert.equal(window.KIDS_MINI_READERS.books.flatMap(b=>b.pages).length,60,'60 original beginner panels');
assert.equal(window.KIDS_FIRST_SOUNDS.groups.length,8,'8 early sound families');
for(const g of window.KIDS_FIRST_SOUNDS.groups){
 assert.equal(g.words.length,3,'3 examples per beginning sound');
 for(const w of g.words)assert.equal(w[0][0].toUpperCase(),g.letter,'correct English initial sound family '+w[0]);
}

assert.equal(window.KIDS_TEACHER_PATH.plans.length,20,'20 week-specific parent scripts');
assert.equal(window.KIDS_TEACHER_PATH.milestones.length,6,'start through B2 milestones');
assert.equal(window.KIDS_TEACHER_PATH.weekPlan.length,4,'four short learning sessions each week');
assert.equal(window.KIDS_TEACHER_PATH.phrases.length,20,'20 distinct contextual listening phrases');
assert.equal(new Set(window.KIDS_TEACHER_PATH.phrases).size,20,'no duplicate conversation scenarios');

assert.equal(window.KIDS_ALPHABET_QUEST.groups.length,7,'alphabet is split into seven gentle small sessions');
assert.equal(window.KIDS_ALPHABET_QUEST.groups.reduce((n,g)=>n+g.length,0),26,'all letters taught');
assert.equal(window.KIDS_WORD_MEMORY.intervals.join(','),'0,1,3,7,14,30','spacing schedule');

assert.equal(window.KIDS_FIRST_STEPS.packs.length,20,'20 gentle micro-lessons');
for(const name of ['cat','dog','sun','apple','ball','mom']){
 assert.ok(read('first-'+name+'.svg').includes('viewBox'),'custom starter illustration exists: '+name);
}
assert.match(read('eva-preschool.css'),/seed-word-illustration/,'real illustrated cards are styled');
assert.match(read('app.js'),/🎀 Ночной кавай/,'original nighttime theme is available');
assert.match(read('app.js'),/⚙️ Маленькие изобретатели/,'original inventor theme is available');
assert.match(read('index.html'),/firststeps.js/,'real preschool course loads in app');

const allSeed=window.KIDS_FIRST_STEPS.packs.flatMap(p=>p.words);
assert.equal(allSeed.length,120,'120 easy first words');
assert.equal(new Set(allSeed.map(w=>w.en)).size,120,'unique first words, no memorizing repeats');
assert.equal(new Set(allSeed.map(w=>w.id)).size,120);
for(const p of window.KIDS_FIRST_STEPS.packs){
 assert.equal(p.words.length,6,'6 words per beginner lesson');
 for(const word of p.words){assert.ok(word.en.length>1&&word.en.length<=11,'small words only '+word.en);assert.ok(word.ru&&word.icon);}
}

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
// Complete all 20 preschool micro-lessons in the real DOM harness, including the no-TTS fallback.
const seedState={seedDone:{},xp:0},seedView=view;
window.KIDS_FIRST_STEPS.open({
 view:seedView,state:seedState,save(){},speak(){},speakAvailable(){return false;},onExit(){}
});
for(let i=0;i<20;i++){
 if(i===0)view.querySelector('#seed-continue').click();
 else view.querySelector('#seed-next-lesson').click();
 assert.match(view.innerHTML,/data-seed-say=/,'six picture-word learning cards on lesson '+(i+1));
 assert.equal(view.querySelectorAll('[data-seed-say]').length,3,'three starter cards, not six at once');

 view.querySelector('#seed-try').click();
 for(let q=0;q<6;q++){
  if(q===3){
   assert.equal(view.querySelectorAll('[data-seed-say]').length,3,'the next three new words are introduced before asking questions');
   view.querySelector('#seed-try').click();
  }
  const word=window.KIDS_FIRST_STEPS.packs[i].words[q];
  assert.match(view.innerHTML,/Без голоса/,'visible fallback when TTS missing');
  const correct=view.querySelectorAll('[data-seed-answer]').find(b=>b.dataset.seedAnswer===word.id);
  assert.ok(correct,'correct picture offered '+word.en);
  correct.click();
  assert.match(view.querySelector('#seed-feedback').innerHTML,/Молодец, Ева!/);
  view.querySelector('#seed-next').click();
 }
 assert.equal(seedState.seedDone['seed-'+String(i+1).padStart(2,'0')],true);
}
assert.equal(Object.keys(seedState.seedDone).length,20,'20 islands completed');
assert.equal(seedState.xp,240,'one-time reward per micro-lesson');
assert.equal(Object.keys(seedState.seedMemory).length,120,'all first words have separately saved recall history');
assert.ok(Object.values(seedState.seedMemory).every(x=>x.seen===1&&x.stage===1),'every answer schedules a next-day review');
view.querySelector('#seed-home').click();

// Family-based contextual conversation: 20 brief listening tasks with visual comprehension.
const teacherState={seedDone:{},alphaDone:{},phraseDone:{},seedMemory:{},xp:0};
for(let i=0;i<20;i++){
 teacherState.seedDone=Object.fromEntries(window.KIDS_FIRST_STEPS.packs.slice(0,i).map(p=>[p.id,true]));
 window.KIDS_TEACHER_PATH.open({
  view,state:teacherState,save(){},speak(){},speakAvailable(){return false;},
  onExit(){},onWords(){},onABC(){},onMemory(){}
 });
 assert.match(view.innerHTML,/Моя дорожка английского/);
 assert.equal(view.querySelectorAll('[data-teacher-action]').length,4);
 view.querySelector('#teacher-say').click();
 assert.match(view.innerHTML,/Как помочь Еве говорить/);
 view.querySelector('#teacher-phrase-game').click();
 assert.match(view.innerHTML,/Прочитай с взрослым/);
 const p=window.KIDS_FIRST_STEPS.packs[i],ix=window.KIDS_TEACHER_PATH.targetIndexes[i],target=p.words[ix];
 const correct=view.querySelectorAll('[data-teacher-phrase-answer]').find(b=>b.dataset.teacherPhraseAnswer===target.id);
 assert.ok(correct,'understand one spoken familiar word in phrase '+i);
 correct.click();
 assert.match(view.querySelector('#teacher-phrase-feedback').innerHTML,/Ты поняла, Ева!/);
 assert.equal(teacherState.phraseDone['phrase-'+i],true);
 view.querySelector('#teacher-phrase-next').click();
}
assert.equal(Object.keys(teacherState.phraseDone).length,20);
assert.equal(teacherState.xp,60,'20 listening achievements once each');
// New child-friendly picture stories open only after the relevant six words have been learnt.
const bookState={seedDone:{},miniBooks:{},xp:0};
window.KIDS_MINI_READERS.open({view,state:bookState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
assert.equal(view.querySelectorAll('[data-mini-book]').length,20);
view.querySelectorAll('[data-mini-book]')[0].click();
assert.match(view.innerHTML,/Сказки-картинки Евы/,'locked book cannot open before its words');
for(let i=0;i<20;i++){
 const pack=window.KIDS_FIRST_STEPS.packs[i],book=window.KIDS_MINI_READERS.books[i];
 bookState.seedDone[pack.id]=true;
 window.KIDS_MINI_READERS.open({view,state:bookState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
 view.querySelectorAll('[data-mini-book]')[i].click();
 for(let step=0;step<3;step++){
  assert.match(view.innerHTML,/data-reading-choice/,'two familiar picture choices on story page');
  assert.equal(view.querySelectorAll('[data-reading-choice]').length,2);
  const target=pack.words[book.pages[step].index];
  assert.ok(book.pages[step].en.toLowerCase().includes(target.en),'target actually mentioned in story '+book.id);
  const match=view.querySelectorAll('[data-reading-choice]').find(b=>b.dataset.readingChoice===target.id);
  assert.ok(match,'correct story answer '+target.en);
  match.click();
  assert.equal(view.querySelector('#reading-result').innerHTML,'','answer is blocked while the illustration is visible');
  view.querySelector('#reading-ready').click();
  match.click();
  assert.match(view.querySelector('#reading-result').innerHTML,/Ты поняла, Ева!/);
  view.querySelector('#reading-next').click();
 }
 assert.equal(bookState.miniBooks[book.id],true);
 view.querySelector('#reading-more').click();
}
assert.equal(Object.keys(bookState.miniBooks).length,20,'all twenty original books completed');
assert.equal(bookState.xp,100,'20 first-time reading rewards only');
window.KIDS_MINI_READERS.open({view,state:bookState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
view.querySelectorAll('[data-mini-book]')[0].click();
for(let i=0;i<3;i++){
 const target=window.KIDS_FIRST_STEPS.packs[0].words[i];
 view.querySelector('#reading-ready').click();
 view.querySelectorAll('[data-reading-choice]').find(b=>b.dataset.readingChoice===target.id).click();
 view.querySelector('#reading-next').click();
}
assert.equal(bookState.xp,100,'rereading does not allow reward farming');
view.querySelector('#reading-home').click();

// Beginner sound families use whole-word listening and varied picture distractors.
const soundsState={soundFamilies:{},xp:0};
window.KIDS_FIRST_SOUNDS.open({view,state:soundsState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
assert.equal(view.querySelectorAll('[data-soundfamily]').length,8);
for(let groupIndex=0;groupIndex<8;groupIndex++){
 window.KIDS_FIRST_SOUNDS.open({view,state:soundsState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
 view.querySelectorAll('[data-soundfamily]')[groupIndex].click();
 assert.match(view.innerHTML,/Послушай семью/);
 view.querySelector('#soundfamily-go').click();
 const group=window.KIDS_FIRST_SOUNDS.groups[groupIndex];
 for(let k=0;k<3;k++){
  const opts=view.querySelectorAll('[data-family-answer]');
  assert.equal(opts.length,2);
  const right=opts.find(x=>x.dataset.familyAnswer===group.words[k][0]);
  assert.ok(right,'valid initial-sound matching word '+group.words[k][0]);
  right.click();
  assert.match(view.querySelector('#soundfamily-result').innerHTML,/Молодец, Ева!/);
  view.querySelector('#soundfamily-next').click();
 }
 assert.equal(soundsState.soundFamilies['sound-'+groupIndex],true);
}
assert.equal(Object.keys(soundsState.soundFamilies).length,8);
assert.equal(soundsState.xp,48,'one-time rewards for eight sound families');
// Letter quest: all 26 uppercase/lowercase recognitions, 7 small learning groups.
const alphaState={alphaDone:{},alphabetHeard:{},xp:0};
window.KIDS_ALPHABET_QUEST.open({view,state:alphaState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
assert.match(view.innerHTML,/Буквы для Евы/);
for(let groupIndex=0;groupIndex<7;groupIndex++){
 if(groupIndex===0)view.querySelectorAll('[data-alpha-group]')[0].click();
 else view.querySelector('#alpha-more').click();
 const group=window.KIDS_ALPHABET_QUEST.groups[groupIndex];
 assert.equal(view.querySelectorAll('[data-alpha-say]').length,group.length,'letter cards per group '+groupIndex);
 assert.match(view.innerHTML,/букву/,'letter instruction is shown');
 view.querySelector('#alpha-try').click();
 for(let k=0;k<group.length;k++){
  const chosen=view.querySelectorAll('[data-alpha-answer]').find(b=>b.dataset.alphaAnswer===group[k].letter);
  assert.ok(chosen,'lowercase / picture answer for '+group[k].letter);
  chosen.click();
  assert.match(view.querySelector('#alpha-feedback').innerHTML,/Отлично, Ева!/);
  view.querySelector('#alpha-next').click();
 }
}
assert.equal(Object.keys(alphaState.alphaDone).length,7);
assert.equal(alphaState.xp,70,'seven once-only letter achievements');
view.querySelector('#alpha-all').click();

// Spaced repetition: 8 words are recalled and moved to the next interval.
for(const key of Object.keys(seedState.seedMemory))seedState.seedMemory[key].due=0;
assert.equal(window.KIDS_WORD_MEMORY.due(seedState).length,120);
window.KIDS_WORD_MEMORY.open({view,state:seedState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
view.querySelector('#memory-begin').click();
for(let i=0;i<8;i++){
 const target=view.innerHTML.match(/class="seed-audio fallback" lang="en">([^<]+)/)?.[1];
 const word=allSeed.find(w=>w.en===target);
 assert.ok(word,'due word visible in no-voice fallback');
 const chosen=view.querySelectorAll('[data-memory-answer]').find(b=>b.dataset.memoryAnswer===word.id);
 assert.ok(chosen,'word matching '+word.en);
 chosen.click();
 assert.match(view.querySelector('#memory-feedback').innerHTML,/Отличная память!/);
 view.querySelector('#memory-next').click();
}
assert.match(view.innerHTML,/слова становятся знакомее/);
assert.equal(window.KIDS_WORD_MEMORY.due(seedState).length,112,'eight recalled words deferred to 3 days');
const persistedWord=Object.values(seedState.seedMemory).find(x=>x.stage===2);
assert.ok(persistedWord.due>Date.now()+2*86400000,'second successful recall is due after three days');
assert.ok(Object.values(seedState.seedMemory).some(x=>x.stage===2&&x.due>Date.now()+2*86400000));
view.querySelector('#memory-map').click();
// Optional practice is welcome but cannot skip tomorrow's scheduled review.
const future=Date.now()+5*86400000;
const one=allSeed[0],offday={seedMemory:{[one.id]:{seen:1,correct:1,stage:2,due:future}}};
window.KIDS_WORD_MEMORY.open({view,state:offday,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
assert.equal(window.KIDS_WORD_MEMORY.due(offday).length,0);
view.querySelector('#memory-begin').click();
const unplanned=view.querySelectorAll('[data-memory-answer]').find(x=>x.dataset.memoryAnswer===one.id);
assert.ok(unplanned,'unscheduled review offers the already learned word');
unplanned.click();
assert.equal(offday.seedMemory[one.id].stage,2,'early practice cannot skip a repetition stage');
assert.equal(offday.seedMemory[one.id].due,future,'early practice cannot postpone real review');
view.querySelector('#memory-next').click();
// A child who misses every word is given a smaller remedial picture quiz,
// and the island is NOT falsely marked mastered.
const retryState={seedDone:{},seedMemory:{},xp:0};
window.KIDS_FIRST_STEPS.open({view,state:retryState,save(){},speak(){},speakAvailable(){return false;},onExit(){}});
view.querySelector('#seed-continue').click();
view.querySelector('#seed-try').click();
for(let q=0;q<6;q++){
 if(q===3)view.querySelector('#seed-try').click();
 const word=window.KIDS_FIRST_STEPS.packs[0].words[q];
 const mistake=view.querySelectorAll('[data-seed-answer]').find(b=>b.dataset.seedAnswer!==word.id);
 assert.ok(mistake,'deliberate error choice offered');
 mistake.click();
 assert.match(view.querySelector('#seed-feedback').innerHTML,/Вместе научимся!/);
 view.querySelector('#seed-next').click();
}
assert.match(view.innerHTML,/повторим трудные слова/,'missed-word flashcards appear');
assert.equal(view.querySelectorAll('[data-retry-word]').length,6,'all missed words available to rehearse');
view.querySelector('#seed-retry-done').click();
for(let q=0;q<6;q++){
 const word=window.KIDS_FIRST_STEPS.packs[0].words[q];
 const choice=view.querySelectorAll('[data-seed-retry-choice]').find(b=>b.dataset.seedRetryChoice===word.id);
 assert.ok(choice,'correct recognition retest for missed '+word.en);
 choice.click();
 assert.match(view.querySelector('#seed-retry-feedback').innerHTML,/Вот теперь ты помнишь!/);
 view.querySelector('#seed-retry-next').click();
}
assert.ok(!retryState.seedDone['seed-01'],'a fully wrong first pass cannot unlock the next island');
assert.equal(retryState.xp,0,'remedial session cannot farm bonus stars');
assert.ok(Object.values(retryState.seedMemory).every(v=>v.seen===2),'per-word mistakes and their retry are both recorded');
view.querySelector('#seed-next-lesson').click();
assert.equal(view.querySelectorAll('[data-seed-say]').length,3,'friendly retry returns to three picture cards');

vm.runInNewContext(read('app.js'),{
 window,document:doc,localStorage,console,Date,Math,
 setTimeout(){return 0;},confirm(){return true;},SpeechSynthesisUtterance:function(){}
},{filename:'app.js'});

assert.match(view.innerHTML,/Привет,<br>Ева!/);
assert.match(view.innerHTML,/mini-readers-home/,'picture books accessible from home');
assert.match(view.innerHTML,/first-sounds-home/,'early sound games accessible from home');
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
assert.match(view.innerHTML,/parent-teacher/,'parent area exposes an actionable learning plan');
assert.match(view.innerHTML,/parent-passport/,'adult can access factual report only after gate');
assert.match(view.innerHTML,/id="voice-check"/,'adult can recheck English voice');
assert.match(view.innerHTML,/id="voice-test"/,'adult can test English pronunciation');
view.querySelector('#voice-check').click();
assert.match(view.querySelector('#speech-status').textContent,/не обнаружен/,'correct no-TTS fallback when voice is not installed');

view.querySelector('#parent-passport').click();
assert.match(view.innerHTML,/Учебный паспорт Евы/,'passport opens from adult menu');
assert.match(view.innerHTML,/Пробовали/);
assert.match(view.innerHTML,/Совет на сегодня/);
view.querySelector('#passport-back').click();
assert.match(view.innerHTML,/Прогресс Евы/,'adult can return to settings');

assert.match(view.innerHTML,/id="toggle-advanced"/);
assert.equal(JSON.parse(storage).advancedContent,false,'gentle mode is the default');
view.querySelector('#toggle-advanced').click();
assert.equal(JSON.parse(storage).advancedContent,true,'parent can enable advanced play');
view.querySelector('#family-back').click();
buttons[1].click();
assert.match(view.innerHTML,/data-level="B2"/,'advanced levels shown only after adult opt-in');
get('family-open').click();
const again=view.innerHTML.match(/Сколько будет (\d+) \+ (\d+)\?/);
view.querySelector('#parent-answer').value=String(Number(again[1])+Number(again[2]));
view.querySelector('#parent-check').click();
view.querySelector('#toggle-advanced').click();
assert.equal(JSON.parse(storage).advancedContent,false,'adult can return to gentle mode');
view.querySelector('#family-back').click();
buttons[1].click();
assert.doesNotMatch(view.innerHTML,/data-level="B2"/,'B2 hidden by default in child free play');
view.querySelector('#stories-play').click();
assert.doesNotMatch(view.innerHTML,/data-quest-level="B2"/,'B2 hidden in stories');
buttons[0].click();
assert.match(view.innerHTML,/Привет,<br>Ева!/);
assert.match(view.innerHTML,/teacher-home/,'educational pathway is accessible on the home screen');
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
assert.match(read('magic-world.css'),/eva-valley\.svg/,'scene bundled in CSS');
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
const restoredFixture=JSON.parse(storage);
restoredFixture.seedDone={'seed-01':true};
restoredFixture.seedMemory={'seedword-01-1':seedState.seedMemory['seedword-01-1']};
restoredFixture.alphaDone={'letters-0':true};
restoredFixture.miniBooks={'book-01':true};
restoredFixture.soundFamilies={'sound-0':true};
storage=JSON.stringify(restoredFixture);
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
assert.match(view.innerHTML,/1\/7 островков/,'alphabet group is preserved');
assert.match(view.innerHTML,/1\/20 коротких историй/,'picture reading results survive restart');
assert.match(view.innerHTML,/1\/8 звуковых семей/,'sound families survive restart');
buttons[3].click();
assert.equal(view.querySelectorAll('[data-garden-slot]').length,16,'garden offers 16 places for earned early stickers');
for(const badge of ['Первая полянка','Первая азбука','Первая сказка','Звуковой детектив']){
 assert.match(view.innerHTML,new RegExp(badge),'real six-year-old learning unlocks '+badge);
}
assert.match(view.innerHTML,/13 наклеек/,'garden correctly counts thirteen obtainable sticker types');
buttons[0].click();
view.querySelector('#memory-first').click();
assert.match(view.innerHTML,/Уже встречались: 1 из 120/,'per-word spaced reviews survive Android restart');
buttons[0].click();
view.querySelector('#alphabet-first').click();
assert.match(view.innerHTML,/Знаю буквы!/,'letter mastery survives restart');
buttons[0].click();

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
