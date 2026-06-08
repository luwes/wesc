import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// The bundler injects `createRequire(import.meta.url)` for CommonJS interop.
// On Cloudflare Workers `import.meta.url` is undefined, so that call throws at
// module load. Rewrite it in the emitted server chunks to use a constant URL.
function fixCreateRequire() {
  return {
    name: 'fix-create-require',
    apply: 'build',
    enforce: 'post',
    renderChunk(code) {
      if (!code.includes('createRequire(import.meta.url)')) return null;
      return code.replace(
        /createRequire\(import\.meta\.url\)/g,
        'createRequire("file:///worker.js")',
      );
    },
  };
}

export default defineConfig({
  plugins: [sveltekit(), fixCreateRequire()],
});
