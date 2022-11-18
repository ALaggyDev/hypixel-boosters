import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/Booster.module.css';
import { BoostersMetaData } from '../api/boosterFetch';
import { gameTypeToName, getAllBoosterGames } from '../api/utils';
import DragButton from './dragButton';

import type { ChartConfiguration, ChartDataset, ChartType, DefaultDataPoint } from 'chart.js';
import Chart from './chartWrapper';

export interface ButtonsState {
  [key: number]: {
    queued: {
      toggle: boolean;
      alreadyActivated: boolean;
    };
    stacked: {
      toggle: boolean;
      alreadyActivated: boolean;
    };
  };
}

const BoosterChartLabel: React.FC = () => {
  // --- chart
  const [showChart, setShowChart] = useState(false);

  const [boostersData, setBoosterData] = useState<BoostersMetaData[]>();
  const requestTime = useRef(0);
  const requestOk = useRef<undefined | boolean>(undefined);

  const [chartData, setChartData] = useState<ChartConfiguration<ChartType, DefaultDataPoint<ChartType>, any>>();

  function changeShowChart() {
    if (!showChart && !boostersData) fetchData();
    setShowChart(!showChart);
  }

  async function fetchData() {
    const res = await fetch('/api/boostersHistory');

    requestOk.current = res.ok;
    if (!res.ok) return;

    const json = await res.json();

    setBoosterData(json);
    requestTime.current = Date.now();

    mouseDownRef.current = mouseDown;
    mouseUpRef.current = mouseUp;

    generateChartData(json);
  }

  // using ref to optimize performance by removing unnecessary re-render
  const isClickRef = useRef(false);
  const buttonsStateRef = useRef<ButtonsState>({});

  function mouseDown() {
    if (!boostersData) return;

    isClickRef.current = true;

    for (let i = 0; i < getAllBoosterGames().length; i++) {
      const state = buttonsStateRef.current[getAllBoosterGames()[i]];

      state.queued.alreadyActivated = false;
      state.stacked.alreadyActivated = false;
    }
  }
  function mouseUp() {
    if (!boostersData) return;

    isClickRef.current = false;

    // update chart data if button has drag
    let didDrag = false;
    for (let i = 0; i < getAllBoosterGames().length; i++) {
      const state = buttonsStateRef.current[getAllBoosterGames()[i]];

      if (state.queued.alreadyActivated || state.stacked.alreadyActivated) {
        didDrag = true;

        state.queued.alreadyActivated = false;
        state.stacked.alreadyActivated = false;
      }
    }

    if (didDrag) generateChartData();
  }

  const mouseDownRef = useRef(mouseDown);
  const mouseUpRef = useRef(mouseUp);
  useEffect(() => {
    mouseDownRef.current = mouseDown;
    mouseUpRef.current = mouseUp;
  }, [boostersData]);

  // handle window event listeners and init buttons state
  useEffect(() => {
    for (let i = 0; i < getAllBoosterGames().length; i++) {
      const key = getAllBoosterGames()[i];
      buttonsStateRef.current[key] = {
        queued: {
          toggle: true,
          alreadyActivated: false
        },
        stacked: {
          toggle: true,
          alreadyActivated: false
        }
      };
    }

    const mouseDown = () => mouseDownRef.current();
    const mouseUp = () => mouseUpRef.current();
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  // generate chart data (tip: close this function in VSCode)
  function generateChartData(directData?: BoostersMetaData[]) {
    const _chartData: ChartConfiguration<ChartType, DefaultDataPoint<ChartType>, any> = {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        normalized: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour'
            },
            min: requestTime.current - 86400000,
            max: requestTime.current
          },
          y: {
            min: 0
          }
        },
        parsing: {
          xAxisKey: 'time'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    // loop for all games that have boosters
    const allGames = getAllBoosterGames();
    for (let i = 0; i < allGames.length; i++) {
      const key = getAllBoosterGames()[i];

      if (buttonsStateRef.current[key].queued.toggle) {
        const queuedSet: ChartDataset<ChartType, DefaultDataPoint<ChartType>> = {
          label: gameTypeToName(allGames[i]),
          borderColor: 'rgb(75, 192, 192)',
          // pointRadius: 0,
          // @ts-ignore --- typescript report this as a error but parsing down below actually parse the data to right format
          data: directData || boostersData,
          parsing: {
            yAxisKey: `boosters.${allGames[i]}.queuedLength`
          }
        };

        _chartData.data.datasets.push(queuedSet);
      }

      if (buttonsStateRef.current[key].stacked.toggle) {
        const stackedSet: ChartDataset<ChartType, DefaultDataPoint<ChartType>> = {
          label: gameTypeToName(allGames[i]),
          borderColor: 'rgb(75, 192, 192)',
          // pointRadius: 0,
          // @ts-ignore --- typescript report this as a error but parsing down below actually parse the data to right format
          data: directData || boostersData,
          parsing: {
            yAxisKey: `boosters.${allGames[i]}.stackedLength`
          }
        };

        _chartData.data.datasets.push(stackedSet);
      }
    }

    setChartData(_chartData);
  }

  return (
    <>
      <div className={styles['chart-label']} onClick={changeShowChart}>
        <span className={styles['chart-label-text']}>Boosters History Chart</span>
      </div>

      {showChart ? (
        <div className={styles['chart-label-container']}>
          {/* only render if chart data exists */}

          {chartData && requestOk.current ? (
            <>
              <div className={styles['button-row']}>
                <span>Queued:</span>
                {getAllBoosterGames().map(value => (
                  <DragButton
                    type={value}
                    queued={true}
                    isClickRef={isClickRef}
                    buttonsStateRef={buttonsStateRef}
                    generateChartData={generateChartData}
                    key={value}
                  />
                ))}
              </div>

              <div className={styles['button-row']}>
                <span>Stacked:</span>
                {getAllBoosterGames().map(value => (
                  <DragButton
                    type={value}
                    queued={false}
                    isClickRef={isClickRef}
                    buttonsStateRef={buttonsStateRef}
                    generateChartData={generateChartData}
                    key={value}
                  />
                ))}
              </div>

              <Chart chartData={chartData} />
            </>
          ) : requestOk.current == false ? (
            <>
              <span className={styles['loading-text']}>Loading...</span>
              <div className={styles['loading-spinner']} />
            </>
          ) : (
            <span>An error has happened. Try refreshing. :(</span>
          )}
        </div>
      ) : null}
    </>
  );
};

export default BoosterChartLabel;
