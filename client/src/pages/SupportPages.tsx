/* Design: páginas institucionais da Ouvidoria de Itupeva — cartões claros, métricas agregadas e ações orientadas. */
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check, Download, ExternalLink, Info, Search, ShieldCheck, Target } from "lucide-react";
import OuvidoriaLayout from "@/components/OuvidoriaLayout";

const secretarias = ["Gabinete do Prefeito", "Vice-Prefeito", "Chefia de Gabinete", "Assuntos Jurídicos e Fundiários", "Desenvolvimento Social", "Educação", "Fazenda", "Gestão Pública", "Guarda-Civil Municipal", "Indústria, Comércio e Desenvolvimento Econômico", "Infraestrutura e Manutenção", "Saúde", "Governo", "Obras, Planejamento e Mobilidade Urbana", "Esportes, Lazer e Cultura", "Turismo, Agricultura e Meio Ambiente"];
const indicators = [{ name: "Índice de resolutividade", definition: "Percentual de demandas que receberam uma solução considerada satisfatória ou resolvida.", reading: "Quanto maior, melhor.", source: "Resolveu? / CGU" }, { name: "Satisfação média", definition: "Percentual de avaliações positivas registradas após o atendimento.", reading: "Quanto maior, melhor.", source: "Pesquisa de satisfação" }, { name: "Dentro do prazo", definition: "Percentual de respostas enviadas dentro do prazo definido para o atendimento.", reading: "Quanto maior, melhor.", source: "Fala.BR" }, { name: "Tempo médio de resposta", definition: "Média de dias entre o registro e a resposta ao cidadão.", reading: "Quanto menor, melhor.", source: "Fala.BR" }, { name: "Registros avaliados", definition: "Quantidade total de registros considerados no período selecionado.", reading: "Mostra o volume do período.", source: "Fala.BR" }, { name: "Distribuição por tipo", definition: "Participação de solicitações, reclamações, denúncias, sugestões, elogios e simplificações.", reading: "Ajuda a entender a demanda.", source: "Resolveu? / CGU" }];

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mb-8"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D78B1D]"><span className="h-px w-6 bg-[#D78B1D]" />{eyebrow}</div><h1 className="font-display text-4xl font-semibold tracking-tight text-[#173B5E] md:text-5xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-[16px] leading-7 text-[#5E707A]">{description}</p>}</div>; }
function ActionButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button type="button" onClick={onClick} className="flex items-center gap-2 rounded-lg bg-[#00549D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#0A6BB8]">{children}</button>; }
type ReportColumnKey = "registered" | "concluded" | "open" | "outside" | "resolution" | "categories" | "time";
type ReportMetric = { name: string; registered: number; concluded: number; open: number; outside: number | null; resolution: number | null; categories: string; time: number | null };
type ReportColumn = { key: ReportColumnKey; label: string };

const reportColumns: ReportColumn[] = [
  { key: "registered", label: "Registrados" },
  { key: "concluded", label: "Concluídos" },
  { key: "open", label: "Abertos" },
  { key: "outside", label: "Fora do prazo" },
  { key: "resolution", label: "Resolutividade" },
  { key: "categories", label: "Tipos de manifestação" },
  { key: "time", label: "Tempo médio de resposta" },
];
const defaultReportColumns: ReportColumnKey[] = reportColumns.map(({ key }) => key);

function reportValue(item: ReportMetric, key: ReportColumnKey) {
  if (key === "registered") return item.registered.toLocaleString("pt-BR");
  if (key === "concluded") return item.concluded.toLocaleString("pt-BR");
  if (key === "open") return item.open.toLocaleString("pt-BR");
  if (key === "outside") return item.outside === null ? "Não disponível" : item.outside.toLocaleString("pt-BR");
  if (key === "resolution") return "Não disponível";
  if (key === "categories") return item.categories || "Não disponível";
  return item.time === null ? "Não disponível" : `${item.time.toFixed(1).replace(".", ",")} dias`;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) { const chunk = bytes.subarray(index, Math.min(index + chunkSize, bytes.length)); for (let offset = 0; offset < chunk.length; offset += 1) binary += String.fromCharCode(chunk[offset]); }
  return btoa(binary);
}

async function loadPdfFont(pdf: jsPDF) {
  const response = await fetch(`${import.meta.env.BASE_URL}fonts/NotoSans-Regular.ttf`);
  if (!response.ok) throw new Error("Fonte Unicode não disponível");
  pdf.addFileToVFS("NotoSans-Regular.ttf", arrayBufferToBase64(await response.arrayBuffer()));
  pdf.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
  pdf.setFont("NotoSans", "normal");
}

async function exportReportPdf(metrics: ReportMetric[], period: string, selectedColumns: ReportColumnKey[]) {
  if (!metrics.length) return;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  try { await loadPdfFont(pdf); } catch { pdf.setFont("helvetica", "normal"); }
  const columns = reportColumns.filter(({ key }) => selectedColumns.includes(key));
  const headers = ["Secretaria", ...columns.map(({ label }) => label)];
  const rows = metrics.map((item) => [item.name, ...columns.map(({ key }) => reportValue(item, key))]);
  const margin = 12;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const firstWidth = Math.min(62, usableWidth * 0.25);
  const otherWidth = headers.length > 1 ? (usableWidth - firstWidth) / (headers.length - 1) : usableWidth;
  const widths = headers.map((_, index) => index === 0 ? firstWidth : otherWidth);
  const drawTableHeader = (top: number) => {
    pdf.setFillColor(23, 59, 94);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7.5);
    let x = margin;
    headers.forEach((header, index) => {
      pdf.rect(x, top, widths[index], 9, "F");
      const lines = pdf.splitTextToSize(header, widths[index] - 4);
      pdf.text(lines, x + 2, top + 3.8, { baseline: "middle" });
      x += widths[index];
    });
    pdf.setTextColor(23, 59, 94);
  };
  pdf.setTextColor(23, 59, 94);
  pdf.setFontSize(15);
  pdf.text("Transparência da Ouvidoria de Itupeva", margin, 15);
  pdf.setFontSize(9);
  pdf.text(`Relatório agregado por secretaria — ${period}`, margin, 22);
  pdf.setFontSize(7.5);
  pdf.setTextColor(94, 112, 122);
  pdf.text(`Gerado em ${new Date().toLocaleString("pt-BR")} • Fonte: planilha carregada localmente`, margin, 27);
  let y = 33;
  drawTableHeader(y);
  y += 9;
  pdf.setFontSize(7.5);
  rows.forEach((row, rowIndex) => {
    const lineSets = row.map((value, index) => pdf.splitTextToSize(String(value), widths[index] - 4));
    const rowHeight = Math.max(8, ...lineSets.map((lines) => lines.length * 3.6 + 4));
    if (y + rowHeight > pageHeight - 15) {
      pdf.addPage();
      y = 15;
      drawTableHeader(y);
      y += 9;
    }
    pdf.setFillColor(rowIndex % 2 === 0 ? 248 : 255, rowIndex % 2 === 0 ? 250 : 255, rowIndex % 2 === 0 ? 249 : 255);
    pdf.setTextColor(51, 78, 104);
    let x = margin;
    row.forEach((value, index) => {
      pdf.setFillColor(rowIndex % 2 === 0 ? 248 : 255, rowIndex % 2 === 0 ? 250 : 255, rowIndex % 2 === 0 ? 249 : 255);
      pdf.rect(x, y, widths[index], rowHeight, "F");
      pdf.setDrawColor(220, 227, 228);
      pdf.rect(x, y, widths[index], rowHeight, "S");
      pdf.setFontSize(index === 0 ? 7.5 : 7);
      pdf.text(lineSets[index], x + 2, y + 4, { maxWidth: widths[index] - 4 });
      x += widths[index];
    });
    y += rowHeight;
  });
  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFontSize(7);
    pdf.setTextColor(137, 152, 159);
    pdf.text(`Transparência da Ouvidoria de Itupeva • Página ${page} de ${totalPages}`, margin, pageHeight - 7);
  }
  const slug = period.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "periodo";
  pdf.save(`relatorio-secretarias-${slug}.pdf`);
}

export function ReportsPage() {
  const [period, setPeriod] = useState("Últimos 12 meses");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [selectedSecretariats, setSelectedSecretariats] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<ReportColumnKey[]>(defaultReportColumns);
  const [exporting, setExporting] = useState(false);
  const availableSecretariats = metrics.map((item) => item.name);
  const visibleMetrics = selectedSecretariats.length ? metrics.filter((item) => selectedSecretariats.includes(item.name)) : metrics;
  const visibleColumns = reportColumns.filter(({ key }) => selectedColumns.includes(key));
  const toggleSecretariat = (name: string) => setSelectedSecretariats((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const toggleColumn = (key: ReportColumnKey) => setSelectedColumns((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);

  useEffect(() => {
    let active = true;
    const load = () => {
      const saved = localStorage.getItem("falabr-metrics");
      const request = saved ? Promise.resolve(JSON.parse(saved)) : Promise.reject(new Error("Nenhuma planilha carregada"));
      request.then((data) => {
        const names: string[] = data.meta?.secretarias || [];
        const categoryNames: string[] = data.meta?.categorias || [];
        const monthKeys = Object.keys(data.mensal_dim || {}).sort();
        const latest = Object.keys(data.diario || {}).sort().at(-1) || `${monthKeys.at(-1) || ""}-28`;
        const rangeStart = period === "Período personalizado" ? (start || latest) : period === "Todo o período" ? `${monthKeys[0] || latest.slice(0, 7)}-01` : period === "Últimos 6 meses" ? `${monthKeys.slice(-6)[0] || latest.slice(0, 7)}-01` : period === "Últimos 3 meses" ? `${monthKeys.slice(-3)[0] || latest.slice(0, 7)}-01` : period === "Este mês" ? `${latest.slice(0, 7)}-01` : `${monthKeys.slice(-12)[0] || latest.slice(0, 7)}-01`;
        const rangeEnd = period === "Período personalizado" ? (end || latest) : latest;
        const months = monthKeys.filter((month) => month >= rangeStart.slice(0, 7) && month <= rangeEnd.slice(0, 7));
        const rows = names.map((name, index) => {
          const registered = months.reduce((sum, month) => sum + Number(data.mensal_dim?.[month]?.sec?.reg?.[index] || 0), 0);
          const concluded = months.reduce((sum, month) => sum + Number(data.mensal_dim?.[month]?.sec?.cc?.[index] || 0), 0);
          const storedOpen = months.reduce((sum, month) => sum + Number(data.mensal_dim?.[month]?.sec?.open?.[index] ?? 0), 0);
          const hasOpenData = months.some((month) => Array.isArray(data.mensal_dim?.[month]?.sec?.open));
          const open = hasOpenData ? storedOpen : Math.max(0, registered - concluded);
          const hasDeadlineData = months.some((month) => Array.isArray(data.mensal_dim?.[month]?.sec?.outside));
          const outside = hasDeadlineData ? months.reduce((sum, month) => sum + Number(data.mensal_dim?.[month]?.sec?.outside?.[index] || 0), 0) : null;
          const categoryCounts = categoryNames.map((_, categoryIndex) => months.reduce((sum, month) => sum + Number(data.mensal_dim?.[month]?.sec?.cat?.[index]?.[categoryIndex] || 0), 0));
          const categories = categoryCounts.some((value) => value > 0) ? categoryNames.map((category, categoryIndex) => categoryCounts[categoryIndex] ? `${category}: ${categoryCounts[categoryIndex]}` : "").filter(Boolean).join("; ") : "";
          let timeSum = 0;
          let timeCount = 0;
          months.forEach((month) => {
            const entry = data.tempo_medio?.mensal?.[month];
            const average = entry?.secretarias?.[index];
            const count = entry?.secretarias_count?.[index] || 0;
            if (typeof average === "number" && count > 0) { timeSum += average * count; timeCount += count; }
          });
          return { name, registered, concluded, open, outside, resolution: null, categories, time: timeCount ? timeSum / timeCount : null };
        }).filter((row) => row.registered > 0);
        if (active) setMetrics(rows);
      }).catch(() => { if (active) setMetrics([]); });
    };
    load();
    window.addEventListener("falabr-metrics-updated", load);
    return () => { active = false; window.removeEventListener("falabr-metrics-updated", load); };
  }, [period, start, end]);

  useEffect(() => {
    setSelectedSecretariats((current) => current.filter((name) => availableSecretariats.includes(name)));
  }, [availableSecretariats.join("|")]);

  const handleExport = async () => {
    setExporting(true);
    try { await exportReportPdf(visibleMetrics, period, selectedColumns); } finally { setExporting(false); }
  };

  return <OuvidoriaLayout><div className="mx-auto max-w-[1200px]">
    <PageTitle eyebrow="Relatórios" title="Relatórios por secretaria" description="Monte um relatório com as secretarias e colunas que deseja analisar no período selecionado." />
    <div className="mb-5 flex flex-col items-stretch justify-end gap-2 sm:flex-row sm:items-center"><select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-11 rounded-lg border border-[#DCE3E4] bg-white px-3 text-xs font-bold"><option>Últimos 12 meses</option><option>Últimos 6 meses</option><option>Últimos 3 meses</option><option>Este mês</option><option>Todo o período</option><option>Período personalizado</option></select>{period === "Período personalizado" && <div className="flex gap-2"><input type="date" value={start} onChange={(e) => setStart(e.target.value)} aria-label="Data inicial" className="h-9 rounded-lg border border-[#DCE3E4] bg-white px-2 text-xs" /><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="Data final" className="h-9 rounded-lg border border-[#DCE3E4] bg-white px-2 text-xs" /></div>}</div>
    <section className="mb-6 rounded-2xl border border-[#DCE3E4] bg-white/85 p-4 shadow-[0_8px_24px_rgba(23,59,94,0.03)]"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#173B5E]">Configurar relatório</h2><p className="mt-1 text-xs text-[#71818B]">Escolha as secretarias e as colunas que deseja visualizar e exportar.</p></div><div className="flex flex-wrap gap-2">
      <details className="relative"><summary className="cursor-pointer list-none rounded-lg border border-[#DCE3E4] bg-white px-3 py-2 text-xs font-bold text-[#526873]">Secretarias {selectedSecretariats.length ? `(${selectedSecretariats.length})` : "(todas)"}</summary><div className="absolute right-0 z-20 mt-2 w-[min(430px,calc(100vw-3rem))] rounded-xl border border-[#DCE3E4] bg-white p-3 shadow-[0_12px_32px_rgba(23,59,94,0.15)]"><div className="mb-3 flex gap-2"><button type="button" onClick={() => setSelectedSecretariats([])} className="rounded-md border border-[#DCE3E4] px-2 py-1 text-[11px] font-bold text-[#526873]">Todas</button><button type="button" onClick={() => setSelectedSecretariats(availableSecretariats)} className="rounded-md border border-[#DCE3E4] px-2 py-1 text-[11px] font-bold text-[#526873]">Selecionar todas</button><button type="button" onClick={() => setSelectedSecretariats([])} className="rounded-md border border-[#DCE3E4] px-2 py-1 text-[11px] font-bold text-[#526873]">Limpar</button></div><div className="grid max-h-56 gap-1 overflow-y-auto border-t border-[#E8EEED] pt-2 sm:grid-cols-2">{availableSecretariats.map((name) => <label key={name} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#334E68] hover:bg-[#F5F8F8]"><input type="checkbox" checked={selectedSecretariats.includes(name)} onChange={() => toggleSecretariat(name)} className="h-3.5 w-3.5 accent-[#00549D]" /><span className="truncate">{name}</span></label>)}</div></div></details>
      <details className="relative"><summary className="cursor-pointer list-none rounded-lg border border-[#DCE3E4] bg-white px-3 py-2 text-xs font-bold text-[#526873]">Colunas ({visibleColumns.length})</summary><div className="absolute right-0 z-20 mt-2 w-[min(340px,calc(100vw-3rem))] rounded-xl border border-[#DCE3E4] bg-white p-3 shadow-[0_12px_32px_rgba(23,59,94,0.15)]"><div className="grid gap-1">{reportColumns.map(({ key, label }) => <label key={key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#334E68] hover:bg-[#F5F8F8]"><input type="checkbox" checked={selectedColumns.includes(key)} onChange={() => toggleColumn(key)} className="h-3.5 w-3.5 accent-[#00549D]" /><span>{label}</span></label>)}</div></div></details>
    </div></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-[#E8EEED] pt-3 text-[11px] font-semibold text-[#71818B]"><span>{selectedSecretariats.length ? `${selectedSecretariats.length} de ${availableSecretariats.length} secretarias selecionadas` : `${availableSecretariats.length} secretarias incluídas`}</span><span>{visibleColumns.length} coluna(s) selecionada(s)</span></div></section>
    <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#DCE3E4] pb-4"><div><h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#173B5E]">Indicadores do período</h2><p className="mt-1 text-xs text-[#71818B]">Os valores são atualizados a partir da planilha carregada.</p></div></div>
    <div className="overflow-hidden rounded-2xl border border-[#DCE3E4] bg-white shadow-[0_8px_24px_rgba(23,59,94,0.04)]"><div className="overflow-x-auto"><table className="w-full min-w-[980px] border-collapse text-left"><thead className="bg-[#173B5E] text-[10px] font-bold uppercase tracking-[0.1em] text-white"><tr><th className="px-5 py-3 font-bold">Secretaria</th>{visibleColumns.map(({ key, label }) => <th key={key} className="px-4 py-3 font-bold">{label}</th>)}</tr></thead><tbody className="text-sm">{visibleMetrics.map((item, rowIndex) => <tr key={item.name} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#F8FAFA]"}><td className="max-w-[260px] px-5 py-4 font-semibold text-[#173B5E]">{item.name}</td>{visibleColumns.map(({ key }) => <td key={key} className={`px-4 py-4 align-top text-[#334E68] ${key === "categories" ? "min-w-[240px] text-xs leading-5" : "whitespace-nowrap text-right tabular-nums"}`}>{reportValue(item, key)}</td>)}</tr>)}</tbody></table></div>{metrics.length === 0 && <div className="border-t border-dashed border-[#B8C8CE] bg-white/70 p-10 text-center text-sm text-[#71818B]">Carregando dados da fonte local…</div>}</div>
    <div className="mt-7 flex flex-col items-stretch justify-between gap-3 rounded-xl border border-[#DCE3E4] bg-white/70 p-4 sm:flex-row sm:items-center"><p className="text-xs text-[#71818B]">O PDF usará exatamente as secretarias e colunas selecionadas.</p><ActionButton onClick={() => void handleExport()}>{exporting ? "Gerando PDF…" : <><Download size={16} /> Exportar relatório em PDF</>}</ActionButton></div>
  </div></OuvidoriaLayout>;
}

export function GoalsPage() { return <OuvidoriaLayout><div className="mx-auto max-w-[1200px]"><PageTitle eyebrow="Gestão" title="Metas e prazos" description="Acompanhe os compromissos de atendimento e veja onde a gestão precisa agir." /><div className="grid gap-5 md:grid-cols-3"><div className="rounded-2xl bg-[#173B5E] p-6 text-white"><Target className="text-[#F0C433]" size={22} /><div className="mt-8 text-xs font-bold uppercase tracking-widest text-[#C8DBE2]">Meta de prazo</div><div className="mt-2 font-display text-4xl">90%</div><p className="mt-2 text-sm text-[#D5E1E6]">respostas dentro do prazo</p></div><div className="rounded-2xl border border-[#E4DED2] bg-white p-6"><Check className="text-[#0A8F4D]" size={22} /><div className="mt-8 text-xs font-bold uppercase tracking-widest text-[#71818B]">Resultado atual</div><div className="mt-2 font-display text-4xl">89,6%</div><p className="mt-2 text-sm text-[#71818B]">0,4 ponto abaixo da meta</p></div><div className="rounded-2xl border border-[#E4DED2] bg-[#FFF8E8] p-6"><Info className="text-[#B87800]" size={22} /><div className="mt-8 text-xs font-bold uppercase tracking-widest text-[#8A5B00]">Próxima revisão</div><div className="mt-2 font-display text-4xl">30 dias</div><p className="mt-2 text-sm text-[#8A5B00]">ciclo de acompanhamento</p></div></div><div className="mt-7 rounded-2xl border border-[#E4DED2] bg-white/75 p-6 sm:p-8"><h2 className="font-display text-2xl font-semibold">Indicadores monitorados</h2><div className="mt-6 space-y-5">{[["Prazo de resposta", 89.6, "Meta: 90%"], ["Resolutividade", 74, "Meta: 80%"], ["Satisfação", 84, "Meta: 85%"]].map(([label, value, meta]) => <div key={String(label)}><div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}% <span className="ml-2 text-xs font-normal text-[#71818B]">{meta}</span></span></div><div className="h-3 rounded-full bg-[#E8EDEB]"><div className="h-full rounded-full bg-[#00549D]" style={{ width: `${Number(value)}%` }} /></div></div>)}</div></div></div></OuvidoriaLayout>; }

export function SecretariasPage() { const [query, setQuery] = useState(""); const filtered = secretarias.filter((name) => name.toLowerCase().includes(query.toLowerCase())); return <OuvidoriaLayout><div className="mx-auto max-w-[1200px]"><PageTitle eyebrow="Estrutura municipal" title="Secretarias oficiais" description="Consulte as áreas da Prefeitura de Itupeva usadas como dimensões de acompanhamento da Ouvidoria." /><div className="relative mb-6 max-w-md"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9AA2]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar secretaria" className="h-11 w-full rounded-lg border border-[#DCE3E4] bg-white pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#B8D6DE]" /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((name, index) => <div key={name} className="flex items-center justify-between rounded-xl border border-[#E4DED2] bg-white/75 px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCECF8] text-xs font-bold text-[#00549D]">{index + 1}</span><span className="text-sm font-bold">{name}</span></div><ArrowRight size={16} className="text-[#8A9AA2]" /></div>)}</div><div className="mt-7 rounded-xl border border-[#D7E7E6] bg-[#EAF4F2] p-4 text-sm text-[#2E7563]"><div className="flex gap-2"><ShieldCheck size={18} className="shrink-0" /><span>Fonte: <a className="font-bold underline" href="https://www.itupeva.sp.gov.br/secretarias" target="_blank" rel="noreferrer">portal oficial de Itupeva</a>.</span></div></div></div></OuvidoriaLayout>; }

export function IndicatorsPage() { return <OuvidoriaLayout><div className="mx-auto max-w-[1200px]"><PageTitle eyebrow="Orientação" title="Dicionário de indicadores" description="Entenda o significado de cada número antes de usar o painel para acompanhar resultados." /><div className="space-y-4">{indicators.map((item) => <div key={item.name} className="rounded-2xl border border-[#E4DED2] bg-white/75 p-5 sm:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="font-display text-2xl font-semibold">{item.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5E707A]">{item.definition}</p></div><span className="rounded-full bg-[#DCECF8] px-3 py-1 text-xs font-bold text-[#00549D]">{item.reading}</span></div><div className="mt-4 flex items-center gap-2 text-xs text-[#71818B]"><Info size={14} />Fonte de referência: {item.source}</div></div>)}</div></div></OuvidoriaLayout>; }

export function NotFoundPage() { return <OuvidoriaLayout><div className="mx-auto max-w-xl py-20 text-center"><h1 className="font-display text-4xl">Página não encontrada</h1><p className="mt-3 text-[#71818B]">Use o menu para voltar ao painel da Ouvidoria de Itupeva.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 font-bold text-[#00549D]"><ArrowLeft size={16} /> Voltar à visão geral</Link></div></OuvidoriaLayout>; }
