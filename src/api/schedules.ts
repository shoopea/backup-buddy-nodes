import type { Schedule } from "@/types";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated backend storage
let schedules: Schedule[] = [
  {
    id: "1",
    frequency: "daily",
    retention: "1y2m3d4h",
  },
];

export const fetchSchedules = async (): Promise<Schedule[]> => {
  await delay(500);
  return [...schedules];
};

export const createSchedule = async (schedule: Omit<Schedule, "id">): Promise<Schedule> => {
  await delay(500);
  const newSchedule = {
    ...schedule,
    id: crypto.randomUUID(),
  };
  schedules = [...schedules, newSchedule];
  return newSchedule;
};

export const updateSchedule = async (id: string, schedule: Partial<Schedule>): Promise<Schedule> => {
  await delay(500);
  const index = schedules.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Schedule not found");
  
  const updatedSchedule = {
    ...schedules[index],
    ...schedule,
  };
  schedules[index] = updatedSchedule;
  return updatedSchedule;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await delay(500);
  const index = schedules.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Schedule not found");
  schedules = schedules.filter((s) => s.id !== id);
};