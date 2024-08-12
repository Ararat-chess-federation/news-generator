import { Dispatch } from "react";
import { IPrizes } from "../../models/player.js";
import Prizer from "./Prizer.js";

interface IPrizersListProps {
  prizers: { girl: string; third: string; second: string; winner: string };
  setPrizes: Dispatch<React.SetStateAction<IPrizes>>;
}

export default function PrizersList({ prizers, setPrizes }: IPrizersListProps) {
  return (
    <div>
      <Prizer text={prizers.girl} setPrizes={setPrizes} place="girl" />
      <p>Մրցանակային տեղ գրաված շախմատիստներն են՝ </p>
      <Prizer text={prizers.third} setPrizes={setPrizes} place="third" />
      <Prizer text={prizers.second} setPrizes={setPrizes} place="second" />
      <Prizer text={prizers.winner} setPrizes={setPrizes} place="first" />
    </div>
  );
}
