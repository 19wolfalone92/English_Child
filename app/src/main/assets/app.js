(function kidsApp() {
'use strict';
const modules = Array.isArray(window.KIDS_MODULES) ? window.KIDS_MODULES : [];
const levels = ['Pre-A1', 'A1', 'A2', 'B1', 'B2'];
const levelNames = {'Pre-A1':'Первые слова','A1':'Я умею говорить','A2':'Я рассказываю','B1':'Я общаюсь','B2':'Я рассуждаю'};
const modes = ['Первые слова','Понимаю и отвечаю','Слушаю','Строю фразы','Говорю вслух','Читаю и понимаю','Пишу и думаю','Повторяю','Смешанная практика','Проверка темы'];
const lessons = modules.flatMap((m,i)=>Array.from({length:10},(_,n)=>({id:'day-'+String(i*10+n+1).padStart(3,'0'),index:i*10+n,moduleIndex:i,day:n+1,mode:n,title:m.title})));
const lookup = new Map(modules.flatMap(m=>m.items.map(item=>[item.id,item])));
const view = document.getElementById('view');
const bridge = window.KidsAndroid || null;
const fresh = () => ({done:{},items:{},xp:0,answers:0,correct:0,days:{},level:'Pre-A1'});
let state=fresh();
try {
 const saved=bridge ? bridge.loadProgress() : localStorage.getItem('kids-progress-v1');
 if(saved) {
   const x=JSON.parse(saved);
   if(x && typeof x==='object' && !Array.isArray(x)) state={...fresh(),...x,done:x.done||{},items:x.items||{},days:x.days||{}};
 }
} catch(error) { console.warn('Progress could not be loaded',error); }
const save=()=>{
 try {
  const data=JSON.stringify(state);
  if(bridge) bridge.saveProgress(data);
  else localStorage.setItem('kids-progress-v1',data);
 } catch(error) { console.warn('Progress could not be saved',error); }
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=(a)=>{
 const result=[...a];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
};
const dateKey=()=>{
 const d=new Date();
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const passed=id=>state.done[id]?.passed===true;
const passedCount=()=>lessons.filter(l=>passed(l.id)).length;
const nextLesson=()=>lessons.find(l=>!passed(l.id));
const openLesson=l=>l.index===0||passed(lessons[l.index-1].id);
const today=()=>state.days[dateKey()]||0;
const speakAvailable=()=>{
 try {return bridge ? bridge.isSpeechAvailable() : !!window.speechSynthesis;} catch(e){return false;}
};
const speak=text=>{
 if(!text)return;
 try {
  if(bridge) bridge.speak(text);
  else if(window.speechSynthesis){
   window.speechSynthesis.cancel();
   const u=new SpeechSynthesisUtterance(text);
   u.lang='en-US';u.rate=.8;window.speechSynthesis.speak(u);
  }
 }catch(e){console.warn('Audio failed',e);}
};
let tab='home',session=null;
function setNav(selected){
 tab=selected;
 document.querySelectorAll('.bottom button').forEach(b=>b.classList.toggle('selected',b.dataset.tab===tab));
 document.getElementById('xp').textContent='⭐ '+(state.xp||0);
 document.getElementById('daily').textContent='🎯 '+Math.min(today(),10)+'/10';
}
function topHero(icon,title,text){
 return `<section class="hero"><div class="hero-emoji" aria-hidden="true">${icon}</div><div class="eyebrow">WOLFIE KIDS · ENGLISH ADVENTURE</div><h1>${esc(title)}</h1><p>${esc(text)}</p></section>`;
}
function launchExtra(kind){
 session=null;setNav('play');
 const extras=window.KIDS_ADVENTURES;
 if(!extras||typeof extras[kind]!=='function'){renderPlay();return;}
 extras[kind]({view,state,save,speak,speakAvailable,onExit:renderPlay});
}
function renderHome(){
 session=null;setNav('home');
 const next=nextLesson();
 let html=topHero('🐺','Привет, исследователь!','Английский — это приключение. Учись маленькими шагами, слушай, играй и смело пробуй снова.');
 html+=`<section class="home-stats"><div><strong>${passedCount()}/300</strong><span>занятий</span></div><div><strong>${Math.min(today(),10)}/10</strong><span>цель дня</span></div><div><strong>${state.xp||0}</strong><span>звёзд</span></div></section>`;
 html+='<section class="feature alphabet-banner"><div><h2>🔤 Английская азбука</h2><p>Все 26 букв с озвучиванием и примерами.</p></div><button type="button" class="secondary" id="alphabet">Изучать →</button></section>';
 html+=`<section class="feature"><div class="section-title"><h2>Продолжить путь</h2><span class="badge">Pre-A1 → B2</span></div>${next?`<div class="next"><span class="big-emoji">${modules[next.moduleIndex].emoji}</span><div><strong>Урок ${next.index+1}: ${esc(next.title)}</strong><p>${esc(modes[next.day-1])} · ${esc(modules[next.moduleIndex].level)}</p></div></div><button class="primary" id="continue">▶ Начать урок</button>`:'<p>Все занятия пройдены! Продолжай практику и попробуй независимую проверку знаний.</p>'}</section>`;
 html+=`<section class="feature"><h2>Пять ступеней английского 🏔️</h2><p>30 тем × 10 разных занятий. Материал внутри темы повторяется с новыми задачами — так он лучше запоминается.</p><div class="level-grid">${levels.map(level=>{const count=lessons.filter(l=>modules[l.moduleIndex].level===level&&passed(l.id)).length;return `<div class="level-box"><b>${level}</b><span>${esc(levelNames[level])}</span><small>${count}/60</small><div class="bar"><i style="width:${Math.round(count/60*100)}%"></i></div></div>`;}).join('')}</div></section>`;
 html+='<section class="feature"><h2>Карта приключений 🗺️</h2><p>Занятия открываются по порядку. Для следующего шага достаточно 7 правильных ответов из 10.</p>';
 for(let i=0;i<modules.length;i++){
  const m=modules[i];const start=i*10,done=lessons.slice(start,start+10).filter(l=>passed(l.id)).length;
  const expanded=next&&next.moduleIndex===i;
  html+=`<details class="module" ${expanded?'open':''}><summary><span class="module-symbol">${m.emoji}</span><span class="module-text"><strong>${esc(m.title)}</strong><small>${m.level} · ${done}/10 занятий</small></span><span class="disclosure">⌄</span></summary><div class="lesson-grid">`;
  lessons.slice(start,start+10).forEach(l=>{
   const available=openLesson(l);
   html+=`<button type="button" class="day ${passed(l.id)?'complete':''}" data-start="${l.index}" ${available?'':'disabled'}><span class="day-num">${passed(l.id)?'✓':available?'▶':'🔒'}</span><span><strong>День ${l.index+1}</strong><small>${esc(l.mode)}</small></span></button>`;
  });
  html+='</div></details>';
 }
 html+='</section>';
 view.innerHTML=html;
 view.querySelector('#alphabet')?.addEventListener('click',renderAlphabet);
 view.querySelector('#stories-home')?.addEventListener('click',()=>launchExtra('openStories'));
 view.querySelector('#dialogues-home')?.addEventListener('click',()=>launchExtra('openDialogues'));
 view.querySelector('#memory-home')?.addEventListener('click',()=>launchExtra('openMemory'));
 view.querySelector('#continue')?.addEventListener('click',()=>next&&start(next.index));
 view.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.start))));
}
function renderAlphabet(){
 session=null;setNav('play');
 const alphabet=Array.isArray(window.KIDS_ALPHABET)?window.KIDS_ALPHABET:[];
 let html=topHero('🔤','Моя английская азбука','Все 26 букв! Нажми на карточку, чтобы услышать букву и слово. Повторяй вслух с волчонком.');
 html+=`<section class="feature"><div class="section-title"><h2>Слушай и повторяй</h2><span class="badge">A–Z · ${alphabet.length}</span></div>
 <div class="alphabet-grid">${alphabet.map(row=>`<button type="button" class="alphabet-card" data-say="${esc(row.letter)}" aria-label="Послушать ${esc(row.letter)} — ${esc(row.word)}"><strong>${esc(row.letter)}</strong><b>${esc(row.word)}</b><small>${esc(row.ru)}</small><span>🔊</span></button>`).join('')}</div><p class="muted">Название буквы и звук в слове могут различаться. Слушай слово целиком. Для озвучивания нужен английский голос в Android.</p><button class="secondary full" id="alphabet-back">← К тренировкам</button></section>`;
 view.innerHTML=html;
 view.querySelectorAll('[data-say]').forEach(btn=>btn.addEventListener('click',()=>{
  const row=alphabet.find(a=>a.letter===btn.dataset.say);
  if(row)speak(`${row.letter}. ${row.word}`);
 }));
 view.querySelector('#alphabet-back').addEventListener('click',renderPlay);
}
function renderPlay(){
 session=null;setNav('play');
 let html=topHero('🎮','Играй и учись','Выбери любую тему. Свободная тренировка не влияет на порядок уроков курса.');
 html+='<section class="feature alphabet-banner"><div><h2>🔤 Буквы A–Z</h2><p>26 букв, слова и произношение.</p></div><button type="button" class="secondary" id="alphabet">Изучать →</button></section>';
 html+='<div class="feature"><h2>Выбери уровень</h2><div class="level-buttons">'+levels.map(level=>`<button class="level-button ${state.level===level?'active':''}" data-level="${level}">${level}</button>`).join('')+'</div></div>';
 html+='<section class="feature"><h2>🌟 Выбери приключение</h2><div class="quest-shortcuts"><button class="quest-shortcut" id="stories-play"><span>📚</span><b>Сказки</b><small>Читай по смыслу</small></button><button class="quest-shortcut" id="dialogues-play"><span>🗣️</span><b>Диалоги</b><small>Учись общаться</small></button><button class="quest-shortcut" id="memory-play"><span>🎴</span><b>Найди пару</b><small>Без таймера</small></button></div></section>';
 html+='<section class="feature"><h2>Игры и тренировки</h2><div class="play-grid">';
 for(const [i,m] of modules.entries()){
  if(m.level!==state.level)continue;
  html+=`<button class="play-card" data-free="${i}"><span class="big-emoji">${m.emoji}</span><strong>${esc(m.title)}</strong><small>10 заданий · 🔊 слушать · 🧩 собирать</small></button>`;
 }
 html+='</div></section>';
 view.innerHTML=html;
 view.querySelector('#alphabet')?.addEventListener('click',renderAlphabet);
 view.querySelector('#stories-play')?.addEventListener('click',()=>launchExtra('openStories'));
 view.querySelector('#dialogues-play')?.addEventListener('click',()=>launchExtra('openDialogues'));
 view.querySelector('#memory-play')?.addEventListener('click',()=>launchExtra('openMemory'));
 view.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{state.level=b.dataset.level;save();renderPlay();}));
 view.querySelectorAll('[data-free]').forEach(b=>b.addEventListener('click',()=>startFree(Number(b.dataset.free))));
}
function renderReview(){
 session=null;setNav('review');
 const now=Date.now();
 const due=[...lookup.values()].filter(x=>state.items[x.id]&&state.items[x.id].due<=now);
 view.innerHTML=topHero('🧠','Пора вспомнить!','Знакомые слова возвращаются через 1, 3, 7, 14 и 30 дней.')+
 `<section class="feature"><h2>Повторение</h2><div class="home-stats"><div><strong>${due.length}</strong><span>сейчас</span></div><div><strong>${Object.keys(state.items).length}</strong><span>изучено</span></div></div><button class="primary" id="review-start" ${due.length?'':'disabled'}>${due.length?'🔁 Повторить до 10 фраз':'🎉 Сейчас всё повторено'}</button><p>Если ответ не получился, фраза вернётся раньше. Не нужно торопиться.</p></section>`;
 view.querySelector('#review-start')?.addEventListener('click',()=>{
  const items=shuffle(due).slice(0,10);
  session={kind:'review',items,types:items.map((_,i)=>i%2?'ru-en':'en-ru'),index:0,correct:0,answers:[],module:modules.find(m=>m.items.some(z=>z.id===items[0].id))||modules[0]};
  question();
 });
}
function renderFamily(){
 session=null;setNav('family');
 const count=passedCount(),accuracy=state.answers?Math.round((state.correct||0)/state.answers*100):0;
 const read=Object.values(state.storyScores||{}).filter(x=>x.best>=2).length;
 const talks=Object.values(state.dialogueScores||{}).filter(x=>x.best>=2).length;
 view.innerHTML=topHero('👨‍👩‍👧','Родителям','Приложение без регистрации, рекламы, социальных функций и доступа к интернету.')+
 `<section class="feature"><h2>Как идут занятия?</h2><div class="home-stats"><div><strong>${count}</strong><span>завершено</span></div><div><strong>${accuracy}%</strong><span>ответы</span></div><div><strong>${Object.keys(state.items).length}</strong><span>фраз встречено</span></div></div><p>📚 Прочитанные истории: ${read}/15. 🗣️ Диалоги: ${talks}/10.</p><h3>О важном</h3><p>Путь Pre-A1 → B2 — учебная структура, а не автоматическое присвоение уровня. Для подтверждения B1/B2 нужны самостоятельные тексты, диалоги, чтение и внешнее оценивание.</p><p>Чтение с вопросами, упражнения на выбор реплик и игра в пары доступны отдельно. Слушание использует синтез речи устройства. В приложении нет распознавания произношения: устные задания проверяет взрослый. Письменные творческие задания тоже требуют обратной связи.</p><h3>Как помогать ребёнку</h3><p>Начните с 10–15 минут за раз. После занятия предложите отдых, движение или игру без экрана. Повторяйте вслух, играйте с карточками, делайте перерывы. На сложных ступенях увеличивайте занятия постепенно.</p><p>🔒 Прогресс хранится только на устройстве. Нет аккаунта, загрузок персональных данных и сетевых запросов.</p><button type="button" class="secondary" id="reset-progress">Сбросить весь прогресс</button></section>`;
 view.querySelector('#reset-progress').addEventListener('click',()=>{if(confirm('Удалить все звёзды, уроки и повторения с этого устройства?')){state=fresh();save();renderFamily();}});
}
function buildKinds(index,level){
 const day=index%10,advanced=level==='B1'||level==='B2';
 const patterns=[
 ['en-ru','ru-en'],['ru-en','en-ru'],['listen'],['reorder','en-ru'],
 ['listen','ru-en'],['en-ru','ru-en'],advanced?['type','reorder']:['reorder','ru-en'],
 ['en-ru','listen','ru-en'],advanced?['reorder','type','listen']:['reorder','listen','ru-en'],
 advanced?['en-ru','ru-en','listen','type','reorder']:['en-ru','ru-en','listen','reorder']
 ];
 return Array.from({length:10},(_,i)=>patterns[day][i%patterns[day].length]);
}
function start(index){
 const l=lessons[index];
 if(!l || !openLesson(l))return;
 const module=modules[l.moduleIndex];
 const offset=l.day%10;
 const items=module.items.slice(offset).concat(module.items.slice(0,offset));
 session={kind:'course',lesson:l,module,items,types:buildKinds(index,module.level),index:0,correct:0,answers:[]};
 question();
}
function startFree(moduleIndex){
 const module=modules[moduleIndex];if(!module)return;
 session={kind:'free',module,items:shuffle(module.items),types:buildKinds(moduleIndex*10+8,module.level),index:0,correct:0,answers:[]};
 question();
}
function normalize(s){return String(s).normalize('NFKC').toLocaleLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9а-яё ]/gi,'').replace(/\s+/g,' ').trim();}
function poolOptions(item,side){
 const m=session.module;
 const candidates=[...m.items.filter(x=>x.id!==item.id),...modules.filter(x=>x.level===m.level&&x.id!==m.id).flatMap(x=>x.items)];
 const seen=new Set([side==='en'?item.en:item.ru]);
 const out=[item];
 for(const x of shuffle(candidates)){
  const value=side==='en'?x.en:x.ru;
  if(!seen.has(value)){out.push(x);seen.add(value);}
  if(out.length===4)break;
 }
 return shuffle(out);
}
function record(item,correct){
 const old=state.items[item.id]||{stage:0,seen:0};
 const stage=correct?Math.min((old.stage||0)+1,5):0;
 const schedule=[0,1,3,7,14,30];
 state.items[item.id]={stage,seen:(old.seen||0)+1,due:correct?Date.now()+schedule[stage]*86400000:Date.now()};
 state.answers=(state.answers||0)+1;
 if(correct){state.correct=(state.correct||0)+1;state.xp=(state.xp||0)+10;}
 state.days[dateKey()]=(state.days[dateKey()]||0)+1;
 save();
}
function answer(correct,chosen){
 if(!session||session.answered)return;
 session.answered=true;
 const x=session.items[session.index];
 session.correct+=Number(correct);
 session.answers.push(correct);
 record(x,correct);
 const responses=view.querySelectorAll('[data-answer]');
 responses.forEach(b=>{
  b.disabled=true;
  if(b.dataset.answer===x.id)b.classList.add('good');
  else if(b===chosen)b.classList.add('bad');
 });
 const field=view.querySelector('#type-answer');
 if(field)field.disabled=true;
 const feedback=view.querySelector('#feedback');
 feedback.innerHTML=`<div class="feedback ${correct?'':'retry'}" role="status"><strong>${correct?'🌟 Верно! Молодец!':'💪 Ничего страшного, потренируемся ещё!'}</strong><p><b>${esc(x.en)}</b><br>${esc(x.ru)}</p><button type="button" class="secondary" id="repeat-voice">🔊 Послушать</button><button type="button" class="primary" id="next-question">${session.index===session.items.length-1?'Узнать результат':'Далее →'}</button></div>`;
 feedback.querySelector('#repeat-voice').addEventListener('click',()=>speak(x.en));
 feedback.querySelector('#next-question').addEventListener('click',()=>{session.index++;question();});
}
function question(){
 const s=session;if(!s)return;
 if(s.index>=s.items.length){endSession();return;}
 setNav(s.kind==='course'?'home':s.kind==='review'?'review':'play');
 s.answered=false;
 const item=s.items[s.index];
 let kind=s.types[s.index]||'en-ru';
 if(kind==='listen'&&!speakAvailable())kind='en-ru';
 const m=s.module;
 const day=s.lesson?.day||0;
 let html=`<div class="task-head"><button type="button" class="secondary small" id="leave">← Выйти</button><span>${s.index+1}/${s.items.length}</span><span class="badge">${esc(m.level)}</span></div>
 <div class="bar"><i style="width:${Math.round(s.index/s.items.length*100)}%"></i></div>
 <section class="feature question"><span class="eyebrow">${esc(m.title)} · ${s.kind==='course'?'День '+day:'Практика'}</span><h1>${kind==='listen'?'🎧 Послушай фразу':kind==='reorder'?'🧩 Собери предложение':kind==='type'?'✍️ Напиши по-английски':'🎯 Выбери перевод'}</h1>`;
 if(s.kind==='course'&&s.index===0){
  html+=`<div class="note"><b>Сегодня: ${esc(modes[day-1])}</b><br>${esc(m.rule)}<br>🌟 Задание: ${esc(m.mission)}</div>`;
  if(day===6)html+=`<div class="mini-reader"><b>📖 Мини-текст для чтения</b><p>${m.items.slice(0,3).map(x=>esc(x.en)).join(' ')}</p></div>`;
  if(day===7)html+=`<div class="mini-reader"><b>✍️ Творческая работа</b><p>${esc(m.mission)} Покажи свою работу взрослому: программа не оценивает свободный текст автоматически.</p></div>`;
  if(day===5)html+=`<div class="mini-reader"><b>🎤 Говори вслух</b><p>Слушай английские фразы и повторяй. Попроси взрослого помочь с произношением.</p></div>`;
 }
 if(kind==='listen'){
  html+=`<p>Нажми на звук и выбери русский перевод. Английский текст появится после ответа.</p><button class="listen-big" id="speak-now" type="button" aria-label="Прослушать фразу">🔊</button>`;
 }else if(kind==='en-ru')html+=`<div class="prompt">${esc(item.en)}</div><button class="sound" id="speak-now" type="button">🔊 Слушать</button>`;
 else html+=`<div class="prompt">${esc(item.ru)}</div>`;
 if(kind==='reorder'){
  const tokens=item.en.split(/\s+/).map((word,i)=>({word,i}));
  const shuffled=shuffle(tokens);
  html+=`<p>Нажимай на слова в правильном порядке.</p><div class="word-target" id="chosen-words" aria-live="polite">Нажми на слова ниже...</div><div class="word-bank">${shuffled.map(t=>`<button class="token" data-token="${t.i}">${esc(t.word)}</button>`).join('')}</div><div class="two"><button class="secondary" id="clear-words">↺ Сначала</button><button class="primary" id="check-words">Проверить</button></div>`;
 } else if(kind==='type'){
  html+=`<p>Напиши точный вариант фразы, затем проверь. Возможны и другие правильные переводы — этот тренажёр их пока не распознаёт.</p><label for="type-answer" class="sr-only">Перевод</label><input id="type-answer" class="text-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Введи перевод..." maxlength="240"><button class="primary" id="check-type">Проверить</button>`;
 }else{
  html+=`<div class="answers">${poolOptions(item,kind==='ru-en'?'en':'ru').map(x=>`<button class="answer" data-answer="${esc(x.id)}">${esc(kind==='ru-en'?x.en:x.ru)}</button>`).join('')}</div>`;
 }
 html+='</section><div id="feedback" aria-live="polite"></div>';
 view.innerHTML=html;
 view.querySelector('#leave').addEventListener('click',()=>{session=null;if(s.kind==='course')renderHome();else if(s.kind==='review')renderReview();else renderPlay();});
 view.querySelector('#speak-now')?.addEventListener('click',()=>speak(item.en));
 if(kind==='listen')setTimeout(()=>{if(session===s&&!s.answered) speak(item.en);},250);
 if(kind==='reorder'){
  const selection=[];
  const chosen=view.querySelector('#chosen-words');
  const update=()=>{chosen.textContent=selection.length?selection.map(i=>item.en.split(/\s+/)[i]).join(' '):'Нажми на слова ниже...';view.querySelectorAll('[data-token]').forEach(b=>b.disabled=selection.includes(Number(b.dataset.token)));};
  view.querySelectorAll('[data-token]').forEach(b=>b.addEventListener('click',()=>{if(s.answered)return;selection.push(Number(b.dataset.token));update();}));
  view.querySelector('#clear-words').addEventListener('click',()=>{if(s.answered)return;selection.length=0;update();});
  view.querySelector('#check-words').addEventListener('click',()=>{
   if(s.answered||!selection.length)return;
   const correct=selection.length===item.en.split(/\s+/).length&&selection.every((x,i)=>x===i);
   answer(correct,null);
  });
 }else if(kind==='type'){
  view.querySelector('#check-type').addEventListener('click',()=>{if(!s.answered&&view.querySelector('#type-answer').value.trim())answer(normalize(view.querySelector('#type-answer').value)===normalize(item.en),null);});
  view.querySelector('#type-answer').addEventListener('keydown',e=>{if(e.key==='Enter')view.querySelector('#check-type').click();});
 }else{
  view.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>answer(b.dataset.answer===item.id,b)));
 }
}
function endSession(){
 const s=session;if(!s)return;
 const correct=s.correct,passedToday=correct>=Math.ceil(s.items.length*.7);
 if(s.kind==='course'){
  const old=state.done[s.lesson.id]||{best:0,attempts:0};
  state.done[s.lesson.id]={best:Math.max(old.best||0,correct),passed:passedToday||!!old.passed,attempts:(old.attempts||0)+1};
  save();
 }
 session=null;setNav(s.kind==='course'?'home':s.kind==='review'?'review':'play');
 const result=passedToday?'🏆':'🌈';
 view.innerHTML=topHero(result,passedToday?'У тебя получилось!':'Каждая попытка важна!',`Верных ответов: ${correct} из ${s.items.length}.`)+
 `<section class="feature"><h2>${passedToday?'Звёздный результат!':'Можно попробовать ещё раз'}</h2><p>${s.kind==='course'?(passedToday?'Следующий урок открыт!':'Для открытия следующего урока нужно минимум 7 ответов из 10.'): 'Ты можешь повторить тему в любое время.'}</p><p>🎤 ${esc(s.module.mission)}</p><p class="muted">🌿 После одного занятия полезно сделать перерыв, потянуться и посмотреть вдаль.</p><p class="muted">Творческую устную и письменную работу программа не оценивает. Попроси взрослого послушать твой рассказ.</p><button class="primary" id="back-home">${s.kind==='course'?'Вернуться к курсу':'К тренировкам'}</button>${s.kind==='course'&&!passedToday?'<button class="secondary full" id="retry-day">↺ Повторить урок</button>':''}</section>`;
 view.querySelector('#back-home').addEventListener('click',()=>s.kind==='course'?renderHome():s.kind==='review'?renderReview():renderPlay());
 view.querySelector('#retry-day')?.addEventListener('click',()=>start(s.lesson.index));
}
document.querySelectorAll('.bottom button').forEach(b=>b.addEventListener('click',()=>{
 if(b.dataset.tab==='home')renderHome();
 if(b.dataset.tab==='play')renderPlay();
 if(b.dataset.tab==='review')renderReview();
 if(b.dataset.tab==='family')renderFamily();
}));
renderHome();
})();
