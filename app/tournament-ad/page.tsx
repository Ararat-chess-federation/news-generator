"use client";

import { useState } from "react";
import Select from "../../src/components/select/Select";
import {
  days,
  months,
  places,
  tournaments,
} from "../../src/constants/selectOptions";

function TournamentAd() {
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [selectedMonths, setSelectedMonths] = useState(
    Array(10).fill(months[0])
  );
  const [selectedDays, setSelectedDays] = useState(Array(10).fill(days[0]));
  const [selectedTimes, setSelectedTimes] = useState(Array(10).fill("15:00"));
  const [deadLineMonth, setDeadLineMonth] = useState(months[0]);
  const [deadLineDay, setDeadLineDay] = useState(days[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleMonthChange = (index: number, value: string) => {
    const newMonths = [...selectedMonths];
    newMonths[index] = value;
    setSelectedMonths(newMonths);
  };

  const handleDayChange = (index: number, value: string) => {
    const newDays = [...selectedDays];
    newDays[index] = value;
    setSelectedDays(newDays);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...selectedTimes];
    newTimes[index] = value;
    setSelectedTimes(newTimes);
  };

  const generateFinalText = () => {
    const days = selectedDays.slice(0, selectedDays.indexOf("0"));
    const startDate = `${selectedMonths[0]}ի ${selectedDays[0]}-ից`;
    const endDate = `${selectedMonths[days.length - 1]}ի ${
      selectedDays[days.length - 1]
    }-ը`;

    const term = `${
      startDate.charAt(0).toUpperCase() + startDate.slice(1)
    } ${endDate}`;

    const intro = `${term} ${selectedPlace} տեղի կունենա ${selectedTournament} որակավորման մրցաշար հետևյալ ժամանակացույցով՝\n`;
    const schedule = days.reduce((acc, val, idx) => {
      return (
        acc +
        `- Տուր ${idx + 1}՝ ${selectedMonths[idx]}ի ${selectedDays[idx]} ժամը ${
          selectedTimes[idx]
        }\n`
      );
    }, "");
    const deadline = `Գրանցման վերջնաժամկետն է՝ ${deadLineMonth} ${deadLineDay} ժամը 18:00։`;
    const number = `Գրանցվելու համար զանգահարել ${phoneNumber} հեռախոսահամարով`;
    return intro + schedule + deadline + number;
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
      {[...Array(10)].map((_, i) => (
        <div style={{ display: "flex", alignItems: "center" }} key={i}>
          Տուր {i + 1}
          <Select
            selectedOption={selectedMonths[i]}
            setSelectedOption={(value: string) => handleMonthChange(i, value)}
            values={months}
            title="Ամիս"
          />
          <Select
            selectedOption={selectedDays[i]}
            setSelectedOption={(value: string) => handleDayChange(i, value)}
            values={days}
            title="Օր"
          />
          Ժամ
          <input
            type="time"
            value={selectedTimes[i]}
            onChange={(e) => handleTimeChange(i, e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>
      ))}
      Գրանցման Վերջնաժամկետ
      <Select
        selectedOption={deadLineMonth}
        setSelectedOption={(value: string) => setDeadLineMonth(value)}
        values={months}
        title="Ամիս"
      />
      <Select
        selectedOption={deadLineDay}
        setSelectedOption={(value: string) => setDeadLineDay(value)}
        values={days}
        title="Օր"
      />
      <input type="text" onChange={(e) => setPhoneNumber(e.target.value)} />
      <div>{generateFinalText()}</div>
    </div>
  );
}

export default TournamentAd;
