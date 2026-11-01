/* Original 20 three-panel picture readers for an early 6-year-old learner.
 * Uses Android's offline English TTS or parent-led reading; pictures are truly clickable.
 * Not an assessment of independent reading without a human listener. */
(function miniReaders(){
'use strict';
const packs=window.KIDS_FIRST_STEPS?.packs||[];
const books=[{"id":"book-01","title":"Кошечка и солнышко","pages":[{"en":"A cat says meow!","ru":"Кошечка говорит «мяу».","index":0},{"en":"A dog runs!","ru":"Собачка бежит!","index":1},{"en":"The sun is warm.","ru":"Солнышко тёплое.","index":2}]},{"id":"book-02","title":"Волшебная радуга","pages":[{"en":"A red heart.","ru":"Красное сердечко.","index":0},{"en":"The sky is blue.","ru":"Небо синее.","index":1},{"en":"A yellow star.","ru":"Жёлтая звезда.","index":2}]},{"id":"book-03","title":"В лесу","pages":[{"en":"A lion roars!","ru":"Лев рычит!","index":0},{"en":"A big bear!","ru":"Большой медведь!","index":1},{"en":"Look, a fox!","ru":"Смотри, лиса!","index":2}]},{"id":"book-04","title":"Маленькое кафе","pages":[{"en":"A banana for me!","ru":"Банан для меня!","index":0},{"en":"A strawberry is sweet.","ru":"Клубника сладкая.","index":1},{"en":"I like milk.","ru":"Я люблю молоко.","index":2}]},{"id":"book-05","title":"Моя семья","pages":[{"en":"My dad is here.","ru":"Мой папа здесь.","index":0},{"en":"My sister can jump.","ru":"Моя сестра умеет прыгать.","index":1},{"en":"Hello, brother!","ru":"Привет, братик!","index":2}]},{"id":"book-06","title":"Игрушечная история","pages":[{"en":"I see a doll!","ru":"Я вижу куклу!","index":0},{"en":"My teddy bear is soft.","ru":"Мой мишка мягкий.","index":1},{"en":"A kite flies high!","ru":"Воздушный змей летит высоко!","index":2}]},{"id":"book-07","title":"Лесные друзья","pages":[{"en":"A tree grows tall.","ru":"Дерево растёт высоким.","index":0},{"en":"A flower for you.","ru":"Цветок для тебя.","index":1},{"en":"A leaf falls down.","ru":"Лист падает вниз.","index":2}]},{"id":"book-08","title":"Ладошки и ножки","pages":[{"en":"Clap your hand!","ru":"Хлопни ладошкой!","index":0},{"en":"Move your foot!","ru":"Подвигай ступнёй!","index":1},{"en":"Close one eye.","ru":"Закрой один глаз.","index":2}]},{"id":"book-09","title":"Считаем звёзды","pages":[{"en":"I have one apple.","ru":"У меня одно яблоко.","index":0},{"en":"Two little stars.","ru":"Две маленькие звезды.","index":1},{"en":"Three happy ducks!","ru":"Три весёлые утки!","index":2}]},{"id":"book-10","title":"Наряжаемся","pages":[{"en":"A dress for the party.","ru":"Платье на праздник.","index":0},{"en":"My hat is pink.","ru":"Моя шляпа розовая.","index":1},{"en":"A warm coat!","ru":"Тёплое пальто!","index":2}]},{"id":"book-11","title":"Мой домик","pages":[{"en":"My house is small.","ru":"Мой дом маленький.","index":0},{"en":"Open the door.","ru":"Открой дверь.","index":1},{"en":"Look at the window.","ru":"Посмотри в окно.","index":2}]},{"id":"book-12","title":"Наше путешествие","pages":[{"en":"We play in the park!","ru":"Мы играем в парке!","index":0},{"en":"My bike is red!","ru":"Мой велосипед красный!","index":1},{"en":"A car goes beep!","ru":"Машина сигналит!","index":2}]},{"id":"book-13","title":"Поиграем!","pages":[{"en":"I can run!","ru":"Я умею бегать!","index":0},{"en":"Let's jump!","ru":"Давай прыгнем!","index":1},{"en":"Time to sleep.","ru":"Время спать.","index":2}]},{"id":"book-14","title":"Улыбки и эмоции","pages":[{"en":"I am happy today.","ru":"Сегодня я счастлива.","index":0},{"en":"I feel sad.","ru":"Мне грустно.","index":1},{"en":"The bear is angry.","ru":"Медведь сердится.","index":2}]},{"id":"book-15","title":"За окном","pages":[{"en":"It is hot today.","ru":"Сегодня жарко.","index":0},{"en":"It is cold outside.","ru":"На улице холодно.","index":1},{"en":"Look at the snow!","ru":"Посмотри на снег!","index":2}]},{"id":"book-16","title":"Весёлая ферма","pages":[{"en":"A cow says moo!","ru":"Корова говорит «му»!","index":0},{"en":"The pig is pink.","ru":"Свинка розовая.","index":1},{"en":"A horse can run.","ru":"Лошадь умеет бегать.","index":2}]},{"id":"book-17","title":"Моя книжка","pages":[{"en":"This is my book.","ru":"Это моя книга.","index":0},{"en":"A blue pen!","ru":"Синяя ручка.","index":1},{"en":"My pencil is yellow.","ru":"Мой карандаш жёлтый.","index":2}]},{"id":"book-18","title":"Фрукты для друзей","pages":[{"en":"An orange for you!","ru":"Апельсин для тебя!","index":0},{"en":"A sweet pear.","ru":"Сладкая груша.","index":1},{"en":"Purple grape!","ru":"Фиолетовая виноградина!","index":2}]},{"id":"book-19","title":"Природа","pages":[{"en":"The sea is blue.","ru":"Море синее.","index":0},{"en":"The river is long.","ru":"Река длинная.","index":1},{"en":"A tall mountain!","ru":"Высокая гора!","index":2}]},{"id":"book-20","title":"Праздник Евы","pages":[{"en":"A gift for Eva!","ru":"Подарок для Евы!","index":0},{"en":"Happy birthday!","ru":"С днём рождения!","index":1},{"en":"A fun party!","ru":"Весёлый праздник!","index":2}]}];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nativeArt=new Set(['cat','dog','sun','apple','ball','mom']);
const picture=w=>nativeArt.has(w.en)?'<img src="first-'+w.en+'.svg" alt="">':'<span>'+w.icon+'</span>';
let ctx=null,round=null;
const completed=()=>Object.keys(ctx.state.miniBooks||{}).length;
function open(api){ctx=api;map();}
function unlocked(i){return !!ctx.state.seedDone?.[packs[i]?.id];}
function map(){
 round=null;
 ctx.view.innerHTML=`<section class="reading-cover"><span class="reading-picto" aria-hidden="true">📚🐺🌈</span>
 <div class="seed-chip">ПЕРВЫЕ МИНИ-ИСТОРИИ</div><h1>Сказки-картинки Евы</h1>
 <p>Три короткие странички в каждой истории. Сначала слушаем Вулфи, затем показываем картинку!</p></section>
 <section class="feature"><div class="section-lead"><h2>🌸 Моя маленькая библиотека</h2><span class="badge">${completed()}/20</span></div>
 <p>История открывается после знакомых слов из своей темы. Читать самостоятельно пока не обязательно.</p>
 <div class="reading-shelf">${books.map((b,i)=>`<button type="button" class="reading-book ${ctx.state.miniBooks?.[b.id]?'read':''}" data-mini-book="${i}" ${unlocked(i)?'':'disabled'}>
 <span class="reading-book-cover" aria-hidden="true">${packs[i]?.emoji||'📚'}</span><b>${esc(b.title)}</b><small>${ctx.state.miniBooks?.[b.id]?'⭐ Прочитано':unlocked(i)?'📖 Слушать':'🔒 Сначала выучи слова'}</small></button>`).join('')}</div>
 <button class="secondary full" type="button" id="reading-back">← Домик</button></section>`;
 ctx.view.querySelectorAll('[data-mini-book]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.miniBook))));
 ctx.view.querySelector('#reading-back')?.addEventListener('click',ctx.onExit);
}
function start(index){
 if(!books[index]||!unlocked(index))return;
 round={book:books[index],index,step:0,correct:0,answered:false};question();
}
function question(){
 const r=round;if(!r)return;
 if(r.step>=r.book.pages.length){finish();return;}
 const page=r.book.pages[r.step],pack=packs[r.index],w=pack.words[page.index];
 const other=pack.words[(page.index+1)%3];
 const options=r.step%2===0?[w,other]:[other,w];
 const audio=ctx.speakAvailable();
 r.answered=false;
 ctx.view.innerHTML=`<div class="task-head"><button class="secondary small" type="button" id="reading-to-shelf">← Библиотека</button>
 <span class="badge">📖 ${r.step+1}/3</span><span>⭐ ${r.correct}</span></div>
 <div class="bar"><i style="width:${Math.round(r.step/3*100)}%"></i></div>
 <section class="reading-page"><span class="reading-page-number">🌷 ${esc(r.book.title)}</span>
 <div class="reading-scene" aria-hidden="true">${picture(w)}<span class="reading-glitter">✨</span></div>
 <div class="reading-text" lang="en">${esc(page.en)}</div>
 <button type="button" class="reading-sound" id="reading-play" ${audio?'':'disabled'}>🔊 ${audio?'Послушать страничку':'Голос недоступен'}</button>
 <details class="reading-translation"><summary>👨‍👩‍👧 Подсказка взрослому</summary><p>${esc(page.ru)}</p></details>
 <h2>Найди ${esc(w.ru)}!</h2>
 <div class="reading-options">${options.map(x=>`<button type="button" class="reading-answer" data-reading-choice="${esc(x.id)}"><span class="reading-option-image" aria-hidden="true">${picture(x)}</span><b>${esc(x.ru)}</b></button>`).join('')}</div>
 <div id="reading-result" role="status" aria-live="polite"></div></section>`;
 ctx.view.querySelector('#reading-to-shelf')?.addEventListener('click',map);
 ctx.view.querySelector('#reading-play')?.addEventListener('click',()=>ctx.speak(page.en));
 ctx.view.querySelectorAll('[data-reading-choice]').forEach(b=>b.addEventListener('click',()=>choose(b,w,page)));
}
function choose(b,w,page){
 const r=round;if(!r||r.answered)return;r.answered=true;
 const good=b.dataset.readingChoice===w.id;if(good)r.correct++;
 ctx.view.querySelectorAll('[data-reading-choice]').forEach(x=>{
  x.disabled=true;if(x.dataset.readingChoice===w.id)x.classList.add('good');else if(x===b)x.classList.add('bad');
 });
 ctx.view.querySelector('#reading-result').innerHTML=`<div class="feedback ${good?'':'retry'}"><strong>${good?'🌟 Ты поняла, Ева!':'💜 Вулфи тебе поможет!'}</strong>
 <p>${esc(page.ru)}</p><button class="primary" type="button" id="reading-next">${r.step===2?'🏅 Конец истории':'📖 Следующая страничка'}</button></div>`;
 ctx.view.querySelector('#reading-next')?.addEventListener('click',()=>{r.step++;question();});
}
function finish(){
 const r=round;if(!r)return;round=null;
 ctx.state.miniBooks??={};
 const was=ctx.state.miniBooks[r.book.id]===true;
 const passed=r.correct>=2;
 if(passed)ctx.state.miniBooks[r.book.id]=true;
 if(!was&&passed)ctx.state.xp=(ctx.state.xp||0)+5;
 ctx.save();
 ctx.view.innerHTML=`<section class="seed-celebrate"><div class="reading-celebrate" aria-hidden="true">📚✨🌸</div>
 <h1>${passed?'Ева, сказка закончилась!':'Ева, повторим сказку!'}</h1><p>Ты нашла ${r.correct} из 3 картинок. Теперь можно читать её снова!</p>
 <button class="primary seed-continue" type="button" id="reading-more">📖 Ещё одну сказку</button>
 <button class="secondary full" type="button" id="reading-home">🏡 В домик</button></section>`;
 ctx.view.querySelector('#reading-more')?.addEventListener('click',map);
 ctx.view.querySelector('#reading-home')?.addEventListener('click',ctx.onExit);
}
window.KIDS_MINI_READERS=Object.freeze({books,open});
})();