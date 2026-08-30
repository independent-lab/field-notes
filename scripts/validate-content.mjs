import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const postsDirectory = new URL('../src/content/posts/', import.meta.url);
const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
const categories = new Set(['Thinking', 'Work', 'Technology', 'Culture', 'Life']);
const requiredFields = ['title', 'pubDate', 'category', 'heroImage', 'description'];
const errors = [];
const featured = [];
const slugs = new Map();
const records = new Map();

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  if (!match) return undefined;
  const value = match[1].trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  return value;
}

for (const filename of readdirSync(postsDirectory).filter((name) => /\.mdx?$/.test(name)).sort()) {
  const source = readFileSync(new URL(filename, postsDirectory), 'utf8');
  const frontmatterMatch = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    errors.push(`${filename}: missing frontmatter`);
    continue;
  }

  const frontmatter = frontmatterMatch[1];
  const slug = basename(filename, extname(filename)).toLowerCase();
  const earlier = slugs.get(slug);
  if (earlier) errors.push(`${filename}: duplicate slug "${slug}" (also used by ${earlier})`);
  slugs.set(slug, filename);

  for (const field of requiredFields) {
    if (!scalar(frontmatter, field)) errors.push(`${filename}: missing required ${field}`);
  }

  const publicationDate = scalar(frontmatter, 'pubDate');
  if (publicationDate && Number.isNaN(Date.parse(publicationDate))) errors.push(`${filename}: invalid pubDate "${publicationDate}"`);

  const category = scalar(frontmatter, 'category');
  if (category && !categories.has(category)) errors.push(`${filename}: invalid category "${category}"`);

  const featuredValue = scalar(frontmatter, 'featured');
  if (featuredValue && !['true', 'false'].includes(featuredValue)) errors.push(`${filename}: featured must be true or false`);
  if (featuredValue === 'true') featured.push({ filename, publicationDate });

  const heroImage = scalar(frontmatter, 'heroImage');
  if (heroImage) {
    if (!heroImage.startsWith('/')) errors.push(`${filename}: heroImage must be root-relative`);
    else if (!existsSync(join(publicDirectory, heroImage.slice(1)))) errors.push(`${filename}: missing referenced image ${heroImage}`);
  }

  const draftValue = scalar(frontmatter, 'draft');
  if (draftValue && !['true', 'false'].includes(draftValue)) errors.push(`${filename}: draft must be true or false`);
  records.set(slug, {
    filename,
    publicationDate,
    draft: draftValue === 'true',
    nextRead: scalar(frontmatter, 'nextRead'),
  });
}

for (const [slug, record] of records) {
  if (!record.nextRead) continue;
  if (record.nextRead === slug) {
    errors.push(`${record.filename}: nextRead cannot recommend the current article`);
    continue;
  }
  const target = records.get(record.nextRead);
  if (!target) {
    errors.push(`${record.filename}: nextRead target "${record.nextRead}" does not exist`);
    continue;
  }
  if (target.draft) errors.push(`${record.filename}: nextRead target "${record.nextRead}" is a draft`);
  if (target.publicationDate && Date.parse(target.publicationDate) > Date.now()) errors.push(`${record.filename}: nextRead target "${record.nextRead}" is future-dated`);
}

if (featured.length > 1) {
  const newest = featured.sort((a, b) => Date.parse(b.publicationDate) - Date.parse(a.publicationDate))[0];
  console.warn(`Content warning: ${featured.length} articles are featured; the homepage will use newest (${newest.filename}).`);
}

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Content validation passed (${slugs.size} posts, ${featured.length} featured).`);
}
