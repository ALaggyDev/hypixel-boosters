import apiFetcher from './fetcher';

export default async function fetcher() {
  const { boosters } = await apiFetcher('/boosters');

  const exportData = parse(boosters);
  const metaData = toMetaData(exportData);

  return metaData;
}

// import fs from 'fs';

// export default function fetcher(): Promise<BoostersMetaData> {
//   return new Promise((res, rej) => {
//     fs.readFile('./raw.json', 'utf8', (err, data) => {
//       if (err) return rej(err);
//       const metaData = toMetaData(parse(JSON.parse(data).boosters));
//       res(metaData);
//     });
//   });
// }

export interface BoostersData {
  requestTime: number;
  queuesState: {
    [type: number]: BoosterGameType;
  };
}

interface BoosterGameType {
  current?: Booster;
  queued: Booster[];
  stacked: Booster[];
}

interface Booster {
  uuid: string;
  // date activated is just for sorting, it don't represent real time
  dateActivated: number;
  length?: number;
}

export interface BoostersMetaData {
  time: number;
  boosters: {
    [type: number]: BoosterTypeMetaData;
  };
}
interface BoosterTypeMetaData {
  queuedLength: number;
  stackedLength: number;
  remainingTime?: number;
}

// only for internal uses
interface _BoosterRaw {
  _id: string;
  purchaserUuid: string;
  amount: number;
  originalLength: number;
  length: number;
  gameType: number;
  dateActivated: number;
  stacked?: boolean | string[];
}

// Convert the messy, raw hypixel api data to a more managed state
function parse(boosters: _BoosterRaw[]) {
  const boostersData: BoostersData = { requestTime: Date.now(), queuesState: {} };

  for (let i = 0; i < boosters.length; i++) {
    const booster = boosters[i];

    // create a queuesState of a game if it didn't exist
    if (boostersData.queuesState[booster.gameType] == undefined) {
      boostersData.queuesState[booster.gameType] = {
        queued: [],
        stacked: []
      };
    }

    if (booster.stacked == true) {
      // it is a stacked booster (waiting)
      boostersData.queuesState[booster.gameType].stacked.push({
        uuid: booster.purchaserUuid,
        dateActivated: booster.gameType
      });
    } else {
      // it is a queued booster

      const addTemp: Booster = {
        uuid: booster.purchaserUuid,
        dateActivated: booster.gameType
      };
      if (booster.length != 3600) addTemp.length = booster.length;

      boostersData.queuesState[booster.gameType].queued.push(addTemp);
    }
  }

  for (const type in boostersData.queuesState) {
    const gameState = boostersData.queuesState[Number(type)];

    gameState.queued.sort((a, b) => a.dateActivated - b.dateActivated);
    gameState.stacked.sort((a, b) => a.dateActivated - b.dateActivated);

    if (gameState.queued[0]) gameState.current = gameState.queued[0];
    if (gameState.current && gameState.current.length == undefined) gameState.current.length = 3600;
    gameState.queued.shift();
  }

  return boostersData;
}

export function toMetaData(boosters: BoostersData) {
  const metaData: BoostersMetaData = { time: boosters.requestTime, boosters: {} };

  for (const type in boosters.queuesState) {
    const gameState = boosters.queuesState[Number(type)];

    metaData.boosters[type] = {
      queuedLength: gameState.current ? gameState.queued.length + 1 : 0,
      stackedLength: gameState.stacked.length
    };

    if (gameState.current) metaData.boosters[type].remainingTime = gameState.current.length;
  }

  return metaData;
}
