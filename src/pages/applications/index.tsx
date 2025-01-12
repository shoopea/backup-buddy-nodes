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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  startBackup,
} from "@/api/applications";
import type { Application } from "@/types";

export default function ApplicationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch applications
  const { data: applications = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Application created successfully",
      });
    },
  });

  // Update application mutation
  const updateApplicationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title: "Success",
        description: "Application updated successfully",
      });
    },
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
    },
  });

  // Start backup mutation
  const startBackupMutation = useMutation({
    mutationFn: startBackup,
    onSuccess: () => {
      toast({
        title: "Backup started",
        description: "The backup process has been initiated",
      });
    },
  });

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
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startBackupMutation.mutate(app.id)}
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // TODO: Implement edit functionality
                updateApplicationMutation.mutate({
                  id: app.id,
                  data: { ...app },
                });
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteApplicationMutation.mutate(app.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddApplication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newApplication: Omit<Application, "id"> = {
      name: formData.get("name") as string,
      schedules: [],
      sourceDirectories: [],
      destinationDirectories: [],
      scripts: [],
    };
    createApplicationMutation.mutate(newApplication);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Manage your backup applications"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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