export default function generateAdText(
  selectedPlace: string,
  selectedTournament: string,
  selectedDays: string[],
  selectedMonths: string[],
  selectedTimes: string[],
  deadLineMonth: string,
  deadLineDay: string,
  phoneNumber: string
) {
  const days = selectedDays.slice(0, selectedDays.indexOf("0"));
  const intro = generateIntro(
    selectedPlace,
    selectedTournament,
    selectedDays,
    selectedMonths,
    days
  );

  const schedule = generateSchedule(
    days,
    selectedDays,
    selectedMonths,
    selectedTimes
  );

  const deadline = generateDeadLine(deadLineMonth, deadLineDay);
  const number = generateNumber(phoneNumber);

  return `${intro}\n${schedule}\n ${deadline}\n ${number}`;
}

function generateIntro(
  selectedPlace: string,
  selectedTournament: string,
  selectedDays: string[],
  selectedMonths: string[],
  days: string[]
) {
  const startDate = `${selectedMonths[0]}ի ${selectedDays[0]}-ից`;
  const endDate = `${selectedMonths[days.length - 1]}ի ${
    selectedDays[days.length - 1]
  }-ը`;

  const term = `${
    startDate.charAt(0).toUpperCase() + startDate.slice(1)
  } ${endDate}`;

  return `${term} ${selectedPlace} տեղի կունենա ${selectedTournament} մրցաշար հետևյալ ժամանակացույցով՝`;
}

function generateSchedule(
  days: string[],
  selectedDays: string[],
  selectedMonths: string[],
  selectedTimes: string[]
) {
  return days.reduce((acc, val, idx) => {
    return (
      acc +
      `- Տուր ${idx + 1}՝ ${selectedMonths[idx]}ի ${selectedDays[idx]} ժամը ${
        selectedTimes[idx]
      }\n`
    );
  }, "");
}

function generateDeadLine(deadLineMonth: string, deadLineDay: string) {
  return `Գրանցման վերջնաժամկետն է՝ ${deadLineMonth}ի ${deadLineDay} ժամը 18:00։`;
}

function generateNumber(phoneNumber: string) {
  return `Գրանցվելու համար զանգահարել ${phoneNumber} հեռախոսահամարով`;
}
