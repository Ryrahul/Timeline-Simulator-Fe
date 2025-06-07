"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Brain,
  GitBranch,
  Sparkles,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Zap,
  Eye,
  Target,
  Twitter,
  Github,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const timelineCards = [
    {
      title: "Timeline A: The Bold Leap",
      emotion: "Adventurous & Fulfilled",
      career: "Startup Founder",
      lifestyle: "Digital Nomad",
      mental: "High Confidence",
      color: isDark ? "from-cyan-500 to-blue-600" : "from-cyan-400 to-blue-500",
    },
    {
      title: "Timeline B: The Steady Path",
      emotion: "Secure & Content",
      career: "Senior Manager",
      lifestyle: "Suburban Family Life",
      mental: "Balanced Stability",
      color: isDark
        ? "from-purple-500 to-pink-600"
        : "from-purple-400 to-pink-500",
    },
    {
      title: "Timeline C: The Creative Route",
      emotion: "Passionate & Inspired",
      career: "Freelance Artist",
      lifestyle: "Urban Creative Hub",
      mental: "Expressive Freedom",
      color: isDark
        ? "from-emerald-500 to-teal-600"
        : "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <div
      className={`min-h-screen overflow-hidden relative ${
        isDark ? "bg-black text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"
              : "bg-gradient-to-br from-blue-50 via-purple-50 to-white"
          }`}
        ></div>
        <div
          className={`absolute w-96 h-96 rounded-full ${
            isDark
              ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
              : "bg-gradient-to-r from-cyan-300/20 to-purple-300/20"
          } blur-3xl`}
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        ></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${
              isDark ? "bg-white" : "bg-blue-500"
            } rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GitBranch
            className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
          />
          <span
            className={`text-xl font-bold ${
              isDark
                ? "bg-gradient-to-r from-cyan-400 to-purple-400"
                : "bg-gradient-to-r from-cyan-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            Parallel Timeline
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={
              isDark
                ? "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                : "border-cyan-600/50 text-cyan-600 hover:bg-cyan-600/10"
            }
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            className={
              isDark
                ? "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                : "border-cyan-600/50 text-cyan-600 hover:bg-cyan-600/10"
            }
          >
            Sign In
          </Button>
        </div>
      </nav>

      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1
              className={`text-6xl md:text-8xl font-bold mb-6 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                  : "bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600"
              } bg-clip-text text-transparent animate-pulse`}
            >
              Explore Your
            </h1>
            <h1
              className={`text-6xl md:text-8xl font-bold mb-6 ${
                isDark
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
              } bg-clip-text text-transparent`}
            >
              Alternate Futures
            </h1>
          </div>
          <p
            className={`text-xl md:text-2xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-8 leading-relaxed`}
          >
            Input any life decision and watch AI simulate three unique timeline
            outcomes
            <br />
            for your mental health, career, lifestyle, and emotions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className={`${
                isDark
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-cyan-500/25 hover:shadow-cyan-500/40"
                  : "bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 shadow-cyan-600/25 hover:shadow-cyan-600/40"
              } text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300`}
            >
              Try Simulation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`${
                isDark
                  ? "border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                  : "border-purple-600/50 text-purple-600 hover:bg-purple-600/10"
              } px-8 py-4 text-lg rounded-full`}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 ${
              isDark
                ? "bg-gradient-to-r from-cyan-400 to-purple-400"
                : "bg-gradient-to-r from-cyan-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12" />,
                title: "Enter a Decision",
                description:
                  "Type any life choice you're contemplating - career moves, relationships, relocations, or major life changes",
              },
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "AI Generates Timelines",
                description:
                  "Our advanced AI creates three distinct future scenarios with detailed outcomes across multiple life dimensions",
              },
              {
                icon: <Eye className="w-12 h-12" />,
                title: "Explore & Fork Outcomes",
                description:
                  "Dive deep into each timeline, compare results, and even create new branches based on sub-decisions",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className={`${
                  isDark
                    ? "bg-gray-900/50 border-gray-700/50 hover:bg-gray-800/50"
                    : "bg-white/80 border-gray-200 hover:bg-gray-50/80 shadow-md"
                } backdrop-blur-sm transition-all duration-300 group`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`${
                      isDark ? "text-cyan-400" : "text-cyan-600"
                    } mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 ${
              isDark
                ? "bg-gradient-to-r from-purple-400 to-pink-400"
                : "bg-gradient-to-r from-purple-600 to-pink-600"
            } bg-clip-text text-transparent`}
          >
            Timeline Snapshots
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {timelineCards.map((timeline, index) => (
              <Card
                key={index}
                className={`${
                  isDark
                    ? "bg-gray-900/30 border-gray-700/30"
                    : "bg-white/80 border-gray-200 shadow-md"
                } backdrop-blur-sm hover:scale-105 transition-all duration-500 group overflow-hidden`}
              >
                <div className={`h-2 bg-gradient-to-r ${timeline.color}`}></div>
                <CardContent className="p-6">
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isDark
                        ? "text-white group-hover:text-cyan-400"
                        : "text-gray-800 group-hover:text-cyan-600"
                    } transition-colors`}
                  >
                    {timeline.title}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Heart
                        className={
                          isDark
                            ? "w-5 h-5 text-pink-400"
                            : "w-5 h-5 text-pink-600"
                        }
                      />
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                      >
                        {timeline.emotion}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Briefcase
                        className={
                          isDark
                            ? "w-5 h-5 text-blue-400"
                            : "w-5 h-5 text-blue-600"
                        }
                      />
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                      >
                        {timeline.career}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Home
                        className={
                          isDark
                            ? "w-5 h-5 text-green-400"
                            : "w-5 h-5 text-green-600"
                        }
                      />
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                      >
                        {timeline.lifestyle}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Brain
                        className={
                          isDark
                            ? "w-5 h-5 text-purple-400"
                            : "w-5 h-5 text-purple-600"
                        }
                      />
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                      >
                        {timeline.mental}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className={`w-full mt-6 ${
                      isDark
                        ? "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                        : "border-cyan-600/50 text-cyan-600 hover:bg-cyan-600/10"
                    }`}
                  >
                    Explore Timeline
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-8 ${
              isDark
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                : "bg-gradient-to-r from-emerald-600 to-cyan-600"
            } bg-clip-text text-transparent`}
          >
            Why It Matters
          </h2>
          <p
            className={`text-xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-12 leading-relaxed`}
          >
            Decision-making is one of life's greatest challenges. Our AI-powered
            foresight helps you visualize potential outcomes, reduce decision
            paralysis, and gain clarity on the paths that align with your values
            and goals.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Decision Clarity",
                description:
                  "See beyond uncertainty with data-driven future projections",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Assisted Foresight",
                description:
                  "Leverage advanced algorithms to explore complex life scenarios",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div
                  className={
                    isDark
                      ? "text-cyan-400 mb-4 flex justify-center"
                      : "text-cyan-600 mb-4 flex justify-center"
                  }
                >
                  {benefit.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {benefit.title}
                </h3>
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 ${
              isDark
                ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                : "bg-gradient-to-r from-yellow-500 to-orange-500"
            } bg-clip-text text-transparent`}
          >
            Perfect For
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Students",
                desc: "Career & education choices",
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Professionals",
                desc: "Job transitions & growth",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Dreamers",
                desc: "Life-changing adventures",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Planners",
                desc: "Strategic life decisions",
              },
            ].map((useCase, index) => (
              <Card
                key={index}
                className={`${
                  isDark
                    ? "bg-gray-900/40 border-gray-700/40 hover:bg-gray-800/40"
                    : "bg-white/80 border-gray-200 hover:bg-gray-50/80 shadow-md"
                } backdrop-blur-sm transition-all duration-300 text-center`}
              >
                <CardContent className="p-6">
                  <div
                    className={
                      isDark
                        ? "text-cyan-400 mb-4 flex justify-center"
                        : "text-cyan-600 mb-4 flex justify-center"
                    }
                  >
                    {useCase.icon}
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {useCase.title}
                  </h3>
                  <p
                    className={
                      isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
                    }
                  >
                    {useCase.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-8 ${
              isDark
                ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                : "bg-gradient-to-r from-indigo-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            Behind the AI
          </h2>
          <p
            className={`text-xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-8 leading-relaxed`}
          >
            Our simulation engine runs independent parallel computations,
            analyzing thousands of variables including psychological patterns,
            market trends, social dynamics, and personal growth trajectories to
            create realistic future scenarios.
          </p>
          <div
            className={`flex justify-center space-x-8 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                1000+
              </div>
              <div className="text-sm">Variables Analyzed</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              >
                3
              </div>
              <div className="text-sm">Parallel Timelines</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-pink-400" : "text-pink-600"
                }`}
              >
                ∞
              </div>
              <div className="text-sm">Possible Outcomes</div>
            </div>
          </div>
        </div>
      </section>

      <footer
        className={`relative z-10 py-16 px-6 border-t ${
          isDark ? "border-gray-800/50" : "border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GitBranch
                  className={
                    isDark ? "w-6 h-6 text-cyan-400" : "w-6 h-6 text-cyan-600"
                  }
                />
                <span
                  className={`text-lg font-bold ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-400 to-purple-400"
                      : "bg-gradient-to-r from-cyan-600 to-purple-600"
                  } bg-clip-text text-transparent`}
                >
                  Parallel Timeline
                </span>
              </div>
              <p
                className={
                  isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
                }
              >
                Explore infinite possibilities with AI-powered future
                simulation.
              </p>
            </div>
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Product
              </h4>
              <ul
                className={`space-y-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                <li>
                  <a
                    href="#"
                    className={
                      isDark
                        ? "hover:text-cyan-400 transition-colors"
                        : "hover:text-cyan-600 transition-colors"
                    }
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={
                      isDark
                        ? "hover:text-cyan-400 transition-colors"
                        : "hover:text-cyan-600 transition-colors"
                    }
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={
                      isDark
                        ? "hover:text-cyan-400 transition-colors"
                        : "hover:text-cyan-600 transition-colors"
                    }
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Company
              </h4>
              <ul
                className={`space-y-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                <li>
                  <a
                    href="#"
                    className={
                      isDark
                        ? "hover:text-cyan-400 transition-colors"
                        : "hover:text-cyan-600 transition-colors"
                    }
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={
                      isDark
                        ? "hover:text-cyan-400 transition-colors"
                        : "hover:text-cyan-600 transition-colors"
                    }
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={
                      isDark
                        ? "hover:text-cyan-400 transition-colors"
                        : "hover:text-cyan-600 transition-colors"
                    }
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Newsletter
              </h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    isDark
                      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                  }
                />
                <Button
                  size="sm"
                  className={
                    isDark
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "bg-cyan-600 hover:bg-cyan-700"
                  }
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t ${
              isDark ? "border-gray-800/50" : "border-gray-200"
            }`}
          >
            <p
              className={
                isDark
                  ? "text-gray-400 text-sm mb-4 md:mb-0"
                  : "text-gray-600 text-sm mb-4 md:mb-0"
              }
            >
              © 2024 Parallel Timeline Simulator. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={
                  isDark
                    ? "text-gray-400 hover:text-cyan-400 transition-colors"
                    : "text-gray-500 hover:text-cyan-600 transition-colors"
                }
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={
                  isDark
                    ? "text-gray-400 hover:text-cyan-400 transition-colors"
                    : "text-gray-500 hover:text-cyan-600 transition-colors"
                }
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={
                  isDark
                    ? "text-gray-400 hover:text-cyan-400 transition-colors"
                    : "text-gray-500 hover:text-cyan-600 transition-colors"
                }
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
