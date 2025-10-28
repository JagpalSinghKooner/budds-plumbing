"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Client, ClientStatus } from "@/types/admin";
import { formatDate } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  showActions?: boolean;
}

function getStatusVariant(
  status: ClientStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "trial":
      return "secondary";
    case "inactive":
      return "outline";
    case "suspended":
      return "destructive";
    default:
      return "outline";
  }
}

export function ClientCard({ client, showActions = true }: ClientCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{client.name}</CardTitle>
            <CardDescription className="mt-1">{client.email}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(client.status)}>
            {client.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Plan:</span>
            <span className="font-medium capitalize">{client.plan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Created:</span>
            <span className="font-medium">{formatDate(client.createdAt)}</span>
          </div>
          {client.lastLoginAt && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Last Login:
              </span>
              <span className="font-medium">
                {formatDate(client.lastLoginAt)}
              </span>
            </div>
          )}
          {client.contactPerson && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Contact:
              </span>
              <span className="font-medium">{client.contactPerson}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Phone:</span>
              <span className="font-medium">{client.phone}</span>
            </div>
          )}
          {client.websiteUrl && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Website:
              </span>
              <a
                href={client.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Visit
              </a>
            </div>
          )}
        </div>
        {client.notes && (
          <div className="mt-4 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {client.notes}
            </p>
          </div>
        )}
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/admin/clients/${client.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
