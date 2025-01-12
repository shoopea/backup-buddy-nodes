import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNodes, createNode, updateNode, deleteNode } from "@/api/nodes";
import type { Node } from "@/types";

export default function NodesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch nodes
  const { data: nodes = [] } = useQuery({
    queryKey: ["nodes"],
    queryFn: fetchNodes,
  });

  // Create node mutation
  const createNodeMutation = useMutation({
    mutationFn: createNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Node created successfully",
      });
    },
  });

  // Update node mutation
  const updateNodeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Node> }) =>
      updateNode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
      toast({
        title: "Success",
        description: "Node updated successfully",
      });
    },
  });

  // Delete node mutation
  const deleteNodeMutation = useMutation({
    mutationFn: deleteNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
      toast({
        title: "Success",
        description: "Node deleted successfully",
      });
    },
  });

  const columns: ColumnDef<Node>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "host",
      header: "Host",
    },
    {
      accessorKey: "port",
      header: "Port",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const node = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // TODO: Implement edit functionality
                updateNodeMutation.mutate({
                  id: node.id,
                  data: { ...node },
                });
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                deleteNodeMutation.mutate(node.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddNode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newNode = {
      name: formData.get("name") as string,
      host: formData.get("host") as string,
      port: parseInt(formData.get("port") as string),
      key: formData.get("key") as string,
    };
    createNodeMutation.mutate(newNode);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Nodes" description="Manage your backup nodes">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Node
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Node</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddNode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" name="host" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  defaultValue={22}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">SSH Key</Label>
                <Input id="key" name="key" required />
              </div>
              <Button type="submit">Add Node</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable columns={columns} data={nodes} />
    </div>
  );
}