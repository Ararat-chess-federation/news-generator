import { IPlayer } from "../../models/player.js";

interface IFinalTextProps {
  selectedPlace: string;
  selectedTournament: string;
  players: IPlayer[];
  prizes: { girl: IPlayer; third: IPlayer; second: IPlayer; first: IPlayer };
}

export default function FinalText({
  selectedPlace,
  selectedTournament,
  players,
  prizes,
}: IFinalTextProps) {
  return (
    <div>
      <div>
        {selectedPlace} ավարտվեց {selectedTournament} մրցաշարը։ Կարգեր լրացրած
        մասնակիցներն են՝
        {players.map(
          (el, idx) =>
            el.player && (
              <div key={idx}>
                {" "}
                <span>{el.player}</span>, մարզիչ՝ <span>{el.trainer}</span>{" "}
              </div>
            )
        )}
      </div>
      <div>
        <p>
          Լավագույն աղջիկ՝ {prizes.girl.player} (մարզիչ՝ {prizes.girl.trainer})
        </p>
        <p>
          3 - {prizes.third.player} (մարզիչ՝ {prizes.third.trainer})
        </p>
        <p>
          2 - {prizes.second.player} (մարզիչ՝ {prizes.second.trainer})
        </p>
        <p>
          1 - {prizes.first.player} (մարզիչ՝ {prizes.first.trainer})
        </p>
      </div>
    </div>
  );
}
