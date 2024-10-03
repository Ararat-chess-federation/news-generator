import generateFinalText from "../../helpers/generateFinalText";
import { IPlayer, IPrizes } from "../../models/player";
import TextForCopy from "../textForCopy/TextForCopy";

interface IFinalTextProps {
  selectedPlace: string;
  selectedTournament: string;
  players: IPlayer[];
  prizes: IPrizes;
}

export default function FinalText({
  selectedPlace,
  selectedTournament,
  players,
  prizes,
}: IFinalTextProps) {
  const finalText = generateFinalText(
    selectedPlace,
    selectedTournament,
    players,
    prizes
  );

  return <TextForCopy text={finalText} />;
}
