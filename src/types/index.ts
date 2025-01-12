export type Frequency = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export type RetentionPeriod = {
  years: number;
  months: number;
  days: number;
  hours: number;
};

export type Node = {
  id: string;
  name: string;
  host: string;
  port: number;
  key: string;
};

export type Schedule = {
  id: string;
  frequency: Frequency;
  retention: string; // Format: "1y2m3d4h"
};

export type Directory = {
  id: string;
  nodeName: string;
  path: string;
};

export type Script = {
  id: string;
  directory: Directory;
  schedule: Schedule;
};

export type Application = {
  id: string;
  name: string;
  schedules: Schedule[];
  sourceDirectories: Directory[];
  destinationDirectories: Directory[];
  scripts: Script[];
};

export type AdminSettings = {
  smtpServer: string;
  smtpPort: number;
  mailFrom: string;
  mailTo: string;
  adminPassword: string;
};