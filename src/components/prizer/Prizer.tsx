import { Dispatch, SetStateAction } from "react";
import { IPrizes } from "../../models/player";

export interface IPrizerProps {
  text: string;
  setPrizes: Dispatch<SetStateAction<IPrizes>>;
  place: "first" | "second" | "third" | "girl";
}

export default function Prizer({ text, setPrizes, place }: IPrizerProps) {
  return (
    <div style={{ marginTop: "8px" }}>
      <label>{text} </label>
      <input
        onChange={(e) =>
          setPrizes((prev) => {
            return {
              ...prev,
              [place]: {
                ...prev[place],
                player: e.target.value,
              },
            };
          })
        }
        type="text"
      />
      <label>(մարզիչ՝ </label>
      <input
        onChange={(e) =>
          setPrizes((prev) => {
            return {
              ...prev,
              [place]: {
                ...prev[place],
                trainer: e.target.value,
              },
            };
          })
        }
        type="text"
      />
      <label>Միավոր </label>
      <input
        type="number"
        onChange={(e) =>
          setPrizes((prev) => {
            return {
              ...prev,
              [place]: {
                ...prev[place],
                points: e.target.value,
              },
            };
          })
        }
      />
      )
    </div>
  );
}
