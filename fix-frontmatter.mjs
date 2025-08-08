import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'src', 'content', 'recipes');

async function run() {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith('.md'));
  let changed = 0;
  for (const file of files) {
    const full = path.join(DIR, file);
    const src = await fs.readFile(full, 'utf8');
    const parsed = matter(src);
    if (!('data' in parsed)) continue;

    if (parsed.data && 'description' in parsed.data) {
      delete parsed.data.description;
      const out = matter.stringify(parsed.content.trimStart() + '\n', parsed.data);
      await fs.writeFile(full, out, 'utf8');
      changed++;
      console.log('Fixed frontmatter:', file);
    } else {
      // Also handle accidental stray lines in frontmatter by re-stringifying as-is
      const out = matter.stringify(parsed.content.trimStart() + '\n', parsed.data || {});
      if (out !== src) {
        await fs.writeFile(full, out, 'utf8');
        console.log('Normalized:', file);
      }
    }
  }
  console.log('Done. Changed:', changed);
}

run().catch((e) => { console.error(e); process.exit(1); }); 