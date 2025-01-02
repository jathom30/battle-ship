import { useState } from "react";

export const usePlayerTurn = (onEndTurn: () => void) => {
  const [userGuesses, setUserGuesses] = useState<number[]>([]);
  const [turnCount, setTurnCount] = useState(0);

  const onPlayerClick = (i: number) => {
    const isNewGuess = !userGuesses.includes(i);
    setUserGuesses((prev) => [...prev, i]);
    const newTurnCount = isNewGuess ? turnCount + 1 : turnCount;
    setTurnCount(newTurnCount);

    if (turnCount > 3) {
      setTimeout(() => {
        onEndTurn();
        setTurnCount(0);
      }, 300);
    }
  };

  const onReset = () => {
    setUserGuesses([]);
    setTurnCount(0);
  };

  return { userGuesses, onPlayerClick, turnCount, onResetPlayer: onReset };
};
