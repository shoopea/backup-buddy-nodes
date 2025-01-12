import type { Application } from "@/types";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated backend storage
let applications: Application[] = [
  {
    id: "1",
    name: "Database Backup",
    schedules: [],
    sourceDirectories: [],
    destinationDirectories: [],
    scripts: [],
  },
];

export const fetchApplications = async (): Promise<Application[]> => {
  await delay(500);
  return [...applications];
};

export const createApplication = async (application: Omit<Application, "id">): Promise<Application> => {
  await delay(500);
  const newApplication = {
    ...application,
    id: crypto.randomUUID(),
  };
  applications = [...applications, newApplication];
  return newApplication;
};

export const updateApplication = async (id: string, application: Partial<Application>): Promise<Application> => {
  await delay(500);
  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Application not found");
  
  const updatedApplication = {
    ...applications[index],
    ...application,
  };
  applications[index] = updatedApplication;
  return updatedApplication;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await delay(500);
  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Application not found");
  applications = applications.filter((a) => a.id !== id);
};

export const startBackup = async (id: string): Promise<void> => {
  await delay(500); // Simulate backup initiation
  const application = applications.find((a) => a.id === id);
  if (!application) throw new Error("Application not found");
  // In a real implementation, this would trigger the backup process
};