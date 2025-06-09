import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Home";
import { Toaster } from "sonner";
import AuthPage from "./pages/Auth";
import TimelineFlow from "./pages/TimelineFlow";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client instance
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors /> {/* Optional props */}
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/simulator" element={<TimelineFlow />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
