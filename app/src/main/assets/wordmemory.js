/* Scheduled vocabulary retrieval: correct words return after 1, 3, 7, 14, 30 days.
 * Mistakes are replayable immediately and words are never automatically considered
 * known merely because the parent opened a card. */
(function kidsWordMemory(){
'use strict';
const all=(window.KIDS_FIRST_STEPS?.packs||[]).flatMap(p=>p.words);
const byId=new Map(all.map(w=>[w.id,w]));
const intervals=[0,1,3,7,14,30];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const originalArt=new Set(['cat','dog','sun','apple','ball','mom']);
const picture=w=>originalArt.has(w.en)?'<img src="first-'+w.en+'.svg" alt="">':'<span>'+w.icon+'</span>';
function due(state,now=Date.now()){
 return Object.entries(state.seedMemory||{}).filter(([id,rec])=>byId.has(id)&&rec&&rec.seen>0&&Number(rec.due)<=now)
  .sort((a,b)=>Number(a[1].due)-Number(b[1].due)).map(([id])=>byId.get(id));
}
const practiced=state=>all.filter(w=>(state.seedMemory?.[w.id]?.seen||0)>0);
function shuffle(a){let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
let ctx=null,session=null;
function open(api){ctx=api;showMap();}
function showMap(){
 session=null;
 const list=due(ctx.state),total=practiced(ctx.state).length;
 ctx.view.innerHTML=`<section class="alpha-header memory-header"><div class="alpha-big" aria-hidden="true">🧠🌸</div><div>
 <div class="seed-chip">✨ ВОЛШЕБНАЯ ПАМЯТЬ</div><h1>Помним слова вместе!</h1>
 <p>Ева, знакомые слова возвращаются через день, потом через 3, 7, 14 и 30 дней. Так учиться легче!</p></div></section>
 <section class="feature"><div class="section-lead"><h2>🌷 Пора повторить</h2><span class="badge">${list.length} слов</span></div>
 <p>Уже встречались: ${total} из 120 слов. ${list.length?'Сегодня тебя ждут знакомые картинки!':'Сегодня всё повторено. Молодец! Можно поиграть ещё раз.'}</p>
 <button type="button" class="primary seed-continue" id="memory-begin" ${total?'':'disabled'}>${list.length?'🎲 Повторим '+Math.min(8,list.length)+' слов':'🎨 Поиграем для тренировки'}</button>
 <p class="seed-calm">Без таймера, без оценок и наказаний.</p>
 <button type="button" class="secondary full" id="memory-exit">← На карту</button></section>`;
 ctx.view.querySelector('#memory-begin')?.addEventListener('click',begin);
 ctx.view.querySelector('#memory-exit')?.addEventListener('click',ctx.onExit);
}
function begin(){
 const list=due(ctx.state);
 const words=list.length?list.slice(0,8):shuffle(practiced(ctx.state)).slice(0,6);
 if(!words.length){showMap();return;}
 session={words,step:0,correct:0,answered:false,scheduled:list.length>0};
 question();
}
function question(){
 const s=session;if(!s)return;
 if(s.step>=s.words.length){finish();return;}
 s.answered=false;
 const word=s.words[s.step];
 const known=practiced(ctx.state).filter(x=>x.id!==word.id);
 const extras=shuffle(known.length>=2?known:all.filter(x=>x.id!==word.id)).slice(0,s.step===0?1:2);
 const options=shuffle([word,...extras]);
 const audio=ctx.speakAvailable();
 ctx.view.innerHTML=`<div class="task-head"><button type="button" class="secondary small" id="memory-back">← Память</button>
 <span class="badge">🌸 ${s.step+1}/${s.words.length}</span></div>
 <div class="bar"><i style="width:${Math.round(s.step/s.words.length*100)}%"></i></div>
 <section class="feature seed-question"><div class="alpha-guide" aria-hidden="true">🧸 💜</div><h1>${audio?'Какое слово слышишь?':'Найди знакомую картинку!'}</h1>
 ${audio?`<button class="seed-audio" type="button" id="memory-hear">🔊 <span>Послушать ещё раз</span></button>`:
 `<div class="seed-audio fallback" lang="en">${esc(word.en)}<small>🔇 Без голоса: посмотри слово с взрослым</small></div>`}
 <div class="seed-choices">${options.map(x=>`<button type="button" class="seed-choice" data-memory-answer="${x.id}" aria-label="${esc(x.ru)}">
 <span class="seed-choice-image" aria-hidden="true">${picture(x)}</span><b>${esc(x.ru)}</b></button>`).join('')}</div>
 <div id="memory-feedback" aria-live="polite" role="status"></div></section>`;
 ctx.view.querySelector('#memory-back')?.addEventListener('click',showMap);
 ctx.view.querySelector('#memory-hear')?.addEventListener('click',()=>ctx.speak(word.en));
 ctx.view.querySelectorAll('[data-memory-answer]').forEach(b=>b.addEventListener('click',()=>answer(b,word)));
}
function answer(button,word){
 const s=session;if(!s||s.answered)return;s.answered=true;
 const ok=button.dataset.memoryAnswer===word.id;if(ok)s.correct++;
 // Playing before the due date must NOT advance the interval or postpone real review.
 const rec=ctx.state.seedMemory?.[word.id]||{seen:0,correct:0,stage:0,due:0};
 const time=Date.now(),scheduled=Number(rec.due)<=time;
 const stage=ok?(scheduled?Math.min((rec.stage||0)+1,5):(rec.stage||0)):0;
 const nextDue=ok?(scheduled?time+intervals[stage]*86400000:rec.due):time;
 ctx.state.seedMemory??={};
 ctx.state.seedMemory[word.id]={stage,seen:(rec.seen||0)+1,correct:(rec.correct||0)+Number(ok),due:nextDue};
 ctx.save();
 ctx.view.querySelectorAll('[data-memory-answer]').forEach(b=>{b.disabled=true;if(b.dataset.memoryAnswer===word.id)b.classList.add('good');else if(b===button)b.classList.add('bad');});
 ctx.view.querySelector('#memory-feedback').innerHTML=`<div class="feedback ${ok?'':'retry'}"><strong>${ok?'🌟 Отличная память!':'💖 Учимся понемногу!'}</strong>
 <p><b lang="en">${esc(word.en)}</b> — ${esc(word.ru)}</p>
 <button type="button" class="primary" id="memory-next">Дальше →</button></div>`;
 ctx.view.querySelector('#memory-next')?.addEventListener('click',()=>{s.step++;question();});
}
function finish(){
 const s=session;if(!s)return;session=null;
 ctx.view.innerHTML=`<section class="seed-celebrate"><div class="alpha-celebrate">⭐ 🌸 🧠</div>
 <h1>Ева, слова становятся знакомее!</h1><p>Ты вспомнила ${s.correct} из ${s.words.length} слов. Они будут возвращаться, чтобы ты их запомнила.</p>
 <button type="button" class="primary seed-continue" id="memory-again">🌷 Ещё потренируемся</button>
 <button type="button" class="secondary full" id="memory-map">🗺️ К словам</button></section>`;
 ctx.view.querySelector('#memory-again')?.addEventListener('click',showMap);
 ctx.view.querySelector('#memory-map')?.addEventListener('click',ctx.onExit);
}
window.KIDS_WORD_MEMORY=Object.freeze({open,due,intervals});
})();
