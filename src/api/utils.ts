const typeDictonary: Record<GameType, string> = {
  2: 'Quake',
  3: 'Walls',
  4: 'Paintball',
  5: 'Blitz Survival Games',
  6: 'TNT Games',
  7: 'VampireZ',
  13: 'Mega Walls',
  14: 'Arcade',
  17: 'Arena',
  20: 'UHC Champions',
  21: 'Cops and Crims',
  23: 'Warlords',
  24: 'Smash Heroes',
  25: 'Turbo Kart Racers',
  26: 'Housing',
  51: 'SkyWars',
  52: 'Crazy Walls',
  54: 'Speed UHC',
  55: 'SkyClash',
  56: 'Classic Games',
  57: 'Prototype',
  58: 'Bed Wars',
  59: 'Murder Mystery',
  60: 'Build Battle',
  61: 'Duels',
  63: 'SkyBlock',
  64: 'Pit'
};

export type GameType =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 13
  | 14
  | 17
  | 20
  | 21
  | 23
  | 24
  | 25
  | 26
  | 51
  | 52
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 63
  | 64;

export function gameTypeToName(gameType: number): string {
  if (testType(gameType)) {
    return typeDictonary[gameType];
  } else throw new Error(`Game type ${gameType} didn't match a game!`);
}

export function getAllBoosterGames(): number[] {
  return [5, 6, 13, 14, 20, 21, 23, 24, 51, 56];
}

function testType(a: number): a is GameType {
  return Object.keys(typeDictonary).includes(a.toString());
}
