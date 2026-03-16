import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import V1 from "./pages/V1.tsx";
import V2 from "./pages/V2.tsx";
import V3 from "./pages/V3.tsx";
import V4 from "./pages/V4.tsx";
import V5 from "./pages/V5.tsx";
import V6 from "./pages/V6.tsx";
import V7 from "./pages/V7.tsx";
import V8 from "./pages/V8.tsx";
import V9 from "./pages/V9.tsx";
import V10 from "./pages/V10.tsx";
import V11 from "./pages/V11.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/v1" element={<V1 />} />
          <Route path="/v2" element={<V2 />} />
          <Route path="/v3" element={<V3 />} />
          <Route path="/v4" element={<V4 />} />
          <Route path="/v5" element={<V5 />} />
          <Route path="/v6" element={<V6 />} />
          <Route path="/v7" element={<V7 />} />
          <Route path="/v8" element={<V8 />} />
          <Route path="/v9" element={<V9 />} />
          <Route path="/v10" element={<V10 />} />
          <Route path="/v11" element={<V11 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
