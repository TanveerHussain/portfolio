# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal portfolio/resume site + blog built on Next.js 16 (App Router), React 19, and Tailwind CSS v4. Forked from the [dillionverma/portfolio](https://github.com/dillionverma/portfolio) template, styled with shadcn/ui ("new-york" style) and Magic UI components. Deployed on Vercel.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` is the tracked lockfile — do not add/commit `package-lock.json`, it's a stray npm artifact currently untracked in git status).

- `pnpm dev` — start the dev server
- `pnpm build` — production build (also runs Content Collections codegen via `withContentCollections`)
- `pnpm start` — run the production build
- `pnpm lint` / `pnpm lint:fix` — ESLint (flat config, `eslint-config-next/core-web-vitals`)

There is no test suite configured in this repo.

## Architecture

### Single-source-of-truth config

Nearly all personal content — name, bio, work history, education, skills, projects, hackathons, social links, navbar items — lives in one file: [src/data/resume.tsx](src/data/resume.tsx), exported as `const DATA`. Page components (`src/app/page.tsx`, section components) render directly from this object. When asked to update resume/bio/project/work content, edit this file rather than the page components.

### Content Collections for the blog

Blog posts are MDX files in [content/](content/), defined and validated via [content-collections.ts](content-collections.ts) (schema: title, publishedAt, updatedAt, author, summary, image, content). Content Collections compiles MDX at build time into a generated module resolved by the `content-collections` import alias (see `tsconfig.json` → `paths`), which is imported as `import { allPosts } from "content-collections"` — not a real npm package, it's codegen output in `.content-collections/generated`.

- `remarkGfm` + a custom plugin [src/lib/remark-code-meta.ts](src/lib/remark-code-meta.ts) (attaches fenced-code-block meta like `title="..."` as `data-*` hProperties) run during MDX compilation.
- [src/mdx-components.tsx](src/mdx-components.tsx) supplies the component overrides passed to `<MDXContent>` (custom `pre`/`code`/`table`/`hr`, syntax highlighting via [src/components/mdx/code-block.tsx](src/components/mdx/code-block.tsx) using Shiki, loaded client-side).
- [src/app/blog/page.tsx](src/app/blog/page.tsx) lists posts (paginated via [src/lib/pagination.ts](src/lib/pagination.ts), 5/page) sorted by `publishedAt` descending.
- [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) renders a single post, derives the slug from `post._meta.path` (strips `.mdx`), builds JSON-LD structured data, and computes prev/next post links from the sorted list. Uses `generateStaticParams` for full SSG.
- Both blog routes have sibling `opengraph-image.tsx` files for dynamic OG image generation.

### Styling

Tailwind v4 is CSS-first — there is **no** `tailwind.config.ts` file even though `components.json` references one; all theme tokens (colors, radius, sidebar/chart palette) are defined as CSS custom properties in [src/app/globals.css](src/app/globals.css) under `@theme inline`, with light/dark values further down via the `.dark` class (`next-themes`, `attribute="class"`). Utility class merging goes through `cn()` in [src/lib/utils.ts](src/lib/utils.ts) (`clsx` + `tailwind-merge`).

shadcn/ui components live in `src/components/ui/`; Magic UI (animated/decorative) components live in `src/components/magicui/` (e.g. `BlurFade`, `FlickeringGrid`, `Dock`). Page-level composed sections live in `src/components/section/`.

### Layout shell

[src/app/layout.tsx](src/app/layout.tsx) wraps every page with `ThemeProvider`, `TooltipProvider`, a `FlickeringGrid` background decoration, and a fixed bottom `Navbar` (a `Dock` of icons built from `DATA.navbar`/`DATA.contact.social`). Content is constrained to `max-w-2xl` centered.

### Security headers

[next.config.mjs](next.config.mjs) sets `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, and a restrictive `Permissions-Policy` on all routes. `withContentCollections` must remain the outermost Next config wrapper.

### Path aliases

`@/*` → `src/*` (see `tsconfig.json` and `components.json` aliases: `@/components`, `@/lib`, `@/ui`, `@/hooks`).
