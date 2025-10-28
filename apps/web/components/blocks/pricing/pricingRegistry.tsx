import React from 'react';
import Pricing1 from './Pricing1';
import Pricing2 from './Pricing2';
import Pricing3 from './Pricing3';
import { GridRow as PricingType } from '@/sanity.types';

// Type for pricing variants
export type PricingVariant = 'pricing-1' | 'pricing-2' | 'pricing-3';

// Common props interface for pricing components
export interface PricingProps extends PricingType {
  variant?: PricingVariant;
}

// Type-safe registry mapping variant strings to React components
// Using Record<string, unknown> for props to avoid any while maintaining flexibility
const pricingRegistry: {
  [K in PricingVariant]: React.ComponentType<Record<string, unknown>>;
} = {
  'pricing-1': Pricing1,
  'pricing-2': Pricing2,
  'pricing-3': Pricing3,
};

export default pricingRegistry;
