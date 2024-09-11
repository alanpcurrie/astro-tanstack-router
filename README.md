# Astro TanStack Router SPA Starter

This project is a starter template for building a Single Page Application (SPA) using Astro and TanStack Router.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── app.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── [...all].astro
├── astro.config.mjs
├── biome.json
├── package.json
└── tsconfig.json
```

- `src/components/app.tsx`: This is the main React component that sets up TanStack Router.
- `src/pages/[...all].astro`: This is the catch-all route that serves your SPA.
- Other components in `src/components/` represent different pages or sections of your SPA.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help`    | Get help using the Astro CLI                     |

## 🛠️ Technologies Used

- [Astro](https://astro.build)
- [React](https://reactjs.org)
- [TanStack Router](https://tanstack.com/router)
- [TypeScript](https://www.typescriptlang.org)
- [Biome](https://biomejs.dev/guides/getting-started)

## Getting Started

1. Clone this repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`

## SPA Entry Point

The SPA entry point is a catch-all route in the `pages` directory. The file `[...all].astro` contains:

```astro
---
import { App } from "~components/app";
import Layout from "~layouts/Layout.astro";
---

<Layout title="Dashboard">
  <App client:only="react" />
</Layout>
```

This setup allows TanStack Router to handle all routes within the SPA.

## Configuration

- The project uses path aliases for cleaner imports. Check `tsconfig.json` and `astro.config.mjs` for the alias configurations.
- TanStack Router is set up in `src/components/app.tsx`.

## Links

- [Astro documentation](https://docs.astro.build)
- [TanStack Router documentation](https://tanstack.com/router/latest)
- [React documentation](https://react.dev/))
