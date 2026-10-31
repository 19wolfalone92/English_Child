/* EVA OFFLINE STUDIO • original children's picture-listening adventures.
 * No microphone, generated audio, ads or networking. English speech uses Android system TTS.
 */
(function soundGarden(){
'use strict';
const WORLDS=[
 {id:'pets',title:'Лес зверят',icon:'🦊',hint:'Познакомимся с животными',words:[
 ['cat','кот','🐈'],['dog','собака','🐕'],['fox','лиса','🦊'],['bear','медведь','🐻'],['rabbit','кролик','🐇'],['frog','лягушка','🐸']]},
 {id:'food',title:'Сладкое кафе',icon:'🍓',hint:'Что сегодня на обед?',words:[
 ['apple','яблоко','🍎'],['banana','банан','🍌'],['carrot','морковь','🥕'],['cake','торт','🎂'],['bread','хлеб','🍞'],['milk','молоко','🥛']]},
 {id:'nature',title:'Солнечная полянка',icon:'🌞',hint:'Слушаем слова о природе',words:[
 ['sun','солнце','☀️'],['moon','луна','🌙'],['star','звезда','⭐'],['cloud','облако','☁️'],['tree','дерево','🌳'],['flower','цветок','🌸']]},
 {id:'toys',title:'Домик игрушек',icon:'🧸',hint:'Найдём любимые игрушки',words:[
 ['ball','мяч','⚽'],['doll','кукла','🪆'],['kite','воздушный змей','🪁'],['teddy bear','плюшевый мишка','🧸'],['puzzle','пазл','🧩'],['balloon','воздушный шарик','🎈']]},
 {id:'clothes',title:'Шкаф феи',icon:'👑',hint:'Наряжаем героев по-английски',words:[
 ['hat','шляпа','👒'],['dress','платье','👗'],['shoe','туфля','👟'],['coat','пальто','🧥'],['sock','носок','🧦'],['scarf','шарф','🧣']]},
 {id:'travel',title:'Весёлое путешествие',icon:'🚂',hint:'На чём поедем?',words:[
 ['car','машина','🚗'],['bus','автобус','🚌'],['train','поезд','🚂'],['plane','самолёт','✈️'],['bike','велосипед','🚲'],['boat','лодка','⛵']]},
 {id:'home',title:'Милый дом',icon:'🏡',hint:'Слова, которые живут дома',words:[
 ['house','дом','🏠'],['bed','кровать','🛏️'],['chair','стул','🪑'],['door','дверь','🚪'],['clock','часы','🕒'],['lamp','лампа','💡']]},
 {id:'music',title:'Оркестр Вулфи',icon:'🎵',hint:'Музыкальная загадка',words:[
 ['guitar','гитара','🎸'],['drum','барабан','🥁'],['piano','пианино','🎹'],['bell','колокольчик','🔔'],['microphone','микрофон','🎤'],['violin','скрипка','🎻']]}
];
const total=WORLDS.length;
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{let r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
let ctx=null,round=null;
function head(symbol,title,subtitle){
 return `<section class="hero sound-hero"><div class="hero-emoji" aria-hidden="true">${symbol}</div><div class="eyebrow">🎧 СЛУШАЕМ И ИГРАЕМ</div><h1>${escapeHTML(title)}</h1><p>${escapeHTML(subtitle)}</p></section>`;
}
function bind(selector,fn){
 ctx.view.querySelector(selector)?.addEventListener('click',fn);
}
function getBest(id){return Number(ctx.state.soundScores?.[id]?.best||0);}
function open(api){
 ctx=api;round=null;
 const completed=WORLDS.filter(w=>getBest(w.id)>=w.words.length).length;
 ctx.view.innerHTML=head('🎧','Звуковой лес Евы','Слушай слова, находи картинки и получай волшебные цветочки!')+
 `<section class="feature"><div class="section-lead"><h2>🌷 Мои открытия</h2><span class="badge">${completed}/${total} полянок</span></div>
 <p>В каждой полянке шесть английских слов. Не нужно спешить: можно слушать сколько угодно раз!</p>
 <div class="sound-worlds">${WORLDS.map((w,i)=>`<button type="button" class="sound-world" data-sound-world="${w.id}"><span class="sound-world-icon">${w.icon}</span><b>${escapeHTML(w.title)}</b><small>${escapeHTML(w.hint)}</small><span class="sound-progress">${getBest(w.id)>=w.words.length?'🌟 Собрано!':getBest(w.id)?'⭐ '+getBest(w.id)+'/6':'✨ Начать'}</span></button>`).join('')}</div><button id="sound-exit" class="secondary full">← К играм</button></section>`;
 ctx.view.querySelectorAll('[data-sound-world]').forEach(b=>b.addEventListener('click',()=>begin(b.dataset.soundWorld)));
 bind('#sound-exit',ctx.onExit);
}
function begin(id){
 const world=WORLDS.find(w=>w.id===id);if(!world)return;
 round={world,queue:shuffle(world.words),index:0,correct:0,answered:false};
 question();
}
function question(){
 const s=round;if(!s)return;
 if(s.index>=s.queue.length){finish();return;}
 const target=s.queue[s.index],others=shuffle(s.world.words.filter(x=>x!==target)).slice(0,s.index===0?1:2);
 const picks=shuffle([target,...others]);
 s.answered=false;
 const audio=ctx.speakAvailable();
 ctx.view.innerHTML=`<div class="task-head"><button type="button" id="sound-back" class="secondary small">← Полянки</button><span>${s.index+1}/${s.queue.length}</span><span class="badge">${s.world.icon} ${escapeHTML(s.world.title)}</span></div>
 <div class="bar"><i style="width:${Math.round(s.index/s.queue.length*100)}%"></i></div>
 <section class="feature sound-question"><div class="sound-portrait">🐺✨</div>
 <h1>${audio?'Послушай и найди!':'Посмотри и найди!'}</h1>
 ${audio?`<button type="button" class="sound-mega" id="sound-play" aria-label="Повторить английское слово"><span aria-hidden="true">🔊</span><small>Нажми, чтобы услышать</small></button>`:
 `<div class="sound-fallback"><b lang="en">${escapeHTML(target[0])}</b><small>Английский голос пока недоступен — можно играть по написанию.</small></div>`}
 <div class="sound-pictures">${picks.map(([en,ru,emoji])=>`<button type="button" class="sound-pick" data-sound-answer="${escapeHTML(en)}" aria-label="${escapeHTML(ru)}"><span aria-hidden="true">${emoji}</span><b>${escapeHTML(ru)}</b></button>`).join('')}</div>
 <div id="sound-feedback" aria-live="polite" role="status"></div></section>`;
 bind('#sound-back',()=>open(ctx));
 bind('#sound-play',()=>ctx.speak(target[0]));
 ctx.view.querySelectorAll('[data-sound-answer]').forEach(b=>b.addEventListener('click',()=>choose(b,target)));
}
function choose(button,target){
 const s=round;if(!s||s.answered)return;
 s.answered=true;
 const good=button.dataset.soundAnswer===target[0];
 if(good)s.correct++;
 ctx.view.querySelectorAll('[data-sound-answer]').forEach(b=>{
  b.disabled=true;
  if(b.dataset.soundAnswer===target[0])b.classList.add('good');
  else if(b===button)b.classList.add('bad');
 });
 ctx.view.querySelector('#sound-feedback').innerHTML=`<div class="feedback ${good?'':'retry'}"><strong>${good?'🌟 Ура, Ева!':'🌱 Давай запомним!'}</strong>
 <p><b lang="en">${escapeHTML(target[0])}</b> — ${escapeHTML(target[1])}. ${good?'Ты нашла нужную картинку!':'Ничего страшного, слушай ещё раз!'}</p>
 <button type="button" class="secondary" id="sound-repeat">🔊 Послушать слово</button>
 <button type="button" class="primary" id="sound-next">${s.index===s.queue.length-1?'Посмотреть результат':'Дальше →'}</button></div>`;
 bind('#sound-repeat',()=>ctx.speak(target[0]));
 bind('#sound-next',()=>{s.index++;question();});
}
function finish(){
 const s=round;if(!s)return;
 const length=s.queue.length;
 ctx.state.soundScores??={};
 const before=getBest(s.world.id);
 ctx.state.soundScores[s.world.id]={best:Math.max(before,s.correct),attempts:(ctx.state.soundScores[s.world.id]?.attempts||0)+1};
 if(s.correct===length && before<length)ctx.state.xp=(ctx.state.xp||0)+12;
 ctx.save();round=null;
 ctx.view.innerHTML=head(s.world.icon,s.correct===length?'Полянка расцвела, Ева!':'Отличное приключение, Ева!',`Узнала ${s.correct} из ${length} слов.`)+
 `<section class="feature"><div class="sound-finish" aria-hidden="true">🌻🌷🦋🌸</div><h2>${s.correct===length?'🌟 Все картинки найдены!':'💖 Можно попробовать снова'}</h2>
 <p>Слушай слова и учись в своём темпе. Здесь нет таймера и штрафов.</p>
 <button type="button" class="primary" id="sound-again">↻ Ещё раз</button><button type="button" class="secondary full" id="sound-all">🗺️ Выбрать полянку</button></section>`;
 bind('#sound-again',()=>begin(s.world.id));bind('#sound-all',()=>open(ctx));
}
window.KIDS_SOUND_GARDEN=Object.freeze({open,worlds:WORLDS});
})();
