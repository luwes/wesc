import '../app/globals.css';
import Head from 'next/head'
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Head>
        <title>WeSC - Next.js Pages example</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
