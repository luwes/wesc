<svelte:head>
  <style>
    body {
      margin: 0;
    }

    html {
      font-family: system-ui, sans-serif;
    }

    code {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
        Bitstream Vera Sans Mono, Courier New, monospace;
    }

    .main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .player {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .player media-controller {
      display: block;
      width: 100%;
      max-width: 960px;
      aspect-ratio: 2.4;
    }

    .player video {
      width: 100%;
    }
  </style>
</svelte:head>

<script>
  // this prevents the custom elements from being redefined when the REPL is updated and reloads, which throws an error
  // this means that any changes to the custom element won't be picked up without saving and refreshing the REPL
  import { onMount } from 'svelte';
  onMount(async () => {
    await import('media-chrome');
  });
</script>

<main class="main">
  <h1>Sveltekit - <a href="https://github.com/muxinc/media-chrome" target="_blank">Media Chrome</a> SSG example</h1>
  <div class="player">
    <media-controller>
      <video
        playsinline
        slot="media"
        src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
      ></video>
      <media-poster-image
        slot="poster"
        src="https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/thumbnail.jpg"
        placeholdersrc="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAUADADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAECBAP/xAAdEAEBAAEEAwAAAAAAAAAAAAAAARECAxITFCFR/8QAGQEAAwADAAAAAAAAAAAAAAAAAAEDAgQF/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAETERL/2gAMAwEAAhEDEQA/ANeC4ldyI1b2EtIzzrrIqYZLvl5FGkGdbfQzGPvo76WsPxXLlfqbaA5va2iVJADgPELACsD/2Q=="
      ></media-poster-image>
      <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
      <media-control-bar>
        <media-play-button></media-play-button>
        <media-mute-button></media-mute-button>
        <media-volume-range></media-volume-range>
        <media-time-display></media-time-display>
        <media-time-range></media-time-range>
        <media-duration-display></media-duration-display>
        <media-playback-rate-button></media-playback-rate-button>
        <media-fullscreen-button></media-fullscreen-button>
      </media-control-bar>
    </media-controller>
  </div>
</main>
