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
  forkQuestion?: string;
}

export interface QuestionResponse {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  Timelines: Timeline[];
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  timeline: Timeline | QuestionResponse;
  type: string;
  children: LayoutNode[];
  parent?: LayoutNode;
}

export function buildNodesAndEdges(
  rawData: QuestionResponse,
  onFork?: (timelineId: string) => void
) {
  if (!rawData?.Timelines || rawData.Timelines.length === 0)
    return { nodes: [], edges: [] };

  const nodes: any[] = [];
  const edges: any[] = [];

  const NODE_WIDTH = 300;
  const MIN_HORIZONTAL_SPACING = 150;
  const VERTICAL_SPACING = 350;
  const ROOT_Y = 0;

  const rootLayout: LayoutNode = {
    id: "root",
    x: 0,
    y: ROOT_Y,
    width: NODE_WIDTH,
    timeline: rawData,
    type: "question",
    children: [],
  };

  rawData.Timelines.forEach((timeline, index) => {
    const timelineLayout = buildLayoutTree(
      timeline,
      `timeline-${index}`,
      "timeline",
      rootLayout
    );
    rootLayout.children.push(timelineLayout);
  });

  calculatePositions(
    rootLayout,
    NODE_WIDTH,
    MIN_HORIZONTAL_SPACING,
    VERTICAL_SPACING
  );

  convertLayoutToNodes(rootLayout, nodes, edges, onFork);

  return { nodes, edges };
}

function buildLayoutTree(
  timeline: Timeline,
  nodeId: string,
  type: string,
  parent?: LayoutNode
): LayoutNode {
  const layoutNode: LayoutNode = {
    id: nodeId,
    x: 0,
    y: 0,
    width: 300,
    timeline,
    type,
    children: [],
    parent,
  };

  if (timeline.forks && timeline.forks.length > 0) {
    timeline.forks.forEach((fork, index) => {
      const forkId = `${nodeId}-fork-${index}`;
      const forkType =
        parent?.type === "question"
          ? "fork"
          : `fork-level-${getDepth(layoutNode)}`;
      const forkLayout = buildLayoutTree(fork, forkId, forkType, layoutNode);
      layoutNode.children.push(forkLayout);
    });
  }

  return layoutNode;
}

function getDepth(node: LayoutNode): number {
  let depth = 0;
  let current = node.parent;
  while (current) {
    depth++;
    current = current.parent;
  }
  return depth;
}

function calculatePositions(
  root: LayoutNode,
  nodeWidth: number,
  minSpacing: number,
  verticalSpacing: number
) {
  calculateSubtreeWidths(root, nodeWidth, minSpacing);
  positionNodes(root, 0, verticalSpacing, minSpacing);
  centerTree(root);
}

function calculateSubtreeWidths(
  node: LayoutNode,
  nodeWidth: number,
  minSpacing: number
): number {
  if (node.children.length === 0) {
    node.width = nodeWidth;
    return nodeWidth;
  }

  let totalChildrenWidth = 0;
  node.children.forEach((child) => {
    totalChildrenWidth += calculateSubtreeWidths(child, nodeWidth, minSpacing);
  });

  const spacingWidth = (node.children.length - 1) * minSpacing;
  const childrenWidth = totalChildrenWidth + spacingWidth;

  node.width = Math.max(nodeWidth, childrenWidth);
  return node.width;
}

function positionNodes(
  node: LayoutNode,
  x: number,
  verticalSpacing: number,
  minSpacing: number
) {
  node.x = x;

  if (node.children.length === 0) {
    return;
  }

  const childY = node.y + verticalSpacing;

  let totalChildrenWidth = 0;
  node.children.forEach((child) => {
    totalChildrenWidth += child.width;
  });

  const totalSpacing = (node.children.length - 1) * minSpacing;
  const childrenTotalWidth = totalChildrenWidth + totalSpacing;

  let currentX = node.x - childrenTotalWidth / 2;

  node.children.forEach((child, index) => {
    child.y = childY;
    const childCenterX = currentX + child.width / 2;
    positionNodes(child, childCenterX, verticalSpacing, minSpacing);

    currentX += child.width + minSpacing;
  });
}

function centerTree(root: LayoutNode) {
  const bounds = getTreeBounds(root);

  const centerX = 600;
  const treeCenter = (bounds.minX + bounds.maxX) / 2;
  const offsetX = centerX - treeCenter;

  applyOffset(root, offsetX, 0);
}

function getTreeBounds(node: LayoutNode): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const halfWidth = 150;
  let minX = node.x - halfWidth;
  let maxX = node.x + halfWidth;
  let minY = node.y;
  let maxY = node.y;

  node.children.forEach((child) => {
    const childBounds = getTreeBounds(child);
    minX = Math.min(minX, childBounds.minX);
    maxX = Math.max(maxX, childBounds.maxX);
    minY = Math.min(minY, childBounds.minY);
    maxY = Math.max(maxY, childBounds.maxY);
  });

  return { minX, maxX, minY, maxY };
}

function applyOffset(node: LayoutNode, offsetX: number, offsetY: number) {
  node.x += offsetX;
  node.y += offsetY;

  node.children.forEach((child) => {
    applyOffset(child, offsetX, offsetY);
  });
}

function convertLayoutToNodes(
  layoutNode: LayoutNode,
  nodes: any[],
  edges: any[],
  onFork?: (timelineId: string) => void
) {
  const isQuestion = layoutNode.type === "question";

  nodes.push({
    id: layoutNode.id,
    type: "card",
    data: {
      item: layoutNode.timeline,
      label: isQuestion
        ? `Question: ${(layoutNode.timeline as QuestionResponse).text}`
        : (
            (layoutNode.timeline as Timeline).tldr ||
            (layoutNode.timeline as Timeline).summary ||
            `Timeline`
          ).slice(0, 80) + "...",
      onFork,
      type: layoutNode.type,
    },
    position: { x: layoutNode.x - 150, y: layoutNode.y },
  });

  layoutNode.children.forEach((child) => {
    edges.push({
      id: `edge-${layoutNode.id}-${child.id}`,
      source: layoutNode.id,
      target: child.id,
      animated: true,
      markerEnd: { type: "arrowclosed" },
    });

    convertLayoutToNodes(child, nodes, edges, onFork);
  });
}
