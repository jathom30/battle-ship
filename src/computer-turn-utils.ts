import {
  getIndex,
  getXY,
  isConsecutive,
  isHit,
  isWithinBounds,
  TShip,
} from "./ship-utils";

export const getRandomComputerGuess = (
  userShips: TShip,
  computerGuesses: number[]
): number => {
  if (computerGuesses.length === 100) {
    return -1;
  }
  const guess = Math.floor(Math.random() * 100);
  if (computerGuesses.includes(guess)) {
    return getRandomComputerGuess(userShips, computerGuesses);
  }
  return guess;
};

// TODO - implement the isFoundShip function
export const isFoundShip = (
  ships: TShip,
  guesses: number[],
  shipLength: number
) => {
  // ship is likely found if there is a straight line of computer guesses of the same length
  const hits = guesses
    .map((guess) => getXY(guess))
    .filter(([x, y]) => isHit(getIndex(x, y), ships));
  const rowsOfHits = hits.reduce((acc, [x, y]) => {
    if (acc[x]) {
      acc[x].push(y);
    } else {
      acc[x] = [y];
    }
    return acc;
  }, {} as Record<number, number[]>);
  const colsOfHits = hits.reduce((acc, [x, y]) => {
    if (acc[y]) {
      acc[y].push(x);
    } else {
      acc[y] = [x];
    }
    return acc;
  }, {} as Record<number, number[]>);
  return [...Object.values(rowsOfHits), ...Object.values(colsOfHits)].some(
    (line) => isConsecutive(line) && line.length >= shipLength
  );
};

const getVerticalGuess = (
  ships: TShip,
  computerGuesses: number[],
  lastGuess: number
) => {
  const [x, y] = getXY(lastGuess);
  const [up, down] = [x - 1, x + 1].map((x) => getIndex(x, y));
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
  const [x, y] = getXY(lastGuess);
  const [left, right] = [y - 1, y + 1].map((y) => getIndex(x, y));
  if (left >= 0 && !computerGuesses.includes(left)) {
    return left;
  }
  if (right < 100 && !computerGuesses.includes(right)) {
    return right;
  }
  return getRandomComputerGuess(ships, computerGuesses);
};

const getLastHit = (userShips: TShip, computerGuesses: number[]) => {
  const hits = computerGuesses.filter((i) => isHit(i, userShips));
  if (!hits) return null;
  return hits[hits.length - 1];
};

const getNextMoveBasedOnLastHit = (
  computerGuesses: number[],
  lastHit: number
) => {
  const [x, y] = getXY(lastHit);
  const adjacentSquares = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  const availableSquares = adjacentSquares
    .filter(
      ([x, y]) =>
        isWithinBounds(x, y) && !computerGuesses.includes(getIndex(x, y))
    )
    .map(([x, y]) => getIndex(x, y));
  return availableSquares;
};

export const getComputerGuess = (
  userShips: TShip,
  computerGuesses: number[]
) => {
  // if no guesses, get random guess
  if (computerGuesses.length === 0) {
    return getRandomComputerGuess(userShips, computerGuesses);
  }
  // if last guess was a miss, get random guess
  const lastGuess = computerGuesses[computerGuesses.length - 1];
  if (!isHit(lastGuess, userShips)) {
    const lastHit = getLastHit(userShips, computerGuesses);
    if (!lastHit) {
      return getRandomComputerGuess(userShips, computerGuesses);
    }
    const nextMoveBasedOnLastHit = getNextMoveBasedOnLastHit(
      computerGuesses,
      lastHit
    );
    if (nextMoveBasedOnLastHit.length === 0) {
      return getRandomComputerGuess(userShips, computerGuesses);
    }
    return nextMoveBasedOnLastHit[0];
  }
  const [x, y] = getXY(lastGuess);
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
      isHit(getIndex(x, y), userShips) &&
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
    return getHorizontalGuess(userShips, computerGuesses, lastGuess);
  }
  if (isVertical) {
    return getVerticalGuess(userShips, computerGuesses, lastGuess);
  }
  return getRandomComputerGuess(userShips, computerGuesses);
};
