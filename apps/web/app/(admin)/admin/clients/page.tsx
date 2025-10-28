import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClientList } from '@/components/admin/ClientList';
import { listClients } from '@/app/actions/admin/list-clients';

export const metadata = {
  title: 'Clients',
  description: 'Manage your clients',
};

function ClientListSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white dark:bg-slate-900">
      <div className="space-y-4 p-6">
        <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
}

async function ClientListWrapper() {
  const clients = await listClients();

  return <ClientList clients={clients} />;
}

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your clients
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">Add Client</Link>
        </Button>
      </div>

      <Suspense fallback={<ClientListSkeleton />}>
        <ClientListWrapper />
      </Suspense>
    </div>
  );
}
