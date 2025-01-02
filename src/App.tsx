import { useMemo, useState } from "react";
import { Board } from "./components/board";
import {
  allShipsPlaced,
  createComputerShips,
  DEFAULT_SHIPS,
  getIndex,
  isHit,
  isWinner,
  placeShip,
  quickStartPos,
  SHIPS,
  TShip,
  TShipObj,
} from "./ship-utils";
import { Button } from "./components/ui/button";
import { ShipSelection } from "./components/ship-selection";
import { Square } from "./components/square";
import { useComputerTurn } from "./use-computer-turn";
import { usePlayerTurn } from "./use-player-turn";
import { EndGameDialog } from "./components/end-game-dialog";

function App() {
  const [player, setPlayer] = useState<"computer" | "user">("user");
  const [gameState, setGameState] = useState<
    "setup" | "playing" | "won" | "lost"
  >("setup");

  const computerShips = useMemo(() => createComputerShips(), []);
  const [selectedShip, setSelectedShip] =
    useState<keyof typeof SHIPS>("carrier");

  const [userShips, setUserShips] = useState<TShipObj>(DEFAULT_SHIPS);

  const checkGameState = () => {
    const isUserWinner = isWinner(computerShips, userGuesses);
    const isComputerWinner = isWinner(
      Object.values(userShips),
      computerGuesses
    );

    if (isUserWinner) {
      return setGameState("won");
    }
    if (isComputerWinner) {
      return setGameState("lost");
    }
    setPlayer((prevPlayer) => (prevPlayer === "user" ? "computer" : "user"));
  };

  const { onPlayerClick, userGuesses, turnCount, onResetPlayer } =
    usePlayerTurn(checkGameState);
  const { computerGuesses, onResetComputer, onNextTurn } = useComputerTurn(
    userShips,
    checkGameState,
    player === "computer"
  );

  const resetGame = () => {
    setGameState("setup");
    setUserShips(DEFAULT_SHIPS);
    onResetPlayer();
    onResetComputer();
    setPlayer("user");
  };

  const handleSquareClick = (i: number) => {
    if (gameState === "setup") {
      setUserShips((prev) => placeShip(i, selectedShip, prev));
    }
    if (gameState === "playing" && player === "user") {
      onPlayerClick(i);
    }
  };

  const squareMarker = (i: number, ships: TShip[]) => {
    if (!isHit(i, ships.flat())) {
      return "Ⓧ";
    }
    return "💥";
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Battleship</h1>
        <h5>
          {gameState} {player}
        </h5>
      </div>
      <Board>
        {Array.from({ length: 100 }, (_, i) => i).map((i) => (
          <Square onClick={() => handleSquareClick(i)} key={i}>
            {/* <span className="absolute left-0 top-0 text-xs text-slate-300">
              {i}
            </span> */}
            {gameState === "setup" &&
            Object.values(userShips).some((ship) =>
              ship.some(([x, y]) => getIndex(x, y) === i)
            )
              ? "🚢"
              : null}
            {gameState === "playing" && player === "user"
              ? userGuesses.includes(i)
                ? squareMarker(i, computerShips)
                : null
              : null}
            {gameState === "playing" && player === "computer"
              ? computerGuesses.includes(i)
                ? squareMarker(i, Object.values(userShips))
                : null
              : null}
          </Square>
        ))}
      </Board>
      {gameState === "setup" ? (
        <div className="flex flex-col gap-2">
          <ShipSelection selected={selectedShip} onSelect={setSelectedShip} />
          <Button
            onClick={() => setGameState("playing")}
            disabled={!allShipsPlaced(userShips)}
          >
            Start game
          </Button>
          <Button
            onClick={() => {
              setGameState("playing");
              setUserShips(quickStartPos);
            }}
          >
            Quick Start
          </Button>
        </div>
      ) : null}
      {gameState === "playing" ? (
        <div>
          <Button variant="ghost" onClick={onNextTurn}>
            NEXT
          </Button>
          <p className="font-bold">Missles</p>
          <div className="flex gap-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={turnCount > i ? "text-slate-300" : ""}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {gameState === "won" || gameState === "lost" ? (
        <EndGameDialog isWinner={gameState === "won"} onClick={resetGame} />
      ) : null}
    </div>
  );
}

export default App;
