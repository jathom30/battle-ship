import { SHIPS } from "@/ship-utils";
import { Button } from "./ui/button";

export const ShipSelection = ({
  onSelect,
  selected,
}: {
  selected: keyof typeof SHIPS;
  onSelect: (ship: keyof typeof SHIPS) => void;
}) => {
  return (
    <div>
      <h5 className="font-bold">Select which ship to place</h5>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(SHIPS).map(([ship, length]) => (
          <Button
            key={ship}
            onClick={() => onSelect(ship as keyof typeof SHIPS)}
            variant={selected === ship ? "default" : "outline"}
          >
            {ship} ({length})
          </Button>
        ))}
      </div>
    </div>
  );
};
