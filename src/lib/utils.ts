import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const AgentType = {
  PERSONAL_GROWTH: "PERSONAL_GROWTH",
  FINANCE: "FINANCE",
  MENTAL_HEALTH: "MENTAL_HEALTH",
} as const;

export type AgentType = (typeof AgentType)[keyof typeof AgentType];

export interface Simulation {
  id: string;
  timelineId: string;
  agentType: AgentType;
  summary: string;
  score: number;
  createdAt: string;
}

export interface Timeline {
  id: string;
  questionId: string;
  forkedFromId: string | null;
  summary: string;
  tldr: string;
  createdAt: string;
  simulation: Simulation[];
  forks?: Timeline[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  Timelines: Timeline[];
}
export function buildNodesAndEdges(
  rawData: QuestionResponse,
  onFork?: (timelineId: string) => void
) {
  console.log(rawData);
  if (!rawData?.Timelines || rawData.Timelines.length === 0)
    return { nodes: [], edges: [] };

  const nodes: any[] = [];
  const edges: any[] = [];

  // Root node - main question
  nodes.push({
    id: "root",
    type: "card",
    data: {
      item: rawData,
      label: `Question: ${rawData.text}`,
      type: "question", // Add type to distinguish node types
    },
    position: { x: 600, y: 0 }, // center root
  });

  // Layout spacing
  const timelineSpacing = 500;
  const forkSpacing = 400;
  const rootToTimelineSpacing = 300;
  const timelineToForkSpacing = 350;
  const rootX = 600;

  const totalWidth = (rawData.Timelines.length - 1) * timelineSpacing;
  const startX = rootX - totalWidth / 2;

  rawData.Timelines.forEach((timeline, index) => {
    const timelineX = startX + index * timelineSpacing;

    // Timeline node - ONLY create timeline nodes, NOT simulation nodes
    nodes.push({
      id: `timeline-${index}`,
      type: "card",
      data: {
        item: timeline, // This should be the timeline object, not simulation
        label:
          (timeline.tldr || timeline.summary || `Timeline ${index + 1}`).slice(
            0,
            80
          ) + "...",
        onFork,
        type: "timeline", // Add type to distinguish
      },
      position: { x: timelineX, y: rootToTimelineSpacing },
    });

    // Edge from root to timeline
    edges.push({
      id: `edges-root-timeline-${index}`,
      source: "root",
      target: `timeline-${index}`,
      animated: true,
      markerEnd: { type: "arrowclosed" },
    });

    // Fork nodes - ONLY if forks exist
    if (timeline.forks && timeline.forks.length > 0) {
      const forkCount = timeline.forks.length;
      const forkStartX = timelineX - ((forkCount - 1) * forkSpacing) / 2;

      timeline.forks.forEach((fork, forkIndex) => {
        const forkX = forkStartX + forkIndex * forkSpacing;
        const forkY = rootToTimelineSpacing + timelineToForkSpacing;

        // Fork node
        nodes.push({
          id: `timeline-${index}-fork-${forkIndex}`,
          type: "card",
          data: {
            item: fork, // This should be the fork object
            label:
              (fork.tldr || fork.summary || `Fork ${forkIndex + 1}`).slice(
                0,
                80
              ) + "...",
            onFork,
            type: "fork", // Add type to distinguish
          },
          position: { x: forkX, y: forkY },
        });

        // Edge from timeline to fork
        edges.push({
          id: `edges-timeline-${index}-fork-${forkIndex}`,
          source: `timeline-${index}`,
          target: `timeline-${index}-fork-${forkIndex}`,
          animated: true,
          markerEnd: { type: "arrowclosed" },
        });
      });
    }
  });

  console.log("Generated nodes:", nodes);
  console.log("Generated edges:", edges);

  return { nodes, edges };
}
