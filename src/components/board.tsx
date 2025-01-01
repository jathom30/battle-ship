import { ReactNode } from "react";

export const Board = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="aspect-square grid grid-cols-11 grid-rows-11  max-h-screen w-full">
      <span />
      <span className="self-center text-center">1</span>
      <span className="self-center text-center">2</span>
      <span className="self-center text-center">3</span>
      <span className="self-center text-center">4</span>
      <span className="self-center text-center">5</span>
      <span className="self-center text-center">6</span>
      <span className="self-center text-center">7</span>
      <span className="self-center text-center">8</span>
      <span className="self-center text-center">9</span>
      <span className="self-center text-center">10</span>
      <div className="grid row-span-10 gap-1">
        <span className="self-center text-center">A</span>
        <span className="self-center text-center">B</span>
        <span className="self-center text-center">C</span>
        <span className="self-center text-center">D</span>
        <span className="self-center text-center">E</span>
        <span className="self-center text-center">F</span>
        <span className="self-center text-center">G</span>
        <span className="self-center text-center">H</span>
        <span className="self-center text-center">I</span>
        <span className="self-center text-center">J</span>
      </div>
      <div className="border grid col-span-10  row-span-10 grid-cols-10 grid-rows-10 items-center text-center">
        {children}
      </div>
    </div>
  );
};
