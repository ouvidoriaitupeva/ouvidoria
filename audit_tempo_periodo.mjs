import fs from "node:fs";
import XLSX from "xlsx";
const input = "/home/ubuntu/upload/Ouvidorias-13082026082544.xlsx";
const metrics = JSON.parse(fs.readFileSync("/home/ubuntu/falabr-facil/client/public/metricas.json", "utf8"));
const workbook = XLSX.readFile(input, { cellDates: true, dense: true });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: null, raw: false });
function parseDate(value) { if (typeof value !== "string") return null; const m = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/); if (!m) return null; const y = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]); return new Date(Date.UTC(y, Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0), Number(m[6] || 0))); }
const start = new Date("2025-09-01T00:00:00Z");
const end = new Date("2026-08-13T23:59:59Z");
const eligible = rows.filter((row) => { const d = parseDate(row["Recebido em"]); return d && d >= start && d <= end; });
const finalized = eligible.map((row) => [parseDate(row["Recebido em"]), parseDate(row["Finalizado em"])]).filter(([received, finished]) => received && finished && finished >= received);
const totalDays = finalized.reduce((sum, [received, finished]) => sum + (finished - received) / 86400000, 0);
const receivedDates = eligible.map((row) => parseDate(row["Recebido em"])).sort((a, b) => a - b);
const finishedDates = finalized.map(([, finished]) => finished).sort((a, b) => a - b);
console.log(JSON.stringify({ expectedFilter: { start: start.toISOString(), end: end.toISOString() }, receivedMin: receivedDates[0]?.toISOString(), receivedMax: receivedDates.at(-1)?.toISOString(), finalizedMin: finishedDates[0]?.toISOString(), finalizedMax: finishedDates.at(-1)?.toISOString(), eligible: eligible.length, finalized: finalized.length, averageDays: Number((totalDays / finalized.length).toFixed(2)), savedGeneral: metrics.tempo_medio?.geral, savedPeriod: metrics.tempo_medio?.periodo }, null, 2));
