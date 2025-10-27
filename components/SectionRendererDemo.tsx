import React from 'react';
import SectionRenderer from './SectionRenderer';
import {
  Hero1,
  Hero2,
  Carousel2,
  Faqs,
  Cta1,
  GridRow,
} from '@/apps/studio/sanity.types';

/**
 * SectionRendererDemo - Test component to validate SectionRenderer functionality
 *
 * This component demonstrates:
 * 1. Rendering multiple block types (Hero, Testimonial, FAQ, CTA, Pricing)
 * 2. Using different variants for each block type
 * 3. Proper error handling for edge cases
 */
export default function SectionRendererDemo() {
  // Test data with multiple block types and variants
  const testSections = [
    // Hero Block - Variant 1
    {
      _type: 'hero-1',
      _key: 'hero-test-1',
      variant: 'hero-1',
      tagLine: 'Test Hero Section',
      title: 'Welcome to Budds Plumbing',
      body: [
        {
          _type: 'block',
          _key: 'block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-1',
              text: 'This is a test hero section using hero-1 variant.',
              marks: [],
            },
          ],
        },
      ],
      links: [
        {
          _type: 'link',
          _key: 'link-1',
          title: 'Get Started',
          isExternal: false,
        },
      ],
    } as Hero1,

    // Hero Block - Variant 2
    {
      _type: 'hero-2',
      _key: 'hero-test-2',
      variant: 'hero-2',
      tagLine: 'Another Hero',
      title: 'Hero Variant 2 Test',
      body: [
        {
          _type: 'block',
          _key: 'block-2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span-2',
              text: 'Testing hero-2 variant.',
              marks: [],
            },
          ],
        },
      ],
    } as Hero2,

    // Testimonial Block - Variant 2
    {
      _type: 'carousel-2',
      _key: 'testimonial-test-1',
      variant: 'testimonial-2',
      padding: {
        _type: 'section-padding',
        pt: 'md',
        pb: 'md',
      },
      colorVariant: 'background',
      testimonial: [
        {
          _type: 'reference',
          _key: 'testimonial-ref-1',
          _ref: 'testimonial-123',
        },
      ],
    } as Carousel2,

    // FAQ Block - Variant 1
    {
      _type: 'faqs',
      _key: 'faq-test-1',
      variant: 'faq-1',
      padding: {
        _type: 'section-padding',
        pt: 'lg',
        pb: 'lg',
      },
      colorVariant: 'background',
      faqs: [
        {
          _type: 'reference',
          _key: 'faq-ref-1',
          _ref: 'faq-123',
        },
        {
          _type: 'reference',
          _key: 'faq-ref-2',
          _ref: 'faq-456',
        },
      ],
    } as Faqs,

    // FAQ Block - Variant 3 (different variant)
    {
      _type: 'faqs',
      _key: 'faq-test-2',
      variant: 'faq-3',
      padding: {
        _type: 'section-padding',
        pt: 'md',
        pb: 'md',
      },
      colorVariant: 'card',
      faqs: [
        {
          _type: 'reference',
          _key: 'faq-ref-3',
          _ref: 'faq-789',
        },
      ],
    } as Faqs,

    // CTA Block - Variant 1
    {
      _type: 'cta-1',
      _key: 'cta-test-1',
      variant: 'cta-1',
      padding: {
        _type: 'section-padding',
        pt: 'xl',
        pb: 'xl',
      },
      colorVariant: 'primary',
      sectionWidth: 'narrow',
      stackAlign: 'center',
      tagLine: 'Ready to Start?',
      title: 'Get Your Free Quote Today',
      body: [
        {
          _type: 'block',
          _key: 'cta-block-1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'cta-span-1',
              text: 'Contact us now for professional plumbing services.',
              marks: [],
            },
          ],
        },
      ],
      links: [
        {
          _type: 'link',
          _key: 'cta-link-1',
          title: 'Contact Us',
          isExternal: false,
        },
      ],
    } as Cta1,

    // Pricing Block - Variant 2
    {
      _type: 'grid-row',
      _key: 'pricing-test-1',
      variant: 'pricing-2',
      padding: {
        _type: 'section-padding',
        pt: 'lg',
        pb: 'lg',
      },
      colorVariant: 'background',
      gridColumns: 'grid-cols-3',
      columns: [
        {
          _type: 'gridCard',
          _key: 'pricing-card-1',
          title: 'Basic',
          body: [
            {
              _type: 'block',
              _key: 'pricing-block-1',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: 'pricing-span-1',
                  text: '$99/month',
                  marks: [],
                },
              ],
            },
          ],
        },
      ],
    } as GridRow,
  ];

  // Test edge cases
  const edgeCaseSections = [
    // Section without variant (should use default)
    {
      _type: 'hero-1',
      _key: 'hero-no-variant',
      title: 'No Variant Test',
    } as Hero1,

    // Section without _key (should generate fallback)
    {
      _type: 'carousel-2',
      variant: 'testimonial-1',
      testimonial: [],
    } as Carousel2,
  ];

  return (
    <div className="section-renderer-demo">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">SectionRenderer Test Demo</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Test 1: Multiple Block Types with Different Variants
          </h2>
          <p className="text-gray-600 mb-4">
            Testing Hero (2 variants), Testimonial (1 variant), FAQ (2
            variants), CTA (1 variant), and Pricing (1 variant)
          </p>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <SectionRenderer sections={testSections} />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Test 2: Edge Cases</h2>
          <p className="text-gray-600 mb-4">
            Testing sections without variant (uses default) and without _key
            (generates fallback)
          </p>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <SectionRenderer sections={edgeCaseSections} />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Test 3: Invalid Sections (Check Console)
          </h2>
          <p className="text-gray-600 mb-4">
            Testing unknown _type and invalid variant (should log warnings)
          </p>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <SectionRenderer
              sections={
                [
                  {
                    _type: 'unknown-type',
                    _key: 'unknown-1',
                    variant: 'unknown',
                  },
                  {
                    _type: 'hero-1',
                    _key: 'invalid-variant',
                    variant: 'invalid-hero-variant',
                  },
                ] as any
              }
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Test 4: Empty and Null Sections
          </h2>
          <p className="text-gray-600 mb-4">
            Testing empty array, null, and undefined sections
          </p>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <SectionRenderer sections={[]} />
            <SectionRenderer sections={null as any} />
            <SectionRenderer sections={undefined as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
