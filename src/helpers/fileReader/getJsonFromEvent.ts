import * as XLSX from "xlsx";

export default function getJsonFromEvent(e: ProgressEvent<FileReader>) {
  const binaryString = e?.target?.result;
  const workbook = XLSX.read(binaryString, { type: "binary" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json<{ [key: string]: string }>(worksheet);
}
