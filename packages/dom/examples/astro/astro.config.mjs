import wesc from '@wesc/dom/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [wesc()],
});
