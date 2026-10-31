(function kidsApp() {
'use strict';
const identity=window.KIDS_IDENTITY;
if(!identity || identity.name!=='Ева' || identity.englishName!=='Eva')throw new Error('Eva profile is missing');
const child=(form='name')=>identity[form]||identity.name;
const modules = Array.isArray(window.KIDS_MODULES) ? window.KIDS_MODULES : [];
const levels = ['Pre-A1', 'A1', 'A2', 'B1', 'B2'];
const levelNames = {'Pre-A1':'Первые слова','A1':'Я умею говорить','A2':'Я рассказываю','B1':'Я общаюсь','B2':'Я рассуждаю'};
const modes = ['Первые слова','Понимаю и отвечаю','Слушаю','Строю фразы','Говорю вслух','Читаю и понимаю','Пишу и думаю','Повторяю','Смешанная практика','Проверка темы'];
const lessons = modules.flatMap((m,i)=>Array.from({length:10},(_,n)=>({id:'day-'+String(i*10+n+1).padStart(3,'0'),index:i*10+n,moduleIndex:i,day:n+1,mode:n,title:m.title})));
const lookup = new Map(modules.flatMap(m=>m.items.map(item=>[item.id,item])));
const view = document.getElementById('view');
const bridge = window.KidsAndroid || null;
const fresh = () => ({done:{},items:{},xp:0,answers:0,correct:0,days:{},level:'Pre-A1',theme:'lilac'});
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
const speakHint=text=>{
 if(!text)return;
 try{
  if(bridge?.speakRussian){bridge.speakRussian(String(text).slice(0,250));return;}
  if(window.speechSynthesis){
   window.speechSynthesis.cancel();
   const u=new SpeechSynthesisUtterance(String(text).slice(0,250));
   u.lang='ru-RU';u.rate=.85;window.speechSynthesis.speak(u);
  }
 }catch(error){console.warn('Russian speech unavailable',error);}
};
const sparkle=()=>{
 if(typeof view.insertAdjacentHTML!=='function')return;
 view.insertAdjacentHTML('beforeend','<div class="decor-sparkles" aria-hidden="true"></div>');
 const box=view.querySelector('.decor-sparkles');
 if(!box)return;
 for(let i=0;i<9;i++){
  const icon=document.createElement('i');
  icon.textContent=['⭐','✨','🌸','💖'][i%4];
  icon.style.setProperty('--dx',(Math.cos(i*2*Math.PI/9)*135).toFixed(0)+'px');
  icon.style.setProperty('--dy',(Math.sin(i*2*Math.PI/9)*120-45).toFixed(0)+'px');
  box.appendChild(icon);
 }
 setTimeout(()=>{box.remove?.();},1100);
};
document.title='Eva English Kids — Английский для '+child('genitive');
const brandTitle=document.getElementById('brand-title');
if(brandTitle)brandTitle.textContent=child('englishName')+' English Kids';
const brandSubtitle=document.getElementById('brand-subtitle');
if(brandSubtitle)brandSubtitle.textContent='Вулфи и '+child('name')+' учат английский!';
let tab='home',session=null;
function setNav(selected){
 tab=selected;
 document.querySelectorAll('.bottom button').forEach(b=>b.classList.toggle('selected',b.dataset.tab===tab));
 document.getElementById('xp').textContent='⭐ '+(state.xp||0);
 document.getElementById('daily').textContent='🎯 '+Math.min(today(),10)+'/10';
}
function topHero(icon,title,text){
 return `<section class="hero"><div class="hero-emoji" aria-hidden="true">${icon}</div><div class="eyebrow">✨ ИГРАЕМ И УЧИМСЯ</div><h1>${esc(title)}</h1><p>${esc(text)}</p></section>`;
}
function launchExtra(kind){
 session=null;setNav(kind==='openStories'?'stories':'play');
 const extras=window.KIDS_ADVENTURES;
 if(!extras||typeof extras[kind]!=='function'){renderPlay();return;}
 extras[kind]({view,state,save,speak,speakHint,speakAvailable,onExit:renderPlay,identity});
}
function achievements(){
 const stories=Object.values(state.storyScores||{}).filter(x=>x.best>=2).length;
 const talks=Object.values(state.dialogueScores||{}).filter(x=>x.best>=2).length;
 const letters=Object.keys(state.alphabetHeard||{}).length;
 return [
  {emoji:'🔤',name:'Открыватель букв',earned:letters===26,detail:letters+'/26 букв'},
  {emoji:'👣',name:'Первый шаг',earned:passed('day-001'),detail:'Первое занятие'},
  {emoji:'🎨',name:'Художник',earned:Object.values(state.pictureWins||{}).some(x=>x>=6),detail:'Игра с картинками'},
  {emoji:'🎴',name:'Хранитель слов',earned:Object.keys(state.gameWins||{}).length>0,detail:'Игра в пары'},
  {emoji:'📚',name:'Сказочник',earned:stories>=3,detail:stories+'/3 истории'},
  {emoji:'🗣️',name:'Собеседник',earned:talks>=3,detail:talks+'/3 диалога'},
  {emoji:'🗺️',name:'Путешественник',earned:passed('day-030'),detail:'30 уроков'},
  {emoji:'🏔️',name:'Весь маршрут',earned:passed('day-300'),detail:'300 уроков'}
 ];
}

const palettes=[
{id:'lilac',name:'💜 Сиреневое чудо',primary:'#7451b8',accent:'#f1a96b',bg:'#fff8f3'},
{id:'strawberry',name:'🍓 Клубника',primary:'#b53671',accent:'#f89a78',bg:'#fff3f5'},
{id:'mint',name:'🌿 Мята',primary:'#237c76',accent:'#efac5b',bg:'#f1fff8'},
{id:'sky',name:'🦋 Голубое небо',primary:'#376eb2',accent:'#f2ac7d',bg:'#f3faff'},
{id:'sunshine',name:'🌻 Солнышко',primary:'#ad5b28',accent:'#f8bd54',bg:'#fffaf0'},
{id:'rainbow',name:'🌈 Радуга',primary:'#6654bc',accent:'#ed81ad',bg:'#fff9ff'}
];
const isHex=h=>/^#[0-9a-f]{6}$/i.test(h);
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const blend=(a,b,t)=>{
 const c=rgb(a),d=rgb(b);
 return '#'+c.map((v,i)=>Math.round(v*(1-t)+d[i]*t).toString(16).padStart(2,'0')).join('');
};
function onPrimary(hex){
 const [r,g,b]=rgb(hex).map(v=>{const s=v/255;return s<=0.04045?s/12.92:((s+.055)/1.055)**2.4;});
 return .2126*r+.7152*g+.0722*b>.38?'#262139':'#ffffff';
}
function applyTheme(){
 const root=document.documentElement;if(!root)return;
 const name=palettes.some(x=>x.id===state.theme)?state.theme:state.theme==='custom'?'custom':'lilac';
 root.dataset.theme=name;
 const style=root.style;
 const settings=['--ui-primary','--ui-deep','--ui-accent','--ui-bg','--ui-soft','--ui-sky','--ui-highlight','--ui-border','--ui-softglow','--ui-on-primary'];
 if(name==='custom'){
  const p=isHex(state.customPrimary)?state.customPrimary:'#7451b8',a=isHex(state.customAccent)?state.customAccent:'#f1a96b';
  const values={
   '--ui-primary':p,'--ui-deep':blend(p,'#111021',.38),'--ui-accent':a,
   '--ui-bg':blend(p,'#ffffff',.955),'--ui-soft':blend(p,'#ffffff',.77),
   '--ui-sky':blend(a,'#ffffff',.79),'--ui-highlight':blend(a,'#ffffff',.71),
   '--ui-border':blend(p,'#ffffff',.83),'--ui-softglow':'rgba(90,60,100,.18)','--ui-on-primary':onPrimary(p)
  };
  for(const key of settings)style.setProperty(key,values[key]);
 }else{
  for(const key of settings)style.removeProperty(key);
 }
 const bg=name==='custom'?blend(isHex(state.customPrimary)?state.customPrimary:'#7451b8','#ffffff',.955):(palettes.find(x=>x.id===name)?.bg||'#fff8f3');
 try{bridge?.setSystemBarColor?.(bg);}catch(error){console.warn('System colors unavailable',error);}
}
function setTheme(theme){
 if(!(theme==='custom'||palettes.some(x=>x.id===theme)))return;
 state.theme=theme;save();applyTheme();renderThemeChooser();
}
function closeThemeChooser(){
 const overlay=document.getElementById('theme-overlay');
 if(overlay){overlay.hidden=true;overlay.innerHTML='';}
 document.getElementById('theme-open')?.focus?.();
}
function renderThemeChooser(){
 const overlay=document.getElementById('theme-overlay');if(!overlay)return;
 overlay.hidden=false;
 const p=isHex(state.customPrimary)?state.customPrimary:'#7451b8',a=isHex(state.customAccent)?state.customAccent:'#f1a96b';
 overlay.innerHTML='<div class="theme-sheet" role="dialog" aria-modal="true" aria-labelledby="theme-title" tabindex="-1">'+
 '<div class="section-lead"><h2 id="theme-title">🎨 Мои цвета</h2><span class="badge">Волшебная палитра</span></div><p>Выбери любимое настроение. Цвета останутся даже после закрытия приложения!</p>'+
 '<div class="theme-grid">'+palettes.map(x=>'<button type="button" data-palette="'+x.id+'" class="theme-choice '+((state.theme||'lilac')===x.id?'selected':'')+'" aria-pressed="'+((state.theme||'lilac')===x.id)+'"><span class="theme-swatches"><i style="background:'+x.primary+'"></i><i style="background:'+x.accent+'"></i><i style="background:'+x.bg+'"></i></span><b>'+x.name+'</b></button>').join('')+'</div>'+
 '<div class="theme-custom"><h3>✨ Придумай свои цвета!</h3><div class="theme-pickers">'+
 '<label>Главный цвет<input id="custom-main" type="color" value="'+p+'" aria-label="Выбери основной цвет"></label>'+
 '<label>Цвет волшебства<input id="custom-accent" type="color" value="'+a+'" aria-label="Выбери дополнительный цвет"></label></div>'+
 '<p class="muted">Выбирай цвет — экран изменится сам.</p></div>'+
 '<button class="primary theme-close" id="theme-close">🌸 Готово!</button></div>';
 overlay.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.palette)));
 const change=()=>{
  const main=overlay.querySelector('#custom-main'),accent=overlay.querySelector('#custom-accent');
  if(!main||!accent||!isHex(main.value)||!isHex(accent.value))return;
  state.customPrimary=main.value;state.customAccent=accent.value;state.theme='custom';save();applyTheme();
 };
 overlay.querySelector('#custom-main')?.addEventListener('input',change);
 overlay.querySelector('#custom-accent')?.addEventListener('input',change);
 overlay.querySelector('#theme-close')?.addEventListener('click',closeThemeChooser);
 overlay.querySelector('[role="dialog"]')?.focus?.();
}
function renderParentGate(){
 session=null;setNav('home');
 const a=17+Math.floor(Math.random()*17),b=19+Math.floor(Math.random()*17);
 view.innerHTML=topHero('👨‍👩‍👧','Вход для взрослых','Здесь находятся настройки и отчёт для родителей.')+
 `<section class="feature parent-gate"><h2>🔒 Только для взрослых</h2><p>Решите пример, чтобы открыть настройки.</p><label for="parent-answer"><strong>Сколько будет ${a} + ${b}?</strong></label><input type="number" inputmode="numeric" pattern="[0-9]*" id="parent-answer" class="text-input" placeholder="Ответ" aria-label="Ответ на пример" max="999"><p id="parent-error" role="status"></p><button class="primary" id="parent-check">Открыть для родителей</button><button class="secondary full" id="parent-back">← Назад</button></section>`;
 const check=()=>{
  const input=view.querySelector('#parent-answer');
  if(Number(input?.value)===a+b&&String(input?.value).trim()!=='')renderFamily();
  else{const e=view.querySelector('#parent-error');if(e)e.textContent='Попробуйте ещё раз.';}
 };
 view.querySelector('#parent-check')?.addEventListener('click',check);
 view.querySelector('#parent-answer')?.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
 view.querySelector('#parent-back')?.addEventListener('click',renderHome);
}

function renderHome(){
 session=null;setNav('home');
 const next=nextLesson(),doneCount=passedCount(),awards=achievements();
 const current=next?next.index:299;
 const startAt=Math.max(0,Math.min(current-2,lessons.length-6));
 let html=`<section class="hero home-welcome"><div class="welcome-copy"><div class="eyebrow">✨ ПРИКЛЮЧЕНИЯ С ВУЛФИ</div><h1>Привет,<br>${esc(child("name"))}!</h1><p>${esc(child("name"))}, пойдём играть и открывать английский?</p></div><img class="wolfie-home" src="wolfie.svg" alt="Вулфи — добрый волчонок с бантиком"><span class="welcome-sparkle one">✨</span><span class="welcome-sparkle two">✦</span></section>`;
 html+=`<section class="home-stats"><div><strong>⭐ ${state.xp||0}</strong><span>звёздочки</span></div><div><strong>🌸 ${doneCount}</strong><span>уроков</span></div><div><strong>🏅 ${awards.filter(a=>a.earned).length}</strong><span>наклейки</span></div></section>`;
 html+=`<section class="feature home-start"><div class="section-lead"><h2>🌷 Следующий шаг ${esc(child("genitive"))}</h2><span class="badge">${next?esc(levelNames[modules[next.moduleIndex].level]):'Ура! 🎉'}</span></div>`;
 if(next){
  const m=modules[next.moduleIndex];
  html+=`<div class="next"><span class="big-emoji">${m.emoji}</span><div><strong>${esc(m.title)}</strong><p class="level-pill">Занятие ${next.index+1} · ${esc(modes[next.day-1])}</p></div></div><button class="primary" id="continue">▶ Играть и учиться</button>`;
 }else html+='<p>Ты прошла весь маршрут! Можешь выбрать игру, сказку или повторение.</p><button class="primary" id="home-game">🎮 Выбрать игру</button>';
 html+='<button class="child-voice" id="home-voice" type="button">🔊 Послушать Вулфи</button></section>';
 html+='<section class="feature"><div class="section-lead"><h2>✨ ${esc(child("name"))} и Вулфи</h2><span class="badge">Выбирай!</span></div><div class="quest-shortcuts">'+
 '<button type="button" class="quest-shortcut" id="stories-home"><span>📚</span><b>Сказки</b><small>Читать и слушать</small></button>'+
 '<button type="button" class="quest-shortcut" id="pictures-home"><span>🎨</span><b>Картинки</b><small>Угадывать слова</small></button>'+
 '<button type="button" class="quest-shortcut" id="dialogues-home"><span>🗣️</span><b>Говорим</b><small>Выбрать ответ</small></button>'+
 '<button type="button" class="quest-shortcut" id="memory-home"><span>🎴</span><b>Пары</b><small>Играть и помнить</small></button></div></section>';
 html+='<section class="feature"><div class="section-lead"><h2>🗺️ Карта ${esc(child("genitive"))}</h2><span class="badge">'+doneCount+'/300</span></div><p class="route-hint">Пройди по волшебной тропинке. 🌸 — уже пройдено, ⭐ — следующий шаг!</p><div class="route-track">';
 for(const l of lessons.slice(startAt,startAt+6)){
  const isDone=passed(l.id),available=openLesson(l);
  html+=`<button type="button" class="route-stop ${isDone?'complete':available?'ready':''}" data-hop="${l.index}" ${available?'':'disabled'} aria-label="Урок ${l.index+1}: ${esc(l.title)}"><span class="route-icon">${isDone?'🌸':available?'⭐':'☁️'}</span><b>Шаг ${l.index+1}</b><small>${isDone?'Пройдено':available?'Играть':'Позже'}</small></button>`;
 }
 html+='</div><details class="route-all"><summary>🧭 Все острова и уроки</summary><p class="map-intro">В каждом острове 10 маленьких занятий. Раскрой островок, чтобы увидеть все шаги.</p>';
 for(let i=0;i<modules.length;i++){
  const m=modules[i],begin=i*10,done=lessons.slice(begin,begin+10).filter(l=>passed(l.id)).length;
  const expanded=next&&next.moduleIndex===i;
  html+=`<details class="module" ${expanded?'open':''}><summary><span class="module-symbol">${m.emoji}</span><span class="module-text"><strong>${esc(m.title)}</strong><small>${esc(levelNames[m.level])} · ${done}/10</small></span><span class="disclosure">⌄</span></summary><div class="lesson-grid">`;
  lessons.slice(begin,begin+10).forEach(l=>{
   const available=openLesson(l);
   html+=`<button type="button" class="day ${passed(l.id)?'complete':''}" data-start="${l.index}" ${available?'':'disabled'}><span class="day-num">${passed(l.id)?'✓':available?'▶':'🔒'}</span><span><strong>Шаг ${l.index+1}</strong><small>${esc(l.mode)}</small></span></button>`;
  });
  html+='</div></details>';
 }
 html+='</details></section>';
 html+='<section class="feature alphabet-banner"><div><h2>🔤 Азбука с картинками</h2><p>Потрогай буквы и послушай слова!</p></div><button class="secondary" type="button" id="alphabet">🔊 Буквы A–Z</button></section>';
 html+='<section class="feature"><div class="section-lead"><h2>🏅 Награды ${esc(child("genitive"))}</h2><span class="badge">'+awards.filter(a=>a.earned).length+'/8</span></div><p>Собирай наклейки и украшай полянку!</p><button class="secondary full" type="button" id="rewards-home">🌼 Посмотреть награды →</button></section>';
 view.innerHTML=html;
 view.querySelector('#continue')?.addEventListener('click',()=>next&&start(next.index));
 view.querySelector('#home-voice')?.addEventListener('click',()=>speakHint('Привет, '+child('name')+'! Я волчонок Вулфи. Давай вместе учить английский! Нажми на большую кнопку, чтобы начать урок. Или выбери игру ниже.'));
 view.querySelector('#home-game')?.addEventListener('click',renderPlay);
 view.querySelector('#alphabet')?.addEventListener('click',renderAlphabet);
 view.querySelector('#stories-home')?.addEventListener('click',()=>launchExtra('openStories'));
 view.querySelector('#dialogues-home')?.addEventListener('click',()=>launchExtra('openDialogues'));
 view.querySelector('#memory-home')?.addEventListener('click',()=>launchExtra('openMemory'));
 view.querySelector('#pictures-home')?.addEventListener('click',()=>launchExtra('openPictures'));
 view.querySelector('#rewards-home')?.addEventListener('click',renderRewards);
 view.querySelectorAll('[data-hop]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.hop))));
 view.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.start))));
}
function renderAlphabet(){
 session=null;setNav('play');
 const alphabet=Array.isArray(window.KIDS_ALPHABET)?window.KIDS_ALPHABET:[];
 let html=topHero('🔤','Азбука '+child('genitive'),'Все 26 букв! Нажми на карточку, чтобы услышать букву и слово. Повторяй вслух с волчонком.');
 html+=`<section class="feature"><div class="section-title"><h2>Слушай и повторяй</h2><span class="badge">A–Z · ${alphabet.length}</span></div>
 <div class="alphabet-grid">${alphabet.map(row=>`<button type="button" class="alphabet-card" data-say="${esc(row.letter)}" aria-label="Послушать ${esc(row.letter)} — ${esc(row.word)}"><span class="letter-picture" aria-hidden="true">${esc(row.emoji||"🔤")}</span><strong>${esc(row.letter)}</strong><b>${esc(row.word)}</b><small>${esc(row.ru)}</small><span>🔊</span></button>`).join('')}</div><p class="muted">Название буквы и звук в слове могут различаться. Слушай слово целиком. Для озвучивания нужен английский голос в Android.</p><button class="secondary full" id="alphabet-back">← К тренировкам</button></section>`;
 view.innerHTML=html;
 view.querySelectorAll('[data-say]').forEach(btn=>btn.addEventListener('click',()=>{
  const row=alphabet.find(a=>a.letter===btn.dataset.say);
  if(row){state.alphabetHeard??={};state.alphabetHeard[row.letter]=true;save();speak(`${row.letter}. ${row.word}`);}
 }));
 view.querySelector('#alphabet-back').addEventListener('click',renderPlay);
}
function renderPlay(){
 session=null;setNav('play');
 let html=topHero('🎲',child('name')+', давай играть!','Какую игру выберем? Просто нажми на большую картинку!');
 html+='<section class="feature"><div class="section-lead"><h2>🎮 Выбери игру</h2><span class="badge">4 игры</span></div><div class="quest-shortcuts">'+
 '<button class="quest-shortcut" id="pictures-play"><span>🖼️</span><b>Угадай картинку</b><small>Для самых маленьких</small></button>'+
 '<button class="quest-shortcut" id="memory-play"><span>🎴</span><b>Найди пару</b><small>Играй со словами</small></button>'+
 '<button class="quest-shortcut" id="stories-play"><span>📚</span><b>Сказки</b><small>Читаем вместе</small></button>'+
 '<button class="quest-shortcut" id="dialogues-play"><span>🗣️</span><b>Поболтаем</b><small>Выбирай ответ</small></button></div></section>';
 html+='<section class="feature alphabet-banner"><div><h2>🔤 Волшебные буквы</h2><p>A, B, C… Каждую можно послушать!</p></div><button type="button" class="secondary" id="alphabet">🔊 Азбука →</button></section>';
 html+='<section class="feature"><div class="section-lead"><h2>🌼 Повторим?</h2><span class="badge">Для памяти</span></div><p>Знакомые слова возвращаются, чтобы ты их не забыла.</p><button type="button" class="secondary full" id="review-play">🧠 Повторять слова</button></section>';
 html+='<section class="feature"><h2>🧚 Выбери свой мир</h2><p>Начни с первых слов. Другие ступени подрастут вместе с тобой!</p><div class="level-buttons">';
 html+=levels.map(l=>`<button class="level-button ${state.level===l?'active':''}" data-level="${l}">${esc(l)}<br><small>${esc(levelNames[l])}</small></button>`).join('');
 html+='</div></section>';
 html+='<section class="feature"><h2>🐾 Мои темы</h2><div class="play-grid">';
 for(const [i,m] of modules.entries()){
  if(m.level!==state.level)continue;
  html+=`<button class="play-card" data-free="${i}"><span class="big-emoji">${m.emoji}</span><strong>${esc(m.title)}</strong><small>Играй со словами</small></button>`;
 }
 html+='</div></section>';
 view.innerHTML=html;
 view.querySelector('#alphabet')?.addEventListener('click',renderAlphabet);
 view.querySelector('#stories-play')?.addEventListener('click',()=>launchExtra('openStories'));
 view.querySelector('#dialogues-play')?.addEventListener('click',()=>launchExtra('openDialogues'));
 view.querySelector('#memory-play')?.addEventListener('click',()=>launchExtra('openMemory'));
 view.querySelector('#pictures-play')?.addEventListener('click',()=>launchExtra('openPictures'));
 view.querySelector('#review-play')?.addEventListener('click',renderReview);
 view.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{state.level=b.dataset.level;save();renderPlay();}));
 view.querySelectorAll('[data-free]').forEach(b=>b.addEventListener('click',()=>startFree(Number(b.dataset.free))));
}
function renderRewards(){
 session=null;setNav('rewards');
 const awards=achievements(),earned=awards.filter(a=>a.earned),picked=state.chosenSticker;
 const allowed=new Set(earned.map(a=>a.emoji));
 if(!allowed.has(picked))state.chosenSticker=earned[0]?.emoji||null;
 const garden=Array.isArray(state.garden)?state.garden.slice(0,8):[];
 let html=topHero('🎁','Волшебный сад '+child('genitive'),'Собирай добрые награды и укрась свою полянку, '+child('name')+'!');
 html+=`<section class="feature"><div class="section-lead"><h2>🌼 Полянка ${esc(child("genitive"))}</h2><span class="badge">${earned.length}/8 наклеек</span></div><p>${earned.length?'Выбери цветную наклейку, а потом нажми на место в саду.':'Сначала поиграй и узнай новые слова — появятся первые наклейки!'}</p><div class="garden"><div class="garden-hill"></div><div class="garden-slots">`;
 for(let i=0;i<8;i++){
  const emoji=allowed.has(garden[i])?garden[i]:'';
  html+=`<button type="button" class="garden-slot ${emoji?'full':''}" data-garden-slot="${i}" aria-label="Место ${i+1}: ${emoji?'украшено '+emoji:'пустое'}">${emoji||'✧'}</button>`;
 }
 html+='</div></div></section>';
 html+='<section class="feature"><h2>🌟 Наклейки ${esc(child("genitive"))}</h2><p>Цветные наклейки уже твои. Остальные откроются, когда будешь играть и учиться.</p><div class="achievement-grid">';
 for(const award of awards){
  html+=`<button type="button" class="achievement sticker-card ${award.earned?'earned':''} ${state.chosenSticker===award.emoji&&award.earned?'sticker-selected':''}" data-sticker="${esc(award.emoji)}" ${award.earned?'':'disabled'} aria-label="${award.earned?'Выбрать наклейку':'Награда пока закрыта'}: ${esc(award.name)}"><span>${award.earned?award.emoji:'🔒'}</span><b>${esc(award.name)}</b><small>${esc(award.detail)}</small></button>`;
 }
 html+='</div><p id="sticker-feedback" class="muted" role="status">🏅 Наклейки не пропадут, даже если долго не играть.</p></section>';
 view.innerHTML=html;
 view.querySelectorAll('[data-sticker]').forEach(b=>b.addEventListener('click',()=>{
  if(!allowed.has(b.dataset.sticker))return;
  state.chosenSticker=b.dataset.sticker;save();renderRewards();
 }));
 view.querySelectorAll('[data-garden-slot]').forEach(b=>b.addEventListener('click',()=>{
  if(!state.chosenSticker||!allowed.has(state.chosenSticker)){
   const note=view.querySelector('#sticker-feedback');
   if(note)note.textContent='Сначала открой свою первую наклейку! 🌷';
   return;
  }
  const i=Number(b.dataset.gardenSlot);
  state.garden=Array.isArray(state.garden)?state.garden:[];
  state.garden[i]=state.chosenSticker;
  save();renderRewards();
 }));
}
function renderReview(){
 session=null;setNav('play');
 const now=Date.now();
 const due=[...lookup.values()].filter(x=>state.items[x.id]&&state.items[x.id].due<=now);
 view.innerHTML=topHero('🧠',child('name')+', повторим слова?','Знакомые слова возвращаются через 1, 3, 7, 14 и 30 дней.')+
 `<section class="feature"><h2>Повторение</h2><div class="home-stats"><div><strong>${due.length}</strong><span>сейчас</span></div><div><strong>${Object.keys(state.items).length}</strong><span>изучено</span></div></div><button class="primary" id="review-start" ${due.length?'':'disabled'}>${due.length?'🔁 Повторить до 10 фраз':'🎉 Сейчас всё повторено'}</button><p>Если ответ не получился, фраза вернётся раньше. Не нужно торопиться.</p></section>`;
 view.querySelector('#review-start')?.addEventListener('click',()=>{
  const items=shuffle(due).slice(0,10);
  session={kind:'review',items,types:items.map((_,i)=>i%2?'ru-en':'en-ru'),index:0,correct:0,answers:[],module:modules.find(m=>m.items.some(z=>z.id===items[0].id))||modules[0]};
  question();
 });
}
function renderFamily(){
 session=null;setNav('home');
 const count=passedCount(),accuracy=state.answers?Math.round((state.correct||0)/state.answers*100):0;
 const read=Object.values(state.storyScores||{}).filter(x=>x.best>=2).length;
 const talks=Object.values(state.dialogueScores||{}).filter(x=>x.best>=2).length;
 view.innerHTML=topHero('👨‍👩‍👧','Прогресс '+child('genitive'),'Приложение без регистрации, рекламы, социальных функций и доступа к интернету.')+
 `<section class="feature"><h2>Как занимается ${esc(child('name'))}?</h2><div class="home-stats"><div><strong>${count}</strong><span>завершено</span></div><div><strong>${accuracy}%</strong><span>ответы</span></div><div><strong>${Object.keys(state.items).length}</strong><span>фраз встречено</span></div></div><p>📚 Прочитанные истории: ${read}/15. 🗣️ Диалоги: ${talks}/10.</p><p>🏅 Получено наград: ${achievements().filter(x=>x.earned).length} из 8.</p><h3>О важном</h3><p>Путь Pre-A1 → B2 — учебная структура, а не автоматическое присвоение уровня. Для подтверждения B1/B2 нужны самостоятельные тексты, диалоги, чтение и внешнее оценивание.</p><p>Чтение с вопросами, упражнения на выбор реплик и игра в пары доступны отдельно. Слушание использует синтез речи устройства. В приложении нет распознавания произношения: устные задания проверяет взрослый. Письменные творческие задания тоже требуют обратной связи.</p><h3>Как помогать ребёнку</h3><p>Начните с 10–15 минут за раз. После занятия предложите отдых, движение или игру без экрана. Повторяйте вслух, играйте с карточками, делайте перерывы. На сложных ступенях увеличивайте занятия постепенно.</p><p>🔒 Прогресс хранится только на устройстве. Нет аккаунта, загрузок персональных данных и сетевых запросов.</p><button type="button" class="secondary" id="reset-progress">Сбросить весь прогресс</button><button type="button" class="secondary full" id="family-back">← На главный экран</button></section>`;
 view.querySelector('#reset-progress').addEventListener('click',()=>{if(confirm('Удалить все звёзды, уроки и повторения с этого устройства?')){state=fresh();save();applyTheme();renderFamily();}});
 view.querySelector('#family-back')?.addEventListener('click',renderHome);
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
 const limit=m.level==='Pre-A1'?2:m.level==='A1'?3:4;
 const candidates=[...m.items.filter(x=>x.id!==item.id),...modules.filter(x=>x.level===m.level&&x.id!==m.id).flatMap(x=>x.items)];
 const seen=new Set([side==='en'?item.en:item.ru]);
 const out=[item];
 for(const x of shuffle(candidates)){
  const value=side==='en'?x.en:x.ru;
  if(!seen.has(value)){out.push(x);seen.add(value);}
  if(out.length===limit)break;
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
 feedback.innerHTML=`<div class="feedback ${correct?'':'retry'}" role="status"><strong>${correct?'🌟 Верно! '+esc(child('name'))+', молодец!':'💪 '+esc(child('name'))+', ничего страшного! Попробуем ещё!'}</strong><p><b>${esc(x.en)}</b><br>${esc(x.ru)}</p><button type="button" class="secondary" id="repeat-voice">🔊 Послушать</button><button type="button" class="primary" id="next-question">${session.index===session.items.length-1?'Узнать результат':'Далее →'}</button></div>`;
 feedback.querySelector('#repeat-voice').addEventListener('click',()=>speak(x.en));
 feedback.querySelector('#next-question').addEventListener('click',()=>{session.index++;question();});
}
function question(){
 const s=session;if(!s)return;
 if(s.index>=s.items.length){endSession();return;}
 setNav(s.kind==='course'?'home':'play');
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
  html+=m.level==='Pre-A1'||m.level==='A1'?
   `<div class="note"><b>🐾 Сегодня играем и учимся!</b><details><summary>Подсказка взрослому</summary><p>${esc(m.rule)}</p><p>🌟 ${esc(m.mission)}</p></details></div>`:
   `<div class="note"><b>Сегодня: ${esc(modes[day-1])}</b><br>${esc(m.rule)}<br>🌟 Задание: ${esc(m.mission)}</div>`;
  if(day===6)html+=`<div class="mini-reader"><b>📖 Мини-текст для чтения</b><p>${m.items.slice(0,3).map(x=>esc(x.en)).join(' ')}</p></div>`;
  if(day===7)html+=`<div class="mini-reader"><b>✍️ Творческая работа</b><p>${esc(m.mission)} Покажи свою работу взрослому: программа не оценивает свободный текст автоматически.</p></div>`;
  if(day===5)html+=`<div class="mini-reader"><b>🎤 Говори вслух</b><p>Слушай английские фразы и повторяй. Попроси взрослого помочь с произношением.</p></div>`;
 }
 const directions=kind==='listen'?'Нажми на звук, послушай фразу и найди правильный перевод.':kind==='reorder'?'Нажимай на слова по порядку, чтобы получилось предложение.':kind==='type'?'Напиши английскую фразу и нажми проверить.':'Выбери правильный перевод.';
 html+='<button type="button" class="child-voice" id="hear-help">🔊 Послушать задание</button>';
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
 view.querySelector('#hear-help')?.addEventListener('click',()=>speakHint(directions));
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
 view.innerHTML=topHero(result,passedToday?child('name')+', получилось!':child('name')+', каждая попытка важна!',`Верных ответов: ${correct} из ${s.items.length}.`)+
 `<section class="feature"><h2>${passedToday?'Звёздный результат '+esc(child('genitive'))+'!':'Можно попробовать ещё раз'}</h2><p>${s.kind==='course'?(passedToday?'Следующий урок открыт!':'Для открытия следующего урока нужно минимум 7 ответов из 10.'): 'Ты можешь повторить тему в любое время.'}</p><p>🎤 ${esc(s.module.mission)}</p><p class="muted">🌿 После одного занятия полезно сделать перерыв, потянуться и посмотреть вдаль.</p><p class="muted">Творческую устную и письменную работу программа не оценивает. Попроси взрослого послушать твой рассказ.</p><button class="primary" id="back-home">${s.kind==='course'?'Вернуться к курсу':'К тренировкам'}</button>${s.kind==='course'&&!passedToday?'<button class="secondary full" id="retry-day">↺ Повторить урок</button>':''}</section>`;
 view.querySelector('#back-home').addEventListener('click',()=>s.kind==='course'?renderHome():s.kind==='review'?renderReview():renderPlay());
 if(passedToday)sparkle();
 view.querySelector('#retry-day')?.addEventListener('click',()=>start(s.lesson.index));
}
document.getElementById('theme-open')?.addEventListener('click',renderThemeChooser);
document.getElementById('family-open')?.addEventListener('click',renderParentGate);
document.getElementById('theme-overlay')?.addEventListener('click',e=>{if(e.target?.id==='theme-overlay')closeThemeChooser();});
document.addEventListener?.('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('theme-overlay')?.hidden)closeThemeChooser();});
applyTheme();
document.querySelectorAll('.bottom button').forEach(b=>b.addEventListener('click',()=>{
 if(b.dataset.tab==='home')renderHome();
 if(b.dataset.tab==='play')renderPlay();
 if(b.dataset.tab==='stories')launchExtra('openStories');
 if(b.dataset.tab==='rewards')renderRewards();
}));
renderHome();
})();
