import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const EndGameDialog = ({
  isWinner,
  onClick,
}: {
  isWinner: boolean;
  onClick: () => void;
}) => {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isWinner ? "Congrats!" : "Better luck next time!"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isWinner ? "You won!" : "You lost!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClick}>Restart</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
