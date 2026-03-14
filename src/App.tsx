import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SentinelApp from "./apps/sentinel/SentinelApp";
import JeSuisLaHome from "./apps/je-suis-la/JeSuisLaHome";
import EchangeoHome from "./apps/echangeo/EchangeoHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sentinel/*" element={<SentinelHome />} />
          <Route path="/je-suis-la/*" element={<JeSuisLaHome />} />
          <Route path="/echangeo/*" element={<EchangeoHome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
