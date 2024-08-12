import { Dispatch, SetStateAction } from "react";

export interface IPrizerProps {
  text: string;
  setPrizes: Dispatch<
    SetStateAction<{
      first: { player: string; trainer: string };
      second: { player: string; trainer: string };
      third: { player: string; trainer: string };
      girl: { player: string; trainer: string };
    }>
  >;
  place: "first" | "second" | "third" | "girl";
}


export default function Prizer({ text, setPrizes, place }: IPrizerProps) {
  return (
    <div>
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
      )
    </div>
  );
}
