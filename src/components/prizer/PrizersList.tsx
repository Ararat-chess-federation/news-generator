import { Dispatch } from "react";
import { IPrizes } from "../../models/player";
import Prizer from "./Prizer";

interface IPrizersListProps {
  prizers: { girl: string; third: string; second: string; winner: string };
  setPrizes: Dispatch<React.SetStateAction<IPrizes>>;
}

export default function PrizersList({ prizers, setPrizes }: IPrizersListProps) {
  return (
    <div style={{ marginTop: "16px" }}>
      <Prizer text={prizers.girl} setPrizes={setPrizes} place="girl" />
      <Prizer text={prizers.third} setPrizes={setPrizes} place="third" />
      <Prizer text={prizers.second} setPrizes={setPrizes} place="second" />
      <Prizer text={prizers.winner} setPrizes={setPrizes} place="first" />
    </div>
  );
}
