'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NAVIGATION_QUERYResult } from '@/sanity.types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];

export default function DesktopNav({
  navigation,
}: {
  navigation: NAVIGATION_QUERYResult;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden xl:flex items-center gap-7 text-primary">
      {navigation[0]?.links?.map((navItem: SanityLink) => {
        const hasSubLinks = navItem.subLinks && navItem.subLinks.length > 0;

        if (hasSubLinks) {
          return (
            <div
              key={navItem._key}
              className="relative"
              onMouseEnter={() => setOpenDropdown(navItem._key || null)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 transition-colors hover:text-foreground/80 text-sm p-0 h-auto bg-transparent border-none cursor-pointer',
                  buttonVariants({
                    variant: navItem.buttonVariant || 'link',
                  })
                )}
              >
                {navItem.title}
                <ChevronDown className="h-4 w-4" />
              </button>

              {openDropdown === navItem._key && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg p-2 z-50">
                  {navItem.subLinks?.map((subLink) => (
                    <Link
                      key={subLink._key}
                      href={(subLink as any).resolvedLink || '#'}
                      target={subLink.target ? '_blank' : undefined}
                      rel={subLink.target ? 'noopener noreferrer' : undefined}
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {subLink.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={navItem._key}
            href={(navItem as any).resolvedLink || '#'}
            target={navItem.target ? '_blank' : undefined}
            rel={navItem.target ? 'noopener noreferrer' : undefined}
            className={cn(
              buttonVariants({
                variant: navItem.buttonVariant || 'link',
              }),
              'transition-colors hover:text-foreground/80 text-sm p-0 h-auto hover:bg-transparent'
            )}
          >
            {navItem.title}
          </Link>
        );
      })}
    </nav>
  );
}
