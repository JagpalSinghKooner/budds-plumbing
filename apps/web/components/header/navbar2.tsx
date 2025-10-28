'use client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { Menu, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
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

interface ServiceCategory {
  _id: string;
  name: string | null;
  slug: {
    current: string;
  } | null;
  services?: Array<{
    _id: string;
    name: string | null;
    slug: {
      current: string;
    } | null;
  }> | null;
}

interface MenuItem {
  title?: string | null;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  target?: string | null;
  buttonVariant?: string | null;
  isServiceCategory?: boolean;
}

interface Navbar2Props {
  settings: SETTINGS_QUERYResult;
  navigation: NAVIGATION_QUERYResult;
  serviceCategories?: ServiceCategory[];
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
  serviceCategories,
  auth,
  rightContent,
}: Navbar2Props) => {
  // Transform Sanity data to MenuItem format
  const menu: MenuItem[] =
    navigation[0]?.links?.map((link) => {
      const menuItem: MenuItem = {
        title: link.title,
        url: (link as any).resolvedLink || '#',
        target: link.target ? '_blank' : null,
        buttonVariant: link.buttonVariant,
        items: link.subLinks?.map((subLink) => ({
          title: subLink.title,
          url: (subLink as any).resolvedLink || '#',
          target: subLink.target ? '_blank' : null,
        })),
      };

      // Replace Services menu item with dynamic service categories
      if (link.title?.toLowerCase() === 'services' && serviceCategories && serviceCategories.length > 0) {
        menuItem.items = serviceCategories.map((category) => {
          // Each category becomes a menu item with its services as sub-items
          const categoryMenuItem: MenuItem = {
            title: category.name,
            url: `/services`,
            isServiceCategory: true,
            items: [],
          };

          // Add services as nested items under this category
          if (category.services && category.services.length > 0) {
            categoryMenuItem.items = category.services
              .filter((service) => service.name && service.slug?.current)
              .map((service) => ({
                title: service.name,
                url: `/services/${service.slug!.current}`,
              }));
          }

          return categoryMenuItem;
        });
      }

      return menuItem;
    }) || [];

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
    <section className="w-full py-4">
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
              <NavigationMenuWithoutViewport viewport={false}>
                <NavigationMenuList className="relative">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenuWithoutViewport>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {rightContent && <div key="right-content">{rightContent}</div>}
            {auth?.login && (
              <Button key="login-btn" asChild variant="outline" size="sm">
                <Link href={auth.login.url}>{auth.login.title}</Link>
              </Button>
            )}
            {auth?.signup && (
              <Button key="signup-btn" asChild size="sm">
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
              {rightContent && <div key="mobile-right-content">{rightContent}</div>}
              <Sheet key="mobile-menu-sheet">
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
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  const itemKey = `${item.title || 'untitled'}-${item.url}`;

  if (item.items && item.items.length > 0) {
    // Check if this has nested categories (like Services with HVAC & Plumbing)
    const hasNestedCategories = item.items.some(
      (subItem) => subItem.items && subItem.items.length > 0
    );

    return (
      <NavigationMenuItem key={itemKey}>
        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className={cn(
          "origin-top-center data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 relative top-11 rounded-md border shadow md:absolute md:left-1/2 md:w-64 md:-translate-x-1/2 z-[200]",
          hasNestedCategories ? "!overflow-visible" : ""
        )}>
          {hasNestedCategories ? (
            <CascadingCategoryMenu categories={item.items} />
          ) : (
            <div>
              {item.items.map((subItem, idx) => (
                <NavigationMenuLink
                  asChild
                  key={`${subItem.title || 'untitled'}-${subItem.url}-${idx}`}
                  className="w-full"
                >
                  <SubMenuLink item={subItem} />
                </NavigationMenuLink>
              ))}
            </div>
          )}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={itemKey}>
      <NavigationMenuLink
        asChild
        className="hover:bg-accent/50 hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
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

const CascadingCategoryMenu = ({ categories }: { categories: MenuItem[] }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (categoryTitle: string | null) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredCategory(categoryTitle);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200); // Delay to allow smooth navigation to flyout
  };

  return (
    <div className="overflow-visible p-2">
      {categories.map((category, idx) => (
        <div
          key={`category-desktop-${idx}`}
          className="relative"
          onMouseEnter={() => handleMouseEnter(category.title || null)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between p-3 text-sm font-medium hover:bg-muted rounded-md cursor-pointer transition-colors">
            <span>{category.title}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Flyout submenu - positioned outside parent with bridge area */}
          {hoveredCategory === category.title && category.items && category.items.length > 0 && (
            <div
              className="absolute left-full top-0 pl-3"
              onMouseEnter={() => handleMouseEnter(category.title || null)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="min-w-[240px] rounded-md border bg-popover text-popover-foreground shadow-lg p-2 animate-in fade-in slide-in-from-left-2 duration-200">
                {category.items.map((service, serviceIdx) => (
                  <Link
                    key={`service-flyout-${serviceIdx}`}
                    href={service.url}
                    className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold">{service.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  const itemKey = `${item.title || 'untitled'}-${item.url}`;

  if (item.items && item.items.length > 0) {
    // Check if this has nested categories (like Services with HVAC & Plumbing)
    const hasNestedCategories = item.items.some(
      (subItem) => subItem.items && subItem.items.length > 0
    );

    return (
      <AccordionItem key={itemKey} value={itemKey} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {hasNestedCategories ? (
            <Accordion type="single" collapsible className="w-full pl-4">
              {item.items.map((category, idx) => (
                <CategoryAccordion
                  key={`category-mobile-${idx}`}
                  category={category}
                />
              ))}
            </Accordion>
          ) : (
            <>
              {item.items.map((subItem, idx) => (
                <SubMenuLink
                  key={`${subItem.title || 'untitled'}-${subItem.url}-${idx}`}
                  item={subItem}
                />
              ))}
            </>
          )}
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

const CategoryAccordion = ({ category }: { category: MenuItem }) => {
  const categoryKey = `${category.title || 'untitled'}-${category.url}`;

  return (
    <AccordionItem value={categoryKey} className="border-b-0">
      <AccordionTrigger className="text-sm py-2 font-semibold hover:no-underline">
        {category.title}
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <ul className="space-y-2 pl-2">
          {category.items?.map((service, idx) => (
            <li key={`service-mobile-${idx}`}>
              <Link
                href={service.url}
                className="block rounded-md px-3 py-2 text-sm leading-none no-underline transition-colors hover:bg-muted"
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
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
