import generateFinalText from "../../helpers/generateFinalText";
import { IPlayer, IPrizes } from "../../models/player";
import "./FinalText.css";

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

  return (
    <div className="final_container">
      <div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(finalText);
          }}
        >
          📄
        </button>
      </div>
      {finalText}
    </div>
  );
}
