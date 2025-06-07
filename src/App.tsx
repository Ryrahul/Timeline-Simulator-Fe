import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Home";
import { Toaster } from "sonner";
import AuthPage from "./pages/Auth";
function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" richColors /> {/* Optional props */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<AuthPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
