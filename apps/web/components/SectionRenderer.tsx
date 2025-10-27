import React from 'react';
import heroRegistry from './blocks/hero/heroRegistry';
import testimonialRegistry from './blocks/testimonial/testimonialRegistry';
import faqRegistry from './blocks/faq/faqRegistry';
import ctaRegistry from './blocks/cta/ctaRegistry';
import pricingRegistry from './blocks/pricing/pricingRegistry';
import {
  Hero1,
  Hero2,
  Carousel2,
  Faqs,
  Cta1,
  GridRow,
} from '@/sanity.types';

// Union type for all possible section types
export type SectionType = Hero1 | Hero2 | Carousel2 | Faqs | Cta1 | GridRow;

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
type ComponentRegistry = {
  [key: string]: React.ComponentType<any>;
};

// Map section _type to their respective registries
const registryMap: {
  [key: string]: ComponentRegistry;
} = {
  'hero-1': heroRegistry,
  'hero-2': heroRegistry,
  'carousel-2': testimonialRegistry,
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
  'carousel-2': 'testimonial-1',
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
    console.warn('SectionRenderer: No valid sections to render');
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
        try {
          return <Component {...section} key={key} />;
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
