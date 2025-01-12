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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from "@/api/schedules";
import type { Schedule, Frequency } from "@/types";

const frequencies: Frequency[] = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

export default function SchedulesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch schedules
  const { data: schedules = [] } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Schedule created successfully",
      });
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Schedule> }) =>
      updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      });
    },
  });

  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: "frequency",
      header: "Frequency",
    },
    {
      accessorKey: "retention",
      header: "Retention Period",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // TODO: Implement edit functionality
                updateScheduleMutation.mutate({
                  id: schedule.id,
                  data: { ...schedule },
                });
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                deleteScheduleMutation.mutate(schedule.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSchedule = {
      frequency: formData.get("frequency") as Frequency,
      retention: formData.get("retention") as string,
    };
    createScheduleMutation.mutate(newSchedule);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedules"
        description="Manage your backup schedules"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Schedule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select name="frequency" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention">
                  Retention Period (e.g., 1y2m3d4h)
                </Label>
                <Input
                  id="retention"
                  name="retention"
                  placeholder="1y2m3d4h"
                  required
                />
              </div>
              <Button type="submit">Add Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable columns={columns} data={schedules} />
    </div>
  );
}