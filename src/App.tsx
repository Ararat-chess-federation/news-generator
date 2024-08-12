import { ChangeEvent, useState } from "react";
import FinalText from "./components/finalText/FinalText.js";
import Select from "./components/select/Select.js";
import CategoryPlayers from "./components/tournament/Tournament.js";
import { defaultPlayer, defaultPrizes, prizers } from "./constants/players.js";
import { places, tournaments } from "./constants/selectOptions.js";
import { IPlayer, IPrizes } from "./models/player.js";
import "./App.css";
import PrizersList from "./components/prizer/PrizersList.js";

function App() {
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [prizes, setPrizes] = useState<IPrizes>(defaultPrizes);

  const addInputField = () => {
    setPlayers([...players, { ...defaultPlayer }]);
  };

  const removeInputField = (index: number) => {
    const newInputFields = players.filter((_, idx) => idx !== index);

    setPlayers(newInputFields);
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
      <PrizersList prizers={prizers} setPrizes={setPrizes} />
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
