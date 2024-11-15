import { Dispatch, SetStateAction } from "react";
import { IPrizes } from "../../models/player";

type IPlace = "first" | "second" | "third" | "girl";

export interface IPrizerProps {
  text: string;
  setPrizes: Dispatch<SetStateAction<IPrizes>>;
  place: IPlace;
}

export default function Prizer({ text, setPrizes, place }: IPrizerProps) {
  return (
    <div style={{ marginTop: "8px" }}>
      <PrizerLabel
        label={text}
        place={place}
        setPrizes={setPrizes}
        type="player"
      />
      <PrizerLabel
        label="մարզիչ՝"
        place={place}
        setPrizes={setPrizes}
        type="trainer"
      />
      <PrizerLabel
        label="Միավոր"
        place={place}
        setPrizes={setPrizes}
        type="points"
      />
      )
    </div>
  );
}

function PrizerLabel({
  label,
  setPrizes,
  type,
  place,
}: {
  label: string;
  setPrizes: Dispatch<SetStateAction<IPrizes>>;
  type: "player" | "trainer" | "points";
  place: IPlace;
}) {
  const inputType = type === "points" ? "number" : "text";
  return (
    <>
      <label>{label} </label>
      <input
        type={inputType}
        onChange={(e) =>
          setPrizes((prev) => {
            return {
              ...prev,
              [place]: {
                ...prev[place],
                [type]: e.target.value,
              },
            };
          })
        }
      />
    </>
  );
}
