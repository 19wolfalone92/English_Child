/* Teacher dashboard: factual progress, not fabricated CEFR scores.
   Runs entirely offline after the adult mathematical gate; never tracks children. */
(function learningPassport(){
'use strict';
const words=(window.KIDS_FIRST_STEPS?.packs||[]).flatMap(p=>p.words);
const packs=window.KIDS_FIRST_STEPS?.packs||[];
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const millisPerDay=86400000;
let ctx=null;
function snapshot(state,now=Date.now()){
 const memory=state.seedMemory||{},seed=state.seedDone||{};
 const rows=words.map(w=>{
  const x=memory[w.id]||{},seen=Math.max(0,Number(x.seen)||0),
    correct=Math.min(seen,Math.max(0,Number(x.correct)||0)),
    stage=Math.min(5,Math.max(0,Number(x.stage)||0)),
    dueAt=Math.max(0,Number(x.due)||0);
  const status=seen===0?'unseen':stage>=3?'familiar':stage===0?'practice':'learning';
  return{...w,seen,correct,stage,dueAt,due:seen>0&&dueAt<=now,status};
 });
 const counts={
  words:rows.length,seen:rows.filter(w=>w.seen>0).length,
  familiar:rows.filter(w=>w.status==='familiar').length,
  learning:rows.filter(w=>w.status==='learning').length,
  practice:rows.filter(w=>w.status==='practice').length,
  due:rows.filter(w=>w.due).length,
  lessons:packs.filter(p=>seed[p.id]===true).length,
  letters:Object.entries(state.alphaDone||{}).filter(([id,v])=>/^letters-[0-6]$/.test(id)&&v===true).length,
  books:Object.entries(state.miniBooks||{}).filter(([id,v])=>/^book-(?:0[1-9]|1[0-9]|20)$/.test(id)&&v===true).length,
  sound:Object.entries(state.soundFamilies||{}).filter(([id,v])=>/^sound-[0-7]$/.test(id)&&v===true).length,
  phrases:Object.entries(state.phraseDone||{}).filter(([id,v])=>/^phrase-(?:[0-9]|1[0-9])$/.test(id)&&v===true).length
 };
 const practice=rows.filter(w=>w.seen>0&&(w.stage<=1||w.due))
   .sort((a,b)=>(a.stage-b.stage)||(Number(b.due)-Number(a.due))||(a.correct/(a.seen||1)-b.correct/(b.seen||1)))
   .slice(0,12);
 return{counts,rows,practice,selected:packs.find(p=>seed[p.id]!==true)||packs.at(-1)};
}
function lessonTip(data){
 if(data.counts.lessons===0)return 'Начните с первой тройки картинок. Произнесите cat, dog, sun и дайте Еве показать каждую игрушку. Не спешите читать или писать.';
 if(data.counts.due>0)return 'Сначала повторите знакомые слова из «Волшебной памяти». Затем попробуйте одну новую тройку — 5–10 минут достаточно.';
 if(data.counts.practice>0)return 'У Евы есть слова, которые пока вызывают трудности. Повторите два или три с реальными предметами, а затем сыграйте в короткую игру.';
 if(data.counts.letters<7)return 'Можно чередовать три новых слова и небольшую группу букв — по 2–4 буквы, без обязательного письма.';
 return 'Хороший момент для мини-сказки, игры с предметами дома и короткой фразы на английском.';
}
function open(api){ctx=api;render();}
function render(){
 const d=snapshot(ctx.state);
 const div=(val,max)=>Math.max(0,Math.min(100,Math.round(max?val/max*100:0)));
 ctx.view.innerHTML=`<section class="passport-cover"><span aria-hidden="true" class="passport-big">📚🌷🐺</span>
  <div class="seed-chip">ДЛЯ РОДИТЕЛЕЙ · ЛИЧНЫЕ ДАННЫЕ ТОЛЬКО В ТЕЛЕФОНЕ</div>
  <h1>Учебный паспорт Евы</h1>
  <p>Наблюдаем, какие слова Ева уже встречала, какие пора повторять, и что лучше сделать дальше.</p></section>
 <section class="feature passport-summary"><div class="section-lead"><h2>🌼 Первые 120 слов</h2><span class="badge">${d.counts.lessons}/20 тем</span></div>
  <div class="passport-meter" role="progressbar" aria-valuemin="0" aria-valuemax="120" aria-valuenow="${d.counts.seen}" aria-label="Слова, которые Ева уже встречала"><i style="width:${div(d.counts.seen,120)}%"></i></div>
  <div class="passport-metrics">
   <div><strong>${d.counts.seen}<small>/120</small></strong><span>Пробовали</span></div>
   <div><strong>${d.counts.familiar}</strong><span>Закрепляются</span></div>
   <div><strong>${d.counts.due}</strong><span>Пора повторить</span></div>
  </div>
  <p class="passport-explain">«Закрепляются» означает минимум три последовательных успешных этапа повторений в приложении. Это ещё не сертификат, что слово свободно используется в речи.</p>
 </section>
 <section class="feature"><div class="section-lead"><h2>🌈 Маленькие победы</h2><span class="badge">Начальный этап</span></div>
  <div class="passport-ribbons">
   <span>🐾 Темы: <b>${d.counts.lessons}/20</b></span>
   <span>🔤 Азбука: <b>${d.counts.letters}/7</b></span>
   <span>📖 Сказки: <b>${d.counts.books}/20</b></span>
   <span>👂 Звуки: <b>${d.counts.sound}/8</b></span>
   <span>💬 Фразы: <b>${d.counts.phrases}/20</b></span>
  </div></section>
 <section class="feature passport-next"><div class="section-lead"><h2>🧑‍🏫 Совет на сегодня</h2><span class="badge">5–10 минут</span></div>
  <p>${esc(lessonTip(d))}</p>
  <div class="passport-next-buttons">
   <button type="button" class="primary" id="passport-review">🧠 Повторить слова</button>
   <button type="button" class="secondary" id="passport-lesson">🐾 Занятия</button>
  </div></section>
 <section class="feature"><div class="section-lead"><h2>🧩 Слова для тренировки</h2><span class="badge">${d.practice.length}</span></div>
  <p>${d.practice.length?'Начните с нескольких, а не со всего списка. Нажмите на картинку для английской озвучки.':'Ошибок на повторение пока нет. Продолжайте маленькими шагами!'}</p>
  <div class="passport-word-grid">${d.practice.map(w=>`<button type="button" class="passport-word" data-passport-word="${esc(w.id)}">
  <span aria-hidden="true">${w.icon}</span><b lang="en">${esc(w.en)}</b><small>${esc(w.ru)}</small>
  <small class="passport-stage">${w.stage===0?'Повторить снова':w.due?'Повторить сегодня':'В процессе'}</small></button>`).join('')}</div>
  <p class="muted">Результаты показывают только ответы в приложении. Произношение оценивает взрослый, не нейросеть.</p></section>
 <button type="button" class="secondary full" id="passport-back">← К родительским настройкам</button>`;
 ctx.view.querySelector('#passport-back')?.addEventListener('click',ctx.onExit);
 ctx.view.querySelector('#passport-review')?.addEventListener('click',ctx.onMemory);
 ctx.view.querySelector('#passport-lesson')?.addEventListener('click',ctx.onWords);
 ctx.view.querySelectorAll('[data-passport-word]').forEach(b=>b.addEventListener('click',()=>{
  const w=d.practice.find(x=>x.id===b.dataset.passportWord);
  if(w)ctx.speak(w.en);
 }));
}
window.KIDS_LEARNING_PASSPORT=Object.freeze({snapshot,open});
})();
