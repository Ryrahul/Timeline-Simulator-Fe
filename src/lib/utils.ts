import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Node, type Edge, MarkerType } from "reactflow";

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
export function buildNodesAndEdges(rawData: QuestionResponse) {
  if (!rawData?.Timelines || rawData.Timelines.length === 0)
    return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  nodes.push({
    id: "root",
    type: "input",
    data: { item: rawData, label: `Question: ${rawData.text}` },
    position: { x: 300, y: 0 },
  });
  rawData.Timelines.forEach((timeline, index) => {
    nodes.push({
      id: `timeline-${index}`,
      type: "input",
      data: {
        item: timeline,
        label:
          (timeline.tldr || timeline.summary || `Timeline ${index + 1}`).slice(
            0,
            80
          ) + "...",
      },
      position: { x: 100 + index * 300, y: 150 },
    });
    edges.push({
      id: `edges-root-timiline-${index}`,
      source: "root",
      target: `timeline-${index}`,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    });
    timeline.forks?.forEach((fork, forkIndex) => {
      nodes.push({
        id: `timeline-${index}-fork-${forkIndex}`,
        type: "input",
        data: {
          item: fork,
          label:
            (
              fork.tldr ||
              fork.summary ||
              `Timeline ${index + 1}-fork-${forkIndex}`
            ).slice(0, 80) + "...",
        },
        position: { x: 100 + index * 300 + forkIndex * 300, y: 450 },
      });
      edges.push({
        id: `edges-timiline-${index}-fork-${forkIndex}`,
        source: `timeline-${index}`,
        target: `timeline-${index}-fork-${forkIndex}`,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });
  });
  return { nodes, edges };
}
