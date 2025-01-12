import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { AdminSettings } from "@/types";

const defaultSettings: AdminSettings = {
  smtpServer: "smtp.example.com",
  smtpPort: 587,
  mailFrom: "backup@example.com",
  mailTo: "admin@example.com",
  adminPassword: "",
};

export default function AdminPage() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSettings: AdminSettings = {
      smtpServer: formData.get("smtpServer") as string,
      smtpPort: parseInt(formData.get("smtpPort") as string),
      mailFrom: formData.get("mailFrom") as string,
      mailTo: formData.get("mailTo") as string,
      adminPassword: formData.get("adminPassword") as string,
    };
    setSettings(newSettings);
    toast({
      title: "Settings saved",
      description: "The admin settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Manage system settings"
      />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input
                id="smtpServer"
                name="smtpServer"
                defaultValue={settings.smtpServer}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                name="smtpPort"
                type="number"
                defaultValue={settings.smtpPort}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailFrom">Mail From</Label>
              <Input
                id="mailFrom"
                name="mailFrom"
                type="email"
                defaultValue={settings.mailFrom}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailTo">Mail To</Label>
              <Input
                id="mailTo"
                name="mailTo"
                type="email"
                defaultValue={settings.mailTo}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                name="adminPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}