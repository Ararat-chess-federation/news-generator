"use client";

import { useEffect, useState, useRef } from "react";
import AdText from "../../src/components/adText/AdText";
import Select from "../../src/components/select/Select";
import {
  days,
  months,
  places,
  tournaments,
  getDaysInMonth,
  getNextMonth,
} from "../../src/constants/selectOptions";
import "./TournamentAd.css";

const ROUNDS = 9
const PLACE_PHONE_MAP: Record<string, string> = {
  [places[0]]: "077898910",
  [places[1]]: "044306469",
};

function calculateDeadline(roundMonth: string, roundDay: number) {
  const year = new Date().getFullYear();
  const monthIndex = months.indexOf(roundMonth);
  const roundDate = new Date(year, monthIndex, roundDay);
  roundDate.setDate(roundDate.getDate() - 3);
  return {
    deadlineMonth: months[roundDate.getMonth()],
    deadlineDay: String(roundDate.getDate()),
  };
}

function getConsecutiveSchedule(rounds: number) {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const initDays: string[] = [];
  const initMonths: string[] = [];
  for (let i = 0; i < rounds; i++) {
    initDays.push(String(date.getDate()));
    initMonths.push(months[date.getMonth()]);
    date.setDate(date.getDate() + 1);
  }
  return { initDays, initMonths };
}

function TournamentAd() {
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [roundsCount, setRoundsCount] = useState(9);
  const [selectedMonths, setSelectedMonths] = useState(() => getConsecutiveSchedule(ROUNDS).initMonths);
  const [selectedDays, setSelectedDays] = useState(() => getConsecutiveSchedule(ROUNDS).initDays);
  const [selectedTimes, setSelectedTimes] = useState(Array(ROUNDS).fill("15:00"));
  const [deadLineMonth, setDeadLineMonth] = useState(() => {
    const today = new Date();
    return calculateDeadline(months[today.getMonth()], today.getDate()).deadlineMonth;
  });
  const [deadLineDay, setDeadLineDay] = useState(() => {
    const today = new Date();
    return calculateDeadline(months[today.getMonth()], today.getDate()).deadlineDay;
  });
  const [phoneNumber, setPhoneNumber] = useState(() => PLACE_PHONE_MAP[places[0]] ?? "");

  const handleDeadlineMonthChange = (value: string) => {
    setDeadLineMonth(value);
    const maxDays = getDaysInMonth(value);
    if (parseInt(deadLineDay) > maxDays) {
      setDeadLineDay(String(maxDays));
    }
  };

  useEffect(() => {
    const defaultRounds = selectedTournament === "4-րդ կարգի" ? 8 : 9;
    setRoundsCount(defaultRounds);
  }, [selectedTournament]);

  useEffect(() => {
    setSelectedMonths(prev => {
      const newArr = prev.slice(0, roundsCount);
      const last = prev[prev.length - 1] || months[0];
      while (newArr.length < roundsCount) {
        newArr.push(last);
      }
      return newArr;
    });
    setSelectedDays(prev => {
      const newArr = prev.slice(0, roundsCount);
      const last = prev[prev.length - 1] || days[0];
      while (newArr.length < roundsCount) {
        newArr.push(last);
      }
      return newArr;
    });
    setSelectedTimes(prev => {
      const newArr = prev.slice(0, roundsCount);
      const time1 = prev[0] || "15:00";
      const time2 = prev.length > 1 ? prev[1] : time1;
      const isAlternating = time1 !== time2;
      while (newArr.length < roundsCount) {
        const idx = newArr.length;
        newArr.push(isAlternating ? (idx % 2 === 0 ? time1 : time2) : time1);
      }
      return newArr;
    });
  }, [roundsCount]);

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
    newMonths[index] = value;

    const newDays = [...selectedDays];
    const maxDays = getDaysInMonth(value);
    if (parseInt(newDays[index]) > maxDays) {
      newDays[index] = String(maxDays);
    }
    setSelectedDays(newDays);

    if (index === 0) {
      setDeadLineMonth(value);
      const { deadlineDay } = calculateDeadline(value, parseInt(selectedDays[0]));
      setDeadLineDay(deadlineDay);
    }

    setSelectedMonths(newMonths);
  };

  const handleDayChange = (index: number, value: string) => {
    const newDays = [...selectedDays];
    const newMonths = [...selectedMonths];
    const start = parseInt(value, 10);

    const rounds = roundsCount;

    const isPairedMode = selectedDays.length >= 2 && selectedDays[0] === selectedDays[1];

    if ((index === 0 && isPairedMode) || (index === 1 && start === parseInt(newDays[0], 10))) {
      newDays[0] = String(Math.min(start, getDaysInMonth(selectedMonths[0])));
      newDays[1] = String(Math.min(start, getDaysInMonth(selectedMonths[1])));
      let currentMonth = selectedMonths[0];
      let currentDay = start + 1;
      for (let pair = 0; pair < Math.ceil((rounds - 2) / 2); pair++) {
        const max = getDaysInMonth(currentMonth);
        if (currentDay > max) {
          currentMonth = getNextMonth(currentMonth);
          currentDay = 1;
        }
        const i1 = 2 + pair * 2;
        const i2 = i1 + 1;
        if (i1 < rounds) {
          newDays[i1] = String(currentDay);
          newMonths[i1] = currentMonth;
        }
        if (i2 < rounds) {
          newDays[i2] = String(currentDay);
          newMonths[i2] = currentMonth;
        }
        currentDay++;
      }
    } else {
      let currentMonth = selectedMonths[index];
      let currentDay = start;
      for (let j = index; j < rounds; j++) {
        const max = getDaysInMonth(currentMonth);
        if (currentDay > max) {
          currentMonth = getNextMonth(currentMonth);
          currentDay = 1;
        }
        newDays[j] = String(currentDay);
        newMonths[j] = currentMonth;
        currentDay++;
      }
    }

    if (index === 0) {
      const { deadlineMonth, deadlineDay } = calculateDeadline(selectedMonths[0], start);
      setDeadLineMonth(deadlineMonth);
      setDeadLineDay(deadlineDay);
    }

    setSelectedDays(newDays);
    setSelectedMonths(newMonths);
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...selectedTimes];
    updated[index] = value;

    const rounds = roundsCount;
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
      <h2>Վայր</h2>
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
        <div>
          <Select
            selectedOption={String(roundsCount)}
            setSelectedOption={(value: string) => setRoundsCount(parseInt(value))}
            values={["6", "7", "8", "9", "10", "11"]}
            title="Տուրերի քանակ"
          />
        </div>
      </section>
      <h2>Տուրեր</h2>
      <div className="schedule_container">
        {[...Array(roundsCount)].map((_, i) => (
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
                values={days.slice(0, getDaysInMonth(selectedMonths[i]))}
                title="Օր"
              />
              <div style={{ marginTop: "16px" }}>
                <div>Ժամ</div>
                <input
                  type="time"
                  value={selectedTimes[i] || "15:00"}
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
          setSelectedOption={handleDeadlineMonthChange}
          values={months}
          title="Ամիս"
        />
        <Select
          selectedOption={deadLineDay}
          setSelectedOption={(value: string) => setDeadLineDay(value)}
          values={days.slice(0, getDaysInMonth(deadLineMonth))}
          title="Օր"
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
        selectedMonths={selectedMonths.slice(0, roundsCount)}
        selectedDays={selectedDays.slice(0, roundsCount)}
        selectedTimes={selectedTimes.slice(0, roundsCount)}
        deadLineMonth={deadLineMonth}
        deadLineDay={deadLineDay}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}

export default TournamentAd;
