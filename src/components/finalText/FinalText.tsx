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
  const generateText = () => {
    return `
      ${selectedPlace} ավարտվեց ${selectedTournament} մրցաշարը։ Կարգեր լրացրած
      մասնակիցներն են՝ \n
      ${players.map((el) => `${el.player}, մարզիչ՝ ${el.trainer}`).join("\n")}
  
      Լավագույն աղջիկ՝ ${prizes.girl.player} (մարզիչ՝ ${prizes.girl.trainer})\n
      3 - ${prizes.third.player} (մարզիչ՝ ${prizes.third.trainer})\n
      2 - ${prizes.second.player} (մարզիչ՝ ${prizes.second.trainer})\n
      1 - ${prizes.first.player} (մարզիչ՝ ${prizes.first.trainer})\n
    `;
  };

  return (
    <div className="final_container">
      <div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(generateText());
          }}
        >
          📄
        </button>
      </div>
      {generateText()}
    </div>
  );
}
