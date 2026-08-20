/* Design: Carta de Serviços de Itupeva — leitura institucional, busca rápida e navegação por áreas, mantendo o conteúdo da versão inicial anexada. */
import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, FileText, Search } from "lucide-react";
import OuvidoriaLayout from "@/components/OuvidoriaLayout";
import rawCarta from "@/data/carta-servicos.txt?raw";

const areaMarkers = ["Educação", "Assuntos Jurídicos e Fundiários", "Gabinete — Defesa Civil", "Gabinete — Ouvidoria"];
const areaDescriptions: Record<string, string> = {
  "Educação": "Matrículas, transporte escolar, alimentação, materiais, apoio especializado e documentos escolares.",
  "Assuntos Jurídicos e Fundiários": "Regularização fundiária, defesa do consumidor, serviços do DETRAN e orientações jurídicas.",
  "Gabinete — Defesa Civil": "Vistorias e solicitações relacionadas à prevenção de riscos em encostas e imóveis.",
  "Gabinete — Ouvidoria": "Reclamações, denúncias, sugestões, elogios, solicitações e pedidos de acesso à informação.",
};

function splitAreas(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return areaMarkers.map((title, index) => {
    const start = lines.findIndex((line) => line === title);
    const next = areaMarkers[index + 1];
    const end = next ? lines.findIndex((line, lineIndex) => lineIndex > start && line === next) : lines.length;
    return { title, description: areaDescriptions[title], content: lines.slice(start, end < 0 ? lines.length : end).join("\n") };
  }).filter((area) => area.content);
}

export default function CartaServicosPage() {
  const areas = useMemo(() => splitAreas(rawCarta), []);
  const [query, setQuery] = useState("");
  const [activeArea, setActiveArea] = useState("Todas");
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const visibleAreas = areas.filter((area) => {
    const areaMatch = activeArea === "Todas" || area.title === activeArea;
    const queryMatch = !normalizedQuery || `${area.title} ${area.description} ${area.content}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
    return areaMatch && queryMatch;
  });

  return <OuvidoriaLayout><div className="mx-auto max-w-[1200px]"><header className="mb-8"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D78B1D]"><span className="h-px w-6 bg-[#D78B1D]" />Serviços públicos</div><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="font-display text-4xl font-semibold tracking-tight text-[#173B5E] md:text-5xl">Carta de Serviços ao Usuário</h1><p className="mt-3 max-w-3xl text-[16px] leading-7 text-[#5E707A]">Consulte os serviços municipais, seus canais de atendimento, prazos, documentos, gratuidade e etapas de solicitação.</p></div><div className="shrink-0 rounded-2xl border border-[#F1D99A] bg-[#FFF8E8] px-5 py-4 text-sm leading-6 text-[#805D13]"><strong>Versão inicial</strong><br />Validação pelos órgãos responsáveis antes da publicação definitiva.</div></div></header>

<section className="rounded-2xl border border-[#E4DED2] bg-white/85 p-5 shadow-[0_12px_30px_rgba(23,59,94,0.05)] sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><label className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#71818B]" size={19} /><span className="sr-only">Buscar na Carta de Serviços</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por serviço, secretaria, canal ou documento" className="h-12 w-full rounded-xl border border-[#DCE3E4] bg-[#FAF9F5] pl-11 pr-4 text-sm text-[#173B5E] outline-none transition focus:border-[#00549D] focus:ring-4 focus:ring-[#DCECF8]" /></label><div className="flex items-center gap-2 text-sm font-bold text-[#526873]"><FileText size={18} className="text-[#00549D]" />{visibleAreas.length} áreas encontradas</div></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setActiveArea("Todas")} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeArea === "Todas" ? "bg-[#00549D] text-white" : "bg-[#EDF3F5] text-[#526873] hover:bg-[#DCECF8]"}`}>Todas</button>{areas.map((area) => <button key={area.title} onClick={() => setActiveArea(area.title)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeArea === area.title ? "bg-[#00549D] text-white" : "bg-[#EDF3F5] text-[#526873] hover:bg-[#DCECF8]"}`}>{area.title}</button>)}</div></section>

<div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]"><aside className="h-fit rounded-2xl border border-[#E4DED2] bg-[#F0F8FA] p-5 lg:sticky lg:top-24"><div className="flex items-center gap-2 font-display text-xl font-semibold text-[#173B5E]"><BookOpen size={20} className="text-[#00549D]" />Índice da carta</div><p className="mt-2 text-sm leading-6 text-[#5E707A]">Selecione uma área para consultar seus serviços.</p><div className="mt-5 space-y-2">{areas.map((area) => <button key={area.title} onClick={() => setActiveArea(area.title)} className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${activeArea === area.title ? "bg-white text-[#00549D] shadow-sm" : "text-[#526873] hover:bg-white/70"}`}><span>{area.title}</span><ChevronRight size={17} className="mt-0.5 shrink-0" /></button>)}</div></aside><main className="min-w-0 space-y-6">{visibleAreas.length === 0 ? <div className="rounded-2xl border border-dashed border-[#B8C8CE] bg-white/70 p-10 text-center"><Search className="mx-auto text-[#71818B]" size={28} /><h2 className="mt-4 font-display text-2xl font-semibold text-[#173B5E]">Nenhum conteúdo encontrado</h2><p className="mt-2 text-sm text-[#71818B]">Tente buscar por outro termo ou selecione “Todas”.</p></div> : visibleAreas.map((area) => <article key={area.title} className="overflow-hidden rounded-2xl border border-[#E4DED2] bg-white/85 shadow-[0_12px_30px_rgba(23,59,94,0.04)]"><div className="border-b border-[#E4DED2] bg-[#FAF9F5] p-6"><div className="flex items-start gap-3"><CheckCircle2 className="mt-1 shrink-0 text-[#0A8F4D]" size={22} /><div><h2 className="font-display text-3xl font-semibold text-[#173B5E]">{area.title}</h2><p className="mt-2 text-sm leading-6 text-[#5E707A]">{area.description}</p></div></div></div><div className="p-6"><div className="whitespace-pre-wrap break-words font-sans text-[14px] leading-7 text-[#526873]">{area.content}</div></div></article>)}</main></div>

<footer className="mt-8 rounded-xl border-2 border-[#00549D] bg-[#EAF4F2] px-5 py-4 text-sm leading-6 text-[#173B5E]"><strong>Importante:</strong> esta é uma versão inicial da Carta de Serviços ao Usuário. Os dados, prazos e canais devem ser validados e atualizados pelos órgãos responsáveis antes da publicação definitiva.</footer></div></OuvidoriaLayout>;
}
