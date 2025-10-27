'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';
import { useState } from 'react';
import { AlignRight, ChevronDown } from 'lucide-react';
import { SETTINGS_QUERYResult, NAVIGATION_QUERYResult } from '@/sanity.types';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];

export default function MobileNav({
  navigation,
  settings,
}: {
  navigation: NAVIGATION_QUERYResult;
  settings: SETTINGS_QUERYResult;
}) {
  const [open, setOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Set<string>>(new Set());

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Menu"
          variant="ghost"
          className="w-10 p-5 focus-visible:ring-1 focus-visible:ring-offset-1"
        >
          <AlignRight className="dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="mx-auto">
            <Logo settings={settings} />
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        <div className="pt-10 pb-20 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="container">
            <ul className="list-none text-center space-y-3">
              {navigation[0]?.links?.map((navItem: SanityLink) => {
                const hasSubLinks =
                  navItem.subLinks && navItem.subLinks.length > 0;

                if (hasSubLinks) {
                  return (
                    <li key={navItem._key}>
                      <Collapsible
                        open={openSubMenus.has(navItem._key || '')}
                        onOpenChange={() => toggleSubMenu(navItem._key || '')}
                      >
                        <CollapsibleTrigger className="flex items-center justify-center gap-2 w-full text-lg font-medium">
                          {navItem.title}
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform',
                              openSubMenus.has(navItem._key || '') &&
                                'rotate-180'
                            )}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-2">
                          {navItem.subLinks?.map((subLink) => (
                            <Link
                              key={subLink._key}
                              onClick={() => setOpen(false)}
                              href={(subLink as any).resolvedLink || '#'}
                              target={subLink.target ? '_blank' : undefined}
                              rel={
                                subLink.target
                                  ? 'noopener noreferrer'
                                  : undefined
                              }
                              className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                            >
                              {subLink.title}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  );
                }

                return (
                  <li key={navItem._key}>
                    <Link
                      onClick={() => setOpen(false)}
                      href={(navItem as any).resolvedLink || '#'}
                      target={navItem.target ? '_blank' : undefined}
                      rel={navItem.target ? 'noopener noreferrer' : undefined}
                      className={cn(
                        buttonVariants({
                          variant: navItem.buttonVariant || 'default',
                        }),
                        navItem.buttonVariant === 'ghost' &&
                          'hover:text-decoration-none hover:opacity-50 text-lg p-0 h-auto hover:bg-transparent'
                      )}
                    >
                      {navItem.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
