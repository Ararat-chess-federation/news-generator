"use client";

import { useEffect, useState, useRef } from "react";
import AdText from "../../src/components/adText/AdText";
import Select from "../../src/components/select/Select";
import {
  days,
  months,
  places,
  tournaments,
} from "../../src/constants/selectOptions";
import "./TournamentAd.css";

const ROUNDS = 9
const PLACE_PHONE_MAP: Record<string, string> = {
  [places[0]]: "077898910",
  [places[1]]: "044306469",
};

function TournamentAd() {
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [selectedMonths, setSelectedMonths] = useState(
    Array(ROUNDS).fill(months[0])
  );
  const [selectedDays, setSelectedDays] = useState(Array(ROUNDS).fill(days[1]));
  const [selectedTimes, setSelectedTimes] = useState(Array(ROUNDS).fill("15:00"));
  const [deadLineMonth, setDeadLineMonth] = useState(months[0]);
  const [deadLineDay, setDeadLineDay] = useState(days[0]);
  const [phoneNumber, setPhoneNumber] = useState(() => PLACE_PHONE_MAP[selectedPlace] ?? "");

  useEffect(() => {
    const month = months[new Date().getMonth() || 0];
    setSelectedMonths(Array(ROUNDS).fill(month));
    setDeadLineMonth(month)
  }, []);

  const prevPlaceRef = useRef<string | null>(null);
  useEffect(() => {
    const prevPlace = prevPlaceRef.current;
    const prevDefault = prevPlace ? PLACE_PHONE_MAP[prevPlace] ?? "" : "";
    const newDefault = PLACE_PHONE_MAP[selectedPlace] ?? "";

    if (phoneNumber === "" || phoneNumber === prevDefault) {
      setPhoneNumber(newDefault);
    }

    prevPlaceRef.current = selectedPlace;
  }, [selectedPlace, phoneNumber]);

  const handleMonthChange = (index: number, value: string) => {
    const newMonths = [...selectedMonths];
    newMonths.fill(value, index);

    if (index === 0) {
      setDeadLineMonth(value);
    }

    setSelectedMonths(newMonths);
  };

  const handleDayChange = (index: number, value: string) => {
    const newDays = [...selectedDays];
    const start = parseInt(value, 10);

    const rounds = selectedTournament === "4-րդ կարգի" ? 8 : 9;

    if (index === 1 && start === parseInt(newDays[0], 10)) {
      newDays[0] = String(start);
      newDays[1] = String(start);
      for (let pair = 0; pair < Math.ceil((rounds - 2) / 2); pair++) {
        const pairDay = Math.min(start + 1 + pair, 31);
        const i1 = 2 + pair * 2;
        const i2 = i1 + 1;
        if (i1 < rounds) newDays[i1] = String(pairDay);
        if (i2 < rounds) newDays[i2] = String(pairDay);
      }
    } else {
      for (let j = index; j < rounds; j++) {
        const day = Math.min(start + (j - index), 31);
        newDays[j] = String(day);
      }
    }

    if (index === 0) {
      setDeadLineDay(String(start));
    }

    setSelectedDays(newDays);
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...selectedTimes];
    updated[index] = value;

    const rounds = selectedTournament === "4-րդ կարգի" ? 8 : 9;
    const time1 = updated[0];
    const time2 = updated[1];

    if (time1 && time2 && time1 !== time2) {
      const newTimes = Array.from({ length: rounds }, (_v, j) =>
        j % 2 === 0 ? time1 : time2
      );
      setSelectedTimes(newTimes);
      return;
    }

    setSelectedTimes(Array(rounds).fill(value));
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
        {[...Array(selectedTournament === "4-րդ կարգի" ? 8 : 9)].map((_, i) => (
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
                hideOther={true}
              />
              <Select
                selectedOption={selectedDays[i]}
                setSelectedOption={(value: string) => handleDayChange(i, value)}
                values={days}
                title="Օր"
                hideOther={true}
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
      <div className="deadline_container">
        <Select
          selectedOption={deadLineMonth}
          setSelectedOption={(value: string) => setDeadLineMonth(value)}
          values={months}
          title="Ամիս"
          hideOther={true}
        />
        <Select
          selectedOption={deadLineDay}
          setSelectedOption={(value: string) => setDeadLineDay(value)}
          values={days}
          title="Օր"
          hideOther={true}
        />
        <div>
          <div style={{ marginTop: "16px" }}>
            <label>Հեռախոսահամար</label>
          </div>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      <AdText
        selectedPlace={selectedPlace}
        selectedTournament={selectedTournament}
        selectedMonths={selectedMonths.slice(0, selectedTournament === "4-րդ կարգի" ? 8 : 9)}
        selectedDays={selectedDays.slice(0, selectedTournament === "4-րդ կարգի" ? 8 : 9)}
        selectedTimes={selectedTimes.slice(0, selectedTournament === "4-րդ կարգի" ? 8 : 9)}
        deadLineMonth={deadLineMonth}
        deadLineDay={deadLineDay}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}

export default TournamentAd;
