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
    return <TrendingUp className="w-4 h-4 text-green-400" />;
  } else if (type?.includes("mental_health")) {
    return <Brain className="w-4 h-4 text-blue-400" />;
  } else if (type?.includes("personal_growth")) {
    return <Target className="w-4 h-4 text-purple-400" />;
  }

  return <Lightbulb className="w-4 h-4 text-yellow-400" />;
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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <AnimatedBackground />

      <Navbar />

      <div className="relative z-10 p-6 bg-gray-900/30 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="w-7 h-7 text-cyan-400" />
                <h1 className="text-2xl font-bold">My Timelines</h1>
              </div>
              <p className="text-gray-400">
                Explore your past scenarios and create new timeline simulations
              </p>
            </div>
            <Link to="/simulator">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                <Plus className="w-4 h-4 mr-2" />
                New Timeline
              </Button>
            </Link>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-900/20 border-red-500/30 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{getErrorMessage(error)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isRefetching}
                  className="ml-4 border-red-500/30 text-red-200 hover:bg-red-500/20"
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
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search timelines by question or insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-cyan-400/50"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="question">By Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Timelines</p>
                        <p className="text-2xl font-bold text-white">
                          {timelineData.length}
                        </p>
                      </div>
                      <GitBranch className="w-8 h-8 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">This Month</p>
                        <p className="text-2xl font-bold text-white">
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
                      <Calendar className="w-8 h-8 text-purple-400" />
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
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {getErrorMessage(error)}
              </p>
              <Button
                onClick={handleRetry}
                disabled={isRefetching}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                {isRefetching ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="bg-gray-800/30 border-gray-700/50 animate-pulse"
                >
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTimelines.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchQuery ? "No timelines found" : "No timelines yet"}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Create your first timeline simulation to get started exploring different life scenarios."}
              </p>
              {!searchQuery && (
                <Link to="/simulator">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
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
                  className="bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                  onClick={() => navigate(`/simulator/${timeline.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm leading-tight mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {timeline.text}
                        </h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {timeline.Timelines[0]?.tldr && (
                      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
                        {timeline.Timelines[0].tldr}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {timeline.Timelines[0]?.simulation &&
                        timeline.Timelines[0].simulation.length > 0 ? (
                          <div className="flex space-x-1">
                            {timeline.Timelines[0].simulation
                              .slice(0, 3)
                              .map((sim, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 rounded-full bg-gray-700/50 border border-gray-600/50 flex items-center justify-center"
                                  title={
                                    sim.agentType?.replace(/_/g, " ") || "Agent"
                                  }
                                >
                                  {getAgentIcon(sim.agentType || "")}
                                </div>
                              ))}
                            {timeline.Timelines[0].simulation.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-700/50 border border-gray-600/50 flex items-center justify-center">
                                <span className="text-xs text-gray-400">
                                  +{timeline.Timelines[0].simulation.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex space-x-1">
                            <div className="w-8 h-8 rounded-full bg-gray-700/30 border border-gray-600/30 flex items-center justify-center">
                              <Brain className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {timeline.createdAt && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(timeline.createdAt)}
                        </div>
                      )}
                    </div>

                    {timeline.Timelines.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-gray-700/50">
                        <div className="flex items-center text-xs text-gray-400">
                          <GitBranch className="w-3 h-3 mr-1" />
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
