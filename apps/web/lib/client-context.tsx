'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import type { ClientConfig, DatasetName } from '@/lib/dataset-config';

/**
 * Client Context for Multi-Tenant Support
 *
 * This context provides client and dataset information to all components
 * in the application. It enables components to access the current dataset
 * and client configuration without prop drilling.
 *
 * The context is populated by the server via the middleware and passed
 * through the RootLayout.
 */

interface ClientContextValue extends ClientConfig {
  isMultiTenant: boolean;
}

const ClientContext = createContext<ClientContextValue | undefined>(undefined);

interface ClientContextProviderProps {
  children: ReactNode;
  dataset: DatasetName;
  clientName: string;
  domain: string;
}

/**
 * ClientContextProvider Component
 *
 * Wraps the application and provides client/dataset context to all children.
 * Should be placed in the root layout after theme providers.
 *
 * @example
 * <ClientContextProvider
 *   dataset="production"
 *   clientName="Budds Plumbing"
 *   domain="buddsplumbing.com"
 * >
 *   {children}
 * </ClientContextProvider>
 */
export function ClientContextProvider({
  children,
  dataset,
  clientName,
  domain,
}: ClientContextProviderProps) {
  const value: ClientContextValue = {
    dataset,
    clientName,
    domain,
    isMultiTenant: true,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}

/**
 * Hook to access client context
 *
 * @throws {Error} If used outside of ClientContextProvider
 * @returns {ClientContextValue} The current client context
 *
 * @example
 * function MyComponent() {
 *   const { dataset, clientName, domain } = useClientContext();
 *
 *   return (
 *     <div>
 *       <p>Dataset: {dataset}</p>
 *       <p>Client: {clientName}</p>
 *       <p>Domain: {domain}</p>
 *     </div>
 *   );
 * }
 */
export function useClientContext(): ClientContextValue {
  const context = useContext(ClientContext);

  if (context === undefined) {
    throw new Error(
      'useClientContext must be used within a ClientContextProvider'
    );
  }

  return context;
}

/**
 * Hook to access only the dataset name
 *
 * @throws {Error} If used outside of ClientContextProvider
 * @returns {DatasetName} The current dataset name
 *
 * @example
 * function MyComponent() {
 *   const dataset = useDataset();
 *
 *   return <div>Current dataset: {dataset}</div>;
 * }
 */
export function useDataset(): DatasetName {
  const { dataset } = useClientContext();
  return dataset;
}

/**
 * Hook to access only the client name
 *
 * @throws {Error} If used outside of ClientContextProvider
 * @returns {string} The current client name
 *
 * @example
 * function MyComponent() {
 *   const clientName = useClientName();
 *
 *   return <div>Welcome to {clientName}</div>;
 * }
 */
export function useClientName(): string {
  const { clientName } = useClientContext();
  return clientName;
}

/**
 * Hook to check if multi-tenant mode is enabled
 *
 * @throws {Error} If used outside of ClientContextProvider
 * @returns {boolean} True if multi-tenant mode is enabled
 *
 * @example
 * function MyComponent() {
 *   const isMultiTenant = useIsMultiTenant();
 *
 *   if (isMultiTenant) {
 *     return <div>Multi-tenant mode is active</div>;
 *   }
 *
 *   return <div>Single-tenant mode</div>;
 * }
 */
export function useIsMultiTenant(): boolean {
  const { isMultiTenant } = useClientContext();
  return isMultiTenant;
}
