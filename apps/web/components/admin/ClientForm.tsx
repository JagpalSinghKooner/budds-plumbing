'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/app/actions/admin/create-client';
import { updateClient } from '@/app/actions/admin/update-client';
import type { Client, ClientStatus, ClientPlan } from '@/types/admin';

interface ClientFormProps {
  client?: Client;
  mode: 'create' | 'edit';
}

export function ClientForm({ client, mode }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as ClientStatus,
      plan: formData.get('plan') as ClientPlan,
      websiteUrl: formData.get('websiteUrl') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      notes: formData.get('notes') as string,
    };

    try {
      if (mode === 'create') {
        const result = await createClient(data);
        if (result.success) {
          router.push('/admin/clients');
          router.refresh();
        } else {
          setError(result.error || 'Failed to create client');
        }
      } else if (client) {
        const result = await updateClient({ id: client.id, ...data });
        if (result.success) {
          router.push(`/admin/clients/${client.id}`);
          router.refresh();
        } else {
          setError(result.error || 'Failed to update client');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Client' : 'Edit Client'}
          </CardTitle>
          <CardDescription>
            {mode === 'create'
              ? 'Add a new client to the system'
              : 'Update client information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={client?.name}
                required
                placeholder="Acme Corporation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={client?.email}
                required
                placeholder="contact@acme.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                id="status"
                name="status"
                defaultValue={client?.status || 'trial'}
                required
                className="border-input ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">
                Plan <span className="text-red-500">*</span>
              </Label>
              <select
                id="plan"
                name="plan"
                defaultValue={client?.plan || 'free'}
                required
                className="border-input ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                defaultValue={client?.contactPerson}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={client?.phone}
                placeholder="+1-555-0100"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                defaultValue={client?.websiteUrl}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={client?.notes}
                rows={4}
                placeholder="Additional notes about this client..."
                className="border-input ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
                ? 'Create Client'
                : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
