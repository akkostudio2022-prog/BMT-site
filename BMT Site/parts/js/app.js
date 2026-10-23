function menuT(){document.getElementById('mMenu').classList.toggle('open');}

/* видео первого экрана: если hero.mp4 нет — включаем фототрансформацию */
(function(){
  const v=document.getElementById('heroVideo');
  const scene=document.getElementById('scene');
  if(!v||!scene)return;
  let ok=false;
  const fail=()=>{if(!ok){scene.classList.add('video-off');}};
  v.addEventListener('loadeddata',()=>{ok=true;scene.classList.remove('video-off');});
  v.addEventListener('error',fail,true);
  v.querySelectorAll('source').forEach(s=>s.addEventListener('error',fail));
  setTimeout(()=>{if(!ok&&v.readyState<2)fail();},2500);
  const slow=(navigator.connection&&/2g|slow-2g/.test(navigator.connection.effectiveType||''));
  if(slow){fail();}
})();

/* тизер вопросов на первом экране */
(function(){
  const QS=['Площадь квартиры?','Какой каркас?','Нужна перепланировка?','Какой уровень отделки?','Сколько санузлов?','Добавить тёплый пол?','Нужна фильтрация воды?','Подключить умный дом?','Остеклить балкон?'];
  let qi=0;
  const q=document.getElementById('qcQ');
  if(!q)return;
  const dots=document.querySelectorAll('.qc-dots i');
  setInterval(()=>{
    q.classList.add('swap');
    setTimeout(()=>{
      qi=(qi+1)%QS.length;
      q.textContent=QS[qi];
      dots.forEach((d,k)=>d.classList.toggle('on',k===qi));
      q.classList.remove('swap');
    },300);
  },2400);
})();

/* ============ QUIZ ============ */
const CFG = {
DISCOUNT_DAYS: 7,
BATH_EXTRA: 0,
APPS_SCRIPT_URL: '',
WHATSAPP: '995591935178',
CURRENCY_API: 'https://api.exchangerate-api.com/v4/latest/USD',
FALLBACK_RATE: 2.72,
OLD_RATES: {
white: {work: [195, 230, 270], materials: [150, 280, 520]},
black: {work: [230, 255, 290], materials: [200, 350, 600]}
},
get NEW_RATES() {
const r = {};
for (const k in this.OLD_RATES) {
r[k] = {work: this.OLD_RATES[k].work.map(v => v / 0.9), materials: this.OLD_RATES[k].materials.map(v => v / 0.9)};
}
return r;
},
LEVELS: ['Базовый', 'Стандарт', 'Премиум'],
QUESTIONS: [
{id:'state',q:'Расскажите о вашей квартире. <em>Какая она сейчас?</em>',type:'radio',options:[
{v:'black',t:'Голые стены, только бетон и блоки',s:'чёрный каркас',icon:'walls'},
{v:'white',t:'Стены оштукатурены, пол залит',s:'белый каркас',icon:'plaster'},
{v:'secondary',t:'Вторичка, нужно всё обновить',s:'',icon:'old'},
{v:'villa',t:'Дом или вилла',s:'считаем индивидуально',icon:'villa'}]},
{id:'area',q:'Какая площадь <em>и сколько ванных комнат?</em>',type:'area'},
{id:'purpose',q:'Для чего <em>эта квартира?</em>',type:'radio',options:[
{v:'self',t:'Для себя и семьи',icon:'family'},
{v:'rent_short',t:'Для гостей, буду сдавать посуточно',icon:'key'},
{v:'rent_long',t:'Для долгой аренды',icon:'calendar'},
{v:'sell',t:'Для продажи',icon:'tag'}]},
{id:'style',q:'Какая атмосфера <em>вам ближе?</em>',type:'style',options:[
{v:'neoclassic',t:'Неоклассика',d:'Молдинги, симметрия, тёплая элегантность',level:2,art:'neoclassic'},
{v:'minimal',t:'Минимализм',d:'Чистые формы и воздух, ничего лишнего',level:1,art:'minimal'},
{v:'scandi',t:'Скандинавский',d:'Светлое дерево, мягкий свет, уют',level:0,art:'scandi'},
{v:'loft',t:'Лофт',d:'Кирпич, бетон и открытые коммуникации',level:1,art:'loft'},
{v:'brutalism',t:'Брутализм',d:'Бетон, геометрия, честные фактуры',level:2,art:'brutalism'},
{v:'advise',t:'Нужен совет',d:'Подберём стиль вместе с дизайнером',level:-1,art:'advise'}]},
{id:'level',q:'Какой уровень отделки <em>вам подойдёт?</em>',type:'level',options:[
{v:0,t:'Базовый',d:'Аккуратная чистая отделка: стены, электрика, плитка в санузле, пол'},
{v:1,t:'Стандарт',d:'Плюс потолки, покраска, двери и сантехника. Можно просто жить'},
{v:2,t:'Премиум',d:'Двухуровневые потолки, молдинги, плинтусы, плитка в гостиной'}]},
{id:'extras',q:'Что сделает жизнь <em>комфортнее?</em>',type:'checkbox',options:[
{v:'warm_floor',t:'Тёплый пол',icon:'warm'},
{v:'smart_home',t:'Умный дом',icon:'smart'},
{v:'water_filter',t:'Фильтрация воды',icon:'water'},
{v:'voltage',t:'Защита от скачков',icon:'bolt'},
{v:'emergency_light',t:'Аварийное освещение',icon:'lamp'},
{v:'ac',t:'Кондиционеры',icon:'wind'},
{v:'none',t:'Ничего лишнего',icon:'none'}]},
{id:'materials',q:'Как поступим <em>с материалами?</em>',type:'radio',options:[
{v:'full',t:'Подберите и привезите всё за меня',icon:'truck'},
{v:'list',t:'Выбор материалов — моя часть, нужен список',icon:'list'},
{v:'consult',t:'Расскажите, как обычно это делают',icon:'chat'}]},
{id:'start',q:'Когда мечтаете <em>начать?</em>',type:'radio',options:[
{v:'month',t:'В ближайший месяц',icon:'soon'},
{v:'1-3',t:'Через 1–3 месяца',icon:'cal1'},
{v:'3-6',t:'Через 3–6 месяцев',icon:'cal2'},
{v:'looking',t:'Пока присматриваюсь',icon:'eye'}]},
{id:'country',q:'Где вы сейчас <em>живёте?</em>',type:'radio',hint:'Расскажем, как следить за ремонтом, не приезжая.',options:[
{v:'georgia',t:'В Грузии',icon:'geo'},
{v:'cis',t:'Россия, СНГ',icon:'cis'},
{v:'israel',t:'Израиль',icon:'isr'},
{v:'other',t:'Другая страна',icon:'globe'}]}
]
};

/* Фото стилей: прямые ссылки ibb */
const STYLE_PHOTOS = {
neoclassic:'https://i.ibb.co/nqCX67QP/2.png',
minimal:'https://i.ibb.co/Hf71yxTz/3.jpg',
scandi:'https://i.ibb.co/RGDLycxm/3.png',
loft:'https://i.ibb.co/Ys0NQ6S/1.jpg',
brutalism:'https://i.ibb.co/RGCQqzm5/2.jpg',
advise:'style-advise.jpg'
};

const ICONS = {
walls:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M3 16h18M9 4v16M15 4v16"/></svg>',
plaster:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 8v8M12 8v8M17 8v8"/></svg>',
old:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6"/></svg>',
villa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18M4 20V10l8-6 8 6v10M10 20v-6h4v6M7 13h2M15 13h2"/></svg>',
family:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="2.5"/><circle cx="17" cy="9" r="2"/><path d="M4 20c0-3 2-5 5-5s5 2 5 5M14 20c0-2.5 1.5-4 3-4s3 1.5 3 4"/></svg>',
key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="10" r="4"/><path d="M11 12l9 0M17 12v3M20 12v2"/></svg>',
calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l9-9 9 0 0 9-9 9zM8 8h.01"/></svg>',
warm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9z"/></svg>',
smart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M11 18h2"/></svg>',
water:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c-4 5-7 8-7 12a7 7 0 0 0 14 0c0-4-3-7-7-12z"/></svg>',
bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
lamp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18h6M10 22h4M12 2v2M5 9H3M21 9h-2M6 16a6 6 0 0 1-1-10 6 6 0 0 1 10 0 6 6 0 0 1-1 10"/></svg>',
wind:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h13a3 3 0 1 0-3-3M3 14h17a3 3 0 1 1-3 3M3 18h9"/></svg>',
none:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>',
truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a8 8 0 0 1-12 7l-6 2 2-6a8 8 0 1 1 16-3z"/></svg>',
soon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
cal1:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01"/></svg>',
cal2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
geo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
cis:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
isr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l8 14H4zM12 21l-8-14h16"/></svg>',
globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 7"/></svg>',
spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>',
heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-8-5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-8 11-8 11z"/></svg>',
shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>'
};

/* Вектор-фолбэк, если фото недоступно */
const STYLE_ART = {
neoclassic:`<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="ncw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f0eae1"/><stop offset="1" stop-color="#ddd5c8"/></linearGradient></defs>
<rect width="200" height="140" fill="url(#ncw)"/>
<rect x="18" y="16" width="72" height="58" fill="none" stroke="#c4b8a4" stroke-width="2"/>
<rect x="26" y="24" width="56" height="42" fill="none" stroke="#c4b8a4" stroke-width="1"/>
<rect x="110" y="16" width="72" height="58" fill="none" stroke="#c4b8a4" stroke-width="2"/>
<rect x="118" y="24" width="56" height="42" fill="none" stroke="#c4b8a4" stroke-width="1"/>
<line x1="100" y1="0" x2="100" y2="26" stroke="#b3a68f" stroke-width="1.5"/>
<circle cx="100" cy="32" r="7" fill="none" stroke="#b3a68f" stroke-width="1.5"/>
<path d="M93 32h14M100 25v14" stroke="#b3a68f" stroke-width="1"/>
<rect x="0" y="104" width="200" height="36" fill="#cbb99b"/>
<path d="M0 104l20 12 20-12 20 12 20-12 20 12 20-12 20 12 20-12 20 12" fill="none" stroke="#b3a184" stroke-width="1"/>
<rect x="52" y="78" width="96" height="26" rx="6" fill="#e6ddcd" stroke="#c4b8a4"/>
<rect x="58" y="70" width="84" height="12" rx="5" fill="#efe7d9" stroke="#c4b8a4"/>
<rect x="60" y="84" width="24" height="12" rx="4" fill="#d9cbb4"/>
<rect x="116" y="84" width="24" height="12" rx="4" fill="#d9cbb4"/>
</svg>`,
minimal:`<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="mnw" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#efedea"/><stop offset="1" stop-color="#dedcd7"/></linearGradient></defs>
<rect width="200" height="140" fill="url(#mnw)"/>
<rect x="140" y="22" width="34" height="46" fill="none" stroke="#c8c5bf" stroke-width="2"/>
<line x1="0" y1="102" x2="200" y2="102" stroke="#c8c5bf" stroke-width="1.5"/>
<rect x="0" y="102" width="200" height="38" fill="#d6d3cd"/>
<rect x="34" y="76" width="86" height="22" rx="3" fill="#e8e6e1" stroke="#c8c5bf"/>
<rect x="30" y="66" width="10" height="32" rx="3" fill="#dfdcd6" stroke="#c8c5bf"/>
<circle cx="150" cy="88" r="10" fill="#e30613" opacity=".14"/>
<line x1="150" y1="98" x2="150" y2="102" stroke="#c8c5bf" stroke-width="1.5"/>
<rect x="52" y="30" width="40" height="26" fill="#e8e6e1" stroke="#c8c5bf"/>
</svg>`,
scandi:`<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="scw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4f0e8"/><stop offset="1" stop-color="#e2dccf"/></linearGradient></defs>
<rect width="200" height="140" fill="url(#scw)"/>
<rect x="0" y="98" width="200" height="42" fill="#d9c9ae"/>
<path d="M0 108h200M0 118h200M0 128h200" stroke="#c6b495" stroke-width="1"/>
<path d="M40 108v10M90 118v10M140 108v10M170 128v10" stroke="#c6b495" stroke-width="1"/>
<rect x="36" y="62" width="64" height="30" rx="8" fill="#efe9dd" stroke="#d3c8b4"/>
<rect x="42" y="54" width="52" height="12" rx="6" fill="#f6f1e6" stroke="#d3c8b4"/>
<path d="M44 92l-4 8M92 92l4 8" stroke="#b9a888" stroke-width="2"/>
<circle cx="140" cy="52" r="14" fill="#9aa88b" opacity=".8"/>
<circle cx="152" cy="62" r="10" fill="#8a987b" opacity=".8"/>
<path d="M146 76v22" stroke="#8a987b" stroke-width="2"/>
<rect x="138" y="96" width="18" height="10" rx="2" fill="#cbb391"/>
<line x1="70" y1="0" x2="70" y2="30" stroke="#d3c8b4" stroke-width="1.5"/>
<path d="M58 30h24l-4 10h-16z" fill="#f2ead9" stroke="#d3c8b4"/>
</svg>`,
loft:`<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern id="brk" width="24" height="12" patternUnits="userSpaceOnUse">
<rect width="24" height="12" fill="#9c4f42"/>
<rect x="0" y="0" width="11" height="5" fill="#a4544a"/><rect x="12" y="0" width="11" height="5" fill="#a4544a"/>
<rect x="6" y="6" width="11" height="5" fill="#a4544a"/><rect x="18" y="6" width="6" height="5" fill="#a4544a"/><rect x="0" y="6" width="4" height="5" fill="#a4544a"/>
</pattern>
<linearGradient id="lfc" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b9b6b0"/><stop offset="1" stop-color="#a5a29c"/></linearGradient>
</defs>
<rect width="200" height="140" fill="url(#brk)"/>
<rect width="200" height="20" fill="url(#lfc)"/>
<rect x="118" y="26" width="66" height="76" fill="#cfe3ea" stroke="#1c1c1c" stroke-width="3"/>
<path d="M151 26v76M118 64h66" stroke="#1c1c1c" stroke-width="2"/>
<rect x="0" y="102" width="200" height="38" fill="#8f8b84"/>
<rect x="24" y="72" width="76" height="26" rx="4" fill="#8a5a3b"/>
<rect x="28" y="64" width="68" height="12" rx="4" fill="#96684a"/>
<rect x="30" y="78" width="20" height="10" rx="3" fill="#7a4c30"/>
<rect x="74" y="78" width="20" height="10" rx="3" fill="#7a4c30"/>
<line x1="52" y1="20" x2="52" y2="44" stroke="#1c1c1c" stroke-width="1.5"/>
<circle cx="52" cy="50" r="6" fill="#ffd9a0" stroke="#1c1c1c"/>
<line x1="76" y1="20" x2="76" y2="36" stroke="#1c1c1c" stroke-width="1.5"/>
<circle cx="76" cy="42" r="6" fill="#ffd9a0" stroke="#1c1c1c"/>
<path d="M8 30h20M8 40h14" stroke="#1c1c1c" stroke-width="2"/>
</svg>`,
brutalism:`<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="brc" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#cfcdc9"/><stop offset="1" stop-color="#aeaca8"/></linearGradient></defs>
<rect width="200" height="140" fill="url(#brc)"/>
<g fill="#989692"><circle cx="30" cy="30" r="2.5"/><circle cx="80" cy="30" r="2.5"/><circle cx="130" cy="30" r="2.5"/><circle cx="30" cy="70" r="2.5"/><circle cx="80" cy="70" r="2.5"/><circle cx="130" cy="70" r="2.5"/></g>
<rect x="150" y="18" width="14" height="86" fill="#e8f2f7"/>
<polygon points="150,18 164,18 196,140 128,140" fill="#ffffff" opacity=".35"/>
<rect x="24" y="84" width="96" height="14" fill="#8f8d89"/>
<rect x="30" y="98" width="12" height="20" fill="#8f8d89"/>
<rect x="102" y="98" width="12" height="20" fill="#8f8d89"/>
<rect x="40" y="58" width="52" height="26" fill="#b98d5f"/>
<rect x="0" y="118" width="200" height="22" fill="#9c9a96"/>
<rect x="128" y="64" width="34" height="54" fill="#7e7c78"/>
</svg>`,
advise:`<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="adw" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e5e2dd"/><stop offset="1" stop-color="#d8d4cc"/></linearGradient></defs>
<rect width="200" height="140" fill="url(#adw)"/>
<circle cx="100" cy="70" r="35" fill="none" stroke="#e30613" stroke-width="1.5" stroke-dasharray="3 3" opacity=".4"/>
<text x="100" y="80" text-anchor="middle" font-family="Georgia" font-size="28" fill="#e30613" opacity=".6">?</text>
</svg>`
};

const state = {
screen: 0, answers: {}, discount: 0, maxDiscount: 0,
currency: 'USD', rate: CFG.FALLBACK_RATE, startTime: Date.now(),
source: getSource(),
device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
fileAttached: false
};

function loadState(){try{const s=localStorage.getItem('bmt_quiz_v3');if(s){const p=JSON.parse(s);Object.assign(state,p);state.startTime=Date.now()-(p.elapsed||0);}}catch(e){}}
function saveState(){try{state.elapsed=Date.now()-state.startTime;localStorage.setItem('bmt_quiz_v3',JSON.stringify(state));}catch(e){}}
function getSource(){const params=new URLSearchParams(location.search);const utm={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{if(params.get(k))utm[k]=params.get(k)});if(Object.keys(utm).length)return JSON.stringify(utm);if(document.referrer&&!document.referrer.includes(location.host))return document.referrer;return location.pathname;}
async function loadRate(){try{const res=await fetch(CFG.CURRENCY_API);const data=await res.json();if(data.rates&&data.rates.GEL)state.rate=data.rates.GEL;}catch(e){state.rate=CFG.FALLBACK_RATE;}}

function render(){
renderProgress();renderDiscount();
const quiz=document.getElementById('quiz');quiz.innerHTML='';
if(state.screen===0)renderStart(quiz);
else if(state.screen<=9)renderQuestion(quiz,state.screen-1);
else renderResult(quiz);
saveState();
}
function renderProgress(){const prog=document.getElementById('progress');prog.innerHTML='';for(let i=1;i<=9;i++){const d=document.createElement('div');d.className='progress-dot';if(i<state.screen)d.classList.add('done');else if(i===state.screen)d.classList.add('active');prog.appendChild(d);}}
function renderDiscount(){document.getElementById('discountValue').textContent=state.discount+'%';document.getElementById('discountFill').style.width=(state.discount*10)+'%';const r=document.getElementById('discountReplica');let t='';if(state.discount===3)t='Отлично, уже 3%';else if(state.discount===5)t='Половина пути пройдена';else if(state.discount===9)t='Один шаг до максимальной скидки';else if(state.discount===10)t='Максимальная скидка ваша';r.textContent=t;if(t)r.classList.add('show');else r.classList.remove('show');}

function renderStart(quiz){
quiz.innerHTML=`
<div class="screen active"><div class="start-hero">
<div class="start-title">Рассчитаем ваш ремонт<br>и подарим скидку <em>до 10%</em></div>
<div class="start-subtitle">С каждым ответом скидка растёт. Это займёт около минуты.</div>
<div class="start-features">
<div class="start-feature"><div class="start-feature-icon">${ICONS.spark}</div><div class="start-feature-text">9 коротких вопросов — <b>+9% к скидке</b></div></div>
<div class="start-feature"><div class="start-feature-icon">${ICONS.heart}</div><div class="start-feature-text">WhatsApp — <b>ещё +1%</b> и смета на почту</div></div>
<div class="start-feature"><div class="start-feature-icon">${ICONS.shield}</div><div class="start-feature-text">Скидка закреплена за вами на <b>${CFG.DISCOUNT_DAYS} дней</b></div></div>
</div>
<button class="btn btn-primary" onclick="nextScreen()">Рассчитать стоимость ${ICONS.arrow}</button>
</div></div>`;
}

function renderQuestion(quiz,idx){
const q=CFG.QUESTIONS[idx];
let html=`<div class="screen active"><div class="quiz-card">
<div class="quiz-card-label">Квиз · шаг ${idx+1} из 9</div>
<div class="question">${q.q}</div>`;
if(q.hint)html+=`<div class="subtitle">${q.hint}</div>`;
if(q.type==='radio'){
html+='<div class="options">';
q.options.forEach(opt=>{const sel=state.answers[q.id]===opt.v?'selected':'';const icon=ICONS[opt.icon]||ICONS.arrow;
html+=`<div class="option ${sel}" onclick="selectRadio('${q.id}','${opt.v}')"><div class="option-icon">${icon}</div><div class="option-text">${opt.t}${opt.s?`<small>${opt.s}</small>`:''}</div></div>`;});
html+='</div>';
if(q.id==='state'&&state.answers[q.id]==='villa'){html+='<div class="hint">Виллы считаем индивидуально. Оставьте контакт — обсудим детали.</div>';}
}
else if(q.type==='area'){
const area=state.answers[q.id+'_area']||'';const baths=state.answers[q.id+'_baths']||'1';
html+=`<div class="input-group"><label class="input-label">Площадь, м²</label>
<input type="number" class="input-field" value="${area}" oninput="updateArea(this.value)" placeholder="Например, 65"></div>
<div class="input-group"><label class="input-label">Санузлы</label><div class="radio-group">
<div class="radio-btn ${baths==='1'?'selected':''}" onclick="updateBaths('1')">Один</div>
<div class="radio-btn ${baths==='2'?'selected':''}" onclick="updateBaths('2')">Два</div>
<div class="radio-btn ${baths==='3+'?'selected':''}" onclick="updateBaths('3+')">Три и больше</div></div></div>
<div class="hint">Примерно подойдёт, уточним на замере.</div>`;
}
else if(q.type==='style'){
html+='<div class="style-grid">';
q.options.forEach(opt=>{const sel=state.answers[q.id]===opt.v?'selected':'';
html+=`<div class="style-card ${sel}" onclick="selectStyle('${opt.v}',${opt.level})">
<div class="style-photo">${STYLE_ART[opt.art]}<img src="${STYLE_PHOTOS[opt.art]}" alt="${opt.t}" loading="lazy" onerror="this.style.display='none'"></div>
<div class="style-info"><div class="style-name">${opt.t}</div>${opt.d?`<div class="style-desc">${opt.d}</div>`:''}</div></div>`;});
html+='</div>';
}
else if(q.type==='level'){
const rec=getLevelRecommendation();
if(rec>=0){html+=`<div class="level-recommend"><div class="level-recommend-icon">${ICONS.spark}</div><div>Вам может подойти <b>${CFG.LEVELS[rec]}</b>. Но выбор за вами — меняйте на любой.</div></div>`;}
html+='<div class="options">';
q.options.forEach(opt=>{const sel=state.answers[q.id]===opt.v?'selected':'';
html+=`<div class="option ${sel}" onclick="selectRadio('${q.id}',${opt.v})"><div class="option-icon">${ICONS.arrow}</div><div class="option-text">${opt.t}<small>${opt.d}</small></div></div>`;});
html+='</div>';
}
else if(q.type==='checkbox'){
html+='<div class="checkbox-grid">';
const selected=state.answers[q.id]||[];
q.options.forEach(opt=>{const sel=selected.includes(opt.v)?'selected':'';const icon=ICONS[opt.icon]||ICONS.check;
html+=`<div class="checkbox-item ${sel}" onclick="toggleCheckbox('${q.id}','${opt.v}')"><div class="check-icon">${selected.includes(opt.v)?ICONS.check:icon}</div><div>${opt.t}</div></div>`;});
html+='</div><div class="hint">Цену назовём после замера.</div>';
}
html+=`</div><div class="btn-row">
${state.screen>1?'<button class="btn btn-secondary" onclick="prevScreen()">Назад</button>':''}
<button class="btn btn-primary" onclick="nextScreen()" ${canProceed()?'':'disabled'}>Далее ${ICONS.arrow}</button></div></div>`;
quiz.innerHTML=html;
}

function renderResult(quiz){
if(state.answers.state==='villa'){renderVilla(quiz);return;}
const calc=calculate();
const oldTotal=calc.total;
const newTotal=calc.total*(1-state.discount/100);
const curr=state.currency==='USD'?'$':'₾';
const rate=state.currency==='USD'?1:state.rate;
const stateLabel=(state.answers.state==='secondary'||state.answers.state==='black')?'чёрный каркас':'белый каркас';
const levelLabel=CFG.LEVELS[state.answers.level];
const styleLabel=CFG.QUESTIONS[3].options.find(o=>o.v===state.answers.style)?.t||'';
let html=`<div class="screen active">
<div class="result-card">
<div class="result-summary">Ваш ремонт: <em>${state.answers.area_area||'?'} м²</em>, ${stateLabel}, ${levelLabel}${styleLabel?', '+styleLabel:''}</div>
<div class="result-row"><span class="label">Работы</span><span class="value">${formatPrice(calc.work*rate,curr)}</span></div>
<div class="result-row"><span class="label">Материалы (ориентир)</span><span class="value">${formatPrice(calc.materials*rate,curr)}</span></div>
<div class="result-row"><span class="label">Срок</span><span class="value">${calc.duration} мес</span></div>
<div class="result-total">
${state.discount>0?`<div class="result-old">${formatPrice(oldTotal*rate,curr)} <span class="result-old-label">Цена без скидки</span></div>`:''}
<div class="result-new">${formatPrice(newTotal*rate,curr)}</div>
${state.answers.state==='secondary'?'<div class="result-note">Демонтаж на вторичке: по факту после осмотра.</div>':''}
<div class="result-note">Предварительный расчёт. Точная смета — после замера. Допы считаются отдельно.</div>
</div></div>
<div class="currency-switch">
<button class="currency-btn ${state.currency==='USD'?'active':''}" onclick="setCurrency('USD')">$ USD</button>
<button class="currency-btn ${state.currency==='GEL'?'active':''}" onclick="setCurrency('GEL')">₾ GEL</button>
</div>
<div class="form-card">
<div class="form-title">${state.discount<10?'Осталась последняя ступень':'Максимальная скидка ваша'}</div>
<div class="form-subtitle">${state.discount<10?`Оставьте WhatsApp — и скидка станет 10%. Закрепим её за вами на ${CFG.DISCOUNT_DAYS} дней и пришлём смету по этапам с примерами работ в вашем стиле.`:`Скидка закреплена за вами на ${CFG.DISCOUNT_DAYS} дней. Оставьте контакт — пришлём смету по этапам с примерами работ в вашем стиле.`}</div>
<div class="input-group"><input type="text" class="input-field" id="userName" placeholder="Ваше имя"></div>
<div class="input-group"><input type="tel" class="input-field" id="userPhone" placeholder="WhatsApp, например +995..."></div>
<div class="input-group"><label class="file-input" id="fileLabel"><input type="file" id="fileInput" style="display:none" accept="image/*,.pdf" onchange="handleFile(this)">Прикрепить планировку (необязательно)</label></div>
<button class="btn btn-primary" onclick="submitLead()">${state.discount<10?'Получить скидку 10%':'Получить смету'} ${ICONS.arrow}</button>
</div>
${state.answers.country&&state.answers.country!=='georgia'?`
<div class="remote-block">
<div class="form-title">Вы будете видеть ход ремонта и принимать этапы ремонта в личном приложении</div>
<div class="form-subtitle">Фото и статусы — без поездок.</div>
</div>`:''}
<div class="btn-row"><button class="btn btn-secondary" onclick="prevScreen()">Назад</button></div>
</div>`;
quiz.innerHTML=html;
}

function renderVilla(quiz){
quiz.innerHTML=`<div class="screen active"><div class="form-card">
<div class="form-title">Дом или вилла — считаем индивидуально</div>
<div class="form-subtitle">Оставьте WhatsApp: обсудим объём, приедем на объект или созвонимся и подготовим смету под ваш проект. Скидка 10% действует и на виллы.</div>
<div class="input-group"><input type="text" class="input-field" id="userName" placeholder="Ваше имя"></div>
<div class="input-group"><input type="tel" class="input-field" id="userPhone" placeholder="WhatsApp, например +995..."></div>
<button class="btn btn-primary" onclick="submitLead()">Получить индивидуальный расчёт ${ICONS.arrow}</button>
</div></div>`;
}

function getLevelRecommendation(){const s=state.answers.style;if(s==='neoclassic')return 2;if(s==='minimal')return 1;if(s==='scandi')return 1;if(s==='loft')return 1;if(s==='brutalism')return 2;return -1;}
function canProceed(){const idx=state.screen-1;if(idx<0)return true;const q=CFG.QUESTIONS[idx];if(q.id==='area')return state.answers[q.id+'_area']>0;return !!state.answers[q.id];}
function selectRadio(id,val){state.answers[id]=val;if(id==='state'&&val==='villa'){setTimeout(()=>{state.screen=10;render();},400);return;}render();}
function selectStyle(val,level){state.answers.style=val;if(level>=0&&state.answers.level===undefined){state.answers.level=level;}render();}
function toggleCheckbox(id,val){if(!state.answers[id])state.answers[id]=[];const arr=state.answers[id];const idx=arr.indexOf(val);if(val==='none'){state.answers[id]=['none'];}else{if(idx>=0)arr.splice(idx,1);else{arr.push(val);const n=arr.indexOf('none');if(n>=0)arr.splice(n,1);}}render();}
function updateArea(val){state.answers.area_area=parseFloat(val)||0;saveState();const btn=document.querySelector('#quiz .btn-primary');if(btn)btn.disabled=!(state.answers.area_area>0);}
function updateBaths(val){const q=CFG.QUESTIONS[state.screen-1];state.answers[q.id+'_baths']=val;render();}
function setCurrency(c){state.currency=c;render();}
function handleFile(input){if(input.files.length){state.fileAttached=true;const l=document.getElementById('fileLabel');l.classList.add('has-file');l.innerHTML=`<input type="file" id="fileInput" style="display:none" accept="image/*,.pdf" onchange="handleFile(this)">✓ ${input.files[0].name}`;}}
function nextScreen(){if(!canProceed())return;if(state.screen<10){const prev=state.screen;state.screen++;if(prev>=1&&prev<=9&&state.discount<10){state.discount=Math.min(10,state.discount+1);state.maxDiscount=Math.max(state.maxDiscount,state.discount);showToast('+1% к скидке',`Ваша скидка теперь ${state.discount}%`);}render();}}
function prevScreen(){if(state.screen>0){state.screen--;render();}}
function showToast(text,sub){const t=document.getElementById('toast');t.innerHTML=text+(sub?`<small>${sub}</small>`:'');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);}
function calculate(){const area=state.answers.area_area||0;const sv=state.answers.state;const level=state.answers.level||0;const baths=parseInt(state.answers.area_baths)||1;let ft='white';if(sv==='black'||sv==='secondary')ft='black';const r=CFG.NEW_RATES[ft];const work=r.work[level]*area;const materials=r.materials[level]*area;const total=work+materials+(baths>1?(baths-1)*CFG.BATH_EXTRA:0);const duration=ft==='white'?1.8:2.7;return{work,materials,total,duration};}
function formatPrice(val,curr){const n=Math.round(val).toLocaleString('ru-RU');return curr==='$'?'$'+n:n+' '+curr;}
function getScore(){let s=0;const st=state.answers.start;if(st==='month')s+=3;else if(st==='1-3')s+=2;else if(st==='3-6')s+=1;if(state.answers.state)s+=1;if(state.fileAttached)s+=2;if(state.answers.materials==='full')s+=1;return s;}
function getScoreLabel(s){if(s>=6)return '🔥 Горячий';if(s>=3)return '🌡 Тёплый';return '❄️ Холодный';}

function submitLead(){
const name=document.getElementById('userName').value.trim();
const phone=document.getElementById('userPhone').value.trim();
if(!name||!phone){showToast('Заполните имя и WhatsApp');return;}
if(state.discount<10){state.discount=10;state.maxDiscount=10;}
const calc=calculate();const score=getScore();const elapsed=Math.round((Date.now()-state.startTime)/1000);
const data={name,phone,frame:state.answers.state,area:state.answers.area_area,baths:state.answers.area_baths,purpose:state.answers.purpose,style:state.answers.style,level:CFG.LEVELS[state.answers.level],extras:(state.answers.extras||[]).join(', '),materials:state.answers.materials,start:state.answers.start,country:state.answers.country,work:Math.round(calc.work),materials_cost:Math.round(calc.materials),total_before:Math.round(calc.total),discount:state.discount,total_after:Math.round(calc.total*(1-state.discount/100)),duration:calc.duration,source:state.source,elapsed,last_screen:state.screen,device:state.device,score,score_label:getScoreLabel(score)};
const msg=buildWhatsAppMessage(data);
window.open(`https://wa.me/${CFG.WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');
if(CFG.APPS_SCRIPT_URL){fetch(CFG.APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(e=>console.log('Apps Script error:',e));}
localStorage.removeItem('bmt_quiz_v3');
showToast('Спасибо, '+name,'Открываем WhatsApp…');
}

function buildWhatsAppMessage(d){
return `Новая заявка с квиза\n\nИсточник: ${d.source}\nВремя: ${new Date().toLocaleString('ru-RU')}\nПрохождение: ${d.elapsed} сек\nУстройство: ${d.device}\nПоследний экран: ${d.last_screen}\n\nКлиент: ${d.name}\nWhatsApp: ${d.phone}\n\nКвартира:\n• Каркас: ${d.frame}\n• Площадь: ${d.area} м²\n• Санузлы: ${d.baths}\n• Цель: ${d.purpose}\n• Стиль: ${d.style}\n• Уровень: ${d.level}\n• Допы: ${d.extras||'нет'}\n• Материалы: ${d.materials}\n• Старт: ${d.start}\n• Страна: ${d.country}\n\nРасчёт:\n• Работы: $${d.work}\n• Материалы: $${d.materials_cost}\n• Итого до скидки: $${d.total_before}\n• Скидка: ${d.discount}%\n• Итого со скидкой: $${d.total_after}\n• Срок: ${d.duration} мес\n\nСкоринг: ${d.score} — ${d.score_label}`;
}

window.addEventListener('beforeunload',()=>{if(state.screen>1&&state.screen<10&&CFG.APPS_SCRIPT_URL){navigator.sendBeacon(CFG.APPS_SCRIPT_URL,JSON.stringify({partial:true,screen:state.screen,answers:state.answers,discount:state.discount,source:state.source,elapsed:Math.round((Date.now()-state.startTime)/1000),device:state.device,timestamp:new Date().toISOString()}));}});

if(document.getElementById('quiz')){loadState();loadRate();render();}