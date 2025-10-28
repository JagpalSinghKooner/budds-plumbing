import React from 'react';
import Faq1 from './Faq1';
import Faq2 from './Faq2';
import Faq3 from './Faq3';
import { Faqs as FaqType } from '@/sanity.types';

// Type for FAQ variants
export type FaqVariant = 'faq-1' | 'faq-2' | 'faq-3';

// Common props interface for FAQ components
export interface FaqProps extends FaqType {
  variant?: FaqVariant;
}

// Type-safe registry mapping variant strings to React components
// Using Record<string, unknown> for props to avoid any while maintaining flexibility
const faqRegistry: {
  [K in FaqVariant]: React.ComponentType<Record<string, unknown>>;
} = {
  'faq-1': Faq1,
  'faq-2': Faq2,
  'faq-3': Faq3,
};

export default faqRegistry;
