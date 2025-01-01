import { ReactNode } from "react";

export const Square = ({
  children,
  onClick,
}: {
  children?: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="relative border h-full flex justify-center items-center hover:bg-gray-200"
    >
      {children}
    </button>
  );
};
