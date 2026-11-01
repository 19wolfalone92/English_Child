/* Sound families for preschool phonological awareness: whole-word TTS, not
 * synthesized /s/ or speech-recognition assessment. Every family / onset verified. */
(function firstSounds(){
'use strict';
const groups=[{"letter":"S","sound":"/s/","words":[["sun","солнце","☀️"],["sock","носок","🧦"],["star","звезда","⭐"]],"other":["moon","луна","🌙"]},{"letter":"M","sound":"/m/","words":[["mom","мама","👩"],["moon","луна","🌙"],["milk","молоко","🥛"]],"other":["fish","рыба","🐟"]},{"letter":"T","sound":"/t/","words":[["tree","дерево","🌳"],["train","поезд","🚂"],["toy","игрушка","🧸"]],"other":["sun","солнце","☀️"]},{"letter":"P","sound":"/p/","words":[["pig","свинка","🐷"],["pen","ручка","🖊️"],["pizza","пицца","🍕"]],"other":["dog","собака","🐕"]},{"letter":"N","sound":"/n/","words":[["nose","нос","👃"],["nest","гнездо","🪺"],["nut","орех","🌰"]],"other":["pig","свинка","🐷"]},{"letter":"F","sound":"/f/","words":[["fish","рыба","🐟"],["fox","лиса","🦊"],["fan","вентилятор","🪭"]],"other":["cat","кошка","🐱"]},{"letter":"B","sound":"/b/","words":[["ball","мяч","⚽"],["bear","медведь","🐻"],["bus","автобус","🚌"]],"other":["sun","солнце","☀️"]},{"letter":"D","sound":"/d/","words":[["dog","собака","🐕"],["duck","утка","🦆"],["door","дверь","🚪"]],"other":["fox","лиса","🦊"]}];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ctx=null,game=null;
const done=()=>ctx.state.soundFamilies||{};
const count=()=>Object.keys(done()).filter(x=>/^sound-[0-7]$/.test(x)&&done()[x]===true).length;
function open(api){ctx=api;map();}
function map(){
 game=null;
 ctx.view.innerHTML=`<section class="soundfamily-hero"><span aria-hidden="true">🦊👂🌸</span>
 <div class="seed-chip">ИГРЫ «СЛЫШУ НАЧАЛО»</div><h1>Звуки и буквы</h1><p>Слова могут начинаться одинаково! Слушай целые английские слова, показывай картинки и повторяй за взрослым.</p></section>
 <section class="feature"><div class="section-lead"><h2>🎵 Восемь звуковых семей</h2><span class="badge">${count()}/8</span></div>
 <div class="soundfamily-grid">${groups.map((g,i)=>`<button type="button" class="soundfamily-group" data-soundfamily="${i}">
 <span class="soundfamily-symbol" aria-hidden="true">${g.words[0][2]}</span>
 <b lang="en">${g.letter}</b><small>${done()['sound-'+i]?'🌟 Готово':'🎧 Слушаем и ищем'}</small></button>`).join('')}</div>
 <p class="muted">Важно: голос Android произносит целые слова, а не отдельные фонемы. Это игра на узнавание начального звука, не полноценная проверка произношения.</p>
 <button class="secondary full" id="soundfamily-exit">← Домик</button></section>`;
 ctx.view.querySelectorAll('[data-soundfamily]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.soundfamily))));
 ctx.view.querySelector('#soundfamily-exit')?.addEventListener('click',ctx.onExit);
}
function start(i){
 if(!groups[i])return;
 game={index:i,step:0,correct:0,answered:false};
 intro();
}
function intro(){
 const g=groups[game.index];
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="soundfamily-back">← Звуковые семьи</button>
 <span class="badge">👂 Начальный звук</span></div>
 <section class="feature soundfamily-intro"><h1>Послушай семью ${g.letter}!</h1>
 <div class="soundfamily-bigletter" lang="en">${g.letter.toLowerCase()}</div>
 <p>В английских словах ниже слышится одинаковое начало. Послушай их все вместе и произнеси с взрослым.</p>
 <div class="soundfamily-examples">${g.words.map(x=>`<div class="soundfamily-example">
 <span aria-hidden="true">${x[2]}</span><b lang="en">${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>
 <button class="secondary full" type="button" id="soundfamily-hear" ${ctx.speakAvailable()?'':'disabled'}>🔊 ${ctx.speakAvailable()?'Слушать три слова':'Озвучка недоступна — произнесите вместе'}</button>
 <button class="primary seed-continue" id="soundfamily-go">🎲 Поиграем!</button></section>`;
 ctx.view.querySelector('#soundfamily-back')?.addEventListener('click',map);
 ctx.view.querySelector('#soundfamily-hear')?.addEventListener('click',()=>ctx.speak(g.words.map(x=>x[0]).join('. ')));
 ctx.view.querySelector('#soundfamily-go')?.addEventListener('click',question);
}
function question(){
 const r=game;if(!r)return;const g=groups[r.index];
 if(r.step===3){finish();return;}
 r.answered=false;
 const target=g.words[r.step],other=groups[(r.index+r.step+1)%groups.length].words[(r.step+1)%3];
 const opts=(r.step%2)?[other,target]:[target,other];
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" id="soundfamily-back">← Слова</button>
 <span class="badge">${r.step+1}/3</span></div>
 <section class="feature soundfamily-question"><div class="soundfamily-bigletter" lang="en">${g.letter.toLowerCase()}</div>
 <h1>Какое слово начинается так же?</h1>
 <p>Вулфи вспоминает: ${g.words[0][0]}! ${ctx.speakAvailable()?'Послушай и найди похожее начало.':'Попроси взрослого сказать слова вслух.'}</p>
 <button class="secondary full" id="soundfamily-play" ${ctx.speakAvailable()?'':'disabled'}>🔊 ${ctx.speakAvailable()?'Слушать пример и два ответа':'Голос Android недоступен'}</button>
 <div class="soundfamily-choices">${opts.map(x=>`<button class="soundfamily-choice" data-family-answer="${esc(x[0])}">
 <span aria-hidden="true">${x[2]}</span><b>${esc(x[1])}</b></button>`).join('')}</div>
 <div id="soundfamily-result" aria-live="polite" role="status"></div></section>`;
 ctx.view.querySelector('#soundfamily-back')?.addEventListener('click',intro);
 ctx.view.querySelector('#soundfamily-play')?.addEventListener('click',()=>ctx.speak(g.words[0][0]+'. '+opts.map(x=>x[0]).join('. ')));
 ctx.view.querySelectorAll('[data-family-answer]').forEach(b=>b.addEventListener('click',()=>answer(b,target,g)));
}
function answer(b,target,g){
 const r=game;if(!r||r.answered)return;r.answered=true;
 const good=b.dataset.familyAnswer===target[0];if(good)r.correct++;
 ctx.view.querySelectorAll('[data-family-answer]').forEach(x=>{x.disabled=true;if(x.dataset.familyAnswer===target[0])x.classList.add('good');else if(x===b)x.classList.add('bad');});
 ctx.view.querySelector('#soundfamily-result').innerHTML=`<div class="feedback ${good?'':'retry'}">
 <strong>${good?'✨ Молодец, Ева!':'🌷 Слушай ещё раз, Ева!'}</strong>
 <p><b lang="en">${esc(g.words[0][0])}</b> и <b lang="en">${esc(target[0])}</b> начинаются одинаково.</p>
 <button type="button" class="primary" id="soundfamily-next">Дальше →</button></div>`;
 ctx.view.querySelector('#soundfamily-next')?.addEventListener('click',()=>{r.step++;question();});
}
function finish(){
 const r=game;if(!r)return;game=null;
 ctx.state.soundFamilies??={};
 const id='sound-'+r.index,first=!ctx.state.soundFamilies[id];
 if(r.correct>=2){ctx.state.soundFamilies[id]=true;if(first)ctx.state.xp=(ctx.state.xp||0)+6;}
 ctx.save();
 ctx.view.innerHTML=`<section class="seed-celebrate"><div class="alpha-celebrate">👂🎉⭐</div>
 <h1>${r.correct>=2?'Слышишь похожие слова!':'Давай послушаем ещё!'}</h1>
 <p>Правильно с первого раза: ${r.correct}/3. Можно повторить с взрослым!</p>
 <button class="primary seed-continue" id="soundfamily-again">🎵 Ещё слова</button>
 <button class="secondary full" id="soundfamily-home">🏡 Домик</button></section>`;
 ctx.view.querySelector('#soundfamily-again')?.addEventListener('click',map);
 ctx.view.querySelector('#soundfamily-home')?.addEventListener('click',ctx.onExit);
}
window.KIDS_FIRST_SOUNDS=Object.freeze({groups,open});
})();