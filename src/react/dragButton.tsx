import React from 'react';
import styles from '../../styles/Booster.module.css';
import { ButtonsState } from './boosterChartLabel';
import { gameTypeToName } from '../api/utils';

interface Props {
  type: number;
  queued: boolean;
  isClickRef: React.MutableRefObject<boolean>;
  buttonsStateRef: React.MutableRefObject<ButtonsState>;
  generateChartData: Function;
}

const DragSelectButton: React.FC<Props> = ({ type, queued, isClickRef, buttonsStateRef, generateChartData }) => {
  // handle normal click
  function onMouseDown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (e.button != 0) return;

    const key = queued ? buttonsStateRef.current[type].queued : buttonsStateRef.current[type].stacked;

    const element = e.target as HTMLButtonElement;

    key.alreadyActivated = true;

    key.toggle = element.classList.contains(styles['disabled']);
    if (key.toggle) element.classList.remove(styles['disabled']);
    else element.classList.add(styles['disabled']);

    // generate chart data is only called in onClick because chart label will handle for this
    generateChartData();
  }
  // handle drag
  function onMouseEnter(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const key = queued ? buttonsStateRef.current[type].queued : buttonsStateRef.current[type].stacked;

    if (!isClickRef.current || key.alreadyActivated) return;

    const element = e.target as HTMLButtonElement;

    key.toggle = element.classList.contains(styles['disabled']);
    if (key.toggle) element.classList.remove(styles['disabled']);
    else element.classList.add(styles['disabled']);

    key.alreadyActivated = true;
  }

  function generateClassName(): string | undefined {
    const key = queued ? buttonsStateRef.current[type].queued.toggle : buttonsStateRef.current[type].stacked.toggle;
    return key ? undefined : styles['disabled'];
  }

  return (
    <button className={generateClassName()} onMouseDown={onMouseDown} onMouseEnter={onMouseEnter}>
      {gameTypeToName(type)}
    </button>
  );
};

export default DragSelectButton;
