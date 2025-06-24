
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Dashboard } from "@/pages/Dashboard";
import { Products } from "@/pages/Products";
import { TestSuites } from "@/pages/TestSuites";
import { TestPlans } from "@/pages/TestPlans";
import { TestExecutions } from "@/pages/TestExecutions";
import { TestPlanExecution } from "@/pages/TestPlanExecution";
import { Releases } from "@/pages/Releases";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProductProvider>
          <BrowserRouter>
            <AuthWrapper>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/test-suites" element={<TestSuites />} />
                <Route path="/test-plans" element={<TestPlans />} />
                <Route path="/test-executions" element={<TestExecutions />} />
                <Route path="/test-execution" element={<TestPlanExecution />} />
                <Route path="/releases" element={<Releases />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthWrapper>
          </BrowserRouter>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
