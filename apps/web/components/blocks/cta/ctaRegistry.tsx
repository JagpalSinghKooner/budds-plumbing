import React from 'react';
import Cta1 from './cta-1';
import Cta2 from './Cta2';
import Cta3 from './Cta3';
import { Cta1 as CtaType } from '@/sanity.types';

// Type for CTA variants
export type CtaVariant = 'cta-1' | 'cta-2' | 'cta-3';

// Common props interface for CTA components
export interface CtaProps extends CtaType {
  variant?: CtaVariant;
}

// Type-safe registry mapping variant strings to React components
const ctaRegistry: {
  [K in CtaVariant]: React.ComponentType<any>;
} = {
  'cta-1': Cta1,
  'cta-2': Cta2,
  'cta-3': Cta3,
};

export default ctaRegistry;
