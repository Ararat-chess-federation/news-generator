export default function correctText(text: string) {
    return text.replace(/Մարզիչ/g, "մարզիչ")
        .replace(/\([ \t]+/g, "(")
        .replace(/[ \t]+\)/g, ")")
        .replace(/(\S)\(/g, "$1 (")
        .replace(/[ \t]*՝[ \t]*/g, "՝ ")
        .replace(/՝ (?=\n|$)/gm, "՝")
        .replace(/[ \t]*,[ \t]*/g, ", ")
        .replace(/, (?=\n|$)/gm, ",")
        .replace(/[ \t]*։[ \t]*/g, "։ ")
        .replace(/։ (?=\n|$)/gm, "։")
        .replace(/[ \t]+/g, " ")
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
}