import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import NodesPage from "./pages/nodes";
import SchedulesPage from "./pages/schedules";
import ApplicationsPage from "./pages/applications";
import AdminPage from "./pages/admin";

const queryClient = new QueryClient();

const App = () => {
  // Set dark mode by default
  if (typeof window !== "undefined") {
    document.documentElement.classList.add("dark");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/nodes" replace />} />
              <Route path="/nodes" element={<NodesPage />} />
              <Route path="/schedules" element={<SchedulesPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;