export type ClientStatus = "active" | "inactive" | "suspended" | "trial";

export type ClientPlan = "free" | "basic" | "professional" | "enterprise";

export interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  plan: ClientPlan;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  websiteUrl?: string;
  contactPerson?: string;
  phone?: string;
  notes?: string;
}

export interface ClientMetrics {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  trialClients: number;
  suspendedClients: number;
  clientsByPlan: {
    free: number;
    basic: number;
    professional: number;
    enterprise: number;
  };
  recentActivity: {
    newClientsThisMonth: number;
    newClientsThisWeek: number;
  };
}

export interface CreateClientInput {
  name: string;
  email: string;
  status: ClientStatus;
  plan: ClientPlan;
  websiteUrl?: string;
  contactPerson?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientInput {
  id: string;
  name?: string;
  email?: string;
  status?: ClientStatus;
  plan?: ClientPlan;
  websiteUrl?: string;
  contactPerson?: string;
  phone?: string;
  notes?: string;
}
