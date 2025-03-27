
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LanguageSelection from "./pages/LanguageSelection";
import AadhaarLogin from "./pages/AadhaarLogin";
import UserRegistration from "./pages/UserRegistration";
import ReturningUser from "./pages/ReturningUser";
import SymptomInput from "./pages/SymptomInput";
import Diagnosis from "./pages/Diagnosis";
import DoctorCall from "./pages/DoctorCall";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/aadhaar-login" element={<AadhaarLogin />} />
            <Route path="/registration" element={<UserRegistration />} />
            <Route path="/returning-user" element={<ReturningUser />} />
            <Route path="/symptoms" element={<SymptomInput />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/doctor-call" element={<DoctorCall />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
