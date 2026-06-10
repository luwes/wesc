// Deterministic generator for the `blog` fixture's index.html.
//
// The fixture intentionally renders a realistic, content-heavy page (100 blog
// posts) so it can double as a stress test for both correctness and the
// performance benchmarks. The data is pseudo-random but fully deterministic
// (fixed seed) so the bundler output stays stable and the integration test can
// assert against a checked-in expected.html.
//
// Regenerate with:
//   node crates/wesc/tests/fixtures/blog/generate.mjs
// then refresh the expected.* files (see the test comment in integration_test.rs).

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const POST_COUNT = 100;

// mulberry32: tiny, fast, deterministic PRNG.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x5eed1234);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};

const adjectives = [
  'Streaming',
  'Declarative',
  'Resilient',
  'Minimal',
  'Composable',
  'Progressive',
  'Zero-runtime',
  'Accessible',
  'Server-rendered',
  'Lightweight',
];
const nouns = [
  'Components',
  'Shadow DOM',
  'Slots',
  'Templates',
  'Bundling',
  'Hydration',
  'Custom Elements',
  'HTML',
  'Styles',
  'Build Pipelines',
];
const verbs = [
  'Rethinking',
  'Shipping',
  'Measuring',
  'Untangling',
  'Scaling',
  'Debugging',
  'Designing',
  'Profiling',
];

const authors = [
  { slug: 'ada-lovelace', name: 'Ada Lovelace', role: 'Platform engineer' },
  { slug: 'grace-hopper', name: 'Grace Hopper', role: 'Compiler nerd' },
  { slug: 'alan-kay', name: 'Alan Kay', role: 'Systems thinker' },
  { slug: 'radia-perlman', name: 'Radia Perlman', role: 'Protocol designer' },
  { slug: 'barbara-liskov', name: 'Barbara Liskov', role: 'Language researcher' },
];

const tags = [
  'web-components',
  'css',
  'rust',
  'performance',
  'html',
  'streaming',
  'shadow-dom',
  'tooling',
  'a11y',
  'standards',
];

const words = (
  'the platform gives us streaming html declarative shadow dom slots templates and custom elements ' +
  'without a virtual machine or a heavy runtime so we can ship less javascript and let the browser do the work ' +
  'measuring real builds keeps us honest about throughput and memory while staying close to web standards'
).split(' ');

function sentence(min, max) {
  const n = min + Math.floor(rand() * (max - min));
  const w = [];
  for (let i = 0; i < n; i++) w.push(pick(words));
  const s = w.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

function paragraph() {
  const n = 2 + Math.floor(rand() * 3);
  const s = [];
  for (let i = 0; i < n; i++) s.push(sentence(6, 14));
  return s.join(' ');
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

const posts = [];
for (let i = 0; i < POST_COUNT; i++) {
  const title = `${pick(verbs)} ${pick(adjectives)} ${pick(nouns)}`;
  const author = pick(authors);
  const month = 1 + (i % 12);
  const day = 1 + (i % 27);
  const date = `2024-${pad(month)}-${pad(day)}`;
  const minutes = 2 + Math.floor(rand() * 12);
  posts.push({
    n: i + 1,
    title,
    slug: slugify(title) + '-' + (i + 1),
    author,
    date,
    minutes,
    featured: i % 17 === 0,
    tags: pickN(tags, 2 + Math.floor(rand() * 2)),
    body: [paragraph(), paragraph()],
  });
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const humanDate = (d) => {
  const [y, m, day] = d.split('-').map(Number);
  return `${monthNames[m - 1]} ${day}, ${y}`;
};

const postHtml = (
  p,
) => `        <blog-post id="post-${p.n}" data-post-id="${p.n}" data-title="${p.title}"${p.featured ? ' featured' : ''}>
          <h2 slot="title"><a href="/posts/${p.slug}">${p.title}</a></h2>
          <div slot="meta">
            <author-card>
              <img slot="avatar" src="/avatars/${p.author.slug}.jpg" alt="${p.author.name}" width="48" height="48" loading="lazy" decoding="async">
              <span slot="name">${p.author.name}</span>
              <span slot="role">${p.author.role}</span>
            </author-card>
            <read-time>${p.minutes} min read</read-time>
            <time datetime="${p.date}">${humanDate(p.date)}</time>
          </div>
          <p>${p.body[0]}</p>
          <p>${p.body[1]}</p>
          <ul slot="tags" class="post-tags">
${p.tags.map((t) => `            <li><a href="/tags/${t}" rel="tag">#${t}</a></li>`).join('\n')}
          </ul>
        </blog-post>`;

// The w-trim layout component supplies the whole document (doctype/html/head/
// body, header, footer) and unwraps its own host tag. The page fills the
// layout's named `title` and `sidebar` slots and its default slot, then nests a
// blog-list (with its own named + default slots) that in turn holds the posts —
// exercising named slots on a w-trim component and several levels of slotted
// component nesting.
const html = `<link rel="definition" name="w-layout" href="./components/layout/w-layout.html">
<link rel="definition" name="side-bar" href="./components/sidebar/side-bar.html">
<link rel="definition" name="blog-list" href="./components/post/blog-list.html">
<link rel="definition" name="blog-post" href="./components/post/blog-post.html">
<link rel="definition" name="author-card" href="./components/post/author-card.html">
<link rel="definition" name="read-time" href="./components/post/read-time.html">

<template>
  <w-layout w-trim>
    <link slot="head" rel="preload" as="image" href="/avatars/ada-lovelace.jpg">
    <side-bar slot="sidebar"></side-bar>
    <blog-list>
      <span slot="title">Latest articles</span>
      <span slot="lead">${POST_COUNT} dispatches on web components and the platform.</span>
${posts.map(postHtml).join('\n')}
    </blog-list>
  </w-layout>
</template>
`;

const outPath = join(dirname(fileURLToPath(import.meta.url)), 'index.html');
writeFileSync(outPath, html);
console.log(`Wrote ${outPath} with ${POST_COUNT} posts (${html.length} bytes).`);
