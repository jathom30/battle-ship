import {
  getIndex,
  getXY,
  isGuessedHit,
  isHit,
  isWithinBounds,
  TShip,
  TShipObj,
} from "./ship-utils";

const getRandomComputerGuess = (
  userShips: TShip,
  computerGuesses: number[]
): number => {
  console.log("RANDOM");
  if (computerGuesses.length === 100) {
    return -1;
  }
  const guess = Math.floor(Math.random() * 100);
  if (computerGuesses.includes(guess)) {
    return getRandomComputerGuess(userShips, computerGuesses);
  }
  return guess;
};

export const getSunkenShips = (
  ships: TShipObj,
  guesses: number[]
): (keyof TShipObj)[] => {
  return Object.keys(ships).reduce((acc: (keyof TShipObj)[], shipName) => {
    return [
      ...acc,
      ...(ships[shipName as keyof TShipObj].every(([x, y]) =>
        guesses.includes(getIndex(x, y))
      )
        ? [shipName as keyof TShipObj]
        : []),
    ];
  }, []);
};

const getFirstInConsecutiveRowOfHits = (
  ships: TShip,
  computerGuesses: number[],
  lastHit: number
): number => {
  const [x, y] = getXY(lastHit);
  // if square to the left is hit
  const leftIsHit = isHit(getIndex(x, y - 1), ships);
  if (leftIsHit) {
    return getFirstInConsecutiveRowOfHits(
      ships,
      computerGuesses,
      getIndex(x, y - 1)
    );
  }
  return getIndex(x, y);
};
const getLastInConsecutiveRowOfHits = (
  ships: TShip,
  computerGuesses: number[],
  lastHit: number
): number => {
  const [x, y] = getXY(lastHit);
  // if square to the right is hit
  const rightIsHit =
    isHit(getIndex(x, y + 1), ships) &&
    computerGuesses.includes(getIndex(x, y + 1));
  if (rightIsHit) {
    return getLastInConsecutiveRowOfHits(
      ships,
      computerGuesses,
      getIndex(x, y + 1)
    );
  }
  return getIndex(x, y);
};

const getRowOfHits = (
  ships: TShip,
  computerGuesses: number[],
  lastHit: number
) => {
  const left = getFirstInConsecutiveRowOfHits(ships, computerGuesses, lastHit);
  const right = getLastInConsecutiveRowOfHits(ships, computerGuesses, lastHit);
  return [left, right];
};

const getFirstInConsecutiveColumnOfHits = (
  ships: TShip,
  computerGuesses: number[],
  lastHit: number
): number => {
  const [x, y] = getXY(lastHit);
  // if square above is hit
  const upIsHit =
    isHit(getIndex(x - 1, y), ships) &&
    computerGuesses.includes(getIndex(x - 1, y));
  if (upIsHit) {
    return getFirstInConsecutiveColumnOfHits(
      ships,
      computerGuesses,
      getIndex(x - 1, y)
    );
  }
  return getIndex(x, y);
};
const getLastInConsecutiveColumnOfHits = (
  ships: TShip,
  computerGuesses: number[],
  lastHit: number
): number => {
  const [x, y] = getXY(lastHit);
  // if square below is hit
  const downIsHit =
    isHit(getIndex(x + 1, y), ships) &&
    computerGuesses.includes(getIndex(x + 1, y));
  if (downIsHit) {
    return getLastInConsecutiveColumnOfHits(
      ships,
      computerGuesses,
      getIndex(x + 1, y)
    );
  }
  return getIndex(x, y);
};

const getColumnOfHits = (
  ships: TShip,
  computerGuesses: number[],
  lastHit: number
) => {
  const top = getFirstInConsecutiveColumnOfHits(
    ships,
    computerGuesses,
    lastHit
  );
  const bottom = getLastInConsecutiveColumnOfHits(
    ships,
    computerGuesses,
    lastHit
  );
  return [top, bottom];
};

const getVerticalGuess = (
  ships: TShip,
  computerGuesses: number[],
  lastGuess: number
) => {
  const [first, last] = getColumnOfHits(ships, computerGuesses, lastGuess);
  const up = first - 10;
  const down = last + 10;
  if (up >= 0 && !computerGuesses.includes(up)) {
    return up;
  }
  if (down < 100 && !computerGuesses.includes(down)) {
    return down;
  }
  return getRandomComputerGuess(ships, computerGuesses);
};

const getHorizontalGuess = (
  ships: TShip,
  computerGuesses: number[],
  lastGuess: number
) => {
  const [first, last] = getRowOfHits(ships, computerGuesses, lastGuess);
  const left = first - 1;
  const right = last + 1;
  if (left >= 0 && !computerGuesses.includes(left)) {
    return left;
  }
  if (right < 100 && !computerGuesses.includes(right)) {
    return right;
  }
  return getRandomComputerGuess(ships, computerGuesses);
};

const getNextMoveIfPrevWasHit = (
  computerGuesses: number[],
  lastHit: number,
  ships: TShip
) => {
  const [x, y] = getXY(lastHit);
  const adjacentSquares = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  // see if there are any adjacent squares that have been guessed and are hits
  const adjacentHits = adjacentSquares.filter(
    ([x, y]) =>
      isWithinBounds(x, y) &&
      isHit(getIndex(x, y), ships) &&
      computerGuesses.includes(getIndex(x, y))
  );
  // if there are no adjacent hits, start checking empty adjacent squares
  if (adjacentHits.length === 0) {
    const [availableSquare] = adjacentSquares.filter(
      ([x, y]) =>
        isWithinBounds(x, y) && !computerGuesses.includes(getIndex(x, y))
    );
    return getIndex(availableSquare?.[0], availableSquare?.[1]);
  }

  // derive if the next guess should be horizontal or vertical
  const horizontalHits = adjacentHits.filter((pos) => pos[0] === x);
  const verticalHits = adjacentHits.filter((pos) => pos[1] === y);
  const isHorizontal = horizontalHits.length > 0;
  const isVertical = verticalHits.length > 0;
  if (isHorizontal) {
    return getHorizontalGuess(ships, computerGuesses, lastHit);
  }
  if (isVertical) {
    return getVerticalGuess(ships, computerGuesses, lastHit);
  }
  // if we can't determine if the next guess should be horizontal or vertical
  // return a guess based on the available squares
  const available = adjacentSquares.find(
    (square) => !computerGuesses.includes(getIndex(square[0], square[1]))
  );
  if (!available) {
    return getRandomComputerGuess(ships, computerGuesses);
  }
  return getIndex(available[0], available[1]);
};

const getLastHit = (userShips: TShip, computerGuesses: number[]) => {
  const hits = computerGuesses.filter((i) => isHit(i, userShips));
  if (!hits) return null;
  return hits[hits.length - 1];
};

const getNextMoveBasedOnLastHit = (
  ships: TShipObj,
  computerGuesses: number[],
  lastHit: number
) => {
  // check if last hit was apart of a sunken ship, if it was, return a random guess
  const sunkenShips = getSunkenShips(ships, computerGuesses);
  const sunkenShipSquares = sunkenShips
    .map((ship) => ships[ship])
    .flat()
    .map(([x, y]) => getIndex(x, y));
  if (sunkenShipSquares.includes(lastHit)) {
    return getRandomComputerGuess(Object.values(ships).flat(), computerGuesses);
  }
  // if last hit was not part of a sunken ship, determine if the ship is vertical or horizontal
  const isHorizontal =
    isGuessedHit(lastHit - 1, Object.values(ships), computerGuesses) ||
    isGuessedHit(lastHit + 1, Object.values(ships), computerGuesses);
  const isVertical =
    isGuessedHit(lastHit - 10, Object.values(ships), computerGuesses) ||
    isGuessedHit(lastHit + 10, Object.values(ships), computerGuesses);
  if (isHorizontal) {
    return getHorizontalGuess(
      Object.values(ships).flat(),
      computerGuesses,
      lastHit
    );
  }
  if (isVertical) {
    const guess = getVerticalGuess(
      Object.values(ships).flat(),
      computerGuesses,
      lastHit
    );
    return guess;
  }
  // if we can't determine if the ship is vertical or horizontal, it's a single square ship
  // we should return an open square from above, below, left, or right
  const [x, y] = getXY(lastHit);
  const adjacentSquares = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  const available = adjacentSquares.find(
    (square) => !computerGuesses.includes(getIndex(square[0], square[1]))
  );
  if (!available) {
    return getRandomComputerGuess(Object.values(ships).flat(), computerGuesses);
  }
  return getIndex(available[0], available[1]);
};

export const getComputerGuess = (
  userShips: TShipObj,
  computerGuesses: number[]
) => {
  const ships = Object.values(userShips).flat();

  // if no guesses, get random guess
  if (computerGuesses.length === 0) {
    return getRandomComputerGuess(ships, computerGuesses);
  }
  const lastGuess = computerGuesses[computerGuesses.length - 1];
  // if last guess was a hit, get next move based on last hit
  if (isHit(lastGuess, ships)) {
    return getNextMoveIfPrevWasHit(computerGuesses, lastGuess, ships);
  }
  // if last guess was a miss, get most recent hit and determine next move
  const lastHit = getLastHit(ships, computerGuesses);
  // if no hits have been made, get random guess
  if (!lastHit) {
    return getRandomComputerGuess(ships, computerGuesses);
  }
  return getNextMoveBasedOnLastHit(userShips, computerGuesses, lastHit);
};
