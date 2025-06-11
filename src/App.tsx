import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Home";
import { Toaster } from "sonner";
import AuthPage from "./pages/Auth";
import TimelineFlow from "./pages/TimelineFlow";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TimelineListPage from "./pages/TimelineList";
import TimelineDetailPage from "./pages/TimelineDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/simulator" element={<TimelineFlow />} />
            <Route path="/timelines" element={<TimelineListPage />} />
            <Route
              path="/simulator/:id"
              element={<TimelineDetailPage />}
            />{" "}
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
