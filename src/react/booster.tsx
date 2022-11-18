import React, { useState } from 'react';
import styles from '../../styles/Booster.module.css';
import { format } from 'date-fns';
import { gameTypeToName } from '../api/utils';
import { BoostersMetaData } from '../api/boosterFetch';

interface Props {
  gameType: number;
  currentTime: number;
  boostersData: BoostersMetaData;
}

const Booster: React.FC<Props> = ({ gameType, currentTime, boostersData }) => {
  const boosters = boostersData.boosters[gameType];

  const [activatedTime, setActivatedTime] = useState(boostersData.time + boosters.remainingTime! * 1000 - 3600000); // in ms

  // booster had end, new booster activate
  if (currentTime > activatedTime + 3600000) {
    if (boosters.queuedLength > 1) setActivatedTime(activatedTime + 3600000);

    // push new booster into current slot
    boosters.queuedLength--;
    if (boosters.stackedLength <= 10) boosters.stackedLength = 0;
    else boosters.stackedLength -= 10;
  }

  const remainingTime = Math.round((activatedTime - currentTime + 3600000) / 1000); // in seconds

  const QueuedLength = boosters.queuedLength;
  const StackedLength = Math.floor(boosters.stackedLength / 10) + 1;

  return (
    <div className={styles['booster-item']}>
      {/* game heading */}
      <div className={styles['heading-container']}>
        <h3 className={styles['heading']}>{gameTypeToName(gameType)}</h3>
      </div>

      <div className={styles['text-container']}>
        {/* Remaining Time */}
        <strong>Remaining Time: </strong>

        {/* Personal note: I sometime hate prettier formatting */}
        <span>{`${String(Math.floor(remainingTime / 60)).padStart(2, '0')}:${String(remainingTime % 60).padStart(
          2,
          '0'
        )} (Raw Time: ${remainingTime})`}</span>
        <br />

        {/* Queued Booster Length */}
        <strong>Queued Booster Length: </strong>
        <span>{QueuedLength}</span>
        <br />

        {/* Stacked Booster Length */}
        <strong>Stacked Booster Length: </strong>
        <span>{boosters.stackedLength}</span>
        <br />

        <br />

        {/* Last Queued Booster End Date */}
        <strong>Last Queued Booster End Date: </strong>
        <br />
        <span className={styles['text-date']}>
          {format(activatedTime + QueuedLength * 3600000, 'dd-MM-yyyy hh:mm:ss aa')}
        </span>
        <br />

        {/* Last Stacked Booster End Date */}
        <strong>Last Stacked Booster End Date: </strong>
        <br />
        <span className={styles['text-date']}>
          {format(activatedTime + StackedLength * 3600000, 'dd-MM-yyyy hh:mm:ss aa')}
        </span>
        <br />
      </div>
    </div>
  );
};

export default Booster;
