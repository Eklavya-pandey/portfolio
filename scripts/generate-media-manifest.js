import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const musicDir = path.join(publicDir, 'media', 'music');
const videoDir = path.join(publicDir, 'media', 'video');
const manifestPath = path.join(publicDir, 'media-manifest.json');

const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.ogv', '.mov']);

function formatTitle(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  return base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function scanDir(dir, validExts, type, webPrefix) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (validExts.has(ext)) {
        results.push({
          name: formatTitle(entry.name),
          path: `${webPrefix}/${entry.name}`,
          type,
        });
      }
    }
  }

  return results;
}

const music = scanDir(musicDir, AUDIO_EXTS, 'audio', '/media/music');
const video = scanDir(videoDir, VIDEO_EXTS, 'video', '/media/video');
const allItems = [...music, ...video];

const manifest = {
  music,
  video,
  items: allItems,
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`[media-manifest] Generated media-manifest.json with ${music.length} songs and ${video.length} videos.`);
