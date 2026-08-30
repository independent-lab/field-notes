import type { CollectionEntry } from 'astro:content';

export function isPublishedPost(post: CollectionEntry<'posts'>, now = new Date()) {
  return !post.data.draft && post.data.pubDate.valueOf() <= now.valueOf();
}

export function selectNextRead(current: CollectionEntry<'posts'>, published: CollectionEntry<'posts'>[]) {
  const candidates = published.filter((post) => post.id !== current.id);
  if (!candidates.length) return undefined;

  if (current.data.nextRead) {
    const override = candidates.find((post) => post.id === current.data.nextRead);
    if (!override) throw new Error(`${current.id}: invalid nextRead override "${current.data.nextRead}"`);
    return override;
  }

  const currentTags = new Set(current.data.tags.map(normalizeTag).filter((tag) => tag !== 'from the archive'));
  const topical = candidates
    .map((post) => ({ post, sharedTags: post.data.tags.map(normalizeTag).filter((tag) => currentTags.has(tag)).length }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags || newestFirst(a.post, b.post));
  if (topical[0]) return topical[0].post;

  const sameCategory = candidates.filter((post) => post.data.category === current.data.category).sort(newestFirst);
  return sameCategory[0] ?? candidates.sort(newestFirst)[0];
}

function normalizeTag(tag: string) {
  return tag.trim().toLocaleLowerCase('en');
}

function newestFirst(a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.data.title.localeCompare(b.data.title);
}
