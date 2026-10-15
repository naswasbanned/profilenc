import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const STYLES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'styles');
const GUARD = ':not(:where(.bf-preview-canvas *))';
const BARE = /(?:^|[\s>+~])(label|input|textarea|select|button|p|span|a|h[1-6]|svg|img)(?=$|[\s.:#[>+~,])/;

function selectorsOf(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const re = /([^{}]+)\{/g;
  let m;
  while ((m = re.exec(stripped))) {
    const prelude = m[1].trim();
    if (prelude.startsWith('@')) continue;
    prelude.split(',').forEach((s) => out.push(s.trim()));
  }
  return out;
}

describe('editor preview isolation', () => {
  it('chrome element rules under the modal dialog/body exclude the live preview', () => {
    const offenders = [];
    for (const file of fs.readdirSync(STYLES_DIR).filter((f) => f.endsWith('.css'))) {
      const css = fs.readFileSync(path.join(STYLES_DIR, file), 'utf8');
      for (const sel of selectorsOf(css)) {
        if (!/^\.editor-modal-(dialog|body)\b/.test(sel)) continue;
        // Only the final compound decides what element is styled.
        const subject = sel.replace(/:not\(:where\([^)]*\)\)/g, '').split(/[\s>+~]+/).pop();
        if (!BARE.test(` ${subject}`) && !/^(label|input|textarea|select|button|p|span|a|h[1-6]|svg|img)\b/.test(subject)) continue;
        if (!sel.includes(GUARD)) offenders.push(`${file}: ${sel}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('.bf-preview-canvas declares the public-page typography baseline', () => {
    const css = fs.readFileSync(path.join(STYLES_DIR, '10-guided-block-editor.css'), 'utf8');
    const block = css.match(/\.bf-preview-canvas\s*\{([^}]*)\}/)[1];
    expect(block).toMatch(/font-family:\s*var\(--font-body\)/);
    expect(block).toMatch(/color:\s*var\(--color-text-primary\)/);
    expect(block).toMatch(/line-height:/);
  });
});
