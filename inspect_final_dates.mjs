import XLSX from "xlsx";
const workbook = XLSX.readFile("/home/ubuntu/upload/Ouvidorias-13082026082544.xlsx", { cellDates: true, dense: true });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: null, raw: false });
function parseDate(value) { if (typeof value !== "string") return null; const m = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/); if (!m) return null; const y = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]); return new Date(Date.UTC(y, Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0), Number(m[6] || 0))); }
const values = rows.map((row) => ({ received: row["Recebido em"], final: row["Finalizado em"], parsed: parseDate(row["Finalizado em"]), status: row.Status })).filter((row) => row.parsed).sort((a, b) => b.parsed - a.parsed);
console.log(JSON.stringify({ latest: values.slice(0, 20).map((row) => ({ ...row, parsed: row.parsed.toISOString() })), years: values.reduce((acc, row) => { const y = row.parsed.getUTCFullYear(); acc[y] = (acc[y] || 0) + 1; return acc; }, {}) }, null, 2));
