/* ================================================================
   scenes/scene4/scene4.js
   
   Contact section — links, fallen ball.
   
   TO ADD/REMOVE LINKS: edit CONTACT_LINKS below only.
   ================================================================ */

import { onScroll, localProgress } from '../../JS/utils/scrollProgress.js';
import { remap } from '../../JS/utils/lerp.js';

/* ================================================================
   ✏️  EDIT THESE — your contact links
   ================================================================ */
const CONTACT_LINKS = [
  {
    label:    'Email',
    value:    'youremail@example.com',
    href:     'mailto:youremail@example.com',
    icon:     '✉',
    color:    'var(--neon-cyan)',
  },
  {
    label:    'GitHub',
    value:    'github.com/EasternNova',
    href:     'https://github.com/EasternNova',
    icon:     '◈',
    color:    'var(--neon-purple)',
  },
  {
    label:    'LinkedIn',
    value:    'linkedin.com/in/...',
    href:     'https://linkedin.com',
    icon:     '◉',
    color:    'var(--neon-cyan)',
  },
  {
    label:    'LeetCode',
    value:    'leetcode.com/u/...',
    href:     'https://leetcode.com',
    icon:     '◇',
    color:    'var(--neon-amber)',
  },
  {
    label:    'HackerRank',
    value:    'hackerrank.com/...',
    href:     'https://hackerrank.com',
    icon:     '◈',
    color:    'var(--neon-green)',
  },
  {
    label:    'Instagram',
    value:    '@EasternNova',
    href:     'https://instagram.com',
    icon:     '◎',
    color:    'var(--neon-pink)',
  },
];

/* ── DOM refs ─────────────────────────────────────────────────── */
const scene4El      = document.getElementById('scene4');
const contactLinks  = document.getElementById('contact-links');
const scene4Ball    = document.getElementById('scene4-ball');

/* ================================================================
   INIT
   ================================================================ */
export function initScene4(range) {
  buildContactLinks();

  if (scene4El) scene4El.style.opacity = '0';

  onScroll(({ progress }) => {
    const local = localProgress(progress, range.start, range.end);
    updateScene4(local);
  });
}

/* ── Build contact links grid ─────────────────────────────────── */
function buildContactLinks() {
  if (!contactLinks) return;
  contactLinks.innerHTML = '';

  CONTACT_LINKS.forEach((link, i) => {
    const item = document.createElement('a');
    item.href      = link.href;
    item.target    = '_blank';
    item.rel       = 'noopener noreferrer';
    item.className = 'contact-item stagger-reveal';
    item.style.setProperty('--delay', `${i * 0.08}s`);
    item.style.setProperty('--accent', link.color);

    item.innerHTML = `
      <span class="contact-icon" style="color:${link.color}">${link.icon}</span>
      <div class="contact-text">
        <span class="contact-label">${link.label}</span>
        <span class="contact-value">${link.value}</span>
      </div>
      <span class="contact-arrow">↗</span>
    `;
    contactLinks.appendChild(item);
  });
}

/* ── Scene update ─────────────────────────────────────────────── */
function updateScene4(local) {
  if (!scene4El) return;

  // Fade in
  const opacity = local < 0.1
    ? remap(local, 0, 0.1, 0, 1)
    : 1;
  scene4El.style.opacity = String(opacity);

  if (scene4Ball) {
    scene4Ball.style.opacity = '0';
    scene4Ball.hidden = true;
  }
}
