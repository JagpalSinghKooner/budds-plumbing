'use client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { Menu } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NAVIGATION_QUERYResult, SETTINGS_QUERYResult } from '@/sanity.types';

interface MenuItem {
  title?: string | null;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  target?: string | null;
  buttonVariant?: string | null;
}

interface Navbar2Props {
  settings: SETTINGS_QUERYResult;
  navigation: NAVIGATION_QUERYResult;
  auth?: {
    login?: {
      title: string;
      url: string;
    };
    signup?: {
      title: string;
      url: string;
    };
  };
  rightContent?: React.ReactNode;
}

const Navbar2 = ({
  settings,
  navigation,
  auth,
  rightContent,
}: Navbar2Props) => {
  // Transform Sanity data to MenuItem format
  const menu: MenuItem[] =
    navigation[0]?.links?.map((link) => ({
      title: link.title,
      url: (link as any).resolvedLink || '#',
      target: link.target ? '_blank' : null,
      buttonVariant: link.buttonVariant,
      items: link.subLinks?.map((subLink) => ({
        title: subLink.title,
        url: (subLink as any).resolvedLink || '#',
        target: subLink.target ? '_blank' : null,
      })),
    })) || [];

  // Extract logo URL safely
  const logoUrl = settings?.logo
    ? (settings.logo as any).asset?.url ||
      (settings.logo as any).dark?.asset?.url ||
      ''
    : '';

  const logo = {
    url: '/',
    src: logoUrl,
    alt: settings?.siteName || 'Logo',
    title: settings?.siteName || '',
  };

  return (
    <div className="w-full">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          {/* Logo */}
          <Link href={logo.url} className="flex items-center gap-2">
            {logo.src && (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={32}
                height={32}
                className="max-h-8 w-auto"
              />
            )}
            <span className="text-lg font-semibold tracking-tighter">
              {logo.title}
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <NavigationMenuWithoutViewport>
                <NavigationMenuList className="relative">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenuWithoutViewport>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {rightContent}
            {auth?.login && (
              <Button asChild variant="outline" size="sm">
                <Link href={auth.login.url}>{auth.login.title}</Link>
              </Button>
            )}
            {auth?.signup && (
              <Button asChild size="sm">
                <Link href={auth.signup.url}>{auth.signup.title}</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              {logo.src && (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={32}
                  height={32}
                  className="max-h-8 w-auto"
                />
              )}
            </Link>
            <div className="flex items-center gap-2">
              {rightContent}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        {logo.src && (
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={32}
                            height={32}
                            className="max-h-8 w-auto"
                          />
                        )}
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {(auth?.login || auth?.signup) && (
                      <div className="flex flex-col gap-3">
                        {auth?.login && (
                          <Button asChild variant="outline">
                            <Link href={auth.login.url}>
                              {auth.login.title}
                            </Link>
                          </Button>
                        )}
                        {auth?.signup && (
                          <Button asChild>
                            <Link href={auth.signup.url}>
                              {auth.signup.title}
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderMenuItem = (item: MenuItem) => {
  const itemKey = `${item.title}-${item.url}`;

  if (item.items && item.items.length > 0) {
    return (
      <NavigationMenuItem key={itemKey}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="origin-top-center data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 relative top-11 w-full overflow-hidden rounded-md border shadow md:absolute md:left-1/2 md:w-80 md:-translate-x-1/2 z-50">
          {item.items.map((subItem) => (
            <NavigationMenuLink
              asChild
              key={`${subItem.title}-${subItem.url}`}
              className="w-full"
            >
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={itemKey}>
      <NavigationMenuLink
        asChild
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        <Link
          href={item.url}
          target={item.target || undefined}
          rel={item.target ? 'noopener noreferrer' : undefined}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  const itemKey = `${item.title}-${item.url}`;

  if (item.items && item.items.length > 0) {
    return (
      <AccordionItem key={itemKey} value={itemKey} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink
              key={`${subItem.title}-${subItem.url}`}
              item={subItem}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={itemKey}
      href={item.url}
      target={item.target || undefined}
      rel={item.target ? 'noopener noreferrer' : undefined}
      className="text-md font-semibold"
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
      target={item.target || undefined}
      rel={item.target ? 'noopener noreferrer' : undefined}
    >
      {item.icon && <div className="text-muted-foreground">{item.icon}</div>}
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

const NavigationMenuWithoutViewport = ({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
      {/* The Viewport needs to be removed to center align submenus under their parents. You could remove this from the shadcn/ui component */}
      {/* {viewport && <NavigationMenuViewport />} */}
    </NavigationMenuPrimitive.Root>
  );
};

export { Navbar2 };
