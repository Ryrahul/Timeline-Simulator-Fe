import { useEffect, useState } from "react";
import { ArrowRight, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <>
      <div className="min-h-screen bg-black text white overflow-hidden  relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
          <div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
              transition: "all 0.3s ease-out",
            }}
          ></div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
        <nav className=" relative z-10 p-6 flex justify-between items-center">
          <div className=" flex  items-center space-x-2">
            <GitBranch className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Parallel Timeline
            </span>
          </div>
          <Button
            variant="outline"
            className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
          >
            Sign In
          </Button>
        </nav>
        <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Explore Your
              </h1>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Alternate Futures
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Input any life decision and watch AI simulate three unique
              timeline outcomes
              <br />
              for your mental health, career, lifestyle, and emotions
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 cursor-pointer"
              >
                Try Simulation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 hover:text-white px-8 py-4 text-lg rounded-full cursor-pointer"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
