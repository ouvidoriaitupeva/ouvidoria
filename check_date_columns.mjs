import XLSX from "xlsx";
const workbook = XLSX.readFile("/home/ubuntu/upload/Ouvidorias-13082026082544.xlsx", { cellDates: true, dense: true });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: null, raw: false });
const headers = Object.keys(rows[0] || {});
const result = headers.filter((header) => /data|receb|final|respost|encamin|prazo|conclu/i.test(header)).map((header) => ({ header, nonEmpty: rows.filter((row) => row[header] !== null && row[header] !== "").length, examples: rows.map((row) => row[header]).filter((value) => value !== null && value !== "").slice(0, 3) }));
console.log(JSON.stringify(result, null, 2));
