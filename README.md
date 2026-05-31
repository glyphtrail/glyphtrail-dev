# glyphtrail.dev

The static website for [glyphtrail.dev](https://glyphtrail.dev), built with [SvelteKit](https://svelte.dev/docs/kit).

## Developing

Install dependencies with [Yarn](https://yarnpkg.com/) (managed via [Corepack](https://nodejs.org/api/corepack.html)):

```sh
corepack enable
yarn install
```

Start a development server:

```sh
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

## Building

To create a production version of the site:

```sh
yarn build
```

You can preview the production build locally with:

```sh
yarn preview
```

## Deployment

The site is automatically deployed to [GitHub Pages](https://pages.github.com/) on every push to `main` via the [deploy workflow](.github/workflows/deploy.yml). The custom domain `glyphtrail.dev` is configured via [`static/CNAME`](static/CNAME).
