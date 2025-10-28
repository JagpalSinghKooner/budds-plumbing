import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getClient } from '@/app/actions/admin/get-client';
import { formatDate } from '@/lib/utils';
import type { ClientStatus } from '@/types/admin';

export const metadata = {
  title: 'Client Details',
  description: 'View and manage client information',
};

interface ClientDetailPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

function getStatusVariant(
  status: ClientStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'trial':
      return 'secondary';
    case 'inactive':
      return 'outline';
    case 'suspended':
      return 'destructive';
    default:
      return 'outline';
  }
}

function ClientDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-64 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="animate-pulse rounded-xl border bg-white p-6 dark:bg-slate-900">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="animate-pulse rounded-xl border bg-white p-6 dark:bg-slate-900">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
}

async function ClientDetailContent({ clientId }: { clientId: string }) {
  const client = await getClient(clientId);

  if (!client) {
    notFound();
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <Badge variant={getStatusVariant(client.status)}>
              {client.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">{client.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/clients/${client.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/clients">Back to List</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>
              Basic details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">Plan:</span>
              <span className="font-medium capitalize">{client.plan}</span>
            </div>
            {client.contactPerson && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Contact Person:
                </span>
                <span className="font-medium">{client.contactPerson}</span>
              </div>
            )}
            {client.phone && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Phone:
                </span>
                <span className="font-medium">{client.phone}</span>
              </div>
            )}
            {client.websiteUrl && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Website:
                </span>
                <a
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Visit Website
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Timeline</CardTitle>
            <CardDescription>Important dates and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Created:
              </span>
              <span className="font-medium">
                {formatDate(client.createdAt)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Last Updated:
              </span>
              <span className="font-medium">
                {formatDate(client.updatedAt)}
              </span>
            </div>
            {client.lastLoginAt && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Last Login:
                </span>
                <span className="font-medium">
                  {formatDate(client.lastLoginAt)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {client.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage & Activity</CardTitle>
          <CardDescription>
            Client usage statistics and activity logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>Usage tracking coming soon</p>
            <p className="mt-2 text-sm">
              TODO: Implement usage statistics, activity logs, and analytics
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                Delete this client
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                This action cannot be undone
              </p>
            </div>
            <Button variant="destructive" disabled>
              Delete Client
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { clientId } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<ClientDetailSkeleton />}>
        <ClientDetailContent clientId={clientId} />
      </Suspense>
    </div>
  );
}
