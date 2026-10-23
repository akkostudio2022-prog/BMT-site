const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const css = src.slice(src.indexOf('<style>') + 7, src.indexOf('</style>'));
const js  = src.slice(src.lastIndexOf('<script>') + 8, src.lastIndexOf('</script>'));
const header = src.slice(src.indexOf('<header class="hdr">'), src.indexOf('</header>') + 9).trim();
const heroStart = src.indexOf('<section class="hero">');
const quizStart = src.indexOf('<section class="quiz-band"');
const toastStart = src.indexOf('<div class="toast"');
const hero = src.slice(heroStart, quizStart).trim();
const quiz = src.slice(quizStart, toastStart).trim();
const head = src.slice(0, src.indexOf('<style>')) + '<style>\n{{CSS}}\n</style>' + src.slice(src.indexOf('</style>') + 8, src.indexOf('<body>') + 6);

const app = js
  .replace("const v=document.getElementById('heroVideo');\n  const scene=document.getElementById('scene');",
           "const v=document.getElementById('heroVideo');\n  const scene=document.getElementById('scene');\n  if(!v||!scene)return;")
  .replace("const q=document.getElementById('qcQ');\n  const dots=",
           "const q=document.getElementById('qcQ');\n  if(!q)return;\n  const dots=")
  .replace("\nloadState();\nloadRate();\nrender();\n",
           "\nif(document.getElementById('quiz')){loadState();loadRate();render();}\n");

const footerCss = `\n/* футер */\n.ftr{background:#181818;color:rgba(255,255,255,.75);padding:22px 0}\n.ftr-in{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;font-size:13px}\n.ftr-contacts{display:flex;gap:16px}\n.ftr-contacts a{color:rgba(255,255,255,.85);text-decoration:none}\n.ftr-contacts a:hover{color:#fff;text-decoration:underline}\n`;

const footer = `<footer class="ftr">
  <div class="wrap ftr-in">
    <span>© 2026 BMT Remonti · Батуми, Грузия</span>
    <span class="ftr-contacts">
      <a href="tel:+995591935178">+995 591 935 178</a>
      <a href="https://t.me/bmtremonti" target="_blank">Telegram</a>
      <a href="https://wa.me/995591935178" target="_blank">WhatsApp</a>
    </span>
  </div>
</footer>
<div class="toast" id="toast"></div>`;

fs.mkdirSync(path.join(__dirname, 'parts', 'css'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'parts', 'js'), { recursive: true });
const W = (f, d) => fs.writeFileSync(path.join(__dirname, 'parts', f), d);
W('head.html', head);
W('header.html', header);
W('hero.html', hero);
W('quiz.html', quiz);
W('footer.html', footer);
W('css/style.css', css.trim() + footerCss);
W('js/app.js', app.trim());
console.log('OK: parts/ created');