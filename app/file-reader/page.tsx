"use client";

import { ChangeEvent, useState } from "react";
import FinalText from "../../src/components/finalText/FinalText";
import getJsonFromEvent from "../../src/helpers/fileReader/getJsonFromEvent";
import {
  getPrizersByJSON,
  getTournamentInfo,
} from "../../src/helpers/fileReader/getTournamentData";
import { defaultPrizes } from "../../src/constants/players";
import { IPlayer } from "../../src/models/player";
import { ITournament } from "../../src/models/tournament";

const defaultData = {
  ...defaultPrizes,
  prizers: [],
};

export default function ExcelReader() {
  const [data, setData] = useState<ITournament>(defaultData);
  const [info, setInfo] = useState({ place: "", tournament: "" });

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const jsonData = getJsonFromEvent(e);
      const { place, tournament, finalTable } = getTournamentInfo(jsonData);
      const players = getPrizersByJSON(finalTable);

      setInfo({ place, tournament });
      setData(players);
    };

    reader.readAsBinaryString(file as File);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <FinalText
        players={data?.prizers as IPlayer[]}
        selectedPlace={info.place}
        selectedTournament={info.tournament}
        prizes={data}
      />
    </div>
  );
}
