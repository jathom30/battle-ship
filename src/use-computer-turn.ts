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

  // useEffect(() => {
  //   if (!isComputerTurn) {
  //     setTurnCount(0);
  //     return;
  //   }
  //   const interval = setInterval(() => {
  //     setComputerGuesses((prev) => [
  //       ...prev,
  //       getComputerGuess(Object.values(userShips).flat(), prev),
  //     ]);
  //     setTurnCount((prev) => prev + 1);
  //   }, 1000);
  //   if (turnCount > 24) {
  //     clearInterval(interval);
  //     onEndTurn();
  //   }
  //   return () => clearInterval(interval);
  // }, [isComputerTurn, onEndTurn, turnCount, userShips]);

  const onNextTurn = () => {
    setComputerGuesses((prev) => [
      ...prev,
      getComputerGuess(Object.values(userShips).flat(), prev),
    ]);
    setTurnCount((prev) => prev + 1);
  };

  const onReset = () => {
    setComputerGuesses([]);
    setTurnCount(0);
  };

  return { computerGuesses, onResetComputer: onReset, onNextTurn };
};
