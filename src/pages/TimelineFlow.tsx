import React, { useState } from "react";
import {
  ConnectionLineType,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
} from "reactflow";
import { useMutation } from "@tanstack/react-query";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import {
  GitBranch,
  User,
  Settings,
  LogOut,
  Home,
  Brain,
  Sparkles,
  Eye,
  X,
  ChevronLeft,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "@/state/authAtom";
import { axiosClient } from "@/lib/httpClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import "reactflow/dist/style.css";
import { buildNodesAndEdges } from "@/lib/utils";
import { CardNode } from "@/nodes/cardNode";
import { ForkModal } from "@/components/ui/fork-modal";
import { isAxiosError } from "axios";
import { ProgressiveLoader } from "@/components/progressive-loader";

interface AuthUser {
  username: string;
  email: string;
}

interface SimulationData {
  agentType?: string;
  summary?: string;
  score?: string | number;
}

interface TimelineItem {
  id: string;
  summary?: string;
  tldr?: string;
  createdAt?: string;
  simulation?: SimulationData[];
}

const nodeTypes = {
  card: CardNode,
};

export default function EnhancedTimelineSimulator(): JSX.Element {
  const [question, setQuestion] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [forkModalOpen, setForkModalOpen] = useState<boolean>(false);
  const [currentTimelineId, setCurrentTimelineId] = useState<string>("");

  const auth = useRecoilValue<AuthUser | null>(authAtom);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await axiosClient.post("/question", { text });
      return response.data;
    },
    onSuccess: (data) => {
      const { nodes: newNodes, edges: newEdges } = buildNodesAndEdges(
        data,
        handleFork
      );
      setNodes(newNodes);
      setEdges(newEdges);
    },
  });

  const forkMutation = useMutation({
    mutationFn: async ({
      question,
      timelineId,
    }: {
      question: string;
      timelineId: string;
    }) => {
      const response = await axiosClient.post("/question/fork", {
        newText: question,
        parentTimelineId: timelineId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { nodes: newNodes, edges: newEdges } = buildNodesAndEdges(
        data,
        handleFork
      );
      setNodes(newNodes);
      setEdges(newEdges);
    },
  });

  const handleFork = (timelineId: string): void => {
    setCurrentTimelineId(timelineId);
    setForkModalOpen(true);
  };

  const handleForkSubmit = (question: string, timelineId: string): void => {
    forkMutation.mutate({ question, timelineId });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutation.mutate(question);
    setSelectedItem(null);
    setShowDetails(false);
  };

  const onNodeClick = (_: React.MouseEvent, node: Node): void => {
    setSelectedItem(node.data.item);
    setShowDetails(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("accountState");
    window.location.href = "/";
  };

  const { isPending, error } = mutation;

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      <ProgressiveLoader isLoading={isPending} />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-black"></div>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Navigation Bar */}
      <nav className="relative z-20 px-6 py-4 bg-gray-900/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <GitBranch className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Parallel Timeline
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-400">
              <Home className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span className="text-cyan-400">Simulator</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {auth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="w-10 h-10 border-2 border-cyan-400/50">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                        {auth.username
                          ? auth.username.substring(0, 2).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-gray-800 border-gray-700"
                  align="end"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {auth.username}
                      </p>
                      <p className="text-xs leading-none text-gray-400">
                        {auth.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="text-red-400 hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin">
                <Button
                  variant="outline"
                  className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Input Section */}
      <div className="relative z-10 p-6 bg-gray-900/30 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <Brain className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-semibold">Timeline Simulator</h1>
          </div>

          <form onSubmit={onSubmit} className="flex gap-3">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="What life decision are you contemplating? (e.g., Should I change careers, move cities, start a business?)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Timelines
            </Button>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
              <strong>Error:</strong>{" "}
              {isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : error.message ||
                  "Failed to generate timelines. Please try again."}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* ReactFlow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
            connectionLineType={ConnectionLineType.SmoothStep}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            className="w-full h-full"
            style={{ backgroundColor: "transparent" }}
          >
            <MiniMap
              className="!bg-gray-800/50 !border-gray-600 !rounded-lg"
              nodeColor={(node: Node) => {
                switch (node.type) {
                  case "card":
                    return "#06b6d4";
                  default:
                    return "#8b5cf6";
                }
              }}
            />
            <Controls className="!bg-gray-800/80 !border-gray-600 !rounded-lg" />
            <Background color="#374151" gap={16} />
          </ReactFlow>

          {/* Mobile Details Toggle */}
          {selectedItem && (
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="lg:hidden absolute top-4 right-4 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 z-20"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}

          {/* Empty State */}
          {nodes.length === 0 && !isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Ready to Explore Your Future?
                </h3>
                <p className="text-gray-400 mb-6">
                  Enter a life decision above and watch as we generate three
                  unique timeline scenarios for you to explore.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-cyan-400" />
                    AI-Powered
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                    Multiple Outcomes
                  </div>
                  <div className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-2 text-pink-400" />
                    Forkable Paths
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Details Panel */}
        <div
          className={`
            ${showDetails ? "block" : "hidden"} lg:block
            lg:w-96 lg:border-l lg:border-gray-700/50 
            absolute lg:relative inset-0 lg:inset-auto
            bg-gray-900/95 lg:bg-gray-900/50 backdrop-blur-lg z-30 lg:z-auto
            overflow-y-auto
          `}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2 text-cyan-400" />
                Timeline Details
              </h2>
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {selectedItem ? (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-cyan-400">
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedItem.summary || "No summary available"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-400">
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedItem.tldr || "No insights available"}
                    </p>
                  </CardContent>
                </Card>

                {selectedItem.createdAt && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    Created {new Date(selectedItem.createdAt).toLocaleString()}
                  </div>
                )}

                {selectedItem.simulation &&
                  selectedItem.simulation.length > 0 && (
                    <Card className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-emerald-400">
                          Simulation Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedItem.simulation.map((sim, idx) => (
                            <div
                              key={idx}
                              className="border-l-2 border-gradient-to-b from-cyan-400 to-purple-400 pl-4 py-2 bg-gray-900/30 rounded-r-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-sm text-white">
                                  {sim.agentType?.replace(/_/g, " ") ||
                                    "Agent Analysis"}
                                </h4>
                                {sim.score && (
                                  <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">
                                    {sim.score}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {sim.summary || "No analysis available"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Select a Timeline
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Click on any node in the timeline to view detailed information
                  about that scenario and its potential outcomes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fork Modal */}
      <ForkModal
        isOpen={forkModalOpen}
        isLoading={forkMutation.isPending}
        timelineId={currentTimelineId}
        onClose={() => setForkModalOpen(false)}
        onSubmit={handleForkSubmit}
        error={isAxiosError(forkMutation.error) ? forkMutation.error : error}
      />
    </div>
  );
}
