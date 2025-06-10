import { Brain, CheckCircle, Sparkles, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";

const loadingStages = [
  { id: 1, label: "Analyzing your question", icon: Brain, duration: 13000 },
  { id: 2, label: "Generating scenarios", icon: Sparkles, duration: 12000 },
  { id: 3, label: "Simulating outcomes", icon: Zap, duration: 11000 },
  { id: 4, label: "Calculating probabilities", icon: Target, duration: 9000 },
  { id: 5, label: "Finalizing timelines", icon: CheckCircle, duration: 9000 },
];

export const ProgressiveLoader = ({ isLoading }: { isLoading: boolean }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStage(0);
      setProgress(0);
      setStageProgress(0);
      return;
    }

    const totalDuration = 55000;
    const startTime = Date.now();
    let currentStageIndex = 0;
    let stageStartTime = startTime;

    const updateProgress = () => {
      const currentTime = Date.now();
      const totalElapsed = currentTime - startTime;

      const overallProgress = Math.min(
        (totalElapsed / totalDuration) * 100,
        100
      );
      setProgress(overallProgress);

      const targetStageIndex = Math.min(
        Math.floor((overallProgress / 100) * loadingStages.length),
        loadingStages.length - 1
      );

      if (targetStageIndex !== currentStageIndex) {
        currentStageIndex = targetStageIndex;
        stageStartTime = currentTime;
        setCurrentStage(currentStageIndex);
        setStageProgress(0);
      }

      const currentStage = loadingStages[currentStageIndex];
      if (currentStage) {
        const stageElapsed = currentTime - stageStartTime;
        const stageDuration = currentStage.duration;
        const stageProgressValue = Math.min(
          (stageElapsed / stageDuration) * 100,
          100
        );
        setStageProgress(stageProgressValue);
      }

      if (totalElapsed < totalDuration) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setCurrentStage(loadingStages.length - 1);
        setStageProgress(100);
      }
    };

    updateProgress();

    return () => {};
  }, [isLoading]);

  if (!isLoading) return null;

  const CurrentIcon = loadingStages[currentStage]?.icon || Brain;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900/90 border border-gray-700/50 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
              <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Creating Your Timelines
          </h3>
          <p className="text-gray-400 text-sm">
            Our AI is working to map out your possible futures
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm text-cyan-400">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white flex items-center">
              <CurrentIcon className="w-4 h-4 mr-2 text-cyan-400" />
              {loadingStages[currentStage]?.label || "Processing..."}
            </span>
            <span className="text-sm text-purple-400">
              {Math.round(stageProgress)}%
            </span>
          </div>
          <Progress value={stageProgress} className="h-1 bg-gray-800" />
        </div>

        <div className="space-y-2">
          {loadingStages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;

            return (
              <div
                key={stage.id}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-l-2 border-cyan-400"
                    : isCompleted
                    ? "bg-green-500/10 border-l-2 border-green-400"
                    : "bg-gray-800/30"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-green-500"
                      : isActive
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600"
                      : "bg-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3 text-white" />
                  ) : (
                    <StageIcon
                      className={`w-3 h-3 text-white ${
                        isActive ? "animate-pulse" : ""
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-white font-medium"
                      : isCompleted
                      ? "text-green-300"
                      : "text-gray-400"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
          <p className="text-xs text-blue-300 text-center">
            💡 <strong>Did you know?</strong> We're analyzing thousands of
            potential outcomes to give you the most insightful timeline
            scenarios!
          </p>
        </div>
      </div>
    </div>
  );
};
