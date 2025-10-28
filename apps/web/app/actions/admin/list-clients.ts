"use server";

import type { Client } from "@/types/admin";

/**
 * List all clients
 *
 * TODO: Replace mock data with actual database queries
 * Suggested implementations:
 * - Connect to Supabase/PostgreSQL database
 * - Use Prisma ORM for type-safe queries
 * - Add pagination support
 * - Add filtering and sorting options
 * - Add search functionality
 */

export async function listClients(): Promise<Client[]> {
  // TODO: Replace with actual database query
  // Example with Prisma:
  // const clients = await prisma.client.findMany({
  //   orderBy: { createdAt: 'desc' }
  // });
  // return clients;

  // Mock data for development
  const mockClients: Client[] = [
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      status: "active",
      plan: "enterprise",
      createdAt: new Date("2024-01-15").toISOString(),
      updatedAt: new Date("2024-10-20").toISOString(),
      lastLoginAt: new Date("2024-10-27").toISOString(),
      websiteUrl: "https://acme.com",
      contactPerson: "John Doe",
      phone: "+1-555-0100",
      notes: "Premium client with custom requirements",
    },
    {
      id: "2",
      name: "TechStart Inc",
      email: "hello@techstart.io",
      status: "active",
      plan: "professional",
      createdAt: new Date("2024-03-22").toISOString(),
      updatedAt: new Date("2024-10-25").toISOString(),
      lastLoginAt: new Date("2024-10-26").toISOString(),
      websiteUrl: "https://techstart.io",
      contactPerson: "Jane Smith",
      phone: "+1-555-0200",
    },
    {
      id: "3",
      name: "Small Biz LLC",
      email: "owner@smallbiz.com",
      status: "trial",
      plan: "basic",
      createdAt: new Date("2024-10-15").toISOString(),
      updatedAt: new Date("2024-10-15").toISOString(),
      websiteUrl: "https://smallbiz.com",
      contactPerson: "Bob Johnson",
      phone: "+1-555-0300",
      notes: "Trial expires in 7 days",
    },
    {
      id: "4",
      name: "Inactive Corp",
      email: "admin@inactive.com",
      status: "inactive",
      plan: "free",
      createdAt: new Date("2023-12-01").toISOString(),
      updatedAt: new Date("2024-08-10").toISOString(),
      lastLoginAt: new Date("2024-07-15").toISOString(),
      notes: "Churned - cited pricing concerns",
    },
  ];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return mockClients;
}
