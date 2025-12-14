import generateFinalText from "../../helpers/generateFinalText";
import { IFinalTextProps } from "../../models/finalText";
import TextForCopy from "../textForCopy/TextForCopy";

export default function FinalText({
  title,
  players,
  prizes,
}: IFinalTextProps) {
  const finalText = generateFinalText(
    {
      title,
      players,
      prizes
    }
  );

  return <TextForCopy text={finalText} />;
}
