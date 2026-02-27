/**
 * Fetches publications and working papers from the OpenAlex API for Ivo Steimanis
 * and creates markdown files in src/content/publications/ and src/content/working-papers/.
 *
 * Usage: node scripts/fetch-publications.mjs
 */

import { writeFileSync, existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const AUTHOR_SEARCH = 'Ivo Steimanis';
const PUBLICATIONS_DIR = 'src/content/publications';
const WORKING_PAPERS_DIR = 'src/content/working-papers';

// Topic mapping based on keywords in title/abstract
const TOPIC_KEYWORDS = {
  'PES': ['payment', 'ecosystem service', 'crowding', 'conservation incentive', 'agroforestry'],
  'Migration': ['migra', 'refugee', 'displaced'],
  'Leadership': ['leader', 'chief', 'fairness', 'nepotism', 'democracy', 'water management'],
  'Health': ['vaccin', 'COVID', 'hesitancy', 'health'],
  'Metascience': ['meta-analysis', 'replicat', 'crowd-sourced', 'many labs'],
  'Climate & Behavior': ['climate', 'sea level', 'prosocial', 'solidarity', 'typhoon', 'hazard'],
};

function guessTopic(title, abstract) {
  const text = `${title} ${abstract || ''}`.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return topic;
  }
  return 'Climate & Behavior';
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);
}

function toYAMLString(str) {
  if (!str) return '""';
  if (str.includes('"')) return `"${str.replace(/"/g, '\\"')}"`;
  return `"${str}"`;
}

function reconstructAbstract(invertedIndex) {
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.join(' ');
}

function loadExistingFiles(dir) {
  if (!existsSync(dir)) return { files: [], slugs: [] };
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const slugs = files.map((f) => f.replace('.md', ''));
  return { files, slugs };
}

function fileContainsDOI(dir, files, doi) {
  return files.some((f) => {
    const content = readFileSync(join(dir, f), 'utf-8');
    return content.includes(doi);
  });
}

function fileContainsTitle(dir, files, title) {
  const normalised = title.toLowerCase().trim();
  return files.some((f) => {
    const content = readFileSync(join(dir, f), 'utf-8').toLowerCase();
    return content.includes(normalised);
  });
}

async function main() {
  // Step 1: Find author ID
  console.log('Searching for author...');
  const searchRes = await fetch(
    `https://api.openalex.org/authors?search=${encodeURIComponent(AUTHOR_SEARCH)}&mailto=ivo.steimanis@uni-marburg.de`
  );
  const searchData = await searchRes.json();
  const author = searchData.results?.[0];

  if (!author) {
    console.error('Author not found on OpenAlex');
    process.exit(1);
  }

  console.log(`Found author: ${author.display_name} (${author.id})`);
  const authorId = author.id.replace('https://openalex.org/', '');

  // Step 2: Fetch all works
  console.log('Fetching works...');
  const worksRes = await fetch(
    `https://api.openalex.org/works?filter=author.id:${authorId}&sort=publication_date:desc&per_page=50&mailto=ivo.steimanis@uni-marburg.de`
  );
  const worksData = await worksRes.json();
  const works = worksData.results || [];

  console.log(`Found ${works.length} works`);

  // Step 3: Load existing files from both directories
  const pubs = loadExistingFiles(PUBLICATIONS_DIR);
  const wps = loadExistingFiles(WORKING_PAPERS_DIR);

  let newPubCount = 0;
  let newWPCount = 0;
  let skippedCount = 0;

  for (const work of works) {
    const workType = work.type;

    // Determine target: article → publications, preprint/posted-content → working papers
    const isPublication = workType === 'article' || workType === 'journal-article';
    const isWorkingPaper = workType === 'preprint' || workType === 'posted-content';

    if (!isPublication && !isWorkingPaper) {
      skippedCount++;
      continue;
    }

    const title = work.title;
    if (!title) continue;

    const doi = work.doi?.replace('https://doi.org/', '') || '';
    const date = work.publication_date || '';
    const abstract = work.abstract_inverted_index
      ? reconstructAbstract(work.abstract_inverted_index)
      : '';
    const authors = work.authorships
      .map((a) => a.author.display_name)
      .map((name) => (name.toLowerCase().includes('steimanis') ? 'Ivo Steimanis' : name));
    const slug = slugify(title);
    const topic = guessTopic(title, abstract);

    if (isPublication) {
      // Skip if already exists as a publication (by slug or DOI)
      if (pubs.slugs.includes(slug)) continue;
      if (doi && fileContainsDOI(PUBLICATIONS_DIR, pubs.files, doi)) continue;

      const journal = work.primary_location?.source?.display_name || '';
      const frontmatter = [
        '---',
        `title: ${toYAMLString(title)}`,
        `authors: [${authors.map(toYAMLString).join(', ')}]`,
        `date: ${date}`,
        doi ? `doi: ${toYAMLString(doi)}` : null,
        `publication: ${toYAMLString(journal)}`,
        abstract ? `abstract: ${toYAMLString(abstract)}` : null,
        `tags: []`,
        `topic: ${toYAMLString(topic)}`,
        `methods: []`,
        '---',
      ]
        .filter(Boolean)
        .join('\n');

      const filePath = join(PUBLICATIONS_DIR, `${slug}.md`);
      writeFileSync(filePath, frontmatter + '\n');
      pubs.slugs.push(slug);
      console.log(`  [pub] Created: ${slug}.md`);
      newPubCount++;
    } else {
      // Working paper — skip if it already exists as a published article
      if (doi && fileContainsDOI(PUBLICATIONS_DIR, pubs.files, doi)) continue;
      if (fileContainsTitle(PUBLICATIONS_DIR, pubs.files, title)) continue;

      // Skip if already exists as a working paper (by slug or DOI)
      if (wps.slugs.includes(slug)) continue;
      if (doi && fileContainsDOI(WORKING_PAPERS_DIR, wps.files, doi)) continue;

      const frontmatter = [
        '---',
        `title: ${toYAMLString(title)}`,
        `authors: [${authors.map(toYAMLString).join(', ')}]`,
        `date: ${date}`,
        abstract ? `abstract: ${toYAMLString(abstract)}` : null,
        `tags: []`,
        `topic: ${toYAMLString(topic)}`,
        `methods: []`,
        `status: "Working paper"`,
        '---',
      ]
        .filter(Boolean)
        .join('\n');

      const filePath = join(WORKING_PAPERS_DIR, `${slug}.md`);
      writeFileSync(filePath, frontmatter + '\n');
      wps.slugs.push(slug);
      console.log(`  [wp]  Created: ${slug}.md`);
      newWPCount++;
    }
  }

  console.log(`\nDone. Created ${newPubCount} new publication(s) and ${newWPCount} new working paper(s).`);
  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} work(s) with unhandled types (e.g. book-chapter, dataset).`);
  }
}

main().catch(console.error);
