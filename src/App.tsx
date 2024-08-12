import { ChangeEvent, useState } from "react";
import FinalText from "./components/finalText/FinalText.js";
import Prizer from "./components/prizer/Prizer.js";
import Select from "./components/select/Select.js";
import CategoryPlayers from "./components/tournament/Tournament.js";
import { defaultPlayer, defaultPrizes, prizers } from "./constants/players.js";
import { places, tournaments } from "./constants/selectOptions.js";
import { IPlayer } from "./models/player.js";
import "./App.css";

function App() {
  const [selectedPlace, setSelectedPlace] = useState<string>(places[0]);
  const [selectedTournament, setSelectedTournament] = useState<string>(
    tournaments[0]
  );
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
      <FinalText
        selectedPlace={selectedPlace}
        selectedTournament={selectedTournament}
        players={players}
        prizes={prizes}
      />
    </div>
  );
}

export default App;
