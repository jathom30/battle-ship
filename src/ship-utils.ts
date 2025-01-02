export type TShip = number[][];
export type TShipObj = Record<keyof typeof SHIPS, TShip>;

export const SHIPS = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

export const DEFAULT_SHIPS: TShipObj = {
  carrier: [],
  battleship: [],
  cruiser: [],
  submarine: [],
  destroyer: [],
};

export const getIndex = (x: number, y: number) => x * 10 + y;
export const getXY = (i: number) => [Math.floor(i / 10), i % 10];
export const isWithinBounds = (x: number, y: number) =>
  x >= 0 && x < 10 && y >= 0 && y < 10;

export function isConsecutive(arr: number[]) {
  arr.sort((a, b) => a - b); // Sort the array

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + 1) {
      return false;
    }
  }

  return true;
}

export const isGuessedHit = (
  guess: number,
  ships: TShip[],
  guesses: number[]
) => isHit(guess, ships.flat()) && guesses.includes(guess);

const isFreeSpace = (x: number, y: number, ships: TShip[]) =>
  !ships.some((ship) =>
    ship.some(([shipX, shipY]) => shipX === x && shipY === y)
  );

const getRandomShipPlacement = (length: number, otherShips: TShip[]) => {
  const isVertical = Math.random() > 0.5;
  const [x, y] = getXY(Math.floor(Math.random() * 100));

  const ship = Array.from({ length }, (_, i) =>
    isVertical ? [x, y + i] : [x + i, y]
  );
  if (ship.some(([x, y]) => x < 0 || x >= 10 || y < 0 || y >= 10)) {
    return getRandomShipPlacement(length, otherShips);
  }
  if (!isFreeSpace(x, y, otherShips)) {
    return getRandomShipPlacement(length, otherShips);
  }
  return ship;
};

export const createComputerShips = () => {
  const ships: TShip[] = [];
  for (const length of Object.values(SHIPS)) {
    const ship = getRandomShipPlacement(length, ships);
    ships.push(ship);
  }
  return ships;
};

const isConnected = (ship: TShip) => {
  const [x, y] = ship[0];
  const isVertical = ship.every(([, shipY]) => shipY === y);
  const isHorizontal = ship.every(([shipX]) => shipX === x);
  const isConsecutiveX = isConsecutive(ship.map((x) => x[0]));
  const isConsecutiveY = isConsecutive(ship.map((x) => x[1]));
  return (isVertical && isConsecutiveX) || (isHorizontal && isConsecutiveY);
};

export const placeShip = (
  squareIndex: number,
  shipName: keyof typeof SHIPS,
  placedShips: TShipObj
) => {
  const length = SHIPS[shipName];
  const [x, y] = getXY(squareIndex);

  const isSameShipSpace = placedShips[shipName].some(
    ([shipX, shipY]) => shipX === x && shipY === y
  );

  // remove ship if clicked on the same square
  if (isSameShipSpace) {
    return {
      ...placedShips,
      [shipName]: [],
    };
  }

  if (!isFreeSpace(x, y, Object.values(placedShips))) {
    return placedShips;
  }
  const newShip: TShip = [...placedShips[shipName], [x, y]];
  if (!isConnected(newShip)) {
    return placedShips;
  }
  if (newShip.length > length) {
    return placedShips;
  }
  return {
    ...placedShips,
    [shipName]: newShip,
  };
};

export const allShipsPlaced = (ships: TShipObj) =>
  Object.entries(ships).every(
    ([ship, shipPos]) => shipPos.length === SHIPS[ship as keyof typeof SHIPS]
  );

export const isHit = (guess: number, ships: TShip) =>
  ships.some((ship) => getIndex(ship[0], ship[1]) === guess);

export const quickStartPos = {
  carrier: [
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
  ],
  battleship: [
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
  ],
  cruiser: [
    [6, 5],
    [7, 5],
    [8, 5],
  ],
  submarine: [
    [1, 5],
    [1, 6],
    [1, 7],
  ],
  destroyer: [
    [8, 7],
    [9, 7],
  ],
};

export const isWinner = (ships: TShip[], guesses: number[]) => {
  const allShips = Object.values(ships).flat();
  return allShips.every((ship) => guesses.includes(getIndex(ship[0], ship[1])));
};
