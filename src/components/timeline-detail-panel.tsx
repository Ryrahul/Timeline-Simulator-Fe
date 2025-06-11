import React from "react";
import {
  Eye,
  X,
  Clock,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Zap,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { TimelineItem } from "@/pages/TimelineFlow";

interface TimelineDetailsPanelProps {
  item: TimelineItem | null;
  show: boolean;
  onClose: () => void;
}

export const TimelineDetailsPanel: React.FC<TimelineDetailsPanelProps> = ({
  item,
  show,
  onClose,
}) => {
  const formatSummary = (summary: string) => {
    return summary.replace(
      /\b(Year\s+\d+\s*:)/g,
      "<strong><h3>$1</h3></strong>"
    );
  };
  const formatTldr = (tldr: string) => {
    console.log(item);
    return tldr.replace(/\b(Year\s+\d+)/g, "<strong>$1</strong>");
  };
  return (
    <div
      className={`
      ${show ? "block" : "hidden"} lg:block
      lg:w-96 lg:border-l lg:border-purple-500/20
      absolute lg:relative inset-0 lg:inset-auto
      backdrop-blur-xl z-30 lg:z-auto
      overflow-y-auto
      bg-gradient-to-b from-gray-900/80 via-purple-900/70 to-gray-900/80 
      lg:bg-gradient-to-b lg:from-gray-900/50 lg:via-purple-900/30 lg:to-gray-900/50
      before:absolute before:inset-y-0 before:left-0 before:w-0.5 
      before:bg-gradient-to-b before:from-cyan-400/30 before:via-purple-400/30 before:to-pink-400/30
    `}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-violet-600/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg blur-md" />
              <Eye className="w-6 h-6 text-cyan-400 relative z-10 drop-shadow-lg" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Timeline Details
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {item ? (
          <div className="space-y-6">
            {item.forkQuestion && (
              <Card className="bg-gradient-to-br from-gray-800/60 via-orange-800/20 to-gray-800/60 border border-orange-500/30 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg font-bold flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg">
                      <GitBranch className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                      Fork Question
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {item.forkQuestion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-gray-800/60 via-cyan-800/20 to-gray-800/60 border border-cyan-500/30 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent" />
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                    <Brain className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                  <p
                    className="text-gray-200 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatSummary(
                        item.summary || "No summary available"
                      ),
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/60 via-purple-800/20 to-gray-800/60 border border-purple-500/30 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent" />
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Key Insights
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                  <p
                    className="text-gray-200 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatTldr(item.tldr || "No Tldr available"),
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {item.createdAt && (
              <div className="flex items-center justify-center p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl backdrop-blur-sm border border-gray-600/30">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="p-1 bg-gray-600/30 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">
                    Created {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {item.simulation && item.simulation.length > 0 && (
              <Card className="bg-gradient-to-br from-gray-800/60 via-emerald-800/20 to-gray-800/60 border border-emerald-500/30 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-lg font-bold flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Simulation Results
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    {item.simulation.map((sim, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
                        <div className="relative p-4 bg-gray-900/50 rounded-xl border border-gray-700/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
                                <Target className="w-4 h-4 text-cyan-400" />
                              </div>
                              <h4 className="font-semibold text-sm text-white">
                                {sim.agentType?.replace(/_/g, " ") ||
                                  "Agent Analysis"}
                              </h4>
                            </div>
                            {sim.score && (
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full font-medium border border-cyan-500/30">
                                  {sim.score}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                            <p className="text-xs text-gray-300 leading-relaxed">
                              {sim.summary || "No analysis available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-full blur-xl" />
              <Eye className="w-16 h-16 text-gray-500 mx-auto relative z-10 drop-shadow-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-4">
              Select a Timeline
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Click on any node in the timeline to view detailed information and
              insights.
            </p>
            <div className="flex justify-center space-x-4 mt-6 text-xs text-gray-500">
              <div className="flex items-center">
                <GitBranch className="w-3 h-3 mr-1 text-orange-400" />
                Fork
              </div>
              <div className="flex items-center">
                <Brain className="w-3 h-3 mr-1 text-cyan-400" />
                Summary
              </div>
              <div className="flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
                Insights
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-400" />
                Analysis
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
