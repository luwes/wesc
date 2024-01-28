import 'wesc/dom/server';

import styles from './page.module.css';
import Player from '../components/player.js';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Next.js 14 - <a href="https://github.com/muxinc/media-chrome" target="_blank">Media Chrome</a> SSG example
      </h1>
      <div className={styles.player}>
        <Player />
      </div>
      <p>
        <a href="./old">Using Pages Router</a>
      </p>
    </main>
  )
}
