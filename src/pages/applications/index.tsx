import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { Plus, Pencil, Trash2, Play } from "lucide-react";
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
import type { Application } from "@/types";

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "schedules",
    header: "Schedules",
    cell: ({ row }) => {
      const schedules = row.original.schedules;
      return <span>{schedules.length} schedules</span>;
    },
  },
  {
    accessorKey: "sourceDirectories",
    header: "Source Directories",
    cell: ({ row }) => {
      const dirs = row.original.sourceDirectories;
      return <span>{dirs.length} directories</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const app = row.original;
      const { toast } = useToast();

      const handleBackup = () => {
        toast({
          title: "Backup started",
          description: `Backup for ${app.name} has been initiated.`,
        });
      };

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBackup}>
            <Play className="h-4 w-4" />
          </Button>
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

const mockApplications: Application[] = [
  {
    id: "1",
    name: "Database Backup",
    schedules: [],
    sourceDirectories: [],
    destinationDirectories: [],
    scripts: [],
  },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const { toast } = useToast();

  const handleAddApplication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newApplication: Application = {
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      schedules: [],
      sourceDirectories: [],
      destinationDirectories: [],
      scripts: [],
    };
    setApplications([...applications, newApplication]);
    toast({
      title: "Application added",
      description: `Application ${newApplication.name} has been added successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Manage your backup applications"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <Button type="submit">Add Application</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable columns={columns} data={applications} />
    </div>
  );
}