import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/header';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Landshare</title>
        <meta
          content="app.landshare.io"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
    </div>
  );
};

export default Home;
