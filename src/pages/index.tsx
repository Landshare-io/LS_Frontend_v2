import type { NextPage } from 'next';
import Head from 'next/head';
import { Inter_Tight } from 'next/font/google';
import Header from '../components/header';
import styles from '../styles/Home.module.css';

const interTight = Inter_Tight({
  weight: "400",
  style: "normal",
  preload: false,
});

const Home: NextPage = () => {
  return (
    <div className={`${styles.container} ${interTight.className}`}>
      <Head>
        <title>Landshare</title>
        <meta
          content="app.landshare.io"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <Header />
      </main>
    </div>
  );
};

export default Home;
