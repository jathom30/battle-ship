import { useMemo, useState } from "react";
import { Board } from "./components/board";
import {
  allShipsPlaced,
  autoplaceShips,
  DEFAULT_SHIPS,
  getIndex,
  isHit,
  isWinner,
  placeShip,
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
import { getSunkenShips } from "./computer-turn-utils";
import { Badge } from "./components/ui/badge";

function App() {
  const [player, setPlayer] = useState<"computer" | "user">("user");
  const [gameState, setGameState] = useState<
    "setup" | "playing" | "won" | "lost"
  >("setup");
  const computerShips = useMemo(autoplaceShips, []);
  const [selectedShip, setSelectedShip] =
    useState<keyof typeof SHIPS>("carrier");

  const [userShips, setUserShips] = useState<TShipObj>(DEFAULT_SHIPS);

  const checkGameState = () => {
    const isUserWinner = isWinner(Object.values(computerShips), userGuesses);
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
  const { computerGuesses, onResetComputer } = useComputerTurn(
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
    setSelectedShip("carrier");
  };

  const handleSquareClick = (i: number) => {
    if (gameState === "setup") {
      setUserShips((prev) => placeShip(i, selectedShip, prev));
    }
    if (gameState === "playing" && player === "user") {
      onPlayerClick(i);
    }
  };

  const squareMarker = (guesses: number[], i: number, ships: TShip[]) => {
    if (!guesses.includes(i)) return null;
    if (!isHit(i, ships.flat())) {
      return "Ⓧ";
    }
    return "💥";
  };

  const sunkenUserShips = getSunkenShips(userShips, computerGuesses);
  const sunkenComputerShips = getSunkenShips(computerShips, userGuesses);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Battleship</h1>
        <Badge variant="secondary" className="capitalize">
          {gameState} {player}
        </Badge>
      </div>
      <Board>
        {Array.from({ length: 100 }, (_, i) => i).map((i) => (
          <Square onClick={() => handleSquareClick(i)} key={i}>
            {gameState === "setup" &&
            Object.values(userShips).some((ship) =>
              ship.some(([x, y]) => getIndex(x, y) === i)
            )
              ? "🚢"
              : null}
            {gameState === "playing" && player === "user"
              ? squareMarker(userGuesses, i, Object.values(computerShips))
              : null}
            {gameState === "playing" && player === "computer"
              ? squareMarker(computerGuesses, i, Object.values(userShips))
              : null}
          </Square>
        ))}
      </Board>
      {gameState === "setup" ? (
        <div className="flex flex-col gap-2">
          <ShipSelection
            ships={userShips}
            selected={selectedShip}
            onSelect={setSelectedShip}
          />
          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => setGameState("playing")}
              disabled={!allShipsPlaced(userShips)}
            >
              Start game
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                setGameState("playing");
                setUserShips(autoplaceShips());
              }}
            >
              Auto-place ships
            </Button>
          </div>
        </div>
      ) : null}
      {gameState === "playing" ? (
        <div>
          <p className="font-bold">Missles</p>
          <div className="flex gap-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={turnCount > i ? "text-slate-300" : ""}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="font-bold">
            {player === "computer" ? "User" : "Computer"} Ships Sunk
          </div>
          <div className="flex gap-4">
            {Object.keys(SHIPS).map((ship) => (
              <span
                className={`capitalize ${
                  (player === "computer"
                    ? sunkenUserShips
                    : sunkenComputerShips
                  ).includes(ship as keyof TShipObj)
                    ? "font-bold"
                    : "text-slate-300"
                }`}
                key={ship}
              >
                {ship}
              </span>
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
