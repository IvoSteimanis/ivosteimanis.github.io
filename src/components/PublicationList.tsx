import { useState } from 'react';
import TagFilter from './TagFilter';

interface Publication {
  slug: string;
  title: string;
  authors: string[];
  date: string;
  doi?: string;
  publication: string;
  publication_short?: string;
  abstract?: string;
  summary?: string;
  topic?: string | string[];
  methods: string[];
  featured?: boolean;
  image?: string;
  url_pdf?: string;
  url_code?: string;
  url_dataset?: string;
}

const METHOD_COLORS: Record<string, string> = {
  'Lab-in-field': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Survey experiment': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Meta-analysis': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Online experiment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Agent-based model': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'Field experiment': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'Panel data': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Review': 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300',
  'RCT': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

function highlightAuthor(name: string): string {
  if (name === 'Ivo Steimanis') {
    return `<strong class="underline">${name}</strong>`;
  }
  return name;
}

interface Props {
  publications: Publication[];
}

export default function PublicationList({ publications }: Props) {
  const [activeTopic, setActiveTopic] = useState('All');

  const topics = [...new Set(publications.flatMap((p) => Array.isArray(p.topic) ? p.topic : p.topic ? [p.topic] : []))] as string[];

  const filtered = activeTopic === 'All'
    ? publications
    : publications.filter((p) => Array.isArray(p.topic) ? p.topic.includes(activeTopic) : p.topic === activeTopic);

  // Group by year
  const grouped = filtered.reduce<Record<number, Publication[]>>((acc, pub) => {
    const year = new Date(pub.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      <TagFilter topics={topics} activeTopic={activeTopic} onSelect={setActiveTopic} />

      {sortedYears.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-serif">{year}</h2>
          <div className="space-y-4">
            {grouped[year].map((pub) => (
              <article
                key={pub.slug}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/publications/${pub.slug}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 leading-snug block mb-1"
                    >
                      {pub.title}
                    </a>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: pub.authors.map(highlightAuthor).join(', '),
                      }}
                    />
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {pub.publication_short || pub.publication}
                      </span>
                      {pub.methods.map((m) => (
                        <span
                          key={m}
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            METHOD_COLORS[m] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Links row */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          DOI
                        </a>
                      )}
                      {pub.url_pdf && (
                        <a
                          href={pub.url_pdf}
                          target="_blank"
                          rel="noopener"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          PDF
                        </a>
                      )}
                      {pub.url_code && (
                        <a
                          href={pub.url_code}
                          target="_blank"
                          rel="noopener"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Code
                        </a>
                      )}
                      {pub.url_dataset && (
                        <a
                          href={pub.url_dataset}
                          target="_blank"
                          rel="noopener"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Data
                        </a>
                      )}
                    </div>

                    {(pub.abstract || pub.summary) && (
                      <details className="mt-2">
                        <summary className="text-sm text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">
                          Show abstract
                        </summary>
                        <p className="mt-2 p-3 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {pub.abstract || pub.summary}
                        </p>
                      </details>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
          No publications found for this topic.
        </p>
      )}
    </div>
  );
}
