import generateAdText from "../../helpers/generateAdText";
import TextForCopy from "../textForCopy/TextForCopy";

interface IAdTextProps {
  selectedPlace: string;
  selectedTournament: string;
  selectedDays: string[];
  selectedMonths: string[];
  selectedTimes: string[];
  deadLineMonth: string;
  deadLineDay: string;
  phoneNumber: string;
}

export default function AdText({
  selectedPlace,
  selectedTournament,
  selectedDays,
  selectedMonths,
  selectedTimes,
  deadLineMonth,
  deadLineDay,
  phoneNumber,
}: IAdTextProps) {
  const finalText = generateAdText(
    selectedPlace,
    selectedTournament,
    selectedDays,
    selectedMonths,
    selectedTimes,
    deadLineMonth,
    deadLineDay,
    phoneNumber
  );

  return <TextForCopy text={finalText} />;
}
