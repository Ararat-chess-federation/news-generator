import generateFinalText from "../../helpers/generateFinalText";
import { IFinalTextProps } from "../../models/finalText";
import TextForCopy from "../textForCopy/TextForCopy";

export default function FinalText(props: IFinalTextProps) {
  const finalText = generateFinalText(props);
  return <TextForCopy text={finalText} />;
}
