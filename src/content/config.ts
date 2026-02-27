import { defineCollection, z } from 'astro:content';

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    date: z.coerce.date(),
    publishDate: z.coerce.date().optional(),
    doi: z.string().optional(),
    publication: z.string(),
    publication_short: z.string().optional(),
    abstract: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    topic: z.union([z.string(), z.array(z.string())]).optional(),
    methods: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    url_pdf: z.string().optional(),
    url_code: z.string().optional(),
    url_dataset: z.string().optional(),
  }),
});

const workingPapers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    date: z.coerce.date(),
    abstract: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    topic: z.string().optional(),
    methods: z.array(z.string()).default([]),
    image: z.string().optional(),
    status: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    date: z.coerce.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    url: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  publications,
  'working-papers': workingPapers,
  projects,
  blog,
};
