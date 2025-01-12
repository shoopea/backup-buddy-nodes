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
import type { Node } from "@/types";

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
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const mockNodes: Node[] = [
  {
    id: "1",
    name: "Production Server",
    host: "192.168.1.100",
    port: 22,
    key: "ssh-rsa AAAA...",
  },
];

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const { toast } = useToast();

  const handleAddNode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newNode: Node = {
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      host: formData.get("host") as string,
      port: parseInt(formData.get("port") as string),
      key: formData.get("key") as string,
    };
    setNodes([...nodes, newNode]);
    toast({
      title: "Node added",
      description: `Node ${newNode.name} has been added successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nodes"
        description="Manage your backup nodes"
      >
        <Dialog>
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