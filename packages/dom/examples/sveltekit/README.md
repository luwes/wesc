# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Deploying (Vercel & Cloudflare)

This example uses [`@sveltejs/adapter-auto`](https://kit.svelte.dev/docs/adapter-auto), which automatically selects the right adapter at build time:

- **Vercel** → `adapter-vercel`
- **Cloudflare Pages** → `adapter-cloudflare`

No adapter changes are needed to support both platforms.

### Cloudflare: `nodejs_compat`

The SvelteKit server bundle imports Node built-ins (e.g. `node:module`, `node:async_hooks`). Cloudflare's Workers runtime only exposes those when the `nodejs_compat` compatibility flag is enabled. Without it, the deploy fails at publish time with:

```
Error: Failed to publish your Function. Got error: Uncaught Error: No such module "node:module".
```

This flag is configured in [`wrangler.toml`](./wrangler.toml):

```toml
name = "sveltekit"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".svelte-kit/cloudflare"
```

Vercel ignores `wrangler.toml`, so this file only affects Cloudflare deploys.
