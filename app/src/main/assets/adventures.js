(function kidsAdventures(){
'use strict';
const stories=Array.isArray(window.KIDS_STORIES)?window.KIDS_STORIES:[];
const dialogues=Array.isArray(window.KIDS_DIALOGUES)?window.KIDS_DIALOGUES:[];
const vocab={
'Pre-A1':[['apple','яблоко'],['cat','кот'],['dog','собака'],['ball','мяч'],['sun','солнце'],['fish','рыба'],['tree','дерево'],['hat','шляпа'],['milk','молоко'],['star','звезда'],['book','книга'],['car','машина']],
'A1':[['breakfast','завтрак'],['teacher','учитель'],['friend','друг'],['kitchen','кухня'],['window','окно'],['umbrella','зонт'],['pencil','карандаш'],['birthday','день рождения'],['bicycle','велосипед'],['garden','сад'],['school','школа'],['playground','площадка']],
'A2':[['journey','путешествие'],['ticket','билет'],['museum','музей'],['adventure','приключение'],['weather','погода'],['schedule','расписание'],['volunteer','волонтёр'],['nature','природа'],['performance','выступление'],['solution','решение'],['experience','опыт'],['responsibility','ответственность']],
'B1':[['evidence','доказательство'],['research','исследование'],['pollution','загрязнение'],['confidence','уверенность'],['opinion','мнение'],['challenge','трудность'],['invention','изобретение'],['environment','окружающая среда'],['permission','разрешение'],['experiment','эксперимент'],['reflection','размышление'],['consequence','последствие']],
'B2':[['assumption','предположение'],['compromise','компромисс'],['hypothesis','гипотеза'],['implication','следствие'],['reliability','надёжность'],['limitation','ограничение'],['perspective','точка зрения'],['conclusion','вывод'],['uncertainty','неопределённость'],['evaluation','оценка'],['accessibility','доступность'],['interpretation','интерпретация']]
};
let ctx=null, current=null, cardGame=null;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function mix(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
function day(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function title(icon,name,description){return `<section class="hero"><div class="hero-emoji">${icon}</div><div class="eyebrow">КЛУБ ВОЛЧОНКА</div><h1>${esc(name)}</h1><p>${esc(description)}</p></section>`;}
function back(id,callback){const b=ctx.view.querySelector(id);if(b)b.addEventListener('click',callback);}
function chooseLevel(kind,level){
 ctx.state.level=level;ctx.save();
 if(kind==='story')openStories(ctx);
 if(kind==='dialogue')openDialogues(ctx);
 if(kind==='memory')openMemory(ctx);
}
function levelRow(kind){
 const levels=['Pre-A1','A1','A2','B1','B2'];
 return `<div class="level-buttons quest-level">${levels.map(l=>`<button type="button" class="level-button ${ctx.state.level===l?'active':''}" data-quest-level="${esc(l)}">${esc(l)}</button>`).join('')}</div>`;
}
function bindLevel(kind){
 ctx.view.querySelectorAll('[data-quest-level]').forEach(b=>b.addEventListener('click',()=>chooseLevel(kind,b.dataset.questLevel)));
}
function openStories(api){
 ctx=api;current=null;
 const level=api.state.level||'Pre-A1';
 const list=stories.filter(x=>x.level===level);
 let html=title('📚','Сказки и тайны','Настоящие короткие истории на английском. Читай, слушай и отвечай по смыслу!');
 html+=`<section class="feature"><h2>Выбери ступень</h2>${levelRow('story')}<div class="quest-grid">`;
 for(const story of list){
  const best=api.state.storyScores?.[story.id]?.best||0;
  html+=`<button class="quest-tile" type="button" data-story="${esc(story.id)}"><span class="quest-icon">${story.emoji}</span><strong>${esc(story.title)}</strong><small>${esc(story.intro)}</small><span class="quest-progress">${best>=2?'✅ Прочитано':'📖 Открыть рассказ'} · ${best}/3</span></button>`;
 }
 html+='</div><button type="button" class="secondary full" id="quest-back">← К играм</button></section>';
 api.view.innerHTML=html;bindLevel('story');
 api.view.querySelectorAll('[data-story]').forEach(b=>b.addEventListener('click',()=>readStory(b.dataset.story)));
 back('#quest-back',api.onExit);
}
function readStory(id){
 const story=stories.find(s=>s.id===id);if(!story)return;
 current={kind:'story',story,index:0,points:0,answered:false};
 const paras=story.text.split(/(?<=[.!?])\s+(?=[A-Z])/).reduce((groups,x,i)=>{const gi=Math.floor(i/3);(groups[gi]??=[]).push(x);return groups;},[]).map(x=>`<p>${esc(x.join(' '))}</p>`).join('');
 ctx.view.innerHTML=title(story.emoji,story.title,story.intro)+
 `<section class="feature reading"><div class="reading-header"><span class="badge">${esc(story.level)} · Читаем</span><button type="button" class="sound" id="read-aloud" ${ctx.speakAvailable()?'':'disabled'}>🔊 Слушать</button></div><div class="story-text" lang="en">${paras}</div><div class="note">Не торопись. Прочитай два раза, а потом ответь на три вопроса. Можно вернуться к рассказу в любой момент.</div><button class="primary" id="story-questions">🧠 Проверить понимание</button><button class="secondary full" id="story-back">← К историям</button></section>`;
 back('#read-aloud',()=>ctx.speak(story.text));
 back('#story-questions',storyQuestion);
 back('#story-back',()=>openStories(ctx));
}
function storyQuestion(){
 const s=current;if(!s||s.kind!=='story')return;
 if(s.index>=s.story.questions.length){storyEnd();return;}
 s.answered=false;
 const q=s.story.questions[s.index];
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="to-stories">← Назад</button><span>Вопрос ${s.index+1} / ${s.story.questions.length}</span><span class="badge">${esc(s.story.level)}</span></div>
 <div class="bar"><i style="width:${Math.round(s.index/s.story.questions.length*100)}%"></i></div>
 <section class="feature"><span class="eyebrow">📚 ${esc(s.story.title)}</span><h1 class="quest-question">${esc(q.prompt)}</h1><div class="answers">${q.options.map((a,i)=>`<button class="answer" type="button" data-q-answer="${i}">${esc(a)}</button>`).join('')}</div><div id="quest-notice" aria-live="polite"></div></section>`;
 back('#to-stories',()=>readStory(s.story.id));
 ctx.view.querySelectorAll('[data-q-answer]').forEach(b=>b.addEventListener('click',()=>{
  if(s.answered)return;
  s.answered=true;const n=Number(b.dataset.qAnswer),good=n===q.correct;s.points+=Number(good);
  ctx.view.querySelectorAll('[data-q-answer]').forEach(btn=>{btn.disabled=true;if(Number(btn.dataset.qAnswer)===q.correct)btn.classList.add('good');else if(btn===b)btn.classList.add('bad');});
  const notice=ctx.view.querySelector('#quest-notice');
  notice.innerHTML=`<div class="feedback ${good?'':'retry'}"><strong>${good?'⭐ Верно!':'🌱 Учимся на ошибках'}</strong><p>${esc(q.explain)}</p><button class="primary" id="quest-next">${s.index===s.story.questions.length-1?'Узнать результат':'Следующий вопрос →'}</button></div>`;
  notice.querySelector('#quest-next').addEventListener('click',()=>{s.index++;storyQuestion();});
 }));
}
function storyEnd(){
 const s=current,score=s.points;
 const prev=ctx.state.storyScores?.[s.story.id]?.best||0;
 ctx.state.storyScores??={};
 ctx.state.storyScores[s.story.id]={best:Math.max(prev,score),attempts:(ctx.state.storyScores[s.story.id]?.attempts||0)+1};
 if(score>=2&&prev<2)ctx.state.xp=(ctx.state.xp||0)+15;
 ctx.save();current=null;
 ctx.view.innerHTML=title(score>=2?'🏆':'🌈',score>=2?'История разгадана!':'Ты стал внимательнее!',`Правильных ответов: ${score} из 3.`)+
 `<section class="feature"><p>${score>=2?'⭐ История отмечена как прочитанная.':'Ты можешь прочитать рассказ снова и попробовать ещё раз.'}</p><p>Что бы ты сделал на месте героя? Расскажи взрослому одним-двумя английскими предложениями.</p><button class="primary" id="quest-list">К другим историям →</button><button class="secondary full" id="quest-reread">📖 Прочитать ещё раз</button></section>`;
 back('#quest-list',()=>openStories(ctx));back('#quest-reread',()=>readStory(s.story.id));
}
function openDialogues(api){
 ctx=api;current=null;
 const level=api.state.level||'Pre-A1';
 const list=dialogues.filter(x=>x.level===level);
 let html=title('🗣️','Говорим с героями','Помоги герою подобрать естественный ответ. Вслух повторяй выбранную фразу!');
 html+=`<section class="feature"><h2>Выбери ступень</h2>${levelRow('dialogue')}<div class="quest-grid">`;
 for(const d of list){
  const best=api.state.dialogueScores?.[d.id]?.best||0;
  html+=`<button class="quest-tile" data-dialogue="${esc(d.id)}"><span class="quest-icon">${d.emoji}</span><strong>${esc(d.title)}</strong><small>${esc(d.level)} · 3 реплики</small><span class="quest-progress">${best===3?'✅ Отлично':'🗨️ Начать разговор'} · ${best}/3</span></button>`;
 }
 html+='</div><button class="secondary full" id="quest-back">← К играм</button></section>';
 api.view.innerHTML=html;bindLevel('dialogue');
 api.view.querySelectorAll('[data-dialogue]').forEach(b=>b.addEventListener('click',()=>startDialogue(b.dataset.dialogue)));
 back('#quest-back',api.onExit);
}
function startDialogue(id){
 const dialogue=dialogues.find(x=>x.id===id);
 if(!dialogue)return;
 current={kind:'dialogue',dialogue,index:0,points:0,answered:false};
 dialogueQuestion();
}
function dialogueQuestion(){
 const s=current;if(!s||s.kind!=='dialogue')return;
 if(s.index>=s.dialogue.steps.length){dialogueEnd();return;}
 s.answered=false;
 const step=s.dialogue.steps[s.index];
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="to-dialogues">← Назад</button><span>Реплика ${s.index+1} / 3</span><span class="badge">${esc(s.dialogue.level)}</span></div><section class="feature">
 <div class="dialogue-character">${s.dialogue.emoji} <span class="speech-bubble" lang="en">${esc(step.prompt)}</span></div>
 <button class="sound" id="say-dialogue" ${ctx.speakAvailable()?'':'disabled'}>🔊 Слушать героя</button>
 <h2>Что лучше ответить?</h2><div class="answers">${step.options.map((v,i)=>`<button type="button" class="answer" data-dialogue-option="${i}">${esc(v)}</button>`).join('')}</div><div id="dialogue-notice" aria-live="polite"></div></section>`;
 back('#to-dialogues',()=>openDialogues(ctx));
 back('#say-dialogue',()=>ctx.speak(step.prompt));
 ctx.view.querySelectorAll('[data-dialogue-option]').forEach(btn=>btn.addEventListener('click',()=>{
  if(s.answered)return;s.answered=true;
  const i=Number(btn.dataset.dialogueOption),good=i===step.correct;s.points+=Number(good);
  ctx.view.querySelectorAll('[data-dialogue-option]').forEach(b=>{b.disabled=true;if(Number(b.dataset.dialogueOption)===step.correct)b.classList.add('good');else if(b===btn)b.classList.add('bad');});
  const note=ctx.view.querySelector('#dialogue-notice');
  note.innerHTML=`<div class="feedback ${good?'':'retry'}"><strong>${good?'🌟 Здорово!':'💡 Попробуем иначе'}</strong><p>${esc(step.why)}</p><p lang="en"><b>${esc(step.options[step.correct])}</b></p><button class="sound" type="button" id="say-child" ${ctx.speakAvailable()?'':'disabled'}>🔊 Повторить</button><button class="primary" id="dialogue-next">${s.index===2?'Результат':'Далее →'}</button></div>`;
  back('#say-child',()=>ctx.speak(step.options[step.correct]));
  back('#dialogue-next',()=>{s.index++;dialogueQuestion();});
 }));
}
function dialogueEnd(){
 const s=current,old=ctx.state.dialogueScores?.[s.dialogue.id]?.best||0;
 ctx.state.dialogueScores??={};
 ctx.state.dialogueScores[s.dialogue.id]={best:Math.max(old,s.points)};
 if(s.points>=2&&old<2)ctx.state.xp=(ctx.state.xp||0)+15;
 ctx.save();current=null;
 ctx.view.innerHTML=title('🗣️','Разговор завершён!',`Удачных ответов ${s.points} из 3.`)+
 `<section class="feature"><p>Попробуй повторить весь разговор вслух. Это тренировка понимания и выбора реплик, а не проверка твоего произношения.</p><button id="dialogue-list" class="primary">Другие разговоры</button><button id="dialogue-retry" class="secondary full">Повторить</button></section>`;
 back('#dialogue-list',()=>openDialogues(ctx));back('#dialogue-retry',()=>startDialogue(s.dialogue.id));
}
function openMemory(api){
 ctx=api;current=null;cardGame=null;
 let html=title('🧠','Мастер памяти','Найди пары: английское слово и его перевод. Ошибаться можно — мы учимся!');
 html+=`<section class="feature"><h2>Уровень слов</h2>${levelRow('memory')}<p>Пять пар · без таймера · без проигрыша · слушай правильные слова.</p><button class="primary" id="begin-memory">🎴 Играть в пары</button><button class="secondary full" id="memory-back">← К играм</button></section>`;
 ctx.view.innerHTML=html;bindLevel('memory');
 back('#begin-memory',startMemory);back('#memory-back',api.onExit);
}
function startMemory(){
 const level=ctx.state.level||'Pre-A1';
 const items=mix(vocab[level]||vocab['Pre-A1']).slice(0,5).map(([en,ru],i)=>({id:i,en,ru}));
 const deck=mix(items.flatMap(item=>[{id:item.id,label:item.en,side:'en'},{id:item.id,label:item.ru,side:'ru'}]));
 cardGame={level,items,deck,shown:[],matches:new Set(),busy:false,moves:0};drawMemory();
}
function drawMemory(){
 const g=cardGame;if(!g)return;
 const won=g.matches.size===g.items.length;
 if(won){finishMemory();return;}
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="memory-exit">← Выйти</button><span>${g.matches.size}/5 пар</span><span class="badge">${esc(g.level)}</span></div>
 <section class="feature"><h2>🎴 Найди одинаковый смысл</h2><p>Открой два квадрата. Если перевод подходит — пара найдена!</p><div class="memory-grid">
 ${g.deck.map((c,i)=>{const isFound=g.matches.has(c.id),open=isFound||g.shown.includes(i);return `<button type="button" data-memory-card="${i}" class="memory-card ${open?'opened':''} ${isFound?'matched':''}" ${g.busy||open?'disabled':''} aria-label="${open?esc(c.label):'Закрытая карточка '+(i+1)}"><span>${open?esc(c.label):'❔'}</span></button>`;}).join('')}</div><p id="memory-status" aria-live="polite">Отличных совпадений: ${g.matches.size}</p></section>`;
 back('#memory-exit',()=>{cardGame=null;openMemory(ctx);});
 ctx.view.querySelectorAll('[data-memory-card]').forEach(b=>b.addEventListener('click',()=>flipMemory(Number(b.dataset.memoryCard))));
}
function flipMemory(index){
 const g=cardGame;if(!g||g.busy||g.shown.includes(index)||g.matches.has(g.deck[index]?.id)||!g.deck[index])return;
 g.shown.push(index);if(g.shown.length===2)g.moves++;
 if(g.shown.length===2){
  const [a,b]=g.shown.map(i=>g.deck[i]);
  if(a.id===b.id){
   g.matches.add(a.id);g.shown=[];ctx.speak(g.items[a.id].en);drawMemory();
  }else{
   g.busy=true;drawMemory();
   setTimeout(()=>{if(cardGame!==g)return;g.shown=[];g.busy=false;drawMemory();},1100);
  }
 }else drawMemory();
}
function finishMemory(){
 const g=cardGame;if(!g)return;
 ctx.state.gameWins??={};
 const key=`${day()}:${g.level}`;
 const first=!ctx.state.gameWins[key];
 ctx.state.gameWins[key]=(ctx.state.gameWins[key]||0)+1;
 if(first)ctx.state.xp=(ctx.state.xp||0)+10;
 ctx.save();cardGame=null;
 ctx.view.innerHTML=title('🎴','Все пары найдены!',`Ты нашёл 5 пар за ${g.moves} попыток.`)+
 `<section class="feature"><p>${first?'⭐ +10 звёзд за первую игру сегодня!':'Повторение укрепляет память. Ты можешь играть ещё.'}</p><p>Молодец! Попробуй назвать слова без подсказки.</p><button class="primary" id="memory-again">🔁 Ещё раз</button><button class="secondary full" id="memory-home">К играм</button></section>`;
 back('#memory-again',startMemory);back('#memory-home',()=>openMemory(ctx));
}
window.KIDS_ADVENTURES={openStories,openDialogues,openMemory};
})();
