/* Design: roteamento municipal da Ouvidoria de Itupeva — cada item do menu possui uma página própria e uma rota de retorno clara. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import RegistroPage from "./pages/RegistroPage";
import { NotFoundPage, ReportsPage } from "./pages/SupportPages";
import SicPage from "./pages/SicPage";
import OuvidoriaPage from "./pages/OuvidoriaPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import CartaServicosPage from "./pages/CartaServicosPage";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/registro" component={RegistroPage} /><Route path="/sic" component={SicPage} /><Route path="/ouvidoria" component={OuvidoriaPage} /><Route path="/configuracoes" component={ConfiguracoesPage} /><Route path="/carta-servicos" component={CartaServicosPage} /><Route path="/relatorios" component={ReportsPage} /><Route component={NotFoundPage} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
