"use client";

import { useState } from "react";
import AdText from "../../src/components/adText/AdText";
import Select from "../../src/components/select/Select";
import {
  days,
  months,
  places,
  tournaments,
} from "../../src/constants/selectOptions";
import "./TournamentAd.css";

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

  return (
    <div className="container">
      <h2>Վայր և մրցաշար</h2>
      <section className="ad_intro">
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
      </section>
      <h2>Տուրեր</h2>
      <p>*Ավելորդ դաշտերը թողնել անփոփոխ</p>
      <div className="schedule_container">
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <p>Տուր {i + 1}</p>
            <div className="round_container">
              <Select
                selectedOption={selectedMonths[i]}
                setSelectedOption={(value: string) =>
                  handleMonthChange(i, value)
                }
                values={months}
                title="Ամիս"
              />
              <Select
                selectedOption={selectedDays[i]}
                setSelectedOption={(value: string) => handleDayChange(i, value)}
                values={days}
                title="Օր"
              />
              <div style={{ marginTop: "16px" }}>
                <div>Ժամ</div>
                <input
                  type="time"
                  value={selectedTimes[i]}
                  onChange={(e) => handleTimeChange(i, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2>Գրանցման Վերջնաժամկետ</h2>
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
      <AdText
        selectedPlace={selectedPlace}
        selectedTournament={selectedTournament}
        selectedMonths={selectedMonths}
        selectedDays={selectedDays}
        selectedTimes={selectedTimes}
        deadLineMonth={deadLineMonth}
        deadLineDay={deadLineDay}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}

export default TournamentAd;
