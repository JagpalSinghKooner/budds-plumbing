'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Client, ClientStatus, ClientPlan } from '@/types/admin';
import { formatDate } from '@/lib/utils';

interface ClientListProps {
  clients: Client[];
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

function getPlanColor(plan: ClientPlan): string {
  switch (plan) {
    case 'enterprise':
      return 'text-purple-600 dark:text-purple-400';
    case 'professional':
      return 'text-blue-600 dark:text-blue-400';
    case 'basic':
      return 'text-green-600 dark:text-green-400';
    case 'free':
      return 'text-slate-600 dark:text-slate-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
}

export function ClientList({ clients }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground mb-4 text-lg">No clients found</p>
        <Button asChild>
          <Link href="/admin/clients/new">Create your first client</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {client.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {client.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(client.status)}>
                    {client.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium capitalize ${getPlanColor(client.plan)}`}
                  >
                    {client.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(client.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {client.lastLoginAt
                    ? formatDate(client.lastLoginAt)
                    : 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/clients/${client.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
