const fs = require('fs'), path = require('path');
const R = f => fs.readFileSync(path.join(__dirname, 'parts', f), 'utf8');
const SECTIONS = ['header.html', 'hero.html', 'quiz.html', 'footer.html'];
let html = R('head.html').replace('{{CSS}}', R('css/style.css'));
for (const s of SECTIONS) html += '\n' + R(s);
html += '\n<script>\n' + R('js/app.js') + '\n</script>\n</body>\n</html>';
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('OK: index.html built');