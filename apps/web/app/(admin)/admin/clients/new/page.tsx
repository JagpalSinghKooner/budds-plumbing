import { ClientForm } from "@/components/admin/ClientForm";

export const metadata = {
  title: "Create Client",
  description: "Add a new client to the system",
};

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Client</h1>
        <p className="text-muted-foreground mt-2">
          Add a new client to your management system
        </p>
      </div>

      <ClientForm mode="create" />
    </div>
  );
}
