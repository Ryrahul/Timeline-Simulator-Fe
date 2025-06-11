import React from "react";
import { Eye, X, Clock } from "lucide-react";
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
  return (
    <div
      className={`
        ${show ? "block" : "hidden"} lg:block
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
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {item ? (
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-cyan-400">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.summary || "No summary available"}
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
                  {item.tldr || "No insights available"}
                </p>
              </CardContent>
            </Card>

            {item.createdAt && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                Created {new Date(item.createdAt).toLocaleString()}
              </div>
            )}

            {item.simulation && item.simulation.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-emerald-400">
                    Simulation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {item.simulation.map((sim, idx) => (
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
            <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Select a Timeline
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Click on any node in the timeline to view detailed information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
