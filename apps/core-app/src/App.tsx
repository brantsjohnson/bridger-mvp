import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Add from "./pages/Add";
import NotFound from "./pages/NotFound";
import ConnectionHandler from "./components/ConnectionHandler";

const queryClient = new QueryClient();

// Component to handle route changes and update parent window URL
const RouteHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for route changes from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CORE_ROUTE') {
        navigate(event.data.route);
      }
    };

    // Update parent window URL when route changes
    const updateParentURL = () => {
      const currentPath = location.pathname;
      const parentURL = `/core${currentPath}`;
      window.parent.postMessage({ type: 'UPDATE_URL', url: parentURL }, '*');
    };

    window.addEventListener('message', handleMessage);
    updateParentURL();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [location, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/homies" element={<Friends />} />
          <Route path="/homies/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add" element={<Add />} />
          <Route path="/connect" element={<ConnectionHandler currentUserId="fox_red_user_123" currentUserName="Fox Red" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
