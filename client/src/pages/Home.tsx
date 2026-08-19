/* Design: Civic editorial design — serviço público claro. Fraunces para títulos, Public Sans para interface, azul-marinho #173B5E, marfim, amarelo-dourado, verde semântico e trilha de progresso pontilhada. */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Filter,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const initialManifestations = [
  { id: "2026.00041.001", title: "Iluminação da praça do bairro", type: "Solicitação", status: "Em análise", date: "18 ago 2026", updated: "há 2h", tone: "amber", excerpt: "Pedido de manutenção em três postes próximos à praça central." },
  { id: "2026.00037.842", title: "Atendimento no posto de saúde", type: "Reclamação", status: "Respondida", date: "12 ago 2026", updated: "há 1 dia", tone: "green", excerpt: "Relato sobre o tempo de espera e orientação recebida no atendimento." },
  { id: "2026.00029.117", title: "Acesso à informação sobre obras", type: "Acesso à informação", status: "Aguardando resposta", date: "04 ago 2026", updated: "há 3 dias", tone: "blue", excerpt: "Solicitação de informações sobre o cronograma da obra da avenida." },
  { id: "2026.00018.506", title: "Sugestão para o transporte municipal", type: "Sugestão", status: "Encaminhada", date: "27 jul 2026", updated: "há 8 dias", tone: "slate", excerpt: "Ideia para melhorar a comunicação dos horários nos pontos de ônibus." },
];

function StatusBadge({ status, tone }: { status: string; tone: string }) {
  const styles: Record<string, string> = {
    amber: "bg-[#FFF3D3] text-[#8A5B00]",
    green: "bg-[#DDF3E7] text-[#17653B]",
    blue: "bg-[#DCECF8] text-[#1B567C]",
    slate: "bg-[#E8EDF0] text-[#4F616D]",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function ProgressLine({ active = 2 }: { active?: number }) {
  return <div className="flex items-center gap-0 py-4" aria-label={`Etapa ${active} de 4`}>
    {["Recebida", "Em análise", "Resposta", "Concluída"].map((label, index) => {
      const step = index + 1;
      const completed = step < active;
      const current = step === active;
      return <div key={label} className="flex flex-1 items-center last:flex-none">
        <div className="flex flex-col items-center gap-2"><div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${completed ? "border-[#27844F] bg-[#27844F] text-white" : current ? "border-[#E5A928] bg-[#FFF8E8] text-[#8A5B00]" : "border-[#B8C6CF] bg-white text-[#71818B]"}`}>{completed ? <Check size={14} /> : step}</div><span className={`hidden text-[11px] sm:block ${current ? "font-bold text-[#173B5E]" : "text-[#73838C]"}`}>{label}</span></div>
        {step < 4 && <div className={`mx-2 mt-[-17px] h-px flex-1 border-t-2 border-dashed ${completed ? "border-[#5BAE7A]" : "border-[#C9D3D8]"}`} />}
      </div>;
    })}
  </div>;
}

export default function Home() {
  const [active, setActive] = useState("Visão geral");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialManifestations[0]);
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manifestations, setManifestations] = useState(initialManifestations);

  const filtered = useMemo(() => manifestations.filter((item) => `${item.id} ${item.title} ${item.type} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [manifestations, search]);

  function selectNav(item: string) {
    setActive(item);
    setSidebarOpen(false);
    if (item === "Nova manifestação") setModal("new");
    if (item !== "Nova manifestação") toast(`${item} selecionado`, { description: "A demonstração está pronta para receber dados reais da API do Fala.BR." });
  }

  function saveManifestation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "Nova manifestação");
    const type = String(form.get("type") || "Solicitação");
    const item = { id: `2026.${String(manifestations.length + 42).padStart(5, "0")}.300`, title, type, status: "Recebida", date: "19 ago 2026", updated: "agora", tone: "blue", excerpt: String(form.get("description") || "Manifestação cadastrada pela interface Fala.BR Fácil.") };
    setManifestations((current) => [item, ...current]);
    setSelected(item);
    setModal(null);
    toast.success("Manifestação cadastrada", { description: `Seu protocolo é ${item.id}.` });
  }

  return <div className="min-h-screen bg-[#F7F5F0] text-[#173B5E]">
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#DCE3E4] bg-[#F7F5F0]/95 px-5 backdrop-blur-md lg:px-9">
      <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-[#EDEAE1] lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173B5E] shadow-[0_5px_0_#E5A928]"><MessageCircle className="text-[#FFF5D7]" size={20} /></div><div><div className="font-display text-xl font-semibold leading-none tracking-tight">Fala.BR <em className="text-[#D78B1D] not-italic">Fácil</em></div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#71818B]">Ouvidoria digital</div></div></div></div>
      <div className="flex items-center gap-3"><button onClick={() => toast("Central de ajuda", { description: "Aqui você encontrará respostas e orientações para cada etapa." })} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[#526873] hover:bg-[#EDEAE1] sm:flex"><HelpCircle size={17} /> Ajuda</button><div className="flex items-center gap-3 border-l border-[#DCE3E4] pl-3"><div className="hidden text-right sm:block"><div className="text-sm font-bold">Mariana Silva</div><div className="text-xs text-[#71818B]">Cidadã</div></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4E8E8] font-display font-semibold text-[#173B5E]">MS</div><ChevronDown size={16} className="text-[#71818B]" /></div></div>
    </header>
    <div className="flex">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-[270px] border-r border-[#DCE3E4] bg-[#F7F5F0] px-5 py-24 transition-transform duration-200 lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:translate-x-0 lg:px-5 lg:py-8`}>
        <button className="absolute right-4 top-5 rounded-md p-2 hover:bg-[#EDEAE1] lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"><X size={18} /></button>
        <div className="mb-8 rounded-2xl bg-[#173B5E] p-5 text-white shadow-[0_10px_0_#E5A928]"><div className="mb-3 flex items-center gap-2 text-[#FFE9A8]"><Sparkles size={17} /><span className="text-xs font-bold uppercase tracking-widest">Seu caminho</span></div><p className="font-display text-[21px] leading-tight">Tudo sobre suas manifestações, em um só lugar.</p><p className="mt-3 text-xs leading-5 text-[#D5E1E6]">Consulte o andamento, envie uma informação nova ou faça uma nova manifestação.</p></div>
        <nav className="space-y-1" aria-label="Navegação principal"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#84929A]">Menu principal</p>{[["Visão geral", LayoutDashboard], ["Minhas manifestações", FileText], ["Nova manifestação", Plus]].map(([label, Icon]: any) => <button key={label} onClick={() => selectNav(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${active === label ? "bg-[#DCECF8] text-[#173B5E]" : "text-[#526873] hover:bg-[#EDEAE1]"}`}><Icon size={18} className={active === label ? "text-[#24749A]" : "text-[#78909B]"} />{label}</button>)}</nav>
        <div className="mt-10 border-t border-[#DCE3E4] pt-6"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#84929A]">Precisa de orientação?</p><button onClick={() => selectNav("Como funciona")} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#526873] hover:bg-[#EDEAE1]"><HelpCircle size={18} /> Como funciona</button><a href="https://falabr.cgu.gov.br/help" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#526873] hover:bg-[#EDEAE1]"><ShieldCheck size={18} /> Documentação oficial</a></div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-[#173B5E]/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D78B1D]"><span className="h-px w-6 bg-[#D78B1D]" /> Quinta-feira, 19 de agosto de 2026</div><h1 className="font-display text-4xl font-semibold tracking-tight text-[#173B5E] md:text-5xl">Olá, Mariana.</h1><p className="mt-2 max-w-lg text-[16px] leading-7 text-[#5E707A]">Acompanhe o que está acontecendo e encontre o próximo passo de cada manifestação.</p></div><button onClick={() => setModal("new")} className="group flex w-fit items-center gap-3 rounded-xl bg-[#E5A928] px-5 py-3.5 text-sm font-extrabold text-[#173B5E] shadow-[0_4px_0_#B87D13] transition hover:-translate-y-0.5 hover:bg-[#F0B83C] active:translate-y-0 active:shadow-none"><Plus size={19} /> Registrar manifestação <ArrowRight size={17} className="transition group-hover:translate-x-1" /></button></div>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl bg-[#173B5E] p-5 text-white shadow-[0_5px_0_#0E2A45]"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-[#BED1DA]">Total registradas</span><FileText size={20} className="text-[#FFE9A8]" /></div><div className="mt-6 font-display text-4xl">12</div><div className="mt-1 text-xs text-[#C7D8DF]">nos últimos 12 meses</div></div><div className="rounded-2xl border border-[#E4DED2] bg-white/70 p-5 shadow-[0_8px_24px_rgba(23,59,94,0.05)]"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-[#71818B]">Em andamento</span><Clock3 size={20} className="text-[#D78B1D]" /></div><div className="mt-6 font-display text-4xl text-[#173B5E]">04</div><div className="mt-1 text-xs text-[#71818B]">aguardando uma próxima etapa</div></div><div className="rounded-2xl border border-[#E4DED2] bg-white/70 p-5 shadow-[0_8px_24px_rgba(23,59,94,0.05)]"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-[#71818B]">Respondidas</span><Check size={20} className="text-[#27844F]" /></div><div className="mt-6 font-display text-4xl text-[#173B5E]">08</div><div className="mt-1 text-xs text-[#71818B]">com resposta disponível</div></div><div className="rounded-2xl border border-[#E4DED2] bg-[#FFF8E8] p-5 shadow-[0_8px_24px_rgba(23,59,94,0.05)]"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-[#8A5B00]">Atenção</span><AlertCircle size={20} className="text-[#D78B1D]" /></div><div className="mt-6 font-display text-4xl text-[#173B5E]">01</div><div className="mt-1 text-xs text-[#8A5B00]">precisa de informação complementar</div></div></section>
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><div className="rounded-2xl border border-[#E4DED2] bg-white/75 p-5 shadow-[0_8px_24px_rgba(23,59,94,0.04)] sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-display text-2xl font-semibold">Suas manifestações</h2><p className="mt-1 text-sm text-[#71818B]">A mais recente atualização aparece primeiro.</p></div><div className="flex items-center gap-2"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9AA2]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar protocolo ou assunto" className="h-10 w-full rounded-lg border border-[#DCE3E4] bg-[#F7F5F0] pl-9 pr-3 text-xs outline-none ring-[#B8D6DE] transition focus:ring-2 sm:w-[215px]" /></div><button onClick={() => toast("Filtros", { description: "Os filtros avançados estarão disponíveis na integração com a API." })} className="flex h-10 items-center gap-2 rounded-lg border border-[#DCE3E4] px-3 text-xs font-bold text-[#526873] hover:bg-[#F7F5F0]"><Filter size={15} /> <span className="hidden sm:inline">Filtrar</span></button></div></div><div className="mt-6 space-y-3">{filtered.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={`w-full rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#9BBCC8] hover:shadow-[0_8px_20px_rgba(23,59,94,0.07)] ${selected.id === item.id ? "border-[#9BBCC8] bg-[#F4FAFB]" : "border-[#E8E3DA] bg-white/60"}`}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold text-[#24749A]">{item.id}</span><span className="text-[#A4B0B5]">·</span><span className="text-xs text-[#71818B]">{item.type}</span></div><div className="mt-2 truncate text-[15px] font-extrabold text-[#173B5E]">{item.title}</div><p className="mt-1 truncate text-xs text-[#71818B]">{item.excerpt}</p></div><div className="flex shrink-0 items-center gap-3"><StatusBadge status={item.status} tone={item.tone} /><MoreHorizontal size={17} className="text-[#9AA9B0]" /></div></div><div className="mt-3 flex items-center justify-between text-[11px] text-[#8A9AA2]"><span>Registrada em {item.date}</span><span>Atualizada {item.updated}</span></div></button>)}{filtered.length === 0 && <div className="flex flex-col items-center py-8 text-center"><img src="/manus-storage/falabr-empty-state_c79409fe.png" className="mb-3 h-20 w-20 object-contain" alt="Pasta aberta sem resultados" /><p className="font-display text-xl">Nenhuma manifestação encontrada</p><p className="mt-1 text-sm text-[#71818B]">Tente buscar por outro termo ou protocolo.</p></div>}</div></div>
            <div className="space-y-6"><div className="rounded-2xl bg-[#EAF4F2] p-6"><div className="flex items-start justify-between"><div><span className="text-xs font-bold uppercase tracking-widest text-[#2E7563]">Detalhe selecionado</span><h2 className="mt-2 font-display text-2xl font-semibold leading-tight">{selected.title}</h2></div><button onClick={() => setModal("edit")} className="rounded-lg bg-white p-2.5 text-[#24749A] shadow-sm hover:bg-[#FFF8E8]" aria-label="Editar manifestação"><Pencil size={16} /></button></div><div className="mt-5 rounded-xl bg-white/70 p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#71818B]">Protocolo</span><button onClick={() => { navigator.clipboard?.writeText(selected.id); toast.success("Protocolo copiado"); }} className="text-xs font-bold text-[#24749A]">Copiar</button></div><div className="mt-1 font-mono text-[14px] font-bold text-[#173B5E]">{selected.id}</div></div><ProgressLine active={selected.status === "Respondida" ? 3 : 2} /><button onClick={() => toast("Histórico em preparação", { description: "O histórico completo aparecerá aqui quando conectado à API." })} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#B9D8D2] bg-transparent py-2.5 text-xs font-bold text-[#2E7563] hover:bg-white/60">Ver histórico completo <ArrowRight size={15} /></button></div><div className="rounded-2xl border border-[#E4DED2] bg-[#FFF8E8] p-6"><div className="flex items-start gap-3"><div className="rounded-lg bg-[#F2D68D] p-2 text-[#8A5B00]"><HelpCircle size={17} /></div><div><h3 className="font-bold text-[#173B5E]">Como funciona?</h3><p className="mt-1 text-sm leading-6 text-[#6F6652]">Cada manifestação recebe um protocolo. Use esse número para acompanhar o andamento e consultar as respostas.</p><button onClick={() => toast("Dica", { description: "Você também pode anexar documentos e enviar informações complementares." })} className="mt-3 text-xs font-extrabold text-[#8A5B00] underline underline-offset-4">Ler orientação rápida</button></div></div></div></div></section>
        </div>
      </main>
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173B5E]/35 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#F7F5F0] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D78B1D]"><span className="h-px w-5 bg-[#D78B1D]" /> {modal === "new" ? "Novo registro" : "Atualizar dados"}</div><h2 className="font-display text-3xl font-semibold">{modal === "new" ? "Registrar manifestação" : "Atualizar manifestação"}</h2><p className="mt-2 text-sm leading-6 text-[#71818B]">Conte o que aconteceu com suas palavras. Você poderá revisar tudo antes de enviar.</p></div><button onClick={() => setModal(null)} className="rounded-lg p-2 hover:bg-[#EDEAE1]" aria-label="Fechar"><X size={19} /></button></div><form onSubmit={saveManifestation} className="mt-7 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2 text-sm font-bold">Tipo de manifestação<select name="type" defaultValue={modal === "edit" ? selected.type : "Solicitação"} className="mt-1 h-11 w-full rounded-lg border border-[#D5DFE0] bg-white px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#B8D6DE]"><option>Solicitação</option><option>Reclamação</option><option>Denúncia</option><option>Sugestão</option><option>Elogio</option><option>Acesso à informação</option></select></label><label className="space-y-2 text-sm font-bold">Assunto<select className="mt-1 h-11 w-full rounded-lg border border-[#D5DFE0] bg-white px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#B8D6DE]"><option>Escolha um assunto</option><option>Serviços públicos</option><option>Atendimento</option><option>Infraestrutura</option><option>Transparência</option></select></label></div><label className="block space-y-2 text-sm font-bold">Título curto<input name="title" required defaultValue={modal === "edit" ? selected.title : ""} placeholder="Ex.: Iluminação da praça do bairro" className="mt-1 h-11 w-full rounded-lg border border-[#D5DFE0] bg-white px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#B8D6DE]" /></label><label className="block space-y-2 text-sm font-bold">Conte o que aconteceu<textarea name="description" required defaultValue={modal === "edit" ? selected.excerpt : ""} placeholder="Explique a situação, o local e o que você espera como resposta." rows={5} className="mt-1 w-full resize-y rounded-lg border border-[#D5DFE0] bg-white px-3 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#B8D6DE]" /><span className="block text-xs font-normal text-[#71818B]">Evite incluir senhas ou dados pessoais de outras pessoas.</span></label><div className="rounded-xl bg-[#EAF4F2] p-4 text-sm leading-6 text-[#2E7563]"><div className="flex gap-2"><ShieldCheck size={18} className="mt-1 shrink-0" /><p><strong>Seus dados ficam protegidos.</strong> Nesta demonstração, o cadastro é salvo somente nesta tela. Na versão conectada, o envio seguirá a autenticação da API oficial.</p></div></div><div className="flex flex-col-reverse gap-3 border-t border-[#E4DED2] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModal(null)} className="rounded-lg px-5 py-3 text-sm font-bold text-[#526873] hover:bg-[#EDEAE1]">Cancelar</button><button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-[#173B5E] px-5 py-3 text-sm font-extrabold text-white shadow-[0_3px_0_#0E2A45] hover:bg-[#214D73] active:translate-y-0.5 active:shadow-none">{modal === "new" ? <><Send size={16} /> Revisar e cadastrar</> : <><Check size={16} /> Salvar alterações</>}</button></div></form></div></div>}
  </div>;
}
