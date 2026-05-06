const STAR_COUNT = 180;
const NEBULA_COLOR = 'rgba(191, 0, 255, 0.03)';

export function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let width;
  let height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.05,
      opacity: Math.random() * 0.7 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(
      width * 0.3, height * 0.4, 0,
      width * 0.3, height * 0.4, width * 0.6
    );
    grad.addColorStop(0, NEBULA_COLOR);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const grad2 = ctx.createRadialGradient(
      width * 0.7, height * 0.6, 0,
      width * 0.7, height * 0.6, width * 0.4
    );
    grad2.addColorStop(0, 'rgba(0, 245, 255, 0.02)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    for (const star of stars) {
      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }

      star.twinkle += 0.02;
      const alpha = star.opacity * (0.6 + 0.4 * Math.sin(star.twinkle));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}
