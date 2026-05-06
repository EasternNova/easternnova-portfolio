/* ================================================================
   scenes/scene3/scene3.js
   
   Skills + Projects panel (left) + Avatar Video 2 (right).
   
   TO ADD SKILLS:  edit SKILLS_DATA array below.
   TO ADD PROJECTS: edit PROJECTS_DATA array below.
   No other file needs touching.
   ================================================================ */

import { onScroll, localProgress } from '../../JS/utils/scrollProgress.js';
import { remap, easeOut }          from '../../JS/utils/lerp.js';

/* ================================================================
   ✏️  EDIT THESE — your skills and projects
   ================================================================ */
const SKILLS_DATA = [
  { name: 'Python',       level: 70,  color: 'var(--neon-cyan)' },
  { name: 'JavaScript',   level: 60,  color: 'var(--neon-purple)' },
  { name: 'HTML / CSS',   level: 80,  color: 'var(--neon-pink)' },
  { name: 'React',        level: 40,  color: 'var(--neon-amber)' },
  { name: 'Java',         level: 50,  color: 'var(--neon-green)' },
  { name: 'C / C++',      level: 35,  color: 'var(--neon-cyan)' },
  { name: 'Git',          level: 65,  color: 'var(--neon-purple)' },
  { name: 'SQL',          level: 45,  color: 'var(--neon-pink)' },
];

const PROJECTS_DATA = [
  {
    name:  'This Portfolio',
    desc:  'Scroll-driven cinematic portfolio with canvas animations.',
    tags:  ['Vite', 'JS', 'CSS', 'Canvas'],
    url:   '#',
    color: 'var(--neon-cyan)',
  },
  // ← ADD MORE PROJECTS HERE as you build them
  // {
  //   name: 'Your Next Project',
  //   desc: 'Short description.',
  //   tags: ['React', 'Node'],
  //   url:  'https://github.com/...',
  //   color: 'var(--neon-purple)',
  // },
];

/* ── DOM refs ─────────────────────────────────────────────────── */
const skillsPanel   = document.getElementById('skills-panel');
const skillCards    = document.getElementById('skill-cards');
const projectCards  = document.getElementById('project-cards');
const avatarVideo   = document.getElementById('avatar-skills-video');
const scene3El      = document.getElementById('scene3');

/* ================================================================
   INIT
   ================================================================ */
export function initScene3(range) {
  buildSkillCards();
  buildProjectCards();

  // Play avatar video 2 when scene is visible
  if (avatarVideo) {
    avatarVideo.load();
  }

  // Hide scene initially
  if (scene3El) scene3El.style.opacity = '0';

  onScroll(({ progress }) => {
    const local = localProgress(progress, range.start, range.end);
    updateScene3(local);
  });
}

/* ── Build skill bars ─────────────────────────────────────────── */
function buildSkillCards() {
  if (!skillCards) return;
  skillCards.innerHTML = '';

  const heading = document.createElement('h3');
  heading.className = 'section-label';
  heading.textContent = 'skills';
  skillCards.appendChild(heading);

  SKILLS_DATA.forEach((skill, i) => {
    const card = document.createElement('div');
    card.className  = 'skill-row stagger-reveal';
    card.style.setProperty('--delay', `${i * 0.06}s`);

    card.innerHTML = `
      <span class="skill-name">${skill.name}</span>
      <div class="skill-bar-track">
        <div class="skill-bar-fill"
             style="--target-width:${skill.level}%; --bar-color:${skill.color}">
        </div>
      </div>
      <span class="skill-pct">${skill.level}%</span>
    `;
    skillCards.appendChild(card);
  });
}

/* ── Build project cards ──────────────────────────────────────── */
function buildProjectCards() {
  if (!projectCards) return;
  projectCards.innerHTML = '';

  const heading = document.createElement('h3');
  heading.className = 'section-label';
  heading.style.marginTop = '2.5rem';
  heading.textContent = 'projects';
  projectCards.appendChild(heading);

  PROJECTS_DATA.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'project-card stagger-reveal';
    card.style.setProperty('--delay', `${i * 0.1 + 0.3}s`);
    card.style.setProperty('--accent', proj.color);

    const tags = proj.tags
      .map(t => `<span class="tag">${t}</span>`)
      .join('');

    card.innerHTML = `
      <div class="project-accent-bar"></div>
      <div class="project-body">
        <h4 class="project-name">${proj.name}</h4>
        <p class="project-desc">${proj.desc}</p>
        <div class="project-tags">${tags}</div>
        ${proj.url && proj.url !== '#'
          ? `<a class="project-link" href="${proj.url}" target="_blank" rel="noopener">
               view project ↗
             </a>`
          : ''
        }
      </div>
    `;
    projectCards.appendChild(card);
  });
}

/* ── Scene update ─────────────────────────────────────────────── */
function updateScene3(local) {
  if (!scene3El) return;

  // Fade scene in at start, out at end
  let opacity;
  if (local < 0.08) {
    opacity = remap(local, 0, 0.08, 0, 1);
  } else if (local > 0.88) {
    opacity = remap(local, 0.88, 1.0, 1, 0);
  } else {
    opacity = 1;
  }
  scene3El.style.opacity = String(opacity);

  // Avatar video: play when scene starts, pause when fully gone
  if (avatarVideo) {
    if (local > 0.05 && local < 0.95) {
      if (avatarVideo.paused) avatarVideo.play().catch(() => {});
    } else {
      if (!avatarVideo.paused) avatarVideo.pause();
    }

    // Scale up avatar as scene progresses
    const scale = remap(local, 0, 0.3, 0.82, 1.0);
    avatarVideo.style.setProperty('--avatar3-scale', String(scale));
  }

  // Slide panel in from left
  if (skillsPanel) {
    const slideX = remap(local, 0, 0.12, -40, 0);
    skillsPanel.style.transform = `translateX(${slideX}px)`;
  }
}
