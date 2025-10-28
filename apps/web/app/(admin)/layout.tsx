import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Admin Layout
 *
 * TODO: Implement proper authentication guard with Clerk
 *
 * Authentication Implementation Steps:
 * 1. Install @clerk/nextjs package
 * 2. Set up Clerk environment variables (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
 * 3. Add ClerkProvider to root layout
 * 4. Use auth() from @clerk/nextjs/server to check authentication
 * 5. Check for admin role/permission using user metadata
 *
 * Example implementation:
 * ```typescript
 * import { auth } from "@clerk/nextjs/server";
 *
 * export default async function AdminLayout({ children }: { children: React.ReactNode }) {
 *   const { userId } = await auth();
 *
 *   if (!userId) {
 *     redirect("/sign-in");
 *   }
 *
 *   // Check if user has admin role
 *   const { sessionClaims } = await auth();
 *   const isAdmin = sessionClaims?.metadata?.role === "admin";
 *
 *   if (!isAdmin) {
 *     redirect("/unauthorized");
 *   }
 *
 *   return <>{children}</>;
 * }
 * ```
 */

async function checkAuth() {
  // TODO: Replace with actual Clerk authentication
  // For now, this is a placeholder that allows all access
  const isAuthenticated = true; // Replace with: const { userId } = await auth();
  const isAdmin = true; // Replace with role check from Clerk session claims

  if (!isAuthenticated) {
    redirect('/sign-in');
  }

  if (!isAdmin) {
    redirect('/unauthorized');
  }

  return { isAuthenticated, isAdmin };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900">
        <div className="flex h-16 items-center px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin Dashboard
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/clients"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Clients
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {/* TODO: Add user profile button with Clerk UserButton */}
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-8 py-8">{children}</main>
    </div>
  );
}
