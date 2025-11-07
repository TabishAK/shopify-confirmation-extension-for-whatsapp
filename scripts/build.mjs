import { build } from 'esbuild';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

async function ensureCleanOutput() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

async function bundleSource() {
  await build({
    entryPoints: {
      background: path.join(rootDir, 'src/background/index.ts'),
      content: path.join(rootDir, 'src/content/index.ts'),
      popup: path.join(rootDir, 'src/pages/popup/index.tsx')
    },
    bundle: true,
    format: 'esm',
    sourcemap: true,
    target: 'chrome120',
    outdir: distDir,
    entryNames: '[name]',
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx'
    },
    jsx: 'automatic',
    logLevel: 'info',
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });
}

async function copyStaticAssets() {
  const assets = [
    {
      from: path.join(rootDir, 'manifest.json'),
      to: path.join(distDir, 'manifest.json')
    },
    {
      from: path.join(rootDir, 'src/pages/popup/index.html'),
      to: path.join(distDir, 'popup.html')
    }
  ];

  await Promise.all(
    assets.map(async ({ from, to }) => {
      await copyFile(from, to);
    })
  );
}

async function run() {
  await ensureCleanOutput();
  await bundleSource();
  await copyStaticAssets();
}

run().catch((error) => {
  console.error('Build failed:', error);
  process.exitCode = 1;
});

