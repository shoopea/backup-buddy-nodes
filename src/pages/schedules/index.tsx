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
import type { Schedule, Frequency } from "@/types";

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

const frequencies: Frequency[] = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

const mockSchedules: Schedule[] = [
  {
    id: "1",
    frequency: "daily",
    retention: "1y2m3d4h",
  },
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const { toast } = useToast();

  const handleAddSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSchedule: Schedule = {
      id: crypto.randomUUID(),
      frequency: formData.get("frequency") as Frequency,
      retention: formData.get("retention") as string,
    };
    setSchedules([...schedules, newSchedule]);
    toast({
      title: "Schedule added",
      description: "The schedule has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedules"
        description="Manage your backup schedules"
      >
        <Dialog>
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