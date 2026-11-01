/* Eva's real entry course: 120 original beginner word-picture records in 20 short
   six-word micro-lessons. No reading, spelling or typing required. */
(function(){
'use strict';
const packs=[{"id":"seed-01","title":"Первые друзья","emoji":"🐾","words":[{"id":"seedword-01-1","en":"cat","ru":"кошка","icon":"🐱"},{"id":"seedword-01-2","en":"dog","ru":"собака","icon":"🐶"},{"id":"seedword-01-3","en":"sun","ru":"солнце","icon":"☀️"},{"id":"seedword-01-4","en":"apple","ru":"яблоко","icon":"🍎"},{"id":"seedword-01-5","en":"ball","ru":"мяч","icon":"🏐"},{"id":"seedword-01-6","en":"mom","ru":"мама","icon":"👩"}]},{"id":"seed-02","title":"Любимые цвета","emoji":"🎨","words":[{"id":"seedword-02-1","en":"red","ru":"красный","icon":"🔴"},{"id":"seedword-02-2","en":"blue","ru":"синий","icon":"🔵"},{"id":"seedword-02-3","en":"yellow","ru":"жёлтый","icon":"🟡"},{"id":"seedword-02-4","en":"green","ru":"зелёный","icon":"🟢"},{"id":"seedword-02-5","en":"pink","ru":"розовый","icon":"🩷"},{"id":"seedword-02-6","en":"purple","ru":"фиолетовый","icon":"🟣"}]},{"id":"seed-03","title":"Мир животных","emoji":"🦁","words":[{"id":"seedword-03-1","en":"lion","ru":"лев","icon":"🦁"},{"id":"seedword-03-2","en":"bear","ru":"медведь","icon":"🐻"},{"id":"seedword-03-3","en":"fox","ru":"лиса","icon":"🦊"},{"id":"seedword-03-4","en":"rabbit","ru":"кролик","icon":"🐰"},{"id":"seedword-03-5","en":"duck","ru":"утка","icon":"🦆"},{"id":"seedword-03-6","en":"fish","ru":"рыба","icon":"🐟"}]},{"id":"seed-04","title":"Вкусняшки","emoji":"🍓","words":[{"id":"seedword-04-1","en":"banana","ru":"банан","icon":"🍌"},{"id":"seedword-04-2","en":"strawberry","ru":"клубника","icon":"🍓"},{"id":"seedword-04-3","en":"milk","ru":"молоко","icon":"🥛"},{"id":"seedword-04-4","en":"bread","ru":"хлеб","icon":"🍞"},{"id":"seedword-04-5","en":"egg","ru":"яйцо","icon":"🥚"},{"id":"seedword-04-6","en":"cake","ru":"торт","icon":"🎂"}]},{"id":"seed-05","title":"Моя семья","emoji":"💗","words":[{"id":"seedword-05-1","en":"dad","ru":"папа","icon":"👨"},{"id":"seedword-05-2","en":"sister","ru":"сестра","icon":"👧"},{"id":"seedword-05-3","en":"brother","ru":"брат","icon":"👦"},{"id":"seedword-05-4","en":"baby","ru":"малыш","icon":"👶"},{"id":"seedword-05-5","en":"grandma","ru":"бабушка","icon":"👵"},{"id":"seedword-05-6","en":"grandpa","ru":"дедушка","icon":"👴"}]},{"id":"seed-06","title":"Мои игрушки","emoji":"🧸","words":[{"id":"seedword-06-1","en":"doll","ru":"кукла","icon":"🪆"},{"id":"seedword-06-2","en":"teddy bear","ru":"плюшевый мишка","icon":"🧸"},{"id":"seedword-06-3","en":"kite","ru":"воздушный змей","icon":"🪁"},{"id":"seedword-06-4","en":"balloon","ru":"воздушный шарик","icon":"🎈"},{"id":"seedword-06-5","en":"puzzle","ru":"пазл","icon":"🧩"},{"id":"seedword-06-6","en":"robot","ru":"робот","icon":"🤖"}]},{"id":"seed-07","title":"Волшебный лес","emoji":"🌲","words":[{"id":"seedword-07-1","en":"tree","ru":"дерево","icon":"🌳"},{"id":"seedword-07-2","en":"flower","ru":"цветок","icon":"🌸"},{"id":"seedword-07-3","en":"leaf","ru":"лист","icon":"🍃"},{"id":"seedword-07-4","en":"cloud","ru":"облако","icon":"☁️"},{"id":"seedword-07-5","en":"rain","ru":"дождь","icon":"🌧️"},{"id":"seedword-07-6","en":"rainbow","ru":"радуга","icon":"🌈"}]},{"id":"seed-08","title":"Моё тело","emoji":"🙌","words":[{"id":"seedword-08-1","en":"hand","ru":"рука","icon":"✋"},{"id":"seedword-08-2","en":"foot","ru":"ступня","icon":"🦶"},{"id":"seedword-08-3","en":"eye","ru":"глаз","icon":"👁️"},{"id":"seedword-08-4","en":"ear","ru":"ухо","icon":"👂"},{"id":"seedword-08-5","en":"nose","ru":"нос","icon":"👃"},{"id":"seedword-08-6","en":"mouth","ru":"рот","icon":"👄"}]},{"id":"seed-09","title":"Числа 1–6","emoji":"🔢","words":[{"id":"seedword-09-1","en":"one","ru":"один","icon":"1️⃣"},{"id":"seedword-09-2","en":"two","ru":"два","icon":"2️⃣"},{"id":"seedword-09-3","en":"three","ru":"три","icon":"3️⃣"},{"id":"seedword-09-4","en":"four","ru":"четыре","icon":"4️⃣"},{"id":"seedword-09-5","en":"five","ru":"пять","icon":"5️⃣"},{"id":"seedword-09-6","en":"six","ru":"шесть","icon":"6️⃣"}]},{"id":"seed-10","title":"Одежда","emoji":"👗","words":[{"id":"seedword-10-1","en":"dress","ru":"платье","icon":"👗"},{"id":"seedword-10-2","en":"hat","ru":"шляпа","icon":"👒"},{"id":"seedword-10-3","en":"coat","ru":"куртка","icon":"🧥"},{"id":"seedword-10-4","en":"shoe","ru":"туфля","icon":"👟"},{"id":"seedword-10-5","en":"sock","ru":"носок","icon":"🧦"},{"id":"seedword-10-6","en":"shirt","ru":"рубашка","icon":"👕"}]},{"id":"seed-11","title":"В моём доме","emoji":"🏠","words":[{"id":"seedword-11-1","en":"house","ru":"дом","icon":"🏠"},{"id":"seedword-11-2","en":"door","ru":"дверь","icon":"🚪"},{"id":"seedword-11-3","en":"window","ru":"окно","icon":"🪟"},{"id":"seedword-11-4","en":"bed","ru":"кровать","icon":"🛏️"},{"id":"seedword-11-5","en":"chair","ru":"стул","icon":"🪑"},{"id":"seedword-11-6","en":"lamp","ru":"лампа","icon":"💡"}]},{"id":"seed-12","title":"На прогулке","emoji":"🌼","words":[{"id":"seedword-12-1","en":"park","ru":"парк","icon":"🏞️"},{"id":"seedword-12-2","en":"bike","ru":"велосипед","icon":"🚲"},{"id":"seedword-12-3","en":"car","ru":"машина","icon":"🚗"},{"id":"seedword-12-4","en":"bus","ru":"автобус","icon":"🚌"},{"id":"seedword-12-5","en":"train","ru":"поезд","icon":"🚂"},{"id":"seedword-12-6","en":"plane","ru":"самолёт","icon":"✈️"}]},{"id":"seed-13","title":"Весёлые дела","emoji":"🎵","words":[{"id":"seedword-13-1","en":"run","ru":"бежать","icon":"🏃"},{"id":"seedword-13-2","en":"jump","ru":"прыгать","icon":"🤸"},{"id":"seedword-13-3","en":"sleep","ru":"спать","icon":"😴"},{"id":"seedword-13-4","en":"eat","ru":"есть","icon":"😋"},{"id":"seedword-13-5","en":"dance","ru":"танцевать","icon":"💃"},{"id":"seedword-13-6","en":"sing","ru":"петь","icon":"🎤"}]},{"id":"seed-14","title":"Чувства","emoji":"🥰","words":[{"id":"seedword-14-1","en":"happy","ru":"счастливый","icon":"😊"},{"id":"seedword-14-2","en":"sad","ru":"грустный","icon":"😢"},{"id":"seedword-14-3","en":"angry","ru":"сердитый","icon":"😠"},{"id":"seedword-14-4","en":"tired","ru":"уставший","icon":"🥱"},{"id":"seedword-14-5","en":"scared","ru":"испуганный","icon":"😨"},{"id":"seedword-14-6","en":"surprised","ru":"удивлённый","icon":"😲"}]},{"id":"seed-15","title":"Погода","emoji":"⛅","words":[{"id":"seedword-15-1","en":"hot","ru":"жарко","icon":"🥵"},{"id":"seedword-15-2","en":"cold","ru":"холодно","icon":"🥶"},{"id":"seedword-15-3","en":"snow","ru":"снег","icon":"❄️"},{"id":"seedword-15-4","en":"wind","ru":"ветер","icon":"💨"},{"id":"seedword-15-5","en":"storm","ru":"гроза","icon":"⛈️"},{"id":"seedword-15-6","en":"sky","ru":"небо","icon":"🌤️"}]},{"id":"seed-16","title":"На ферме","emoji":"🐮","words":[{"id":"seedword-16-1","en":"cow","ru":"корова","icon":"🐮"},{"id":"seedword-16-2","en":"pig","ru":"свинья","icon":"🐷"},{"id":"seedword-16-3","en":"horse","ru":"лошадь","icon":"🐴"},{"id":"seedword-16-4","en":"sheep","ru":"овца","icon":"🐑"},{"id":"seedword-16-5","en":"chicken","ru":"курица","icon":"🐔"},{"id":"seedword-16-6","en":"goat","ru":"коза","icon":"🐐"}]},{"id":"seed-17","title":"Моя школа","emoji":"📚","words":[{"id":"seedword-17-1","en":"book","ru":"книга","icon":"📘"},{"id":"seedword-17-2","en":"pen","ru":"ручка","icon":"🖊️"},{"id":"seedword-17-3","en":"pencil","ru":"карандаш","icon":"✏️"},{"id":"seedword-17-4","en":"bag","ru":"сумка","icon":"🎒"},{"id":"seedword-17-5","en":"clock","ru":"часы","icon":"🕒"},{"id":"seedword-17-6","en":"scissors","ru":"ножницы","icon":"✂️"}]},{"id":"seed-18","title":"Фрукты и овощи","emoji":"🥕","words":[{"id":"seedword-18-1","en":"orange","ru":"апельсин","icon":"🍊"},{"id":"seedword-18-2","en":"pear","ru":"груша","icon":"🍐"},{"id":"seedword-18-3","en":"grape","ru":"виноград","icon":"🍇"},{"id":"seedword-18-4","en":"lemon","ru":"лимон","icon":"🍋"},{"id":"seedword-18-5","en":"carrot","ru":"морковь","icon":"🥕"},{"id":"seedword-18-6","en":"tomato","ru":"помидор","icon":"🍅"}]},{"id":"seed-19","title":"Природа вокруг","emoji":"🌊","words":[{"id":"seedword-19-1","en":"sea","ru":"море","icon":"🌊"},{"id":"seedword-19-2","en":"river","ru":"река","icon":"🏞️"},{"id":"seedword-19-3","en":"mountain","ru":"гора","icon":"⛰️"},{"id":"seedword-19-4","en":"beach","ru":"пляж","icon":"🏖️"},{"id":"seedword-19-5","en":"star","ru":"звезда","icon":"⭐"},{"id":"seedword-19-6","en":"moon","ru":"луна","icon":"🌙"}]},{"id":"seed-20","title":"Наши маленькие праздники","emoji":"🎉","words":[{"id":"seedword-20-1","en":"gift","ru":"подарок","icon":"🎁"},{"id":"seedword-20-2","en":"birthday","ru":"день рождения","icon":"🎂"},{"id":"seedword-20-3","en":"party","ru":"праздник","icon":"🥳"},{"id":"seedword-20-4","en":"music","ru":"музыка","icon":"🎶"},{"id":"seedword-20-5","en":"friend","ru":"друг","icon":"🧒"},{"id":"seedword-20-6","en":"heart","ru":"сердце","icon":"❤️"}]}];
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const originalArt=new Set(['cat','dog','sun','apple','ball','mom']);
const picture=w=>originalArt.has(w.en)
 ? '<img src="first-'+w.en+'.svg" alt="" loading="lazy">'
 : '<span>'+w.icon+'</span>';
let ctx=null,lesson=null;
function getDone(){return ctx.state.seedDone||{};}
function completed(){return packs.filter(p=>!!getDone()[p.id]).length;}
function open(api){ctx=api;showMap();}
function showMap(){
 lesson=null;
 const d=completed(),next=Math.min(d,packs.length-1);
 const progress=Math.round(d/packs.length*100);
 ctx.view.innerHTML=`<section class="seed-header"><div class="seed-glitter">✨ ✦ 🌈</div><div class="seed-mascot"><img src="wolfie.svg" alt="Вулфи машет Еве"></div>
 <div class="seed-hero-copy"><div class="seed-chip">🌱 С НУЛЯ • МОИ ПЕРВЫЕ СЛОВА</div><h1>Ева, давай знакомиться с английским!</h1>
 <p>Учимся по три слова за раз, потом играем и повторяем. Ничего писать не нужно!</p></div></section>
 <section class="feature seed-panel"><div class="section-lead"><h2>🌸 Мои первые 120 слов</h2><span class="badge">${d}/20 полянок</span></div>
 <div class="seed-progress" role="progressbar" aria-label="Знакомство со словами" aria-valuenow="${d}" aria-valuemin="0" aria-valuemax="20"><i style="width:${progress}%"></i></div>
 <button type="button" class="primary seed-continue" id="seed-continue">${d===20?'🎉 Играть снова':'▶ '+(d===0?'Начать первое занятие':'Продолжить приключение')}</button>
 <p class="seed-calm">🐾 Урок занимает несколько минут. Ошибаться можно!</p></section>
 <section class="feature"><h2>🗺️ Наши волшебные островки</h2><div class="seed-worlds">
 ${packs.map((p,i)=>`<button type="button" class="seed-island ${getDone()[p.id]?'finished':i===next?'current':''}" data-seed-pick="${i}" ${i>next?'disabled':''}>
 <span class="seed-island-art" aria-hidden="true">${p.emoji}</span><b>${safe(p.title)}</b><small>${getDone()[p.id]?'🌟 Готово!':i<=next?'🎮 Играть':'🔒 Скоро'}</small></button>`).join('')}</div>
 <button type="button" class="secondary full" id="seed-exit">← Домик</button></section>`;
 ctx.view.querySelector('#seed-continue')?.addEventListener('click',()=>start(next));
 ctx.view.querySelector('#seed-exit')?.addEventListener('click',ctx.onExit);
 ctx.view.querySelectorAll('[data-seed-pick]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.seedPick))));
}
function start(index){
 const p=packs[index];if(!p||index>completed())return;
 lesson={pack:p,index,phase:'learn',chunk:0,step:0,correct:0,wrong:[],retry:0};
 showWords();
}
function showWords(){
 const p=lesson.pack;
 const portion=p.words.slice(lesson.chunk*3,lesson.chunk*3+3);
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="seed-back">← Назад</button><strong class="badge">🌷 Полянка ${lesson.index+1}/20</strong></div>
 <section class="seed-learn-top"><img src="wolfie.svg" alt="" aria-hidden="true"><div><h1>${safe(p.title)}</h1><p>🌷 По три слова за раз! Это группа ${lesson.chunk+1} из 2. Нажми на картинку и повторяй за Вулфи!</p></div></section>
 <section class="feature"><div class="seed-word-grid">${portion.map((w,i)=>`<button type="button" class="seed-word" data-seed-say="${lesson.chunk*3+i}" aria-label="Посмотреть и послушать слово ${safe(w.en)}">
 <span class="seed-word-illustration seed-art-${i%6}" aria-hidden="true">${picture(w)}</span>
 <span class="seed-word-name" lang="en">${safe(w.en)}</span><small>${safe(w.ru)}</small><span class="seed-speak">🔊</span></button>`).join('')}</div>
 <button class="primary seed-continue" id="seed-try">🎮 Поиграем с этими 3 словами!</button></section>`;
 ctx.view.querySelector('#seed-back')?.addEventListener('click',showMap);
 ctx.view.querySelectorAll('[data-seed-say]').forEach(b=>b.addEventListener('click',()=>ctx.speak(p.words[Number(b.dataset.seedSay)].en)));
 ctx.view.querySelector('#seed-try')?.addEventListener('click',()=>{lesson.phase='quiz';lesson.step=lesson.chunk*3;showQuestion();});
}
function showQuestion(){
 const s=lesson;if(!s)return;
 if(s.step===3&&s.chunk===0){s.chunk=1;s.phase='learn';showWords();return;}
 if(s.step>=6){
  if(s.wrong.length&&s.retry===0){s.retry=1;s.step=0;showRetry();return;}
  finish();return;
 }
 s.answered=false;
 const target=s.pack.words[s.step];
 const familiar=s.pack.words.slice(0,s.chunk===0?3:6);
 const choices=familiar.filter(w=>w!==target).sort(()=>Math.random()-.5).slice(0,s.step<2?1:2);
 const options=[target,...choices].sort(()=>Math.random()-.5);
 const audio=ctx.speakAvailable();
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="seed-back">← Слова</button><span class="badge">${s.step+1}/6</span><span>⭐ ${s.correct}</span></div>
 <div class="bar"><i style="width:${Math.round(s.step/6*100)}%"></i></div>
 <section class="feature seed-question"><div class="seed-guide"><img src="wolfie.svg" alt="" aria-hidden="true"><span>🪄 Вулфи спрашивает!</span></div>
 <h1>${audio?'Послушай и найди!':'Посмотри и найди!'}</h1>
 ${audio?`<button type="button" id="seed-listen" class="seed-audio" aria-label="Послушать английское слово">🔊 <span>Слушать ещё раз</span></button>`:
 `<div class="seed-audio fallback" lang="en">${safe(target.en)} <small>🔇 Без голоса — читай с родителем</small></div>`}
 <div class="seed-choices">${options.map(w=>`<button type="button" class="seed-choice" data-seed-answer="${safe(w.id)}" aria-label="${safe(w.ru)}"><span class="seed-choice-image" aria-hidden="true">${picture(w)}</span><b>${safe(w.ru)}</b></button>`).join('')}</div>
 <div id="seed-feedback" aria-live="polite" role="status"></div></section>`;
 ctx.view.querySelector('#seed-back')?.addEventListener('click',showWords);
 ctx.view.querySelector('#seed-listen')?.addEventListener('click',()=>ctx.speak(target.en));
 ctx.view.querySelectorAll('[data-seed-answer]').forEach(b=>b.addEventListener('click',()=>answer(b,target)));
}
function answer(button,target){
 const s=lesson;if(!s||s.phase!=='quiz'||s.answered)return;s.answered=true;
 const correct=button.dataset.seedAnswer===target.id;if(correct)s.correct++;
 else s.wrong.push(target);
 const old=ctx.state.seedMemory?.[target.id]||{stage:0,seen:0,correct:0};
 const stage=correct?Math.min((old.stage||0)+1,5):0;
 const wait=[0,1,3,7,14,30];
 ctx.state.seedMemory??={};
 ctx.state.seedMemory[target.id]={stage,seen:(old.seen||0)+1,correct:(old.correct||0)+Number(correct),due:Date.now()+(correct?wait[stage]*86400000:0)};
 ctx.save();
 ctx.view.querySelectorAll('[data-seed-answer]').forEach(b=>{b.disabled=true;if(b.dataset.seedAnswer===target.id)b.classList.add('good');else if(b===button)b.classList.add('bad');});
 ctx.view.querySelector('#seed-feedback').innerHTML=`<div class="feedback ${correct?'':'retry'}"><strong>${correct?'✨ Молодец, Ева!':'💗 Вместе научимся!'}</strong>
 <p><b lang="en">${safe(target.en)}</b> — ${safe(target.ru)}</p>
 <button type="button" class="primary" id="seed-next">${s.step===5?'🏅 Мой результат':'Дальше →'}</button></div>`;
 ctx.view.querySelector('#seed-next')?.addEventListener('click',()=>{s.answered=false;s.step++;showQuestion();});
}
function showRetry(){
 const s=lesson;if(!s)return;
 s.phase='revision';
 ctx.view.innerHTML=`<section class="seed-celebrate"><div class="alpha-celebrate">💖 🌼 🧸</div>
  <h1>Ева, повторим трудные слова!</h1><p>Ошибки помогают учиться. Посмотри на картинки и повтори слова ещё раз. Так они лучше запоминаются!</p>
  <div class="seed-word-grid">${s.wrong.map(w=>`<button class="seed-word" data-retry-word="${safe(w.id)}"><span class="seed-word-illustration">${picture(w)}</span>
  <b lang="en">${safe(w.en)}</b><small>${safe(w.ru)}</small><span class="seed-speak">🔊</span></button>`).join('')}</div>
  <button type="button" id="seed-retry-done" class="primary">🌷 Я повторила!</button></section>`;
 ctx.view.querySelectorAll('[data-retry-word]').forEach(b=>b.addEventListener('click',()=>{
  const w=s.wrong.find(x=>x.id===b.dataset.retryWord);if(w)ctx.speak(w.en);
 }));
 ctx.view.querySelector('#seed-retry-done')?.addEventListener('click',()=>{s.retryIndex=0;retryQuestion();});
}
function retryQuestion(){
 const s=lesson;if(!s||s.phase!=='revision')return;
 if(s.retryIndex>=s.wrong.length){finish();return;}
 const w=s.wrong[s.retryIndex];
 const others=s.pack.words.filter(x=>x.id!==w.id);
 const other=others[Math.floor(Math.random()*others.length)];
 const options=Math.random()<.5?[w,other]:[other,w];
 const sound=ctx.speakAvailable();
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="seed-back">← Слова</button>
  <span class="badge">🌱 Повтор ${s.retryIndex+1}/${s.wrong.length}</span></div>
  <section class="feature seed-question"><div class="seed-guide"><img src="wolfie.svg" alt=""><span>💗 Я помогу, Ева!</span></div>
  <h1>Давай вспомним!</h1>
  ${sound?`<button class="seed-audio" id="seed-retry-hear">🔊 <span>Послушать слово</span></button>`:
   `<div class="seed-audio fallback" lang="en">${safe(w.en)}<small>Посмотри слово</small></div>`}
  <div class="seed-choices">${options.map(x=>`<button class="seed-choice" data-seed-retry-choice="${x.id}">
   <span class="seed-choice-image">${picture(x)}</span><b>${safe(x.ru)}</b></button>`).join('')}</div>
  <div id="seed-retry-feedback" role="status" aria-live="polite"></div></section>`;
 ctx.view.querySelector('#seed-back')?.addEventListener('click',showRetry);
 ctx.view.querySelector('#seed-retry-hear')?.addEventListener('click',()=>ctx.speak(w.en));
 ctx.view.querySelectorAll('[data-seed-retry-choice]').forEach(button=>button.addEventListener('click',()=>{
  if(s.answered)return;s.answered=true;
  const good=button.dataset.seedRetryChoice===w.id;
  const old=ctx.state.seedMemory?.[w.id]||{seen:0,correct:0,stage:0};
  const stage=good?Math.min((old.stage||0)+1,5):0;
  const wait=[0,1,3,7,14,30];
  ctx.state.seedMemory[w.id]={stage,seen:(old.seen||0)+1,
   correct:(old.correct||0)+Number(good),due:Date.now()+(good?wait[stage]*86400000:0)};
  ctx.save();
  ctx.view.querySelectorAll('[data-seed-retry-choice]').forEach(b=>{
   b.disabled=true;if(b.dataset.seedRetryChoice===w.id)b.classList.add('good');
   else if(b===button)b.classList.add('bad');
  });
  ctx.view.querySelector('#seed-retry-feedback').innerHTML=`<div class="feedback ${good?'':'retry'}">
   <strong>${good?'🌸 Вот теперь ты помнишь!':'💞 Не страшно, Ева!'}</strong>
   <p><b lang="en">${safe(w.en)}</b> — ${safe(w.ru)}</p>
   <button class="primary" id="seed-retry-next">Дальше →</button></div>`;
  ctx.view.querySelector('#seed-retry-next')?.addEventListener('click',()=>{s.answered=false;s.retryIndex++;retryQuestion();});
 }));
}
function finish(){
 const s=lesson; if(!s)return;lesson=null;
 ctx.state.seedDone??={};
 const mastered=s.correct>=4;
 const first=!ctx.state.seedDone[s.pack.id];
 if(mastered)ctx.state.seedDone[s.pack.id]=true;
 if(mastered&&first)ctx.state.xp=(ctx.state.xp||0)+12;
 ctx.save();
 ctx.view.innerHTML=`<section class="seed-celebrate"><img src="wolfie.svg" alt="Вулфи поздравляет Еву">
 <h1>${mastered?'Ева, ты супер! 🌟':'Ева, давай ещё немного! 💜'}</h1><p>Ты познакомилась с шестью новыми словами!</p>
 <div class="seed-score">${'⭐'.repeat(Math.max(1,Math.ceil(s.correct/2)))}</div>
 <p>Правильных ответов: ${s.correct}/6. Главное — учиться с удовольствием!</p>
 <button class="primary seed-continue" id="seed-next-lesson">${!mastered?'💖 Попробовать снова':completed()<20?'🌈 Следующая полянка':'🎉 Посмотреть мир Евы'}</button>
 <button class="secondary full" id="seed-home">🏠 Домик</button></section>`;
 ctx.view.querySelector('#seed-next-lesson')?.addEventListener('click',()=>{if(!mastered)start(s.index);else{const n=completed();if(n<20)start(n);else showMap();}});
 ctx.view.querySelector('#seed-home')?.addEventListener('click',ctx.onExit);
}
window.KIDS_FIRST_STEPS=Object.freeze({packs,open,completed:()=>ctx?completed():0});
})();
