export default function modifyName(name: string) {
  return name.replace(",", "").split(" ").slice(0, 2).join(" ");
}
