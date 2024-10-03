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
}
