export const FRAME_SEQUENCES = {
  idle: {
    path: 'assets/EXTRA_Assets_Future/9-Avatar-360',
    prefix: 'frame_',
    count: 99,
    ext: 'png',
  },
  run: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/1-RUN',
    prefix: 'frame_',
    count: 49,
    ext: 'png',
  },
  catch: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/2-CATCH',
    prefix: 'frame_',
    count: 49,
    ext: 'png',
  },
  dribble: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/3-DRIBBLE',
    prefix: 'frame_',
    count: 49,
    ext: 'png',
  },
  hookshot1: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/4-HOOK SHOT 1',
    prefix: 'frame_',
    count: 36,
    ext: 'png',
  },
  hookshot2: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/5-HOOK SHOT 2',
    prefix: 'frame_',
    count: 49,
    ext: 'png',
  },
  shot: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/6-SHOT',
    prefix: 'frame_',
    count: 49,
    ext: 'png',
  },
  leaving: {
    path: 'assets/EXTRA_Assets_Future/FRAMES/7-LEAVING',
    prefix: 'frame_',
    count: 49,
    ext: 'png',
  },
};

const cache = {};

function frameFilename(prefix, index, ext, padding = 3) {
  return `${prefix}${String(index).padStart(padding, '0')}.${ext}`;
}

export function loadSequence(key) {
  if (cache[key]) return Promise.resolve(cache[key]);

  const seq = FRAME_SEQUENCES[key];
  if (!seq) return Promise.reject(new Error(`Unknown sequence: ${key}`));

  const frames = [];
  const promises = [];

  for (let i = 0; i < seq.count; i++) {
    const img = new Image();
    img.src = `${seq.path}/${frameFilename(seq.prefix, i, seq.ext)}`;
    frames.push(img);
    promises.push(new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        console.warn(`[assetLoader] Missing frame: ${img.src}`);
        resolve();
      };
    }));
  }

  return Promise.all(promises).then(() => {
    cache[key] = frames;
    return frames;
  });
}

export function getSequence(key) {
  return cache[key] || [];
}

export async function loadAll(onProgress) {
  const keys = Object.keys(FRAME_SEQUENCES);
  let loaded = 0;

  for (const key of keys) {
    await loadSequence(key);
    loaded++;
    if (onProgress) onProgress(loaded, keys.length);
  }
}
