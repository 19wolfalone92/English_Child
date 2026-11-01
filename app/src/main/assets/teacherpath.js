/* Original teacher-authored, age-aware curriculum for Eva English Kids.
 * Teaching targets are estimated milestones, not CEFR certificates or elapsed-time guarantees.
 * 20 real beginner themes are connected to actual first-word games in this APK. */
(function teacherPath(){
'use strict';
const scripts=[["Друзья-зверята","Look! A cat. Hello, cat!","Покажи кошечку и собачку. Попроси Еву повторить «cat» и «dog».","Положи две игрушки и попроси: «Show me a cat!»"],["Цветная радуга","It's red! It's blue!","Покажи два цветных карандаша и произнеси их цвета.","Найди дома по одному красному и синему предмету."],["Звери в лесу","I see a lion!","Играй с картинками льва и лисы. Пусть Ева покажет зверя.","Вместе найдите на картинках трёх знакомых животных."],["Вкусное кафе","I like bananas!","Назови знакомые продукты и предложи указать на них.","Устройте маленькое кафе из игрушечной посуды."],["Моя семья","This is my family.","Назови членов семьи, показывая их на фото без отправки данных в приложение.","Поиграйте в «Where is Dad?», указывая на картинки."],["Магазин игрушек","I have a doll!","Предложи выбрать и назвать игрушки вслух.","Устройте магазин: «A doll, please!»"],["Волшебный лес","Look! A tree and a flower!","Покажи дерево и цветок — сначала по-русски, затем на английском.","На прогулке найдите дерево и цветок."],["Моё тело","Touch your nose!","Назови nose, hand, foot и покажи жестами.","Сыграйте в «Simon says: touch your nose!» без соревнования."],["Считаем вместе","One, two, three!","Пересчитайте три игрушки на столе.","Считайте кубики сначала вместе, потом по очереди."],["Одеваемся","I have a hat!","Покажи шапку и одежду. Пусть ребёнок выберет нужную вещь.","Одень мишку и назови два предмета одежды."],["Мой дом","This is a house.","Покажи дверь, окно и стул.","Найди дома три предмета, которые Ева знает по-английски."],["Путешествие","Let's go by bus!","Вспомните машинку, автобус и поезд.","Постройте маршрут игрушечной машинке и назовите транспорт."],["Двигаемся","Jump! Run! Dance!","Покажи действия и попроси повторить их жестами.","Сыграйте в «Show me jump!» с безопасными движениями."],["Как я себя чувствую","I am happy!","Изобразите улыбку и грусть, назови состояния.","Нарисуйте два смайлика и назовите эмоции."],["Какая погода","It's cold!","Посмотрите в окно и назовите погоду.","Подберите к погоде одежду для куклы."],["На ферме","Look! A cow!","Покажи корову и лошадь. Произнесите названия вместе.","Найдите животных на рисунке и «покормите» их."],["Мои школьные вещи","I have a pencil!","Найди карандаш и книгу, назови предметы.","Соберите игрушечную сумку в школу."],["Фрукты и овощи","I like carrots!","Покажи два фрукта или овоща, пусть Ева выберет.","Устройте игру в магазин фруктов."],["Море и природа","Look at the moon!","Покажи море, звезду и луну на картинке.","Нарисуйте маленькое небо со звездой и луной."],["Маленький праздник","Happy birthday!","Назови подарок, друзей и праздник.","Поздравьте игрушку с днём рождения и назовите подарки."]];
const milestones=[{"id":"first","label":"Старт","period":"Первые 2–4 недели","icon":"🌱","title":"Без страха перед английским","goal":"Привыкнуть слушать и повторять: приветствие, первые знакомые предметы, игра с двумя картинками.","lesson":"3 слова за раз. 5–8 минут. Большая картинка → слово → выбор → движение."},{"id":"prea","label":"Pre-A1","period":"Примерно 3–9 месяцев","icon":"🐾","title":"Знакомые слова, буквы и первые фразы","goal":"120 повседневных слов по темам, 26 букв, короткие реплики и команды, повторение в новых ситуациях.","lesson":"Простые действия: show me, point to, it's a… Слушать, показывать, играть, повторять."},{"id":"a1","label":"A1","period":"Следующий учебный этап","icon":"🌷","title":"Простое общение","goal":"Говорить о себе и семье, понимать короткие вопросы и инструкции, читать совсем небольшие истории.","lesson":"I like…, I have…, I can…, Where is…? Диалоги и простые рассказы."},{"id":"a2","label":"A2","period":"При готовности ребёнка","icon":"📖","title":"Предложения и рассказы","goal":"Понимать знакомые истории, говорить о ежедневных делах, составлять простые предложения.","lesson":"Больше самостоятельной речи и постепенное чтение с обратной связью."},{"id":"b1","label":"B1","period":"В более старшем возрасте","icon":"🧩","title":"Мнение и описание событий","goal":"Обсуждать опыт и планы, связывать предложения, понимать более длинные тексты.","lesson":"Связная речь, чтение, письменно формулировать мысли. Требуется педагогическая оценка."},{"id":"b2","label":"B2","period":"Долгосрочная цель","icon":"🚀","title":"Уверенное владение языком","goal":"Сложные тексты, аргументация, самостоятельные письменные работы и естественные диалоги.","lesson":"Системные занятия, настоящий разговор, исправление ошибок учителем и независимый экзамен."}];
const targetIndexes=[0,0,0,0,0,0,0,4,0,1,0,3,1,0,1,0,2,4,5,0];
const phrases=['Look! A cat!','It is red!','I see a lion!','I like bananas!','This is my dad!',
 'I have a doll!','Look! A tree!','Touch your nose!','One, two, three!','I have a hat!',
 'This is a house!','Let’s go by bus!','Jump!','I am happy!','It is cold!',
 'Look! A cow!','I have a pencil!','I like carrots!','Look at the moon!','A gift! Happy birthday!'];
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const packs=window.KIDS_FIRST_STEPS?.packs||[];
let ctx=null;
function doneCount(){return packs.filter(p=>ctx.state.seedDone?.[p.id]).length;}
function dueCount(){return window.KIDS_WORD_MEMORY?.due?.(ctx.state)?.length||0;}
function letters(){return Object.keys(ctx.state.alphaDone||{}).length;}
const next=()=>Math.min(doneCount(),packs.length-1);
const weekPlan=[
 {day:'День 1',name:'Новые слова',icon:'🧸',desc:'3 картинки, 3 повторения вслух, мини-игра.',action:'words'},
 {day:'День 2',name:'Продолжение',icon:'🍎',desc:'Ещё 3 слова из той же темы, показать игрушками дома.',action:'words'},
 {day:'День 3',name:'Буквы и слух',icon:'🔤',desc:'2–4 буквы, большая и маленькая, послушать слова.',action:'alphabet'},
 {day:'День 4',name:'Вспоминаем и играем',icon:'🧠',desc:'Повторить старые слова и короткую реплику с взрослым.',action:'memory'}
];
function open(api){ctx=api;render();}
function action(id){
 if(id==='words')ctx.onWords();
 else if(id==='alphabet')ctx.onABC();
 else if(id==='memory')ctx.onMemory();
 else if(id==='say')coach();
}
function render(){
 const d=doneCount(),a=letters(),due=dueCount(),progress=Math.round(d/packs.length*100);
 const idx=next(),p=packs[idx],script=scripts[idx];
 const active=due?'memory':d===0?'words':a<Math.min(7,Math.ceil(d/3))?'alphabet':'words';
 const actionText={words:'🐾 Учить слова',alphabet:'🔤 Играть с буквами',memory:'🧠 Вспомнить слова'}[active];
 ctx.view.innerHTML=`<section class="teacher-hero"><div class="teacher-heart" aria-hidden="true">👩‍🏫🐺🌈</div>
 <div class="seed-chip">НАСТОЯЩИЙ МАРШРУТ ДЛЯ ЕВЫ · 6 ЛЕТ</div>
 <h1>Моя дорожка английского</h1><p>Начинаем с простых слов и игр. Движемся постепенно, без спешки и экзаменов.</p></section>
 <section class="feature teacher-next"><div class="section-lead"><h2>🌷 Сейчас учим</h2><span class="badge">${d}/20 тем</span></div>
  <div class="seed-progress" role="progressbar" aria-label="Начальные темы" aria-valuenow="${d}" aria-valuemin="0" aria-valuemax="20"><i style="width:${progress}%"></i></div>
  <div class="teacher-topic"><span class="teacher-topic-icon" aria-hidden="true">${p.emoji}</span><div><strong>${esc(p.title)}</strong>
  <small>${d===20?'Все начальные темы пройдены — можно повторять!':'Следующая из 20 тем. 6 знакомых предметов.'}</small></div></div>
  <div class="teacher-metrics"><span>🐾 ${d*6}/120 слов из пройденных тем</span><span>🔤 ${a}/7 групп букв</span><span>🧠 ${due} слов ждут повторения</span></div>
  <button class="primary seed-continue" id="teacher-go">${actionText}</button>
  <p class="seed-calm">Лучше немного каждый день, чем много и редко.</p></section>
 <section class="feature"><h2>🗓️ Пример недели — 4 короткие встречи</h2>
  <p>Одна встреча — примерно 5–10 минут. Можно делать перерывы и менять дни. Не нужна обязательная ежедневная серия.</p>
  <div class="teacher-week">${weekPlan.map(x=>`<button type="button" class="teacher-day" data-teacher-action="${x.action}">
  <span class="teacher-day-icon">${x.icon}</span><span><b>${x.day} · ${x.name}</b><small>${x.desc}</small></span><span class="teacher-arrow">›</span></button>`).join('')}</div></section>
 <section class="feature teacher-family"><div class="section-lead"><h2>👨‍👩‍👧 С взрослым — без экрана</h2><span class="badge">2 минуты</span></div>
 <p>Короткие фразы и настоящие игрушки помогают перенести слова из приложения в жизнь.</p>
 <blockquote lang="en">${esc(script[1])}</blockquote><p>${esc(script[2])}</p>
 <button class="secondary full" type="button" id="teacher-say">🗣️ Подсказки для родителей</button></section>
 <section class="feature"><h2>🚀 Большой путь — от нуля до B2</h2>
 <p>Сложность повышается вместе с возрастом и готовностью Евы. Возрастные сроки индивидуальны. Уровень подтверждают навыки, а не число нажатий.</p>
 <div class="teacher-milestones">${milestones.map((m,i)=>`<details class="teacher-milestone" ${i===0?'open':''}>
 <summary><span class="teacher-milestone-icon">${m.icon}</span><span><b>${m.label} — ${m.title}</b><small>${m.period}</small></span><span>⌄</span></summary>
 <p>${m.goal}</p><small>${m.lesson}</small></details>`).join('')}</div>
 <p class="muted">Сейчас интерактивно готовы первые 120 слов, игры с алфавитом и ранние упражнения; другие уровни пока не являются полноценной сертифицированной программой.</p></section>
 <button type="button" class="secondary full" id="teacher-exit">← Домик Евы</button>`;
 ctx.view.querySelector('#teacher-go')?.addEventListener('click',()=>action(active));
 ctx.view.querySelector('#teacher-say')?.addEventListener('click',coach);
 ctx.view.querySelector('#teacher-exit')?.addEventListener('click',ctx.onExit);
 ctx.view.querySelectorAll('[data-teacher-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.teacherAction)));
}
function coach(){
 const i=next(),s=scripts[i],p=packs[i];
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="teacher-back">← Маршрут</button>
 <span class="badge">👨‍👩‍👧 Взрослым</span></div>
 <section class="teacher-hero"><div class="teacher-heart" aria-hidden="true">👨‍👩‍👧 🌸</div><h1>Как помочь Еве говорить?</h1>
 <p>Без тестов, не поправляя каждую ошибку. Слушаем, показываем, хвалим за попытки!</p></section>
 <section class="feature teacher-coach"><h2>${esc(s[0])}</h2><p>🎯 Сегодняшняя тема: ${esc(p.title)}</p>
 <div class="teacher-phrase" lang="en">${esc(s[1])}</div>
 <button class="secondary full" id="teacher-hear" ${ctx.speakAvailable()?'':'disabled'}>🔊 Послушать английскую фразу</button>
 <h3>Шаг 1 · Показать</h3><p>${esc(s[2])}</p>
 <h3>Шаг 2 · Сыграть</h3><p>${esc(s[3])}</p>
 <h3>Шаг 3 · Послушать и понять</h3>
 <p>Поиграйте: Вулфи произнесёт короткую фразу, а Ева выберет правильную картинку. Это слушание, а не проверка произношения.</p>
 <button class="primary seed-continue" id="teacher-phrase-game">🎧 Поймай слово в предложении</button>
 <h3>Шаг 4 · Похвалить</h3><p>Попроси ребёнка показать или сказать одно знакомое слово. Если пока молчит — нормально: назови слово сама и покажи пример.</p>
 <p class="muted">Пока в приложении нет распознавания речи, произношение не оценивается автоматически.</p>
 <button class="primary" id="teacher-learn">🌈 Посмотреть слова Евы</button></section>`;
 ctx.view.querySelector('#teacher-back')?.addEventListener('click',render);
 ctx.view.querySelector('#teacher-hear')?.addEventListener('click',()=>ctx.speak(s[1]));
 ctx.view.querySelector('#teacher-phrase-game')?.addEventListener('click',()=>playPhrase(i));
 ctx.view.querySelector('#teacher-learn')?.addEventListener('click',ctx.onWords);
}
function playPhrase(i){
 const p=packs[i],w=p.words[targetIndexes[i]],text=phrases[i];
 // A distractor MUST NOT be another word contained in the spoken phrase.
 const spokenWords=new Set(text.toLowerCase().match(/[a-z]+/g)||[]);
 const second=p.words.find(x=>x.id!==w.id&&!x.en.split(' ').some(term=>spokenWords.has(term)));

 const options=i%2===0?[w,second]:[second,w];
 if(!ctx||!w||!second)return;
 const sound=ctx.speakAvailable();
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="teacher-phrase-back">← Подсказки</button>
  <span class="badge">🗣️ Слушай и понимай</span></div>
  <section class="feature seed-question"><div class="alpha-guide" aria-hidden="true">🐺 💬</div>
  <h1>${sound?'Что сказал Вулфи?':'Прочитай с взрослым!'}</h1>
  ${sound?`<button class="seed-audio" id="teacher-phrase-hear">🔊 <span>Слушать фразу</span></button>`:
   `<div class="seed-audio fallback" lang="en">${esc(text)}<small>Скажи вместе с родителем</small></div>`}
  <p>Найди нужную картинку</p>
  <div class="seed-choices">${options.map(x=>`<button type="button" class="seed-choice" data-teacher-phrase-answer="${x.id}">
   <span class="seed-choice-image" aria-hidden="true">${x.icon}</span><b>${esc(x.ru)}</b></button>`).join('')}</div>
  <div id="teacher-phrase-feedback" aria-live="polite" role="status"></div></section>`;
 ctx.view.querySelector('#teacher-phrase-back')?.addEventListener('click',coach);
 ctx.view.querySelector('#teacher-phrase-hear')?.addEventListener('click',()=>ctx.speak(text));
 let answered=false;
 ctx.view.querySelectorAll('[data-teacher-phrase-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(answered)return;answered=true;
  const ok=b.dataset.teacherPhraseAnswer===w.id;
  ctx.view.querySelectorAll('[data-teacher-phrase-answer]').forEach(x=>{
   x.disabled=true;if(x.dataset.teacherPhraseAnswer===w.id)x.classList.add('good');else if(x===b)x.classList.add('bad');
  });
  if(ok){ctx.state.phraseDone??={};const key='phrase-'+i;
   if(!ctx.state.phraseDone[key]){ctx.state.phraseDone[key]=true;ctx.state.xp=(ctx.state.xp||0)+3;}
   ctx.save();}
  ctx.view.querySelector('#teacher-phrase-feedback').innerHTML=`<div class="feedback ${ok?'':'retry'}">
   <strong>${ok?'✨ Ты поняла, Ева!':'🌸 Послушаем вместе!'}</strong>
   <p><b lang="en">${esc(text)}</b> — ${esc(w.ru)}.</p>
   <button class="primary" type="button" id="teacher-phrase-next">${ok?'🎉 К моему маршруту':'💗 Попробовать ещё'}</button></div>`;
  ctx.view.querySelector('#teacher-phrase-next')?.addEventListener('click',()=>ok?render():playPhrase(i));
 }));
}
window.KIDS_TEACHER_PATH=Object.freeze({open,plans:scripts,milestones,weekPlan,phrases,targetIndexes,playPhrase});
})();
