import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";
import LandingPage from "./pages/Home";

function App() {
  return (
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;
