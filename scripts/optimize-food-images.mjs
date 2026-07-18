import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const sourceDir = path.resolve('public', 'food-images');
const targetDir = path.resolve('public', 'food-images-webp');
const maxWidth = 1200;
const quality = 78;

async function main() {
  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const pngFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (pngFiles.length === 0) {
    console.log(`No PNG files found in ${sourceDir}`);
    return;
  }

  let originalBytes = 0;
  let optimizedBytes = 0;

  for (const fileName of pngFiles) {
    const inputPath = path.join(sourceDir, fileName);
    const outputName = fileName.replace(/\.png$/i, '.webp');
    const outputPath = path.join(targetDir, outputName);
    const inputStat = await fs.stat(inputPath);

    await sharp(inputPath)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outputPath);

    const outputStat = await fs.stat(outputPath);
    originalBytes += inputStat.size;
    optimizedBytes += outputStat.size;
    console.log(`${fileName} -> ${outputName}`);
  }

  const saved = originalBytes - optimizedBytes;
  const percent = originalBytes > 0 ? ((saved / originalBytes) * 100).toFixed(1) : '0.0';
  console.log(
    `Optimized ${pngFiles.length} images: ${formatBytes(originalBytes)} -> ${formatBytes(
      optimizedBytes,
    )} (${percent}% smaller)`,
  );
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
