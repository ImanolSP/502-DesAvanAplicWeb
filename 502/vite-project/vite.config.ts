// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, join } from 'path';
import { readdirSync, statSync } from 'fs';

/* ──────────────────────────────────────────────────────────────
   Recursively collect all *.html files under a directory
   ────────────────────────────────────────────────────────────── */
function findHtmlFiles(dir: string, base = dir, out: string[] = []) {
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    if (statSync(full).isDirectory()) {
      findHtmlFiles(full, base, out);
    } else if (full.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

/* Build a Rollup "input" map:
   {
     main: 'index.html',
     class1_A01783637_Homework_Index: 'src/class1/A01783637/Homework_Index/index.html',
     ...
   }
*/
function getHtmlInputs() {
  const entries: Record<string, string> = {
    main: resolve(__dirname, 'index.html'), // keep root entry
  };

  const htmlFiles = findHtmlFiles(join(__dirname, 'src'));

  for (const file of htmlFiles) {
    // make the key stable & unique: drop "src/", replace "/" with "_", drop ".html"
    const key = file
      .replace(/^.*src[\\/]/, '') // remove leading path up to src/
      .replace(/\\/g, '_')        // Windows→unix safe
      .replace(/\//g, '_')
      .replace(/\.html$/, '');

    entries[key] = file;
  }
  return entries;
}

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
});
