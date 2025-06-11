import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import {
  GitBranch,
  Brain,
  Clock,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { authAtom } from "@/state/authAtom";
import { axiosClient } from "@/lib/httpClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/ui/nav";
import { AnimatedBackground } from "@/components/ui/animated-bg";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthUser {
  username: string;
  email: string;
}

interface SimulationData {
  id: string;
  timelineId: string;
  agentType?: string;
  summary?: string;
  score?: string | number;
  createdAt: string;
}

interface TimelineItem {
  summary?: string;
  tldr?: string;
  simulation?: SimulationData[];
}

interface TimelineData {
  id?: string;
  text: string;
  Timelines: TimelineItem[];
  createdAt?: string;
}

const getAgentIcon = (agentType: string) => {
  const type = agentType?.toLowerCase();

  if (type?.includes("finance")) {
    return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  } else if (type?.includes("mental_health")) {
    return <Brain className="w-4 h-4 text-cyan-400" />;
  } else if (type?.includes("personal_growth")) {
    return <Target className="w-4 h-4 text-purple-400" />;
  }

  return <Lightbulb className="w-4 h-4 text-amber-400" />;
};

const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return `${Math.floor(diffInHours / 168)}w ago`;
};

const getErrorMessage = (error: any): string => {
  if (error?.response?.status === 401) {
    return "You need to log in to view your timelines.";
  }
  if (error?.response?.status === 403) {
    return "You don't have permission to access these timelines.";
  }
  if (error?.response?.status === 404) {
    return "Timelines not found.";
  }
  if (error?.response?.status >= 500) {
    return "Server error. Please try again later.";
  }
  if (error?.code === "NETWORK_ERROR" || !navigator.onLine) {
    return "Network error. Please check your internet connection.";
  }
  return error?.message || "Failed to load timelines. Please try again.";
};

export default function TimelineListPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const auth = useRecoilValue<AuthUser | null>(authAtom);
  const navigate = useNavigate();

  const {
    data: timelineData = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["timelines", auth?.username],
    queryFn: async (): Promise<TimelineData[]> => {
      try {
        const response = await axiosClient.get("/question");
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!auth,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const filteredTimelines = React.useMemo(() => {
    let filtered = timelineData.filter((timeline) => {
      const matchesSearch =
        timeline.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timeline.Timelines.some(
          (t) =>
            t.tldr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesSearch;
    });

    if (sortBy === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
      );
    } else if (sortBy === "question") {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    }

    return filtered;
  }, [timelineData, searchQuery, sortBy]);

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Enhanced animated background with more vibrant colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-600/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <AnimatedBackground />

      <Navbar />

      <div className="relative z-10 p-6 bg-gradient-to-r from-slate-900/50 via-purple-900/30 to-slate-900/50 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  My Timelines
                </h1>
              </div>
              <p className="text-slate-300 text-lg">
                Explore your past scenarios and create new timeline simulations
              </p>
            </div>
            <Link to="/simulator">
              <Button className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 border border-white/20">
                <Plus className="w-5 h-5 mr-2" />
                New Timeline
              </Button>
            </Link>
          </div>

          {error && (
            <Alert className="mb-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/50 text-red-100 shadow-xl backdrop-blur-sm">
              <div className="p-1 bg-red-500 rounded-full">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <AlertDescription className="flex items-center justify-between">
                <span className="text-red-100">{getErrorMessage(error)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isRefetching}
                  className="ml-4 border-red-400/50 text-red-100 hover:bg-red-500/30 bg-red-500/20 backdrop-blur-sm"
                >
                  {isRefetching ? (
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3 mr-1" />
                  )}
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!error && (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <Input
                    placeholder="Search timelines by question or insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 backdrop-blur-sm rounded-xl shadow-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 py-3 bg-slate-800/50 border border-slate-600/50 text-white backdrop-blur-sm rounded-xl shadow-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800/90 border border-slate-700/50 backdrop-blur-xl rounded-xl shadow-2xl">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="question">By Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-slate-800/40 to-cyan-900/20 border border-cyan-500/30 backdrop-blur-sm shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">
                          Total Timelines
                        </p>
                        <p className="text-3xl font-bold text-white mt-1">
                          {timelineData.length}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                        <GitBranch className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">
                          This Month
                        </p>
                        <p className="text-3xl font-bold text-white mt-1">
                          {
                            timelineData.filter(
                              (t) =>
                                t.createdAt &&
                                new Date(t.createdAt).getMonth() ===
                                  new Date().getMonth()
                            ).length
                          }
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {error && !isLoading ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl mx-auto mb-6 w-fit">
                <AlertCircle className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3">
                Something went wrong
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                {getErrorMessage(error)}
              </p>
              <Button
                onClick={handleRetry}
                disabled={isRefetching}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-8 py-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {isRefetching ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 mr-2" />
                )}
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="bg-gradient-to-br from-slate-800/40 to-slate-700/40 border border-slate-600/30 backdrop-blur-sm rounded-2xl shadow-xl animate-pulse"
                >
                  <CardContent className="p-6">
                    <div className="h-5 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-600 to-slate-500 rounded mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-600 to-slate-500 rounded mb-4"></div>
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-500 rounded-xl"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-500 rounded-xl"></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-500 rounded-xl"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTimelines.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl shadow-xl mx-auto mb-6 w-fit">
                <Brain className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3">
                {searchQuery ? "No timelines found" : "No timelines yet"}
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Create your first timeline simulation to get started exploring different life scenarios."}
              </p>
              {!searchQuery && (
                <Link to="/simulator">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-8 py-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Timeline
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTimelines.map((timeline, index) => (
                <Card
                  key={timeline.id || index}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 hover:border-cyan-500/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer group hover:scale-105 hover:-translate-y-2"
                  onClick={() => navigate(`/simulator/${timeline.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                          {timeline.text}
                        </h3>
                      </div>
                      <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg group-hover:from-cyan-500 group-hover:to-purple-500 transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {timeline.Timelines[0]?.tldr && (
                      <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3 group-hover:text-slate-300 transition-colors">
                        {timeline.Timelines[0].tldr}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {timeline.Timelines[0]?.simulation &&
                        timeline.Timelines[0].simulation.length > 0 ? (
                          <div className="flex space-x-2">
                            {timeline.Timelines[0].simulation
                              .slice(0, 3)
                              .map((sim, idx) => (
                                <div
                                  key={idx}
                                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700/80 to-slate-600/80 border border-slate-500/50 flex items-center justify-center backdrop-blur-sm group-hover:from-slate-600 group-hover:to-slate-500 transition-all duration-300 shadow-lg"
                                  title={
                                    sim.agentType?.replace(/_/g, " ") || "Agent"
                                  }
                                >
                                  {getAgentIcon(sim.agentType || "")}
                                </div>
                              ))}
                            {timeline.Timelines[0].simulation.length > 3 && (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700/80 to-slate-600/80 border border-slate-500/50 flex items-center justify-center backdrop-blur-sm shadow-lg">
                                <span className="text-xs text-slate-300 font-semibold">
                                  +{timeline.Timelines[0].simulation.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700/60 to-slate-600/60 border border-slate-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg">
                              <Brain className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        )}
                      </div>

                      {timeline.createdAt && (
                        <div className="flex items-center text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                          <div className="p-1 bg-slate-600/30 rounded-full mr-2">
                            <Clock className="w-3 h-3" />
                          </div>
                          {formatTimeAgo(timeline.createdAt)}
                        </div>
                      )}
                    </div>

                    {timeline.Timelines.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-slate-600/30">
                        <div className="flex items-center text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                          <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full mr-2">
                            <GitBranch className="w-3 h-3" />
                          </div>
                          {timeline.Timelines.length} scenarios generated
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
