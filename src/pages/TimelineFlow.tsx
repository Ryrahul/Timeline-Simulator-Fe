import React, { useState } from "react";
import { ConnectionLineType } from "reactflow";
import { useMutation } from "@tanstack/react-query";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";

import "reactflow/dist/style.css";
import { buildNodesAndEdges } from "@/lib/utils";

export default function TimelineFlowWithDetails() {
  const [question, setQuestion] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const token = "just testing for nowwwww";

  const mutation = useMutation({
    mutationFn: (text: string) =>
      fetch("http://localhost:3000/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }).then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error ${res.status}: ${errorText}`);
        }
        return res.json();
      }),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(question);
    setSelectedItem(null);
  }

  const onNodeClick = (_: any, node: { data: { item: any } }) => {
    setSelectedItem(node.data.item);
  };

  const { data, isPending, error } = mutation;
  const { nodes, edges } = data
    ? buildNodesAndEdges(data)
    : { nodes: [], edges: [] };

  return (
    <div className="w-full h-screen flex flex-col p-4 bg-gray-100 text-gray-900">
      <form onSubmit={onSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="flex-grow px-3 py-2 rounded border border-gray-300"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 rounded"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Ask"}
        </button>
      </form>

      {error && (
        <div className="mb-4 text-red-600">
          Error:{" "}
          {(error as any)?.response?.data?.message ||
            (error as any).message ||
            "Unknown error"}
        </div>
      )}

      <div className="flex flex-1 gap-4">
        <div
          style={{
            flex: 1,
            height: "80vh",
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            attributionPosition="bottom-left"
            connectionLineType={ConnectionLineType.SmoothStep}
            onNodeClick={onNodeClick}
          >
            <MiniMap />
            <Controls />
            <Background color="#ddd" gap={16} />
          </ReactFlow>
        </div>

        <div className="w-80 border-l border-gray-300 p-4 overflow-y-auto bg-gray-100">
          {selectedItem ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <p className="mb-2">
                <strong>Summary:</strong> {selectedItem.summary || "N/A"}
              </p>
              <p className="mb-2">
                <strong>TLDR:</strong> {selectedItem.tldr || "N/A"}
              </p>
              {selectedItem.createdAt && (
                <p className="mb-4 text-sm text-gray-600">
                  <strong>Created:</strong>{" "}
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              )}
              {selectedItem.simulation?.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Simulations</h3>
                  <ul className="space-y-4">
                    {selectedItem.simulation.map((sim: any, idx: number) => (
                      <li key={idx}>
                        <p className="font-medium">
                          {sim.agentType?.replace(/_/g, " ") || "Agent"}:
                        </p>
                        <p className="text-sm text-gray-700">
                          {sim.summary || "No summary"}
                        </p>
                        <p className="text-sm">Score: {sim.score ?? "N/A"}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Click on the root node to reveal timelines, and then click
              timelines to reveal forks.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
