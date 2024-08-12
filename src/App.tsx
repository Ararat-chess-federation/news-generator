import { ChangeEvent, useState } from "react";
import "./App.css";
import Prizer from "./components/prizer/Prizer.js";
import Select from "./components/select/Select.js";
import CategoryPlayers from "./components/tournament/Tournament.js";

const places = [
  "Արտաշատ քաղաքում",
  "Մասիս քաղաքում",
  "Վեդի քաղաքում",
  "Հայաստանի շախմատի ակադեմիայում",
  "Տիգրան Պետրոսյանի անվան շախմատի տուն մարզադպրոցում",
];

const tournaments = ["1-ին կարգի մրցաշար", "2", "3", "4"];

export const defaultPlayer: IPlayer = { player: "", trainer: "" };
export interface IPlayer {
  player: string;
  trainer: string;
}

export const prizers = {
  third: "3-րդ տեղ՝",
  second: "2-րդ տեղ՝",
  winner: "Մրցաշարի հաղթող դարձավ",
  girl: "Լավագույն աղջիկ ճանաչվեց",
};

export const defaultPrizes = {
  first: { ...defaultPlayer },
  second: { ...defaultPlayer },
  third: { ...defaultPlayer },
  girl: { ...defaultPlayer },
};

function App() {
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [prizes, setPrizes] = useState(defaultPrizes);

  const addInputField = () => {
    setPlayers([...players, { ...defaultPlayer }]);
  };

  const handleInputChange = (
    idx: number,
    e: ChangeEvent<HTMLInputElement>,
    name: "player" | "trainer"
  ) => {
    const newInputFields = [...players];
    newInputFields[idx][name] = e.target.value;
    setPlayers(newInputFields);
  };

  const removeInputField = (index: number) => {
    const newInputFields = players.filter((_, idx) => idx !== index);

    setPlayers(newInputFields);
  };

  return (
    <div>
      <div>
        <Select
          selectedOption={selectedPlace}
          setSelectedOption={setSelectedPlace}
          values={places}
          title="Վայր"
        />
      </div>
      <div>
        <Select
          selectedOption={selectedTournament}
          setSelectedOption={setSelectedTournament}
          values={tournaments}
          title="Մրցաշար"
        />
      </div>
      <div>
        <CategoryPlayers
          addInputField={addInputField}
          category={selectedTournament}
          handleInputChange={handleInputChange}
          players={players}
          removeInputField={removeInputField}
        />
      </div>
      <div>
        <Prizer text={prizers.girl} setPrizes={setPrizes} place="girl" />
        <p>Մրցանակային տեղ գրաված շախմատիստներն են՝ </p>
        <Prizer text={prizers.third} setPrizes={setPrizes} place="third" />
        <Prizer text={prizers.second} setPrizes={setPrizes} place="second" />
        <Prizer text={prizers.winner} setPrizes={setPrizes} place="first" />
      </div>
      <hr />
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
          <p>Լավագույն աղջիկ՝ {prizes.girl.player} (մարզիչ՝ {prizes.girl.trainer})</p>
          <p>3 - {prizes.third.player} (մարզիչ՝ {prizes.third.trainer})</p>
          <p>2 - {prizes.second.player} (մարզիչ՝ {prizes.second.trainer})</p>
          <p>1 - {prizes.first.player} (մարզիչ՝ {prizes.first.trainer})</p>
        </div>
      </div>
    </div>
  );
}

export default App;
