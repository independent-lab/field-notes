# Field Notes

A clean, responsive personal publication built with [Astro](https://astro.build/) and Astro Content Collections. It includes five editorial sections, article and archive views, dark mode, accessible semantic markup, and a zero-cost GitHub Pages deployment workflow.

## Run locally

You need Node.js 20 or newer (Node 22 is recommended).

```bash
pnpm install
pnpm dev
```

Open the local address Astro prints, normally `http://localhost:4321`. Useful commands:

```bash
pnpm check    # validate Astro and TypeScript
pnpm build    # create the production site in dist/
pnpm preview  # preview the production build
```

## Add an article manually

Create a lowercase kebab-case `.md` or `.mdx` file in `src/content/posts`. The required frontmatter is:

```yaml
---
title: A Useful Headline
subtitle: A fuller statement of the article's promise.
pubDate: 2026-08-30
category: Thinking
tags: [attention, practice]
heroImage: /images/example.jpg
heroAlt: A clear description of the image
description: A short search and social description.
featured: false
draft: false
sources:
  - label: Name of the source
    url: https://example.com/original-source
---
```

Valid categories are `Thinking`, `Work`, `Technology`, `Culture`, and `Life`. Put images in `public/images`. `sources` is optional, but external facts and quotations should be attributed. Drafts with `draft: true` are omitted from the published site.

## Inbox publishing workflow

Put rough notes, Markdown, text files, source links, and images in `inbox`, then ask Codex one of the following:

- **Preview inbox** — reads and groups the material and prepares article drafts for review without changing, publishing, committing, or moving anything.
- **Process inbox** — creates finished articles in `src/content/posts`, places images in `public/images`, verifies the site, and moves successfully used source material to `published`.
- **Publish inbox** — does everything in Process inbox, then builds, commits, and pushes to the connected GitHub repository.

The complete editorial rules live in `AGENTS.md`. The `published` folder is an archive of source material, not the site output.

## Connect to GitHub

1. Create a new, empty repository on GitHub. Do not add a README or `.gitignore` there if this local folder is already a git repository.
2. In this project folder, initialize and push the project (replace the example URL):

   ```bash
   git init
   git add .
   git commit -m "Build Field Notes publication"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open the repository's **Actions** tab and watch “Deploy Astro to GitHub Pages.” After it succeeds, the deployment job shows the public URL.

For a project repository, the URL is normally `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`. For a repository named `YOUR-USERNAME.github.io`, it is `https://YOUR-USERNAME.github.io/`. The workflow gets the correct site origin and base path from GitHub automatically, so no repository name needs to be hard-coded.

Every later push to `main` triggers a fresh deployment. GitHub Pages is free for public repositories on GitHub Free; confirm current plan limits if using a private repository.

## Project structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages build and deployment
├── inbox/                        # unprocessed notes, links, and images
├── public/images/                # web-ready article images
├── published/                    # archived source material
├── src/
│   ├── components/               # reusable header, footer, and story card
│   ├── content/posts/            # Markdown and MDX articles
│   ├── layouts/                  # shared page and metadata layout
│   ├── pages/                    # home, article, category, archive, about
│   ├── styles/                   # site-wide editorial design
│   └── content.config.ts         # article schema and categories
├── AGENTS.md                     # Codex editorial automation rules
├── astro.config.mjs              # static output and Pages base-path support
└── package.json
```

No paid API, CMS, database, analytics service, or external publishing service is required.
