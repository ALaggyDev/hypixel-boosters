import React, { useState, useEffect } from 'react';
import boosterFetch, { BoostersMetaData } from '../src/api/boosterFetch';
import Booster from '../src/react/booster';
import styles from '../styles/Booster.module.css';
import Sidebar from '../src/react/sidebar';
import BoosterChartLabel from '../src/react/boosterChartLabel';
import { GetStaticProps } from 'next';
import Head from 'next/head';

interface Props {
  boostersData: BoostersMetaData;
}

const Home: React.FC<Props> = ({ boostersData }) => {
  // in reality this state is just for force update
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // set up interval
    const handler: TimerHandler = () => setCurrentTime(Date.now());
    const intervalNum = setInterval(handler, 1000);
    // clear interval when exit
    return () => clearInterval(intervalNum);
  }, []);

  // JSX
  return (
    <>
      <Sidebar />
      <Head>
        <title>Boosters</title>
      </Head>

      <div className={styles['content-container']}>
        <i className={styles['CacheText']}>Data update every 45 seconds.</i>

        <div className={styles['grid-container']}>
          {/* Generate Booster Item */}

          {Object.keys(boostersData.boosters).map(value =>
            boostersData.boosters[Number(value)].queuedLength >= 1 ? (
              <Booster gameType={Number(value)} currentTime={currentTime} boostersData={boostersData} key={value} />
            ) : null
          )}
        </div>

        <BoosterChartLabel />
      </div>
    </>
  );
};

// get props
export const getStaticProps: GetStaticProps = async () => {
  const data = await boosterFetch();
  return {
    props: {
      boostersData: data
    },
    revalidate: 45
  };
};

export default Home;
