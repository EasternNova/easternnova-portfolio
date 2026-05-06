/* ================================================================
   scenes/scene2/canvas.js
   
   Reusable PNG frame sequence player.
   Used by scene2.js to play the basketball animation sequences.
   
   USAGE:
     const player = new FramePlayer(canvasElement);
     player.loadSequence(frames);       // HTMLImageElement[]
     player.goToFrame(0.5);             // jump to 50% through sequence
     player.playFrom(0, 30, callback);  // auto-play frames 0–30
   ================================================================ */

export class FramePlayer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.frames  = [];
    this.current = 0;
    this._playId = null;
  }

  /* ── Load a frame sequence ────────────────────────────────── */
  loadSequence(frames) {
    this.frames  = frames;
    this.current = 0;
    if (frames.length > 0) this._draw(0);
  }

  /* ── Jump to a specific frame by index ────────────────────── */
  goToIndex(index) {
    const i = Math.max(0, Math.min(this.frames.length - 1, Math.round(index)));
    if (this.current === i) return;
    this.current = i;
    this._draw(i);
  }

  /* ── Jump using a 0–1 progress value ──────────────────────── */
  goToProgress(progress) {
    const i = Math.round(progress * (this.frames.length - 1));
    this.goToIndex(i);
  }

  /* ── Auto-play from startFrame to endFrame at given FPS ────── */
  playFrom(startFrame, endFrame, fps = 24, onComplete = null) {
    this.stop();

    const frameMs = 1000 / fps;
    let   current = startFrame;
    let   lastTs  = null;

    const loop = (ts) => {
      if (lastTs === null) lastTs = ts;
      if (ts - lastTs >= frameMs) {
        lastTs = ts;
        this.goToIndex(current);
        current++;
        if (current > endFrame) {
          if (onComplete) onComplete();
          return; // stop
        }
      }
      this._playId = requestAnimationFrame(loop);
    };

    this._playId = requestAnimationFrame(loop);
  }

  /* ── Stop any running auto-play ───────────────────────────── */
  stop() {
    if (this._playId) {
      cancelAnimationFrame(this._playId);
      this._playId = null;
    }
  }

  /* ── Resize canvas (call on window resize) ─────────────────── */
  resize(width, height) {
    this.canvas.width  = width;
    this.canvas.height = height;
    if (this.frames.length > 0) this._draw(this.current);
  }

  /* ── Internal draw ─────────────────────────────────────────── */
  _draw(index) {
    const img = this.frames[index];
    if (!img || !img.complete) return;
    const { width: w, height: h } = this.canvas;
    this.ctx.clearRect(0, 0, w, h);
    // Scale to fit height, maintain aspect ratio
    const aspect = img.naturalWidth / img.naturalHeight;
    const drawW  = h * aspect;
    const drawX  = (w - drawW) / 2;
    this.ctx.drawImage(img, drawX, 0, drawW, h);
  }

  get frameCount() { return this.frames.length; }
  get isPlaying()  { return this._playId !== null; }
}
