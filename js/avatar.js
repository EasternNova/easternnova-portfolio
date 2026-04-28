// ============================================
// AVATAR.JS — EasternNova Custom Avatar
// Based on real reference photos
// ============================================

(function () {

  const canvas = document.getElementById('avatarCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = 288, H = 288;
  const cx = W / 2, cy = H / 2;
  let t = 0;

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 144, 0, Math.PI * 2);
    ctx.clip();

    // ── BACKGROUND: deep purple room ──
    const bg = ctx.createRadialGradient(cx - 40, cy - 20, 10, cx, cy, 180);
    bg.addColorStop(0, '#1a0835');
    bg.addColorStop(0.5, '#110625');
    bg.addColorStop(1, '#060310');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── CODE EDITOR GLOW (left background) ──
    const editorGlow = ctx.createRadialGradient(30, cy, 5, 30, cy, 90);
    editorGlow.addColorStop(0, 'rgba(56,189,248,0.12)');
    editorGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = editorGlow;
    ctx.fillRect(0, 0, W, H);

    // Editor screen (left side, behind figure)
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#0d1117';
    ctx.beginPath();
    ctx.roundRect(8, 55, 90, 130, 6);
    ctx.fill();
    // Code lines on screen
    const codeLines = [
      { y: 72,  w: 55, c: '#c084fc' },
      { y: 83,  w: 70, c: '#86efac' },
      { y: 94,  w: 45, c: '#93c5fd' },
      { y: 105, w: 60, c: '#86efac' },
      { y: 116, w: 38, c: '#c084fc' },
      { y: 127, w: 65, c: '#fde68a' },
      { y: 138, w: 50, c: '#93c5fd' },
      { y: 149, w: 42, c: '#86efac' },
      { y: 160, w: 58, c: '#c084fc' },
    ];
    codeLines.forEach(line => {
      ctx.fillStyle = line.c;
      ctx.beginPath();
      ctx.roundRect(14, line.y, line.w, 4, 2);
      ctx.fill();
    });
    ctx.restore();

    // ── FAIRY LIGHTS (top background) ──
    ctx.save();
    ctx.globalAlpha = 0.7;
    const lightPositions = [20, 55, 90, 125, 160, 195, 230, 265];
    lightPositions.forEach((x, i) => {
      const flicker = 0.5 + 0.5 * Math.sin(time * 0.002 + i * 0.8);
      const y = 22 + 6 * Math.sin(i * 0.9);
      // string
      if (i < lightPositions.length - 1) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(lightPositions[i+1], 22 + 6 * Math.sin((i+1)*0.9));
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      // bulb glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 8);
      glow.addColorStop(0, `rgba(232,121,249,${0.6 * flicker})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI*2); ctx.fill();
      // bulb core
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,220,255,${flicker})`;
      ctx.fill();
    });
    ctx.restore();

    // ── NEON </> SIGN (right background) ──
    ctx.save();
    const neonPulse = 0.7 + 0.3 * Math.sin(time * 0.003);
    ctx.shadowColor = 'rgba(168,85,247,0.9)';
    ctx.shadowBlur = 12 * neonPulse;
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = `rgba(216,180,254,${neonPulse})`;
    ctx.fillText('</>', 220, 105);
    ctx.shadowBlur = 0;
    ctx.restore();

    // ── STICKY NOTE (right, top) ──
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.roundRect(218, 30, 58, 52, 3);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.font = '5.5px sans-serif';
    ctx.fillText('Focus', 226, 44);
    ctx.fillText('Build', 226, 54);
    ctx.fillText('Repeat', 226, 64);
    ctx.globalAlpha = 1;
    ctx.restore();

    // ── PURPLE AMBIENT GLOW (center-right, where face will be) ──
    const faceGlow = ctx.createRadialGradient(cx + 20, cy - 10, 10, cx + 20, cy, 110);
    faceGlow.addColorStop(0, 'rgba(168,85,247,0.08)');
    faceGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = faceGlow;
    ctx.fillRect(0, 0, W, H);

    // ── STARS / DUST ──
    const stars = [
      [200,15],[240,28],[260,50],[270,80],
      [15,30],[10,80],[18,130]
    ];
    stars.forEach(([x,y],i) => {
      const a = 0.2 + 0.3 * Math.sin(time*0.001 + i*1.3);
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    });

    // ══════════════════════════════════════
    // ── FIGURE: kurta body ──
    // ══════════════════════════════════════

    // Kurta — lavender/purple (signature look)
    ctx.save();
    // Main body shape
    ctx.beginPath();
    ctx.moveTo(cx - 80, H + 10);
    ctx.bezierCurveTo(cx - 78, 200, cx - 55, 175, cx - 20, 168);
    ctx.bezierCurveTo(cx - 5, 165, cx + 5, 164, cx + 20, 165);
    ctx.bezierCurveTo(cx + 55, 170, cx + 72, 195, cx + 78, H + 10);
    ctx.closePath();
    ctx.fillStyle = '#c4b5fd';
    ctx.fill();

    // Kurta shading/depth
    const kurtaShade = ctx.createLinearGradient(cx-80, 170, cx+80, 250);
    kurtaShade.addColorStop(0, 'rgba(109,40,217,0.35)');
    kurtaShade.addColorStop(0.5, 'rgba(139,92,246,0.1)');
    kurtaShade.addColorStop(1, 'rgba(88,28,135,0.4)');
    ctx.fillStyle = kurtaShade;
    ctx.beginPath();
    ctx.moveTo(cx - 80, H + 10);
    ctx.bezierCurveTo(cx - 78, 200, cx - 55, 175, cx - 20, 168);
    ctx.bezierCurveTo(cx - 5, 165, cx + 5, 164, cx + 20, 165);
    ctx.bezierCurveTo(cx + 55, 170, cx + 72, 195, cx + 78, H + 10);
    ctx.closePath();
    ctx.fill();

    // Embroidery details on kurta (small floral pattern)
    ctx.globalAlpha = 0.6;
    const embroiderySpots = [
      [cx-18, 185], [cx, 190], [cx+18, 185],
      [cx-10, 205], [cx+10, 205]
    ];
    embroiderySpots.forEach(([ex, ey]) => {
      // small flower
      ctx.fillStyle = '#f9a8d4';
      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(ex + Math.cos(angle)*3, ey + Math.sin(angle)*3, 1.5, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath(); ctx.arc(ex, ey, 1.5, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Kurta neckline
    ctx.beginPath();
    ctx.moveTo(cx - 22, 168);
    ctx.bezierCurveTo(cx - 10, 175, cx + 10, 175, cx + 22, 168);
    ctx.strokeStyle = 'rgba(139,92,246,0.5)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // ── RIGHT ARM + HAND UNDER CHIN ──
    ctx.save();
    // Arm coming up
    ctx.beginPath();
    ctx.moveTo(cx + 45, H);
    ctx.bezierCurveTo(cx + 50, 230, cx + 55, 200, cx + 52, 175);
    ctx.bezierCurveTo(cx + 50, 155, cx + 42, 148, cx + 35, 140);
    ctx.bezierCurveTo(cx + 28, 133, cx + 20, 130, cx + 15, 132);
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#c8956b';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Hand (fist resting under chin)
    ctx.beginPath();
    ctx.ellipse(cx + 8, 135, 12, 9, -0.3, 0, Math.PI*2);
    ctx.fillStyle = '#c8956b';
    ctx.fill();
    // Knuckle details
    ctx.strokeStyle = 'rgba(180,110,60,0.3)';
    ctx.lineWidth = 0.8;
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.arc(cx + 2 + k*4, 133, 1.5, 0, Math.PI*2);
      ctx.stroke();
    }

    // Silver bracelet
    ctx.beginPath();
    ctx.ellipse(cx + 30, 143, 9, 5, -0.5, 0, Math.PI*2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // ── NECK ──
    ctx.beginPath();
    ctx.ellipse(cx - 2, 152, 15, 20, 0.05, 0, Math.PI*2);
    ctx.fillStyle = '#c8956b';
    ctx.fill();
    // neck shadow
    const neckShade = ctx.createLinearGradient(cx-17, 145, cx+13, 145);
    neckShade.addColorStop(0, 'rgba(150,80,30,0.3)');
    neckShade.addColorStop(0.5, 'transparent');
    neckShade.addColorStop(1, 'rgba(150,80,30,0.2)');
    ctx.fillStyle = neckShade;
    ctx.beginPath();
    ctx.ellipse(cx - 2, 152, 15, 20, 0.05, 0, Math.PI*2);
    ctx.fill();

    // ══════════════════════════════════════
    // ── HAIR (drawn before face, behind) ──
    // ══════════════════════════════════════
    ctx.save();

    // Hair color: very dark brown, almost black
    const hairDark = '#1a0d05';
    const hairMid = '#2d1508';
    const hairLight = '#3d1f0a';

    // Back hair mass (left side, longer)
    ctx.beginPath();
    ctx.moveTo(cx - 48, 72);
    ctx.bezierCurveTo(cx - 72, 45, cx - 90, 10, cx - 60, -5);
    ctx.bezierCurveTo(cx - 35, -15, cx - 10, 0, cx - 5, 62);
    ctx.fillStyle = hairDark;
    ctx.fill();

    // Right side back hair
    ctx.beginPath();
    ctx.moveTo(cx + 42, 72);
    ctx.bezierCurveTo(cx + 60, 48, cx + 65, 20, cx + 48, 5);
    ctx.bezierCurveTo(cx + 30, -8, cx + 8, 0, cx + 5, 65);
    ctx.fillStyle = hairDark;
    ctx.fill();

    // Long flowing left strand — goes to bottom-left
    ctx.beginPath();
    ctx.moveTo(cx - 45, 74);
    ctx.bezierCurveTo(cx - 72, 110, cx - 90, 155, cx - 85, 210);
    ctx.bezierCurveTo(cx - 80, 240, cx - 58, 250, cx - 52, 228);
    ctx.bezierCurveTo(cx - 68, 180, cx - 58, 135, cx - 38, 100);
    ctx.bezierCurveTo(cx - 30, 88, cx - 25, 80, cx - 30, 72);
    ctx.closePath();
    ctx.fillStyle = hairMid;
    ctx.fill();

    // Long strand flowing right side
    ctx.beginPath();
    ctx.moveTo(cx + 40, 72);
    ctx.bezierCurveTo(cx + 62, 105, cx + 70, 148, cx + 65, 195);
    ctx.bezierCurveTo(cx + 60, 220, cx + 45, 230, cx + 40, 215);
    ctx.bezierCurveTo(cx + 55, 175, cx + 48, 130, cx + 32, 98);
    ctx.closePath();
    ctx.fillStyle = hairMid;
    ctx.fill();

    // Wavy strand over shoulder (left, characteristic volume)
    ctx.beginPath();
    ctx.moveTo(cx - 38, 95);
    ctx.bezierCurveTo(cx - 55, 115, cx - 60, 140, cx - 52, 165);
    ctx.bezierCurveTo(cx - 48, 180, cx - 38, 185, cx - 35, 175);
    ctx.bezierCurveTo(cx - 42, 155, cx - 40, 130, cx - 28, 108);
    ctx.closePath();
    ctx.fillStyle = hairLight;
    ctx.fill();

    // Top hair — covers head, with slight center-left part
    ctx.beginPath();
    ctx.moveTo(cx - 50, 80);
    ctx.bezierCurveTo(cx - 55, 50, cx - 40, 20, cx - 10, 15);
    ctx.bezierCurveTo(cx + 5, 12, cx + 20, 15, cx + 35, 25);
    ctx.bezierCurveTo(cx + 50, 38, cx + 52, 60, cx + 48, 80);
    ctx.bezierCurveTo(cx + 30, 68, cx + 10, 62, cx - 5, 63);
    ctx.bezierCurveTo(cx - 22, 64, cx - 38, 70, cx - 50, 80);
    ctx.closePath();
    ctx.fillStyle = hairDark;
    ctx.fill();

    // Hair part line (slightly off-center, left)
    ctx.beginPath();
    ctx.moveTo(cx - 8, 18);
    ctx.bezierCurveTo(cx - 10, 35, cx - 8, 50, cx - 5, 63);
    ctx.strokeStyle = 'rgba(40,15,5,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hair shine streaks
    const shineLines = [
      { x1: cx-30, y1: 25, x2: cx-10, y2: 60 },
      { x1: cx+10, y1: 22, x2: cx+28, y2: 55 },
    ];
    shineLines.forEach(l => {
      const grad = ctx.createLinearGradient(l.x1, l.y1, l.x2, l.y2);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, 'rgba(180,110,60,0.18)');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Wispy flyaway strands
    ctx.strokeStyle = 'rgba(50,20,5,0.6)';
    ctx.lineWidth = 1;
    [[cx-20, 20, cx-35, 35], [cx+15, 18, cx+30, 32]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1-5, y1+8, x2-3, y2-5, x2, y2);
      ctx.stroke();
    });

    ctx.restore();

    // ══════════════════════════════════════
    // ── FACE ──
    // ══════════════════════════════════════

    // Face base — warm medium-brown, slightly round
    ctx.beginPath();
    ctx.ellipse(cx - 4, 105, 44, 50, 0.04, 0, Math.PI * 2);
    ctx.fillStyle = '#d4956a';
    ctx.fill();

    // Face warm glow from screen light (left side cooler, right warmer)
    const faceLit = ctx.createRadialGradient(cx + 15, 88, 5, cx, 105, 50);
    faceLit.addColorStop(0, 'rgba(255,195,130,0.22)');
    faceLit.addColorStop(0.6, 'transparent');
    faceLit.addColorStop(1, 'rgba(90,40,10,0.18)');
    ctx.fillStyle = faceLit;
    ctx.beginPath();
    ctx.ellipse(cx - 4, 105, 44, 50, 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Subtle screen-light tint on left cheek
    const screenTint = ctx.createRadialGradient(cx - 35, 100, 0, cx - 20, 105, 28);
    screenTint.addColorStop(0, 'rgba(147,197,253,0.08)');
    screenTint.addColorStop(1, 'transparent');
    ctx.fillStyle = screenTint;
    ctx.beginPath();
    ctx.ellipse(cx - 4, 105, 44, 50, 0.04, 0, Math.PI * 2);
    ctx.fill();

    // ── EYEBROWS — natural, slightly thick ──
    [[cx - 16, 86, -0.12], [cx + 18, 85, 0.1]].forEach(([bx, by, tilt]) => {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(tilt);
      // thick brow
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.bezierCurveTo(-6, -4, 4, -4, 12, -1);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2d1206';
      ctx.lineCap = 'round';
      ctx.stroke();
      // brow fill for thickness
      ctx.beginPath();
      ctx.moveTo(-12, 1);
      ctx.bezierCurveTo(-6, -2, 4, -2.5, 12, 0.5);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(45,18,6,0.5)';
      ctx.stroke();
      ctx.restore();
    });

    // ── EYES — dark brown, expressive ──
    [[cx - 16, 100], [cx + 18, 99]].forEach(([ex, ey], idx) => {
      // Eye white
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(ex, ey, 9, 6.5, idx === 0 ? 0.05 : -0.05, 0, Math.PI * 2);
      ctx.fillStyle = '#f5ede4';
      ctx.fill();

      // Iris — dark brown
      ctx.beginPath();
      ctx.ellipse(ex, ey, 6, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2d1206';
      ctx.fill();

      // Iris color depth
      ctx.beginPath();
      ctx.ellipse(ex, ey, 5, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#3d1a08';
      ctx.fill();

      // Pupil
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0d0604';
      ctx.fill();

      // Main light reflection
      ctx.beginPath();
      ctx.arc(ex + 2.5, ey - 2.5, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fill();

      // Secondary small reflection
      ctx.beginPath();
      ctx.arc(ex - 1.5, ey + 1.5, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();

      // Eyelid crease
      ctx.beginPath();
      ctx.moveTo(ex - 9, ey - 2);
      ctx.bezierCurveTo(ex - 4, ey - 7, ex + 4, ey - 7, ex + 9, ey - 3);
      ctx.strokeStyle = 'rgba(100,40,10,0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Lower lash line
      ctx.beginPath();
      ctx.moveTo(ex - 7, ey + 4);
      ctx.bezierCurveTo(ex - 2, ey + 5.5, ex + 3, ey + 5.5, ex + 7, ey + 4);
      ctx.strokeStyle = 'rgba(60,20,5,0.3)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.restore();
    });

    // ── NOSE — soft, rounded ──
    ctx.beginPath();
    ctx.moveTo(cx - 2, 116);
    ctx.bezierCurveTo(cx - 8, 124, cx - 10, 130, cx - 7, 133);
    ctx.bezierCurveTo(cx - 4, 136, cx - 1, 137, cx + 3, 136);
    ctx.bezierCurveTo(cx + 7, 135, cx + 9, 132, cx + 6, 129);
    ctx.strokeStyle = 'rgba(160,80,30,0.4)';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Nose tip hint
    const noseTip = ctx.createRadialGradient(cx, 133, 0, cx, 133, 7);
    noseTip.addColorStop(0, 'rgba(180,100,50,0.15)');
    noseTip.addColorStop(1, 'transparent');
    ctx.fillStyle = noseTip;
    ctx.beginPath(); ctx.arc(cx, 133, 7, 0, Math.PI*2); ctx.fill();

    // Nose stud (she has one!) — tiny sparkle
    ctx.beginPath();
    ctx.arc(cx - 9, 128, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220,220,220,0.9)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 9, 128, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fill();

    // ── LIPS — full, natural rosy ──
    // Upper lip
    ctx.beginPath();
    ctx.moveTo(cx - 14, 142);
    ctx.bezierCurveTo(cx - 10, 138, cx - 4, 137, cx, 138);
    ctx.bezierCurveTo(cx + 4, 137, cx + 10, 138, cx + 14, 142);
    ctx.bezierCurveTo(cx + 8, 144, cx + 3, 145, cx, 145);
    ctx.bezierCurveTo(cx - 3, 145, cx - 8, 144, cx - 14, 142);
    ctx.closePath();
    ctx.fillStyle = '#c0705a';
    ctx.fill();

    // Lower lip — fuller
    ctx.beginPath();
    ctx.moveTo(cx - 14, 142);
    ctx.bezierCurveTo(cx - 10, 148, cx - 4, 152, cx, 152);
    ctx.bezierCurveTo(cx + 4, 152, cx + 10, 148, cx + 14, 142);
    ctx.bezierCurveTo(cx + 8, 144, cx, 145, cx - 14, 142);
    ctx.closePath();
    ctx.fillStyle = '#c47060';
    ctx.fill();

    // Lip shine
    const lipShine = ctx.createLinearGradient(cx - 8, 146, cx + 8, 150);
    lipShine.addColorStop(0, 'rgba(255,200,180,0.25)');
    lipShine.addColorStop(1, 'transparent');
    ctx.fillStyle = lipShine;
    ctx.beginPath();
    ctx.ellipse(cx, 148, 9, 3, 0, 0, Math.PI*2);
    ctx.fill();

    // Lip line between
    ctx.beginPath();
    ctx.moveTo(cx - 13, 142.5);
    ctx.bezierCurveTo(cx - 5, 143.5, cx + 5, 143.5, cx + 13, 142.5);
    ctx.strokeStyle = 'rgba(150,60,40,0.5)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Smile (soft, characteristic)
    ctx.beginPath();
    ctx.moveTo(cx - 12, 142);
    ctx.bezierCurveTo(cx - 10, 145, cx - 2, 147, cx, 147);
    ctx.strokeStyle = 'rgba(140,60,40,0)';
    ctx.lineWidth = 0;
    ctx.stroke();

    // ── BLUSH — round cheeks ──
    [[cx - 32, 116], [cx + 28, 115]].forEach(([bx, by]) => {
      const blush = ctx.createRadialGradient(bx, by, 0, bx, by, 16);
      blush.addColorStop(0, 'rgba(240,120,100,0.28)');
      blush.addColorStop(0.6, 'rgba(240,120,100,0.1)');
      blush.addColorStop(1, 'transparent');
      ctx.fillStyle = blush;
      ctx.beginPath();
      ctx.ellipse(bx, by, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── EAR (right side visible slightly) ──
    ctx.beginPath();
    ctx.ellipse(cx + 47, 108, 7, 10, 0.2, 0, Math.PI*2);
    ctx.fillStyle = '#c8906a';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 47, 108, 4, 7, 0.2, 0, Math.PI*2);
    ctx.fillStyle = '#bc8060';
    ctx.fill();

    // Small stud earring
    ctx.beginPath();
    ctx.arc(cx + 48, 103, 1.8, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(220,180,255,0.9)';
    ctx.fill();

    // ── HAIR OVER FACE (front strands) ──
    ctx.save();
    // A few wisps that fall on forehead/side
    ctx.strokeStyle = '#1a0d05';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const frontStrands = [
      { pts: [[cx-8,18],[cx-12,30],[cx-10,45],[cx-14,60]] },
      { pts: [[cx+5,17],[cx+2,32],[cx+6,48]] },
    ];
    frontStrands.forEach(strand => {
      ctx.beginPath();
      ctx.moveTo(strand.pts[0][0], strand.pts[0][1]);
      for (let i = 1; i < strand.pts.length; i++) {
        ctx.lineTo(strand.pts[i][0], strand.pts[i][1]);
      }
      ctx.globalAlpha = 0.5;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    // ══════════════════════════════════════
    // ── PURPLE NEON RIM GLOW ──
    // ══════════════════════════════════════
    const rimGrad = ctx.createRadialGradient(cx, H, 0, cx, cy, 144);
    rimGrad.addColorStop(0.8, 'transparent');
    rimGrad.addColorStop(1, 'rgba(168,85,247,0.25)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, W, H);

    // Bottom glow pool
    const poolGrad = ctx.createLinearGradient(0, 210, 0, H);
    poolGrad.addColorStop(0, 'transparent');
    poolGrad.addColorStop(1, 'rgba(124,58,237,0.3)');
    ctx.fillStyle = poolGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.restore(); // end circle clip

    t += 16;
    requestAnimationFrame(() => draw(t));
  }

  draw(0);

})();