import XLSX from "xlsx";
const workbook = XLSX.readFile("/home/ubuntu/upload/Ouvidorias-13082026082544.xlsx", { cellDates: true, dense: true });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: null, raw: false });
function parseDate(value) { const match = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/); if (!match) return null; const rawYear = Number(match[3]); const year = rawYear < 100 ? 2000 + rawYear : rawYear; return new Date(Date.UTC(year, Number(match[2]) - 1, Number(match[1]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0))); }
const sample = rows.slice(0, 5).map((row) => ({ raw: row["Recebido em"], parsed: parseDate(row["Recebido em"]), iso: parseDate(row["Recebido em"])?.toISOString() }));
const dates = rows.map((row) => parseDate(row["Recebido em"])).filter(Boolean);
console.log(JSON.stringify({ sample, min: new Date(Math.min(...dates.map((d) => d.getTime()))).toISOString(), max: new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString(), total: dates.length }, null, 2));
