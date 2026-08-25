/* Design: dashboard municipal de Itupeva — fonte XLSX carregada localmente, sem envio de dados pessoais e com agregação no navegador. */
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import OuvidoriaLayout from "@/components/OuvidoriaLayout";
import { BarChart3, Check, Clock3, Target } from "lucide-react";

type DailyRow = { f?: number; fab?: number; fcc?: number; fcn?: number; fcp?: number; cat?: number[]; ass?: number[]; assC?: number[]; assA?: number[] };
type Metrics = { meta?: { gerado_em?: string; janela_inicio?: string; janela_fim?: string; categorias?: string[]; secretarias?: string[]; assuntos?: string[]; fonte?: string }; diario?: Record<string, DailyRow>; mensal_dim?: Record<string, { sec?: { reg?: number[]; cc?: number[] }; ass?: { reg?: number[] } }>; abertos_mais_30d?: { total?: number }; tempo_medio?: { geral?: number | null; categorias?: (number | null)[]; secretarias?: (number | null)[]; assuntos?: (number | null)[]; base?: string; registros_no_periodo?: number; registros_finalizados_com_tempo?: number; diario?: Record<string, { geral?: number | null; geral_count?: number; categorias?: (number | null)[]; categorias_count?: number[]; secretarias?: (number | null)[]; secretarias_count?: number[]; assuntos?: (number | null)[]; assuntos_count?: number[] }>; mensal?: Record<string, { geral?: number | null; geral_count?: number; categorias?: (number | null)[]; categorias_count?: number[]; secretarias?: (number | null)[]; secretarias_count?: number[]; assuntos?: (number | null)[]; assuntos_count?: number[] }> } };
type SheetRow = Record<string, unknown>;

const colors = ["#00549D", "#0A8F4D", "#D94736", "#F0C433", "#35A8C6", "#7B6BB2", "#D78B1D", "#7B8A91"];
const categoryOrder = ["Reclamação", "Solicitação", "Denúncia", "Informação", "Elogio", "Sugestão", "Doação", "Simplifique"];
const sourceStart = new Date("2021-08-01T00:00:00");
function clean(value: unknown) { return typeof value === "string" ? value.trim() : value; }
type TimeBucket = { sum: number; count: number };
function addTime(bucket: TimeBucket, days: number) { bucket.sum += days; bucket.count += 1; }
function averageTime(bucket?: TimeBucket) { return bucket && bucket.count ? Number((bucket.sum / bucket.count).toFixed(2)) : null; }
function parseSheetDate(value: unknown, format: "received" | "finalized" = "received") {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") return new Date(Date.UTC(1899, 11, 30 + value));
  if (typeof value === "string") {
    const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?/);
    if (match) { const first = Number(match[1]); const second = Number(match[2]); const rawYear = Number(match[3]); const year = rawYear < 100 ? 2000 + rawYear : rawYear; const monthFirst = format === "finalized" && first <= 12; const day = monthFirst ? second : first; const month = monthFirst ? first : second; return new Date(Date.UTC(year, month - 1, day, Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0))); }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}
function isoDate(date: Date) { return date.toISOString().slice(0, 10); }
function formatNumber(value: number) { return new Intl.NumberFormat("pt-BR").format(value); }
function formatDays(value: number | null | undefined) { return typeof value === "number" ? `${value.toFixed(1).replace(".", ",")} dias` : "—"; }
function addMonths(date: Date, amount: number) { const copy = new Date(date); copy.setMonth(copy.getMonth() + amount); return copy; }
function Card({ label, value, helper, icon: Icon, tone, disabled }: any) { const bg = disabled ? "bg-[#EEF0F1] text-[#7B858A]" : tone === "navy" ? "bg-[#173B5E] text-white" : tone === "mint" ? "bg-[#EAF4F2]" : tone === "cream" ? "bg-[#FFF8E8]" : "bg-white"; return <div className={`rounded-2xl p-5 shadow-[0_8px_24px_rgba(23,59,94,0.06)] ${bg}`}><div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] opacity-75">{label}<Icon size={19} /></div><div className="mt-5 font-display text-4xl">{value}</div><div className="mt-2 text-xs opacity-70">{helper}</div></div>; }

export function metricsFromSheet(rows: SheetRow[]): Metrics {
  const daily: Record<string, DailyRow & { _categories?: Record<string, number>; _subjects?: Record<string, number>; _subjectC?: Record<string, number>; _subjectA?: Record<string, number> }> = {};
  const monthlySecretariat: Record<string, Record<string, { reg: number; cc: number }>> = {};
  const monthlySubjects: Record<string, Record<string, number>> = {};
  const secretariatTotals: Record<string, number> = {};
  const subjectTotals: Record<string, number> = {};
  const overallTime: TimeBucket = { sum: 0, count: 0 };
  const categoryTime: Record<string, TimeBucket> = {};
  const secretariatTime: Record<string, TimeBucket> = {};
  const subjectTime: Record<string, TimeBucket> = {};
  const dailyTime: Record<string, { total: TimeBucket; categorias: Record<string, TimeBucket>; secretarias: Record<string, TimeBucket>; assuntos: Record<string, TimeBucket> }> = {};
  const monthlyTime: Record<string, { total: TimeBucket; categorias: Record<string, TimeBucket>; secretarias: Record<string, TimeBucket>; assuntos: Record<string, TimeBucket> }> = {};
  let eligibleForTime = 0;
  let finalizedForTime = 0;
  let latest: Date | null = null;
  for (const row of rows) {
    const received = parseSheetDate(row["Recebido em"]);
    if (!received || received < sourceStart) continue;
    const day = isoDate(received);
    const month = day.slice(0, 7);
    const status = String(clean(row.Status) || "(vazio)");
    const category = String(clean(row.Categoria) || "Não informado");
    const secretariat = String(clean(row.Secretaria) || "Não informado");
    const subject = String(clean(row.Assunto) || "Não informado");
    const finished = parseSheetDate(row["Finalizado em"], "finalized");
    if (finished && finished >= received) {
      eligibleForTime += 1;
      const days = (finished.getTime() - received.getTime()) / 86400000;
      finalizedForTime += 1;
      addTime(overallTime, days);
      if (!categoryTime[category]) categoryTime[category] = { sum: 0, count: 0 };
      if (!secretariatTime[secretariat]) secretariatTime[secretariat] = { sum: 0, count: 0 };
      if (!subjectTime[subject]) subjectTime[subject] = { sum: 0, count: 0 };
      addTime(categoryTime[category], days);
      addTime(secretariatTime[secretariat], days);
      addTime(subjectTime[subject], days);
      if (!dailyTime[day]) dailyTime[day] = { total: { sum: 0, count: 0 }, categorias: {}, secretarias: {}, assuntos: {} };
      if (!monthlyTime[month]) monthlyTime[month] = { total: { sum: 0, count: 0 }, categorias: {}, secretarias: {}, assuntos: {} };
      addTime(dailyTime[day].total, days);
      addTime(monthlyTime[month].total, days);
      for (const [map, name] of [[dailyTime[day].categorias, category], [dailyTime[day].secretarias, secretariat], [dailyTime[day].assuntos, subject], [monthlyTime[month].categorias, category], [monthlyTime[month].secretarias, secretariat], [monthlyTime[month].assuntos, subject]] as const) {
        if (!map[name]) map[name] = { sum: 0, count: 0 };
        addTime(map[name], days);
      }
    }
    if (!latest || received.getTime() > latest.getTime()) latest = received;
    if (!daily[day]) daily[day] = { f: 0, fab: 0, fcc: 0, fcn: 0, cat: [], ass: [], _categories: {}, _subjects: {}, _subjectC: {}, _subjectA: {} };
    const item = daily[day];
    item.f = Number(item.f || 0) + 1;
    item._categories![category] = Number(item._categories![category] || 0) + 1;
    item._subjects![subject] = Number(item._subjects![subject] || 0) + 1;
    if (status === "Concluído") item._subjectC![subject] = Number(item._subjectC![subject] || 0) + 1;
    else if (status !== "Cancelado") item._subjectA![subject] = Number(item._subjectA![subject] || 0) + 1;
    if (status === "Concluído") { item.fcc = Number(item.fcc || 0) + 1; if (String(clean(row.Prorrogado) || "").toLowerCase() !== "sim") item.fcp = Number(item.fcp || 0) + 1; }
    else if (status === "Cancelado") item.fcn = Number(item.fcn || 0) + 1;
    else item.fab = Number(item.fab || 0) + 1;
    if (!monthlySecretariat[month]) monthlySecretariat[month] = {};
    if (!monthlySecretariat[month][secretariat]) monthlySecretariat[month][secretariat] = { reg: 0, cc: 0 };
    monthlySecretariat[month][secretariat].reg += 1;
    if (status === "Concluído") monthlySecretariat[month][secretariat].cc += 1;
    if (!monthlySubjects[month]) monthlySubjects[month] = {};
    monthlySubjects[month][subject] = Number(monthlySubjects[month][subject] || 0) + 1;
    secretariatTotals[secretariat] = Number(secretariatTotals[secretariat] || 0) + 1;
    subjectTotals[subject] = Number(subjectTotals[subject] || 0) + 1;
  }
  const categories = categoryOrder.filter((name) => Object.values(daily).some((row) => row._categories?.[name]));
  const secretariats = Object.entries(secretariatTotals).sort((a, b) => b[1] - a[1]).map(([name]) => name);
  const subjects = Object.entries(subjectTotals).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([name]) => name);
  const serializedDaily: Record<string, DailyRow> = {};
  for (const [day, row] of Object.entries(daily)) serializedDaily[day] = { f: row.f, fab: row.fab, fcc: row.fcc, fcn: row.fcn, fcp: row.fcp, cat: categories.map((name) => Number(row._categories?.[name] || 0)), ass: subjects.map((name) => Number(row._subjects?.[name] || 0)), assC: subjects.map((name) => Number(row._subjectC?.[name] || 0)), assA: subjects.map((name) => Number(row._subjectA?.[name] || 0)) };
  const monthlyDim: Metrics["mensal_dim"] = {};
  for (const month of Object.keys(monthlySecretariat)) {
    monthlyDim![month] = { sec: { reg: secretariats.map((name) => monthlySecretariat[month][name]?.reg || 0), cc: secretariats.map((name) => monthlySecretariat[month][name]?.cc || 0) }, ass: { reg: subjects.map((name) => monthlySubjects[month]?.[name] || 0) } };
  }
  const serializedDailyTime = Object.fromEntries(Object.entries(dailyTime).map(([day, entry]) => [day, { geral: averageTime(entry.total), geral_count: entry.total.count, categorias: categories.map((name) => averageTime(entry.categorias[name])), categorias_count: categories.map((name) => entry.categorias[name]?.count || 0), secretarias: secretariats.map((name) => averageTime(entry.secretarias[name])), secretarias_count: secretariats.map((name) => entry.secretarias[name]?.count || 0), assuntos: subjects.map((name) => averageTime(entry.assuntos[name])), assuntos_count: subjects.map((name) => entry.assuntos[name]?.count || 0) }]));
  const serializedMonthlyTime = Object.fromEntries(Object.entries(monthlyTime).map(([month, entry]) => [month, { geral: averageTime(entry.total), geral_count: entry.total.count, categorias: categories.map((name) => averageTime(entry.categorias[name])), categorias_count: categories.map((name) => entry.categorias[name]?.count || 0), secretarias: secretariats.map((name) => averageTime(entry.secretarias[name])), secretarias_count: secretariats.map((name) => entry.secretarias[name]?.count || 0), assuntos: subjects.map((name) => averageTime(entry.assuntos[name])), assuntos_count: subjects.map((name) => entry.assuntos[name]?.count || 0) }]));
  const cutoff = latest ? new Date(latest.getTime() - 30 * 86400000) : null;
  const openOver30 = Object.entries(serializedDaily).filter(([day]) => cutoff && new Date(`${day}T00:00:00`) <= cutoff).reduce((sum, [, row]) => sum + Number(row.fab || 0), 0);
  return { meta: { gerado_em: latest ? isoDate(latest) : undefined, janela_inicio: isoDate(sourceStart), janela_fim: latest ? isoDate(latest) : undefined, categorias: categories, secretarias: secretariats, assuntos: subjects, fonte: "Planilha carregada localmente no navegador" }, diario: serializedDaily, mensal_dim: monthlyDim, abertos_mais_30d: { total: openOver30 }, tempo_medio: { geral: averageTime(overallTime), categorias: categories.map((name) => averageTime(categoryTime[name])), secretarias: secretariats.map((name) => averageTime(secretariatTime[name])), assuntos: subjects.map((name) => averageTime(subjectTime[name])), base: "Dias corridos entre Recebido em e Finalizado em", registros_no_periodo: eligibleForTime, registros_finalizados_com_tempo: finalizedForTime, diario: serializedDailyTime, mensal: serializedMonthlyTime } };
}

export default function Home() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [period, setPeriod] = useState("Últimos 12 meses");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<"Concluídos" | "Abertos" | "Registrados">("Registrados");
  const [selectedStatus, setSelectedStatus] = useState<"Concluídos" | "Abertos" | "Registrados">("Registrados");
  useEffect(() => {
    let active = true;
    const load = () => {
      const saved = localStorage.getItem("falabr-metrics");
      if (saved) { try { setData(JSON.parse(saved)); setLoadError(false); return; } catch { localStorage.removeItem("falabr-metrics"); } }
      fetch(`${import.meta.env.BASE_URL}metricas.json`).then((response) => { if (!response.ok) throw new Error("metricas.json"); return response.json(); }).then((value) => { if (active) setData(value); }).catch(() => { if (active) setLoadError(true); });
    };
    load();
    window.addEventListener("falabr-metrics-updated", load);
    return () => { active = false; window.removeEventListener("falabr-metrics-updated", load); };
  }, []);
  const daily = data?.diario ?? {};
  const allDates = Object.keys(daily).sort();
  const latest = allDates[allDates.length - 1] ?? "";
  const range = useMemo(() => { if (!latest) return { start: "", end: "" }; if (period === "Período personalizado") return { start: start || latest, end: end || latest }; const latestDate = new Date(`${latest}T00:00:00`); const months = period === "Últimos 6 meses" ? 5 : period === "Este mês" ? 0 : 11; return { start: `${isoDate(addMonths(latestDate, -months)).slice(0, 7)}-01`, end: latest }; }, [latest, period, start, end]);
  const selectedDates = allDates.filter((date) => date >= range.start && date <= range.end);
  const rows = selectedDates.map((date) => daily[date]).filter(Boolean);
  const registered = rows.reduce((sum, row) => sum + Number(row.f || 0), 0);
  const concluded = rows.reduce((sum, row) => sum + Number(row.fcc || 0), 0);
  const open = rows.reduce((sum, row) => sum + Number(row.fab || 0), 0);
  const resolutividade = registered ? (concluded / registered) * 100 : 0;
  const withoutExtension = rows.reduce((sum, row) => sum + Number(row.fcp || 0), 0);
  const withinDeadline = concluded ? (withoutExtension / concluded) * 100 : 0;
  const categories = data?.meta?.categorias ?? [];
  const categoryTotals = categories.map((_, index) => rows.reduce((sum, row) => sum + Number(row.cat?.[index] || 0), 0));
  const categoryTotal = categoryTotals.reduce((sum, value) => sum + value, 0);
  const types = categories.map((label, index) => [label, categoryTotal ? Math.round((categoryTotals[index] / categoryTotal) * 100) : 0, colors[index] || "#7B8A91", index] as const).sort((a, b) => b[1] - a[1]);
  const months = useMemo(() => { const monthMap = new Map<string, { registered: number; concluded: number; open: number }>(); selectedDates.forEach((date) => { const key = date.slice(0, 7); const row = daily[date]; const current = monthMap.get(key) || { registered: 0, concluded: 0, open: 0 }; current.registered += Number(row?.f || 0); current.concluded += Number(row?.fcc || 0); current.open += Number(row?.fab || 0); monthMap.set(key, current); }); return Array.from(monthMap.entries()).slice(-12); }, [selectedDates.join("|"), data]);
  const evolutionValues = months.map(([, values]) => selectedSeries === "Concluídos" ? values.concluded : selectedSeries === "Abertos" ? values.open : values.registered);
  const maxEvolution = Math.max(...evolutionValues, 1);
  const secretariats = data?.meta?.secretarias ?? [];
  const periodMonths = Array.from(new Set(selectedDates.map((date) => date.slice(0, 7))));
  const responseTimes = useMemo(() => {
    const dailyTime = data?.tempo_medio?.diario ?? {};
    const keys = selectedDates.filter((key) => dailyTime[key]);
    const weighted = (dimension: "categorias" | "secretarias" | "assuntos", index: number) => {
      let totalDays = 0;
      let totalCount = 0;
      keys.forEach((key) => {
        const entry = dailyTime[key];
        const average = entry?.[dimension]?.[index];
        const count = entry?.[`${dimension}_count` as "categorias_count" | "secretarias_count" | "assuntos_count"]?.[index] || 0;
        if (typeof average === "number" && count > 0) { totalDays += average * count; totalCount += count; }
      });
      return totalCount ? totalDays / totalCount : null;
    };
    let totalDays = 0;
    let totalCount = 0;
    keys.forEach((key) => { const entry = dailyTime[key]; if (typeof entry?.geral === "number" && entry.geral_count) { totalDays += entry.geral * entry.geral_count; totalCount += entry.geral_count; } });
    return { geral: totalCount ? totalDays / totalCount : null, categorias: categories.map((_, index) => weighted("categorias", index)), secretarias: secretariats.map((_, index) => weighted("secretarias", index)), assuntos: (data?.meta?.assuntos ?? []).map((_, index) => weighted("assuntos", index)) };
  }, [data, selectedDates.join("|"), categories.join("|"), secretariats.join("|"), (data?.meta?.assuntos ?? []).join("|")]);
  const secretariatRows = secretariats.map((name, index) => { let reg = 0; let cc = 0; periodMonths.forEach((monthKey) => { const month = data?.mensal_dim?.[monthKey]; reg += Number(month?.sec?.reg?.[index] || 0); cc += Number(month?.sec?.cc?.[index] || 0); }); return { name, reg, cc, open: Math.max(0, reg - cc), time: responseTimes.secretarias[index] ?? null }; }).filter((row) => row.reg > 0).sort((a, b) => b.reg - a.reg);
  const subjects = (data?.meta?.assuntos ?? []).map((name, index) => { const value = rows.reduce((sum, row) => sum + Number(row.ass?.[index] || 0), 0); const concludedValue = rows.reduce((sum, row) => sum + Number(row.assC?.[index] || 0), 0); const openValue = rows.reduce((sum, row) => sum + Number(row.assA?.[index] || 0), 0); return { name, value, concluded: concludedValue, open: openValue, sourceIndex: index }; }).filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
  const labelPeriod = range.start && range.end ? `${range.start} a ${range.end}` : "período selecionado";
  const maxSecretariatValue = Math.max(...secretariatRows.map((row) => selectedStatus === "Concluídos" ? row.cc : selectedStatus === "Abertos" ? row.open : row.reg), 1);
  return <OuvidoriaLayout><div className="mx-auto max-w-[1200px]"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Ouvidoria de Itupeva</h1><p className="mt-2 max-w-2xl text-[16px] leading-7 text-[#5E707A]">Veja os principais números da Ouvidoria de Itupeva.</p></div><div className="flex flex-col items-stretch gap-2 sm:items-end"><select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-11 rounded-lg border border-[#DCE3E4] bg-white px-3 text-xs font-bold"><option>Últimos 12 meses</option><option>Últimos 6 meses</option><option>Este mês</option><option>Período personalizado</option></select>{period === "Período personalizado" && <div className="flex gap-2"><input type="date" value={start} onChange={(event) => setStart(event.target.value)} aria-label="Data inicial" className="h-9 rounded-lg border border-[#DCE3E4] bg-white px-2 text-xs" /><input type="date" value={end} onChange={(event) => setEnd(event.target.value)} aria-label="Data final" className="h-9 rounded-lg border border-[#DCE3E4] bg-white px-2 text-xs" /></div>}</div></div>{loadError && <div className="mb-7 rounded-xl border border-[#F1C4BF] bg-[#FFF0EE] px-4 py-3 text-sm text-[#A43D30]">Não foi possível ler a fonte de dados.</div>}<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Card label="Protocolos registrados" value={formatNumber(registered)} helper="" icon={BarChart3} tone="navy" /><Card label="Índice de resolutividade" value={registered ? `${resolutividade.toFixed(1).replace(".", ",")}%` : "—"} helper={registered ? `(${formatNumber(concluded)} de ${formatNumber(registered)})` : ""} icon={Target} /><Card label="Dentro do prazo" value={concluded ? `${withinDeadline.toFixed(1).replace(".", ",")}%` : "—"} helper={concluded ? `(${formatNumber(withoutExtension)} de ${formatNumber(concluded)})` : ""} icon={Clock3} /><Card label="Tempo médio de resposta" value={formatDays(responseTimes.geral)} helper={responseTimes?.geral != null ? "dias corridos" : "Sem dado no arquivo"} icon={Clock3} /><Card label="Satisfação média" value="—" helper="Sem dado no arquivo" icon={Check} disabled /></section><section className="mt-7 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-[#E4DED2] bg-white/75 p-6"><h2 className="font-display text-2xl font-semibold">Tipos de manifestação</h2><div className="mt-7 grid gap-4 sm:grid-cols-2">{types.map(([label, value, color, sourceIndex]) => <div key={label}><div className="mb-2 flex justify-between text-xs font-bold"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{label}</span><span className="text-right">{value}% <small className="ml-1 font-normal text-[#89989F]">({formatNumber(categoryTotals[sourceIndex])})</small><small className="mt-1 block text-[10px] font-normal text-[#89989F]">Tempo médio: {formatDays(responseTimes.categorias[sourceIndex])}</small></span></div><div className="h-2 rounded-full bg-[#E8EDEB]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }} /></div></div>)}</div></div><div className="rounded-2xl border border-[#D7E7E6] bg-[#EAF4F2] p-6"><h2 className="font-display text-2xl font-semibold">Situação dos registros</h2><div className="mt-6 space-y-4">{[["Concluídos", concluded, "#0A8F4D"], ["Abertos", open, "#D78B1D"], ["Registrados", registered, "#00549D"]].map(([label, value, color]) => <div key={String(label)}><div className="mb-1 flex justify-between text-xs font-bold"><span>{label}</span><span>{formatNumber(Number(value))}</span></div><div className="h-2 rounded-full bg-white"><div className="h-full rounded-full" style={{ width: `${registered ? Math.min(100, (Number(value) / registered) * 100) : 0}%`, backgroundColor: color as string }} /></div></div>)}</div></div></section><section className="mt-7 rounded-2xl border border-[#E4DED2] bg-white/75 p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><h2 className="font-display text-2xl font-semibold">Evolução dos registros</h2><div className="flex flex-wrap gap-2">{(["Concluídos", "Abertos", "Registrados"] as const).map((series) => <button type="button" key={series} onClick={() => setSelectedSeries(series)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${selectedSeries === series ? "border-[#173B5E] bg-[#F7F5F0] text-[#173B5E]" : "border-[#DCE3E4] bg-white text-[#71818B]"}`}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series === "Concluídos" ? "#0A8F4D" : series === "Abertos" ? "#D78B1D" : "#00549D" }} />{series}</button>)}</div></div><div className="mt-8 flex h-48 items-end gap-2 border-b border-l border-[#DCE3E4] px-3 sm:gap-4">{months.map(([month], index) => <div key={month} className="flex h-full flex-1 flex-col justify-end"><div className="mx-auto w-full max-w-[34px] rounded-t-md" style={{ height: `${(evolutionValues[index] / maxEvolution) * 100}%`, backgroundColor: selectedSeries === "Concluídos" ? "#0A8F4D" : selectedSeries === "Abertos" ? "#D78B1D" : "#00549D" }} /><span className="mt-3 text-center text-[10px] text-[#89989F]">{month.slice(5)}</span></div>)}</div></section><section className="mt-7 rounded-2xl border border-[#E4DED2] bg-white/75 p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl font-semibold">Ranking das secretarias</h2><div className="flex flex-wrap gap-2">{(["Concluídos", "Abertos", "Registrados"] as const).map((status) => <button type="button" key={status} onClick={() => setSelectedStatus(status)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${selectedStatus === status ? "border-[#173B5E] bg-[#F7F5F0] text-[#173B5E]" : "border-[#DCE3E4] bg-white text-[#71818B]"}`}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status === "Concluídos" ? "#0A8F4D" : status === "Abertos" ? "#D78B1D" : "#00549D" }} />{status}</button>)}</div></div><div className="max-h-[430px] overflow-y-auto pr-2"><table className="w-full min-w-[760px] text-left"><thead className="sticky top-0 bg-white/95"><tr className="border-b border-[#E4DED2] text-[10px] uppercase tracking-widest text-[#89989A]"><th className="pb-3">Secretaria</th><th className="pb-3 text-right">{selectedStatus}</th></tr></thead><tbody>{secretariatRows.map((row) => <tr key={row.name} className="border-b border-[#EEEAE2] last:border-0"><td className="py-4 text-sm font-bold">{row.name}</td><td className="py-3 text-right"><div className={`text-sm font-bold ${selectedStatus === "Concluídos" ? "text-[#0A8F4D]" : selectedStatus === "Abertos" ? "text-[#D78B1D]" : "text-[#00549D]"}`}>{formatNumber(selectedStatus === "Concluídos" ? row.cc : selectedStatus === "Abertos" ? row.open : row.reg)}</div><div className="mt-2 h-2 w-full min-w-[160px] rounded-full bg-[#E8EDEB]"><div className={`h-full rounded-full ${selectedStatus === "Concluídos" ? "bg-[#0A8F4D]" : selectedStatus === "Abertos" ? "bg-[#D78B1D]" : "bg-[#00549D]"}`} style={{ width: String(((selectedStatus === "Concluídos" ? row.cc : selectedStatus === "Abertos" ? row.open : row.reg) / maxSecretariatValue) * 100) + "%" }} /></div><div className="mt-1 text-[11px] font-normal text-[#89989F]">Tempo médio de resposta: {formatDays(row.time)}</div></td></tr>)}</tbody></table></div></section><section className="mt-7 rounded-2xl border border-[#E4DED2] bg-white/75 p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl font-semibold">Ranking dos Assuntos</h2><div className="flex flex-wrap gap-2">{(["Concluídos", "Abertos", "Registrados"] as const).map((status) => <button type="button" key={status} onClick={() => setSelectedStatus(status)} className={"flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition " + (selectedStatus === status ? "border-[#173B5E] bg-[#F7F5F0] text-[#173B5E]" : "border-[#DCE3E4] bg-white text-[#71818B]")}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status === "Concluídos" ? "#0A8F4D" : status === "Abertos" ? "#D78B1D" : "#00549D" }} />{status}</button>)}</div></div><div className="max-h-[430px] overflow-y-auto pr-2"><div className="grid gap-3">{subjects.map((item, index) => <div key={item.name} className="border-b border-[#EEEAE2] py-4 last:border-0"><div className="mb-2 flex items-center justify-between gap-4 text-xs font-bold"><span>{item.name}</span><span className={"text-sm " + (selectedStatus === "Concluídos" ? "text-[#0A8F4D]" : selectedStatus === "Abertos" ? "text-[#D78B1D]" : "text-[#00549D]")}>{formatNumber(selectedStatus === "Concluídos" ? item.concluded : selectedStatus === "Abertos" ? item.open : item.value)}</span></div><div className="mb-2 text-right text-[11px] text-[#89989F]">Tempo médio de resposta: {formatDays(responseTimes.assuntos[item.sourceIndex])}</div><div className="h-2 rounded-full bg-[#E8EDEB]"><div className={"h-full rounded-full " + (index < 2 ? "bg-[#00549D]" : index < 4 ? "bg-[#0A8F4D]" : "bg-[#35A8C6]")} style={{ width: String(subjects[0]?.value ? (item.value / subjects[0].value) * 100 : 0) + "%" }} /></div></div>)}</div></div></section></div></OuvidoriaLayout>;
}
