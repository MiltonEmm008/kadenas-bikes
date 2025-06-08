import fs from 'fs/promises';
import path from 'path';

export async function imgToBase64(imgPath, fallbackSvg = null) {
  try {
    const data = await fs.readFile(imgPath);
    const ext = path.extname(imgPath).substring(1);
    return `data:image/${ext};base64,${data.toString('base64')}`;
  } catch {
    // Si hay un SVG de respaldo, úsalo; si no, avatar SVG simple
    const svg = fallbackSvg || `<svg width='96' height='96' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='#cccccc'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='#333'>?</text></svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }
}
