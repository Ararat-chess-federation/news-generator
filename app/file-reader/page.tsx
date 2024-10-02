"use client";

import { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";
import FinalText from "../../src/components/finalText/FinalText";
import { defaultPrizes } from "../../src/constants/players";
import {
  getPrizersByJSON,
  getTournamentInfo,
} from "../../src/helpers/fileReader/getTournamentData";
import { IPlayer } from "../../src/models/player";

export default function ExcelReader() {
  const [data, setData] = useState<{
    first: IPlayer;
    second: IPlayer;
    third: IPlayer;
    girl: IPlayer;
    prizers: IPlayer[];
  }>({ ...defaultPrizes, prizers: [] });
  const [info, setInfo] = useState({ place: "", tournament: "" });

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryString = e?.target?.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json<{ [key: string]: string }>(
        worksheet
      );

      const { place, tournament, finalTable } = getTournamentInfo(jsonData);

      setInfo({ place, tournament });
      const players = getPrizersByJSON(finalTable);

      setData(players);
    };

    reader.readAsBinaryString(file as File);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <FinalText
        players={data?.prizers as IPlayer[]}
        selectedPlace={info.place + "քաղաքում"}
        selectedTournament={info.tournament}
        prizes={data}
      />
    </div>
  );
}
