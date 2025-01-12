import type { Node } from "@/types";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated backend storage
let nodes: Node[] = [
  {
    id: "1",
    name: "Production Server",
    host: "192.168.1.100",
    port: 22,
    key: "ssh-rsa AAAA...",
  },
];

export const fetchNodes = async (): Promise<Node[]> => {
  await delay(500); // Simulate network delay
  return [...nodes];
};

export const createNode = async (node: Omit<Node, "id">): Promise<Node> => {
  await delay(500);
  const newNode = {
    ...node,
    id: crypto.randomUUID(),
  };
  nodes = [...nodes, newNode];
  return newNode;
};

export const updateNode = async (id: string, node: Partial<Node>): Promise<Node> => {
  await delay(500);
  const index = nodes.findIndex((n) => n.id === id);
  if (index === -1) throw new Error("Node not found");
  
  const updatedNode = {
    ...nodes[index],
    ...node,
  };
  nodes[index] = updatedNode;
  return updatedNode;
};

export const deleteNode = async (id: string): Promise<void> => {
  await delay(500);
  const index = nodes.findIndex((n) => n.id === id);
  if (index === -1) throw new Error("Node not found");
  nodes = nodes.filter((n) => n.id !== id);
};