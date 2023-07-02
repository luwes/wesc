import { defineConfig } from 'astro/config';
import wesc from 'wesc/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [wesc()]
});
