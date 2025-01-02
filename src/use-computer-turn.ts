import { useEffect, useState } from "react";
import { getComputerGuess } from "./computer-turn-utils";
import { TShipObj } from "./ship-utils";

export const useComputerTurn = (
  userShips: TShipObj,
  onEndTurn: () => void,
  isComputerTurn: boolean
) => {
  const [computerGuesses, setComputerGuesses] = useState<number[]>([]);
  const [turnCount, setTurnCount] = useState(0);

  useEffect(() => {
    if (!isComputerTurn) {
      setTurnCount(0);
      return;
    }
    let timeout: NodeJS.Timeout;
    const interval = setInterval(() => {
      setComputerGuesses((prev) => [
        ...prev,
        getComputerGuess(userShips, prev),
      ]);
      setTurnCount((prev) => prev + 1);
    }, 300);
    if (turnCount > 4) {
      timeout = setTimeout(() => {
        clearInterval(interval);
        onEndTurn();
      }, 300);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isComputerTurn, onEndTurn, turnCount, userShips]);

  const onNextTurn = () => {
    setComputerGuesses((prev) => [...prev, getComputerGuess(userShips, prev)]);
    setTurnCount((prev) => prev + 1);
  };

  const onReset = () => {
    setComputerGuesses([]);
    setTurnCount(0);
  };

  return { computerGuesses, onResetComputer: onReset, onNextTurn };
};
