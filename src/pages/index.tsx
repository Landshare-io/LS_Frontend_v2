import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import DashboardFeautre from '../components/dashboard-features';
import MoreInvestment from '../components/learn-more-future-investment';
import HomeRwaSection from '../components/home-rwa-section';

const Home: NextPage = () => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>Landshare</title>
        <meta
          content="app.landshare.io"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <HomeRwaSection />
      {/* <DashboardFeautre /> */}
      <MoreInvestment />
    </div>
  );
};

export default Home;
