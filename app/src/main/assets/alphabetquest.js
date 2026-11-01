/* Eva 6+: letter-name recognition before phonics. Examples are complete English words,
 * not a misleading claim that each letter has a single fixed sound. No microphone / network. */
(function alphabetQuest(){
 'use strict';
 const alphabet=Array.isArray(window.KIDS_ALPHABET)?window.KIDS_ALPHABET:[];
 const chunks=[alphabet.slice(0,4),alphabet.slice(4,8),alphabet.slice(8,12),alphabet.slice(12,16),
               alphabet.slice(16,20),alphabet.slice(20,24),alphabet.slice(24,26)];
 const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 function choices(source,correct,count){
  const pool=[...source.filter(x=>x.letter!==correct.letter)];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const result=[correct,...pool.slice(0,count-1)];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
 }
 let ctx=null,round=null;
 const done=()=>ctx.state.alphaDone||{};
 const completed=()=>chunks.filter((g,i)=>g.length&&done()['letters-'+i]===true).length;
 function open(api){ctx=api;showMap();}
 function showMap(){
  round=null;const finished=completed();
  ctx.view.innerHTML=`<section class="alpha-header"><div class="alpha-sparkle" aria-hidden="true">⭐ ✨ 🌈</div>
  <div class="alpha-big" aria-hidden="true">Aa 🐝</div>
  <div><div class="seed-chip">🔤 АЗБУКА С ВУЛФИ</div><h1>Буквы для Евы</h1><p>Учимся узнавать большие и маленькие буквы — по 2–4 за раз!</p></div></section>
  <section class="feature"><div class="section-lead"><h2>🌸 Семь островов букв</h2><span class="badge">${finished}/7</span></div>
   <div class="alpha-group-grid">${chunks.map((g,i)=>`<button class="alpha-group ${done()['letters-'+i]?'completed':''}" type="button" data-alpha-group="${i}"
    ${i>finished?'disabled':''}><span class="alpha-group-icon" aria-hidden="true">${['🍎','🐟','🪁','🌙','👑','☂️','🦓'][i]}</span>
    <b>${g.map(x=>x.letter).join(' ')}</b><small>${done()['letters-'+i]?'⭐ Знаю буквы!':i===finished?'✨ Давай учить':'🔒 Позже'}</small></button>`).join('')}</div>
   <p class="muted">Название буквы и звук внутри английского слова бывают разными. Слушай целое слово и повторяй с взрослым.</p>
   <button type="button" class="secondary full" id="alpha-exit">← Домик</button></section>`;
  ctx.view.querySelector('#alpha-exit')?.addEventListener('click',ctx.onExit);
  ctx.view.querySelectorAll('[data-alpha-group]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.alphaGroup))));
 }
 function start(index){
  if(index<0||index>=chunks.length||index>completed())return;
  round={index,group:chunks[index],step:0,correct:0,answered:false,misses:[],reviewing:false};
  showLetters();
 }
 function showLetters(){
  const r=round;if(!r)return;
  ctx.view.innerHTML=`<div class="task-head"><button type="button" class="secondary small" id="alpha-back">← Азбука</button><span class="badge">🐾 Остров ${r.index+1}/7</span></div>
   <section class="feature"><div class="alpha-helper"><img src="wolfie.svg" alt="" aria-hidden="true"><div><h1>Знакомимся с буквами!</h1><p>Смотри на БОЛЬШУЮ и маленькую букву. Нажми на карточку и повтори!</p></div></div>
   <div class="alpha-learn-grid">${r.group.map(x=>`<button type="button" data-alpha-say="${x.letter}" class="alpha-learn-card"
   aria-label="Буква ${x.letter}, слово ${esc(x.word)}">
   <span class="alpha-letter-pair" lang="en">${x.letter}<small>${x.letter.toLowerCase()}</small></span>
   <span class="alpha-emoji" aria-hidden="true">${x.emoji}</span>
   <b lang="en">${esc(x.word)}</b><small>${esc(x.ru)}</small><span class="alpha-audio">${ctx.speakAvailable()?'🔊 Нажми и послушай':'👀 Посмотри и повтори'}</span></button>`).join('')}</div>
   <button type="button" class="primary seed-continue" id="alpha-try">🎲 Поиграем с буквами!</button></section>`;
  ctx.view.querySelector('#alpha-back')?.addEventListener('click',showMap);
  ctx.view.querySelectorAll('[data-alpha-say]').forEach(b=>b.addEventListener('click',()=>{
   const row=r.group.find(x=>x.letter===b.dataset.alphaSay);
   if(!row)return;
   ctx.speak(row.letter+'. '+row.word+'.');
   if(ctx.speakAvailable()){ctx.state.alphabetHeard??={};ctx.state.alphabetHeard[row.letter]=true;ctx.save();}
  }));
  ctx.view.querySelector('#alpha-try')?.addEventListener('click',()=>{r.step=0;r.reviewing=false;question();});
 }
 function question(){
  const r=round;if(!r)return;
  const list=r.reviewing?r.misses:r.group;
  if(r.step>=list.length){
   if(!r.reviewing&&r.misses.length){r.reviewing=true;r.step=0;question();return;}
   finish();return;
  }
  r.answered=false;
  const target=list[r.step],matches=choices(r.group,target,Math.min(r.group.length,r.step<2?2:3));
  const imageQuestion=r.step%2===1; // printed word association, not pronunciation scoring
  ctx.view.innerHTML=`<div class="task-head"><button type="button" class="secondary small" id="alpha-back">← Карточки</button>
   <span class="badge">${r.reviewing?'🌱 Повторяем':r.step+1+'/'+r.group.length}</span></div>
   <div class="bar"><i style="width:${Math.round(r.step/list.length*100)}%"></i></div>
   <section class="feature alpha-question"><div class="alpha-guide" aria-hidden="true">🐺 💫</div>
   <h1>${imageQuestion?'Какое слово начинается с буквы':'Найди маленькую букву'}</h1>
   <div class="alpha-target" lang="en">${target.letter}</div>
   <div class="alpha-choices">${matches.map(x=>`<button type="button" class="alpha-choice" data-alpha-answer="${x.letter}">
   ${imageQuestion?`<span class="alpha-emoji" aria-hidden="true">${x.emoji}</span><b lang="en">${esc(x.word)}</b>`:
   `<span class="alpha-lower" lang="en">${x.letter.toLowerCase()}</span>`}</button>`).join('')}</div>
   <div id="alpha-feedback" aria-live="polite" role="status"></div></section>`;
  ctx.view.querySelector('#alpha-back')?.addEventListener('click',showLetters);
  ctx.view.querySelectorAll('[data-alpha-answer]').forEach(b=>b.addEventListener('click',()=>answer(b,target)));
 }
 function answer(b,target){
  const r=round;if(!r||r.answered)return;r.answered=true;
  const ok=b.dataset.alphaAnswer===target.letter;
  if(!r.reviewing){if(ok)r.correct++;else r.misses.push(target);}
  ctx.view.querySelectorAll('[data-alpha-answer]').forEach(x=>{x.disabled=true;if(x.dataset.alphaAnswer===target.letter)x.classList.add('good');else if(x===b)x.classList.add('bad');});
  ctx.view.querySelector('#alpha-feedback').innerHTML=`<div class="feedback ${ok?'':'retry'}">
    <strong>${ok?'🌟 Отлично, Ева!':'🌸 Учимся вместе!'}</strong>
    <p><b lang="en">${target.letter} — ${target.letter.toLowerCase()}</b> • ${esc(target.word)} • ${esc(target.ru)}</p>
    <button type="button" class="secondary" id="alpha-hear" ${ctx.speakAvailable()?'':'disabled'}>🔊 Послушать</button>
    <button type="button" class="primary" id="alpha-next">Дальше →</button></div>`;
  ctx.view.querySelector('#alpha-hear')?.addEventListener('click',()=>ctx.speak(target.letter+'. '+target.word));
  ctx.view.querySelector('#alpha-next')?.addEventListener('click',()=>{r.step++;question();});
 }
 function finish(){
  const r=round;if(!r)return;round=null;
  const passed=r.correct>=Math.ceil(r.group.length*.75);
  ctx.state.alphaDone??={};
  const id='letters-'+r.index,was=ctx.state.alphaDone[id]===true;
  if(passed){ctx.state.alphaDone[id]=true;if(!was)ctx.state.xp=(ctx.state.xp||0)+10;}
  ctx.save();
  ctx.view.innerHTML=`<section class="seed-celebrate"><div class="alpha-celebrate">🎉 🔤 ⭐</div>
   <h1>${passed?'Ты знаешь новые буквы, Ева!':'Мы ещё потренируемся, Ева!'}</h1>
   <p>Правильных ответов с первого раза: ${r.correct} из ${r.group.length}. Повторы — это тоже обучение!</p>
   <button class="primary seed-continue" id="alpha-more">${passed?'✨ Следующий остров':'💜 Повторить эти буквы'}</button>
   <button class="secondary full" id="alpha-all">🗺️ Все буквы</button></section>`;
  ctx.view.querySelector('#alpha-more')?.addEventListener('click',()=>{if(!passed)start(r.index);else if(completed()<7)start(completed());else showMap();});
  ctx.view.querySelector('#alpha-all')?.addEventListener('click',showMap);
 }
 window.KIDS_ALPHABET_QUEST=Object.freeze({open,groups:chunks});
})();
