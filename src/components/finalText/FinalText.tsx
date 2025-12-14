import generateFinalText from "../../helpers/generateFinalText";
import { IFinalTextProps } from "../../models/finalText";
import TextForCopy from "../textForCopy/TextForCopy";

export default function FinalText({
  selectedPlace,
  selectedTournament,
  players,
  prizes,
}: IFinalTextProps) {
  const finalText = generateFinalText(
    {
      selectedPlace,
      selectedTournament,
      players,
      prizes
    }
  );

  return <TextForCopy text={finalText} />;
}
