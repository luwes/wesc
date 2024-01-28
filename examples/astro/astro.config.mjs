import { defineConfig } from 'astro/config';
import wesc from 'wesc/dom/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [wesc()]
});
