import Player from '../../components/player.js';
import styles from '../page.module.css';

export const meta = () => {
  return [
    { title: "WeSC - Remix App example" },
    { name: "description", content: "We are the Superlative Components!" },
  ];
};

export default function Index() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Remix -
        <a href="https://github.com/muxinc/media-chrome" target="_blank" rel="noreferrer">Media Chrome</a> SSG example
      </h1>
      <div className={styles.player}>
        <Player />
      </div>
    </main>
  );
}
