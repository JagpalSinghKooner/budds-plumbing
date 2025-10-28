import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MetricsCard } from '@/components/admin/MetricsCard';
import { getClientMetrics } from '@/app/actions/admin/get-client-metrics';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for client management',
};

function MetricsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-6 dark:bg-slate-900">
      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="mt-4 h-8 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="mt-2 h-3 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
    </div>
  );
}

async function DashboardMetrics() {
  const metrics = await getClientMetrics();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Total Clients"
        value={metrics.totalClients}
        description="All registered clients"
        trend={{
          value: 12.5,
          isPositive: true,
        }}
      />
      <MetricsCard
        title="Active Clients"
        value={metrics.activeClients}
        description={`${Math.round((metrics.activeClients / metrics.totalClients) * 100)}% of total`}
      />
      <MetricsCard
        title="Trial Clients"
        value={metrics.trialClients}
        description="Clients in trial period"
      />
      <MetricsCard
        title="New This Month"
        value={metrics.recentActivity.newClientsThisMonth}
        description={`${metrics.recentActivity.newClientsThisWeek} this week`}
      />
    </div>
  );
}

async function PlanDistribution() {
  const metrics = await getClientMetrics();

  const plans = [
    {
      name: 'Enterprise',
      count: metrics.clientsByPlan.enterprise,
      color: 'bg-purple-500',
    },
    {
      name: 'Professional',
      count: metrics.clientsByPlan.professional,
      color: 'bg-blue-500',
    },
    {
      name: 'Basic',
      count: metrics.clientsByPlan.basic,
      color: 'bg-green-500',
    },
    { name: 'Free', count: metrics.clientsByPlan.free, color: 'bg-slate-400' },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">Plan Distribution</h3>
      <div className="mt-6 space-y-4">
        {plans.map((plan) => (
          <div key={plan.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{plan.name}</span>
              <span className="text-slate-600 dark:text-slate-400">
                {plan.count} clients
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full ${plan.color}`}
                style={{
                  width: `${(plan.count / metrics.totalClients) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function StatusOverview() {
  const metrics = await getClientMetrics();

  const statuses = [
    {
      name: 'Active',
      count: metrics.activeClients,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      name: 'Trial',
      count: metrics.trialClients,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Inactive',
      count: metrics.inactiveClients,
      color: 'text-slate-600 dark:text-slate-400',
    },
    {
      name: 'Suspended',
      count: metrics.suspendedClients,
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">Status Overview</h3>
      <div className="mt-6 space-y-4">
        {statuses.map((status) => (
          <div
            key={status.name}
            className="flex items-center justify-between border-b pb-3 last:border-0"
          >
            <span className="text-sm font-medium">{status.name}</span>
            <span className={`text-2xl font-bold ${status.color}`}>
              {status.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your client management system
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">Add Client</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
            <MetricsCardSkeleton />
          </div>
        }
      >
        <DashboardMetrics />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="animate-pulse rounded-xl border bg-white p-6 dark:bg-slate-900">
              <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          }
        >
          <PlanDistribution />
        </Suspense>

        <Suspense
          fallback={
            <div className="animate-pulse rounded-xl border bg-white p-6 dark:bg-slate-900">
              <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          }
        >
          <StatusOverview />
        </Suspense>
      </div>

      <div className="rounded-xl border bg-white p-6 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Button asChild variant="outline" className="h-auto flex-col py-4">
            <Link href="/admin/clients">
              <span className="text-2xl">View All Clients</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col py-4">
            <Link href="/admin/clients/new">
              <span className="text-2xl">Add New Client</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col py-4">
            <Link href="/admin/clients?status=trial">
              <span className="text-2xl">View Trial Clients</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
