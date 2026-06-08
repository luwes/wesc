import netlify from '@netlify/vite-plugin';
import netlifyReactRouter from '@netlify/vite-plugin-react-router';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter(), netlifyReactRouter(), netlify()],
  ssr: {
    // Bundle the wesc DOM SSR runtime and media-chrome's React entry so their
    // server-only exports resolve during SSR instead of being treated as
    // external CommonJS modules.
    noExternal: ['@wesc/dom', 'media-chrome'],
  },
});
