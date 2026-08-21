import fs from "node:fs";
import XLSX from "xlsx";
const input = "/home/ubuntu/upload/Ouvidorias-13082026082544.xlsx";
const metricsPath = "/home/ubuntu/falabr-facil/client/public/metricas.json";
const metrics = JSON.parse(fs.readFileSync(metricsPath, "utf8"));
const workbook = XLSX.readFile(input, { cellDates: true, dense: true });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: null, raw: false });
function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) return null;
  const rawYear = Number(match[3]);
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  return new Date(Date.UTC(year, Number(match[2]) - 1, Number(match[1]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0)));
}
function add(map, key, days) { if (!map[key]) map[key] = { sum: 0, count: 0 }; map[key].sum += days; map[key].count += 1; }
const periodStart = new Date("2025-09-01T00:00:00Z");
const periodEnd = new Date("2026-08-13T23:59:59Z");
const categories = metrics.meta?.categorias || [];
const secretariats = metrics.meta?.secretarias || [];
const subjects = metrics.meta?.assuntos || [];
const categoryMap = {}, secretariatMap = {}, subjectMap = {};
let overall = { sum: 0, count: 0 };
let eligible = 0;
let finalized = 0;
for (const row of rows) {
  const received = parseDate(row["Recebido em"]);
  const finished = parseDate(row["Finalizado em"]);
  if (!received || received < periodStart || received > periodEnd) continue;
  eligible += 1;
  if (!finished || finished < received) continue;
  const days = (finished.getTime() - received.getTime()) / 86400000;
  finalized += 1;
  overall.sum += days; overall.count += 1;
  add(categoryMap, String(row.Categoria || "Não informado").trim(), days);
  add(secretariatMap, String(row.Secretaria || "Não informado").trim(), days);
  add(subjectMap, String(row.Assunto || "Não informado").trim(), days);
}
const avg = (entry) => entry && entry.count ? Number((entry.sum / entry.count).toFixed(2)) : null;
metrics.tempo_medio = {
  geral: avg(overall),
  categorias: categories.map((name) => avg(categoryMap[name])),
  secretarias: secretariats.map((name) => avg(secretariatMap[name])),
  assuntos: subjects.map((name) => avg(subjectMap[name])),
  base: "Dias corridos entre Recebido em e Finalizado em",
  registros_no_periodo: eligible,
  registros_finalizados_com_tempo: finalized,
};
fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2) + "\n");
console.log(JSON.stringify(metrics.tempo_medio, null, 2));
