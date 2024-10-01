"use client";

import { ChangeEvent, useState } from "react";
import FinalText from "../../src/components/finalText/FinalText";
import PrizersList from "../../src/components/prizer/PrizersList";
import Select from "../../src/components/select/Select";
import CategoryPlayers from "../../src/components/tournament/Tournament";
import {
  defaultPlayer,
  defaultPrizes,
  prizers,
} from "../../src/constants/players";
import { places, tournaments } from "../../src/constants/selectOptions";
import { IPlayer, IPrizes } from "../../src/models/player";

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
    <div className="container">
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
          handleInputChange={handleInputChange}
          players={players}
          removeInputField={removeInputField}
        />
      </div>
      <PrizersList prizers={prizers} setPrizes={setPrizes} />
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
