import XLSX from "xlsx";
const input = "/home/ubuntu/upload/Ouvidorias-13082026082544.xlsx";
const workbook = XLSX.readFile(input, { cellDates: true, dense: true });
for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
  const headers = rows.length ? Object.keys(rows[0]) : [];
  console.log(JSON.stringify({ sheetName, rowCount: rows.length, headers, samples: rows.slice(0, 3) }, null, 2));
}
