import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Lightbulb,
  ArrowRight,
  GitBranch,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { QuestionResponse, Timeline } from "@/lib/utils";
import { Handle, Position } from "reactflow";

type CardNodeData = {
  label: string;
  item: QuestionResponse | Timeline;
  onFork?: (timelineId: string) => void;
};

export function CardNode({ data }: { data: CardNodeData }) {
  const description =
    "summary" in data.item
      ? data.item.summary || data.item.tldr || "No description provided."
      : data.item.text || "No question text available.";

  const truncatedDescription =
    description.length > 150
      ? description.substring(0, 150) + "..."
      : description;

  const isTimeline = "summary" in data.item;
  const timelineId = isTimeline ? data.item.id : "N/A";
  const shortId =
    timelineId !== "N/A" ? timelineId.split("-")[0] + "..." : "Root";
  const itemType = isTimeline ? "Timeline" : "Question";

  const handleForkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTimeline && data.onFork) {
      data.onFork(timelineId);
    }
  };

  return (
    <div className="min-w-[340px] max-w-[400px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 border-2 border-white shadow-xl rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-200 hover:scale-110"
      />

      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl transition-all duration-200 ease-in-out hover:shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        <div
          className={`h-1.5 relative ${
            isTimeline
              ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              : "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg shadow-lg transition-all duration-200 ${
                  isTimeline
                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30"
                    : "bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/30"
                }`}
              >
                {isTimeline ? (
                  <Clock className="w-5 h-5 text-cyan-400 transition-colors duration-200" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-amber-400 transition-colors duration-200" />
                )}
              </div>
              <div>
                <span
                  className={`text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isTimeline ? "text-cyan-300" : "text-amber-300"
                  }`}
                >
                  {itemType}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="text-xs text-gray-400 font-mono bg-gray-800/60 px-2 py-1 rounded border border-gray-600/50 transition-all duration-200">
                    {shortId}
                  </div>
                  {isTimeline && (
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-purple-400 transition-all duration-200" />
                      <TrendingUp className="w-3 h-3 text-green-400 transition-all duration-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isTimeline && (
              <button
                onClick={handleForkClick}
                className="group/fork relative p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-600/30 border border-purple-400/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 transition-all duration-150 ease-in-out shadow-lg hover:shadow-purple-500/25 hover:scale-102 active:scale-98"
                title="Create Fork"
              >
                <GitBranch className="w-4 h-4 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover/fork:opacity-100 transition-opacity duration-200" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <p className="text-sm text-gray-200 leading-relaxed font-medium transition-colors duration-200">
                {truncatedDescription}
              </p>
              {description.length > 150 && (
                <div className="absolute bottom-0 right-0 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pl-8 pr-2">
                  <span className="text-xs text-cyan-400 font-medium transition-colors duration-200">
                    read more
                  </span>
                </div>
              )}
            </div>

            {isTimeline && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="transition-colors duration-200">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Zap className="w-3 h-3 transition-all duration-200" />
                    <span className="transition-colors duration-200">
                      Simulated
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-700/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-200" />
              <div className="w-2 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-200" />
            </div>

            <div
              className={`flex items-center space-x-2 text-xs font-medium transition-all duration-200 ${
                isTimeline
                  ? "text-gray-400 group-hover:text-cyan-300"
                  : "text-gray-400 group-hover:text-amber-300"
              }`}
            >
              <span>Dive Deeper</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-200" />
            </div>
          </div>

          <div
            className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none ${
              isTimeline
                ? "bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10"
                : "bg-gradient-to-br from-amber-400/10 via-orange-500/10 to-red-500/10"
            }`}
          />
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 border-2 border-white shadow-xl rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-200 hover:scale-110"
      />
    </div>
  );
}
