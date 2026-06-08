import '@wesc/dom/server';
import { prerender } from '@wesc/dom/react';

import Player from '../components/player.js';

import styles from '../app/page.module.css';

export const getStaticProps = async () => {
  await prerender(() => <Player />);

  return { props: {} };
};

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Next.js 14 -{' '}
        <a href="https://github.com/muxinc/media-chrome" target="_blank">
          Media Chrome
        </a>{' '}
        SSG example
      </h1>
      <div className={styles.player}>
        <Player />
      </div>
      <p>
        <a href="./">Using App Router</a>
      </p>
    </main>
  );
}
