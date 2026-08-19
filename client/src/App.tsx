/* Design: roteamento municipal da Ouvidoria de Itupeva — cada item do menu possui uma página própria e uma rota de retorno clara. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import RegistroPage from "./pages/RegistroPage";
import { GoalsPage, IndicatorsPage, NotFoundPage, ReportsPage, SecretariasPage } from "./pages/SupportPages";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/registro" component={RegistroPage} /><Route path="/relatorios" component={ReportsPage} /><Route path="/metas" component={GoalsPage} /><Route path="/secretarias" component={SecretariasPage} /><Route path="/indicadores" component={IndicatorsPage} /><Route component={NotFoundPage} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
