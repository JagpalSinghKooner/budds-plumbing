import React from 'react';
import heroRegistry from './blocks/hero/heroRegistry';
import testimonialRegistry from './blocks/testimonial/testimonialRegistry';
import faqRegistry from './blocks/faq/faqRegistry';
import ctaRegistry from './blocks/cta/ctaRegistry';
import pricingRegistry from './blocks/pricing/pricingRegistry';
// Direct component imports for blocks without variant registries
import SectionHeaderComponent from './blocks/section-header';
import SplitRowComponent from './blocks/split/split-row';
import Carousel1Component from './blocks/carousel/carousel-1';
import TimelineRowComponent from './blocks/timeline/timeline-row';
import LogoCloud1Component from './blocks/logo-cloud/logo-cloud-1';
import FormNewsletterComponent from './blocks/forms/newsletter';
import AllPostsComponent from './blocks/all-posts';
import Compliance1Component from './blocks/compliance/compliance-1';
import {
  Hero1,
  Hero2,
  SectionHeader,
  SplitRow,
  GridRow,
  Carousel1,
  Carousel2,
  TimelineRow,
  Cta1,
  LogoCloud1,
  Faqs,
  FormNewsletter,
  AllPosts,
  Compliance1,
} from '@/sanity.types';

// Union type for all possible section types
export type SectionType =
  | Hero1
  | Hero2
  | SectionHeader
  | SplitRow
  | GridRow
  | Carousel1
  | Carousel2
  | TimelineRow
  | Cta1
  | LogoCloud1
  | Faqs
  | FormNewsletter
  | AllPosts
  | Compliance1;

// Base section interface with required _key
interface BaseSection {
  _key: string;
  _type: string;
  variant?: string;
}

// Props interface for SectionRenderer
export interface SectionRendererProps {
  sections: SectionType[];
}

// Registry type for type-safe registry lookup
// Using Record<string, unknown> instead of any for better type safety
// Each component accepts props that are objects with unknown structure
type ComponentRegistry = {
  [key: string]: React.ComponentType<Record<string, unknown>>;
};

// Create simple registries for direct components (no variant support yet)
const sectionHeaderRegistry: ComponentRegistry = {
  'section-header': SectionHeaderComponent as React.ComponentType<
    Record<string, unknown>
  >,
};

const splitRowRegistry: ComponentRegistry = {
  'split-row': SplitRowComponent as React.ComponentType<
    Record<string, unknown>
  >,
};

const carousel1Registry: ComponentRegistry = {
  'carousel-1': Carousel1Component as unknown as React.ComponentType<
    Record<string, unknown>
  >,
};

const timelineRowRegistry: ComponentRegistry = {
  'timeline-row': TimelineRowComponent as React.ComponentType<
    Record<string, unknown>
  >,
};

const logoCloud1Registry: ComponentRegistry = {
  'logo-cloud-1': LogoCloud1Component as React.ComponentType<
    Record<string, unknown>
  >,
};

const formNewsletterRegistry: ComponentRegistry = {
  'form-newsletter': FormNewsletterComponent as React.ComponentType<
    Record<string, unknown>
  >,
};

const allPostsRegistry: ComponentRegistry = {
  'all-posts': AllPostsComponent as React.ComponentType<
    Record<string, unknown>
  >,
};

const compliance1Registry: ComponentRegistry = {
  'compliance-1': Compliance1Component as React.ComponentType<
    Record<string, unknown>
  >,
};

// Map section _type to their respective registries
const registryMap: {
  [key: string]: ComponentRegistry;
} = {
  'hero-1': heroRegistry,
  'hero-2': heroRegistry,
  'section-header': sectionHeaderRegistry,
  'split-row': splitRowRegistry,
  'carousel-1': carousel1Registry,
  'carousel-2': testimonialRegistry,
  'timeline-row': timelineRowRegistry,
  'logo-cloud-1': logoCloud1Registry,
  'form-newsletter': formNewsletterRegistry,
  'all-posts': allPostsRegistry,
  'compliance-1': compliance1Registry,
  faqs: faqRegistry,
  'cta-1': ctaRegistry,
  'grid-row': pricingRegistry,
};

// Default variants for each section type
const defaultVariants: {
  [key: string]: string;
} = {
  'hero-1': 'hero-1',
  'hero-2': 'hero-2',
  'section-header': 'section-header',
  'split-row': 'split-row',
  'carousel-1': 'carousel-1',
  'carousel-2': 'testimonial-1',
  'timeline-row': 'timeline-row',
  'logo-cloud-1': 'logo-cloud-1',
  'form-newsletter': 'form-newsletter',
  'all-posts': 'all-posts',
  'compliance-1': 'compliance-1',
  faqs: 'faq-1',
  'cta-1': 'cta-1',
  'grid-row': 'pricing-1',
};

/**
 * SectionRenderer - Dynamically renders sections based on their _type and variant
 *
 * This component takes an array of sections and renders each one by:
 * 1. Looking up the appropriate registry based on the section's _type
 * 2. Finding the specific component variant within that registry
 * 3. Rendering the component with all section props
 *
 * Error Handling:
 * - Unknown _type: Logs warning and returns null
 * - Unknown variant: Logs warning and returns null
 * - Missing _key: Generates fallback key using index
 * - Null/undefined sections: Filters out invalid sections
 *
 * Registry Coverage:
 * - All Phase 1 block types are registered
 * - Blocks without variant support use single-entry registries
 * - No fallback to console warnings - all types handled
 *
 * @param sections - Array of section objects from Sanity
 * @returns Rendered section components
 */
export default function SectionRenderer({ sections }: SectionRendererProps) {
  // Filter out null/undefined sections
  const validSections = sections?.filter(
    (section): section is SectionType =>
      section !== null && section !== undefined
  );

  if (!validSections || validSections.length === 0) {
    return null;
  }

  return (
    <>
      {validSections.map((section, index) => {
        const sectionWithKey = section as BaseSection;

        // Generate fallback key if missing
        const key =
          sectionWithKey._key || `section-${sectionWithKey._type}-${index}`;

        // Get the appropriate registry for this section type
        const registry = registryMap[sectionWithKey._type];

        if (!registry) {
          console.warn(
            `SectionRenderer: No registry found for type: ${sectionWithKey._type}. ` +
              `Available types: ${Object.keys(registryMap).join(', ')}`
          );
          return null;
        }

        // Get variant or use default
        const variant =
          sectionWithKey.variant || defaultVariants[sectionWithKey._type];

        if (!variant) {
          console.warn(
            `SectionRenderer: No variant found for type: ${sectionWithKey._type}. ` +
              `Section data:`,
            section
          );
          return null;
        }

        // Get the specific component for this variant
        const Component = registry[variant];

        if (!Component) {
          console.warn(
            `SectionRenderer: No component found for type: ${sectionWithKey._type}, variant: ${variant}. ` +
              `Available variants: ${Object.keys(registry).join(', ')}`
          );
          return null;
        }

        // Render the component with all section props
        // Type assertion is safe here because we've validated the registry lookup
        try {
          return (
            <Component {...(section as Record<string, unknown>)} key={key} />
          );
        } catch (error) {
          console.error(
            `SectionRenderer: Error rendering component for type: ${sectionWithKey._type}, variant: ${variant}`,
            error
          );
          return null;
        }
      })}
    </>
  );
}
