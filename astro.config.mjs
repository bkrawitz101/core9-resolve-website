import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { defineConfig } from 'astro/config';
import editableRegions from '@cloudcannon/editable-regions/astro-integration';

const preserveAssessmentsIndex = {
  name: 'preserve-assessments-index',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const outDir = fileURLToPath(dir);
      const src = join(outDir, 'assessments.html');
      const destDir = join(outDir, 'assessments');
      await mkdir(destDir, { recursive: true });
      await copyFile(src, join(destDir, 'index.html'));
    },
  },
};

export default defineConfig({
  build: {
    format: 'file',
  },
  integrations: [editableRegions(), preserveAssessmentsIndex],
});
