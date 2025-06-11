import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ConnectionLineType,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
} from "reactflow";
import { useQuery, useMutation } from "@tanstack/react-query";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import {
  GitBranch,
  Brain,
  Eye,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Calendar,
} from "lucide-react";

import { axiosClient } from "@/lib/httpClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import "reactflow/dist/style.css";
import {
  buildNodesAndEdges,
  type QuestionResponse,
  type Timeline,
} from "@/lib/utils";
import { CardNode } from "@/nodes/cardNode";
import { ForkModal } from "@/components/ui/fork-modal";
import { isAxiosError } from "axios";
import { ProgressiveLoader } from "@/components/progressive-loader";
import { TimelineDetailsPanel } from "@/components/timeline-detail-panel";
import { Navbar } from "@/components/ui/nav";
import { AnimatedBackground } from "@/components/ui/animated-bg";

const nodeTypes = {
  card: CardNode,
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getErrorMessage = (error: any): string => {
  if (error?.response?.status === 404) {
    return "Timeline not found. It may have been deleted or you don't have access to it.";
  }
  if (error?.response?.status === 401) {
    return "You need to log in to view this timeline.";
  }
  if (error?.response?.status === 403) {
    return "You don't have permission to access this timeline.";
  }
  if (error?.response?.status >= 500) {
    return "Server error. Please try again later.";
  }
  if (error?.code === "NETWORK_ERROR" || !navigator.onLine) {
    return "Network error. Please check your internet connection.";
  }
  return error?.message || "Failed to load timeline. Please try again.";
};

export default function TimelineDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState<Timeline | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [forkModalOpen, setForkModalOpen] = useState<boolean>(false);
  const [currentTimelineId, setCurrentTimelineId] = useState<string>("");

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const {
    data: timelineData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["timeline-detail", id],
    queryFn: async (): Promise<QuestionResponse> => {
      try {
        const response = await axiosClient.get(`/question/${id}`);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!id,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
      refetch();
    },
  });

  useEffect(() => {
    if (timelineData) {
      const { nodes: newNodes, edges: newEdges } = buildNodesAndEdges(
        timelineData,
        handleFork
      );
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [timelineData]);

  const handleFork = (timelineId: string): void => {
    setCurrentTimelineId(timelineId);
    setForkModalOpen(true);
  };

  const handleForkSubmit = (question: string, timelineId: string): void => {
    forkMutation.mutate({ question, timelineId });
    setForkModalOpen(false);
  };

  const onNodeClick = (_: React.MouseEvent, node: Node): void => {
    setSelectedItem(node.data.item);
    setShowDetails(true);
  };

  const handleRetry = () => {
    refetch();
  };

  const handleGoBack = () => {
    navigate("/timelines");
  };

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <AnimatedBackground />
        <Navbar />

        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Unable to Load Timeline
            </h3>
            <p className="text-gray-400 mb-6">{getErrorMessage(error)}</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Timelines
              </Button>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      <ProgressiveLoader isLoading={isLoading || forkMutation.isPending} />

      <AnimatedBackground />

      <Navbar />

      {/* Header Section */}
      <div className="relative z-10 p-6 bg-gray-900/30 backdrop-blur-sm border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-cyan-400" />
                <h1 className="text-xl font-semibold">Timeline Details</h1>
              </div>
            </div>
          </div>

          {timelineData && (
            <div className="space-y-4">
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader className="pb-3">
                  <h2 className="text-lg font-semibold text-white leading-tight">
                    {timelineData.text}
                  </h2>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Created: {formatDate(timelineData.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <GitBranch className="w-4 h-4 mr-2" />
                        {timelineData.Timelines.length} scenario
                        {timelineData.Timelines.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {forkMutation.error && (
                <Alert className="bg-red-900/20 border-red-500/30 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {isAxiosError(forkMutation.error) &&
                    forkMutation.error.response?.data?.message
                      ? forkMutation.error.response.data.message
                      : forkMutation.error.message ||
                        "Failed to create fork. Please try again."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Loading timeline...</p>
              </div>
            </div>
          ) : (
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
          )}

          {selectedItem && (
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="lg:hidden absolute top-4 right-4 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 z-20"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}

          {nodes.length === 0 && !isLoading && timelineData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Timeline Data
                </h3>
                <p className="text-gray-400 mb-6">
                  This timeline doesn't have any generated scenarios yet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Details Panel */}
        <TimelineDetailsPanel
          item={selectedItem}
          show={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </div>

      {/* Fork Modal */}
      <ForkModal
        isOpen={forkModalOpen}
        isLoading={forkMutation.isPending}
        timelineId={currentTimelineId}
        onClose={() => setForkModalOpen(false)}
        onSubmit={handleForkSubmit}
        error={isAxiosError(forkMutation.error) ? forkMutation.error : null}
      />
    </div>
  );
}
