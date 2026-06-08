import Player from '../../components/player.jsx';

import styles from '../page.module.css';

export const meta = () => {
  return [
    { title: 'WeSC - React Router example' },
    { name: 'description', content: 'We are the Superlative Components!' },
  ];
};

export default function Index() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        React Router -{' '}
        <a href="https://github.com/muxinc/media-chrome" target="_blank" rel="noreferrer">
          Media Chrome
        </a>{' '}
        SSR example
      </h1>
      <div className={styles.player}>
        <Player />
      </div>
    </main>
  );
}
