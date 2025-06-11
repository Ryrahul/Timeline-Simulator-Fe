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
import { GitBranch, Brain, Sparkles, Eye, TrendingUp } from "lucide-react";

import { axiosClient } from "@/lib/httpClient";

import { Button } from "@/components/ui/button";

import "reactflow/dist/style.css";
import { buildNodesAndEdges } from "@/lib/utils";
import { CardNode } from "@/nodes/cardNode";
import { ForkModal } from "@/components/ui/fork-modal";
import { isAxiosError } from "axios";
import { ProgressiveLoader } from "@/components/progressive-loader";
import { TimelineDetailsPanel } from "@/components/timeline-detail-panel";
import { Navbar } from "@/components/ui/nav";
import { AnimatedBackground } from "@/components/ui/animated-bg";

interface SimulationData {
  agentType?: string;
  summary?: string;
  score?: string | number;
}

export interface TimelineItem {
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

  const { isPending, error } = mutation;

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      <ProgressiveLoader isLoading={isPending} />

      <AnimatedBackground />

      <Navbar />

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

      <div className="flex-1 flex overflow-hidden relative z-10">
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

          {selectedItem && (
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="lg:hidden absolute top-4 right-4 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 z-20"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}

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
        <TimelineDetailsPanel
          item={selectedItem}
          show={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </div>

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
