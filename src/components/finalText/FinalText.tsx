import generateFinalText from "../../helpers/generateFinalText";
import type { IFinalTextProps } from "../../models/finalText";
import TextForCopy from "../textForCopy/TextForCopy";

export default function FinalText(props: IFinalTextProps) {
  const finalText = generateFinalText(props);
  return <TextForCopy text={finalText} />;
}
