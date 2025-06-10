import { isAxiosError, type AxiosError } from "axios";
import { X, GitBranch, Sparkles, Zap, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function ForkModal({
  isOpen,
  onClose,
  timelineId,
  onSubmit,
  isLoading,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  timelineId: string;
  onSubmit: (question: string, timelineId: string) => void;
  isLoading: boolean;
  error: AxiosError | Error | null;
}) {
  const [question, setQuestion] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setQuestion("");
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (question.trim()) {
      onSubmit(question.trim(), timelineId);
      setQuestion("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const shortTimelineId = timelineId.split("-")[0] + "...";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-700/50 relative overflow-hidden transform transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-30" />

        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-400/30">
              <GitBranch className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Fork</h2>
              <p className="text-sm text-gray-400">
                Branch off from this timeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 p-6 space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
                <div>
                  <span className="text-sm font-medium text-gray-300">
                    Source Timeline
                  </span>
                  <div className="text-xs text-gray-500 font-mono">
                    {shortTimelineId}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-cyan-400">
                <Sparkles className="w-3 h-3" />
                <span>Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-200">
              What would you like to explore from this point?
            </label>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a follow-up question to explore different outcomes from this timeline... (Ctrl+Enter to submit)"
                className="w-full p-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 min-h-[120px]"
                rows={4}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <div className="text-xs text-gray-500">
                  {question.length}/500
                </div>
                {question.length > 0 && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center space-x-4">
              <span>
                💡 Tip: Be specific about the scenario you want to explore
              </span>
              <span>⌘ + Enter to submit</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-300 text-sm">
                  {isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : error.message ||
                      "Failed to generate timelines. Please try again."}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-700/30">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !question.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Create Fork</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-20 animate-ping" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Creating your fork...</p>
                <p className="text-gray-400 text-sm">
                  Analyzing new timeline possibilities
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </div>
    </div>
  );
}
