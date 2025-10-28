'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NAVIGATION_QUERYResult, SETTINGS_QUERYResult } from '@/sanity.types';
import PortableTextRenderer from '@/components/portable-text-renderer';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
  })
  .required({ email: true });

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

interface Footer15Props {
  settings: SETTINGS_QUERYResult;
  navigation: NAVIGATION_QUERYResult;
  socialLinks?: SocialLink[];
}

const NewsletterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Successfully subscribed to newsletter!');
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to subscribe'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex items-start gap-2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      id="emailInput"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="placeholder-muted-foreground block h-10 w-full border bg-inherit px-3 py-2 text-sm placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
          </div>
          <div className="shrink-0">
            <Button
              type="submit"
              className="border-muted h-10 w-10 rounded-lg border"
              size="icon"
              variant="secondary"
              disabled={isLoading}
            >
              <ArrowRight className="stroke-foreground size-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

const Footer15 = ({ settings, navigation, socialLinks }: Footer15Props) => {
  // Extract logo URL safely
  const logoUrl = settings?.logo
    ? (settings.logo as any).dark?.asset?.url ||
      (settings.logo as any).light?.asset?.url ||
      ''
    : '';

  // Default social links if not provided
  const defaultSocialLinks: SocialLink[] = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const displaySocialLinks = socialLinks || defaultSocialLinks;

  // Transform Sanity navigation into footer sections
  const footerSections =
    navigation[0]?.links
      ?.filter((link) => link.subLinks && link.subLinks.length > 0)
      .map((link) => ({
        title: link.title || '',
        links:
          link.subLinks?.map((subLink) => ({
            name: subLink.title || '',
            href: (subLink as any).resolvedLink || '#',
            target: subLink.target,
          })) || [],
      })) || [];

  // If no sections with sublinks, create a simple section with all main links
  if (footerSections.length === 0) {
    const mainLinks =
      navigation[0]?.links?.map((link) => ({
        name: link.title || '',
        href: (link as any).resolvedLink || '#',
        target: link.target,
      })) || [];

    if (mainLinks.length > 0) {
      footerSections.push({
        title: 'Quick Links',
        links: mainLinks,
      });
    }
  }

  const currentYear = new Date().getFullYear();
  const businessName =
    (settings as any)?.businessName || settings?.siteName || 'Company';

  return (
    <section className="bg-background py-16 md:py-24">
      <footer className="container flex flex-col gap-16 md:gap-24">
        <div className="flex w-full flex-col justify-between gap-y-16 lg:flex-row lg:gap-24">
          <div className="flex shrink-0 grow-0 basis-auto flex-col items-start justify-start gap-6 lg:max-w-md">
            {/* Logo */}
            <Link href="/" className="inline-block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={businessName}
                  title={businessName}
                  width={160}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <span className="text-2xl font-bold">{businessName}</span>
              )}
            </Link>

            {/* Business Description */}
            {settings?.copyright && (
              <div className="text-muted-foreground w-full text-base leading-relaxed">
                <PortableTextRenderer value={settings.copyright} />
              </div>
            )}

            {/* Contact Info */}
            {(settings as any)?.phoneNumber && (
              <div className="text-muted-foreground">
                <Link
                  href={`tel:${(settings as any).phoneNumber}`}
                  className="hover:text-foreground transition-colors"
                >
                  {(settings as any).phoneNumber}
                </Link>
              </div>
            )}

            {/* Social Links */}
            <div className="flex w-full items-center justify-start gap-4">
              {displaySocialLinks.map((item, i) => (
                <Link
                  href={item.href}
                  key={`social-link-${i}`}
                  className="flex size-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 hover:bg-muted"
                  aria-label={item.label}
                >
                  <item.icon className="stroke-foreground size-5" />
                </Link>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="w-full space-y-3">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.length > 0 && (
            <div className="flex flex-col gap-16">
              <nav className="flex flex-wrap gap-16 md:gap-24">
                {footerSections.map((section) => (
                  <div
                    key={section.title}
                    className="flex flex-col items-start justify-start gap-4 min-w-[120px]"
                  >
                    <p className="text-foreground mb-2 text-sm font-semibold md:text-base">
                      {section.title}
                    </p>
                    {section.links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        target={link.target ? '_blank' : undefined}
                        rel={link.target ? 'noopener noreferrer' : undefined}
                        className="text-muted-foreground text-sm font-medium leading-none transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col justify-between gap-y-4 border-t pt-8 md:flex-row md:items-center">
          <div className="text-muted-foreground text-sm font-medium">
            © {currentYear} {businessName}. All rights reserved.
          </div>

          {(settings as any)?.licenseNumber && (
            <div className="text-muted-foreground text-sm">
              License #{(settings as any).licenseNumber}
            </div>
          )}
        </div>
      </footer>
    </section>
  );
};

export { Footer15 };
