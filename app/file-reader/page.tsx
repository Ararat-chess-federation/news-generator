"use client";

import { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";
import getPrizersByJSON from "../../src/helpers/fileReader/getPlayer";
import generateFinalText from "../../src/helpers/generateFinalText";

export default function ExcelReader() {
  const [data, setData] = useState("");
  const [players, setPlayer] = useState({});

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryString = e?.target?.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils
        .sheet_to_json<{ [key: string]: string }>(worksheet)
        .slice(4);

      const players = getPrizersByJSON(jsonData);
      const { first, second, third, prizers } = players;
      const text = generateFinalText("p", "t", prizers, {
        first,
        second,
        third,
        girl: first,
      });
      setData(text);
    };

    reader.readAsBinaryString(file as File);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <p>{data}</p>
    </div>
  );
}
