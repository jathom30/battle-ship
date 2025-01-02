import { SHIPS, TShipObj } from "@/ship-utils";
import { Button } from "./ui/button";

export const ShipSelection = ({
  ships,
  onSelect,
  selected,
}: {
  ships: TShipObj;
  selected: keyof typeof SHIPS;
  onSelect: (ship: keyof typeof SHIPS) => void;
}) => {
  const isPlaced = (ship: keyof typeof SHIPS) =>
    ships[ship].length === SHIPS[ship];
  return (
    <div>
      <h5 className="font-bold">Select which ship to place</h5>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(SHIPS).map(([ship, length]) => (
          <Button
            key={ship}
            onClick={() => onSelect(ship as keyof typeof SHIPS)}
            variant={
              selected === ship
                ? "default"
                : isPlaced(ship as keyof typeof SHIPS)
                ? "secondary"
                : "outline"
            }
          >
            {ship} ({length})
          </Button>
        ))}
      </div>
    </div>
  );
};
