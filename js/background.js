(function () {

  const codeBg = document.getElementById('codeBg');
  if (!codeBg) return;

  const snippets = [
    'const build = () => elevate();',
    'import { create } from "EasternNova"',
    'git commit -m "✨ new feature"',
    'npm run dev',
    'export default EasternNova;',
    'const [isDark, setDark] = useState(true)',
    'border-radius: 9999px;',
    'flex-direction: column;',
    '.then(result => ship(result))',
    'z-index: Infinity',
    'background: #080b14;',
    'transform: translateY(-2px)',
    'async function launch() {}',
  ];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'code-line-bg';

    const x = Math.random() * 100;
    const y = Math.random() * 120;
    const dur = 25 + Math.random() * 20;

    el.textContent = snippets[Math.floor(Math.random() * snippets.length)];

    el.style.cssText = `
      left:${x}%;
      top:${y}%;
      animation-duration:${dur}s;
      animation-delay:-${Math.random() * dur}s;
    `;

    codeBg.appendChild(el);
  }

})();