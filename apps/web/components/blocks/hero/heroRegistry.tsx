import React from 'react';
import Hero1 from './hero-1';
import Hero2 from './hero-2';
import Hero3 from './Hero3';
import { Hero1 as Hero1Type, Hero2 as Hero2Type } from '@/sanity.types';

// Type for hero variants
export type HeroVariant = 'hero-1' | 'hero-2' | 'hero-3';

// Union type for all hero block types
export type HeroBlockType = Hero1Type | Hero2Type;

// Common props interface for hero components
export interface HeroProps extends Omit<Hero1Type, '_type'> {
  variant?: HeroVariant;
  _type?: 'hero-1' | 'hero-2';
}

// Type-safe registry mapping variant strings to React components
// Using Record<string, unknown> for props to avoid any while maintaining flexibility
const heroRegistry: {
  [K in HeroVariant]: React.ComponentType<Record<string, unknown>>;
} = {
  'hero-1': Hero1 as React.ComponentType<Record<string, unknown>>,
  'hero-2': Hero2 as React.ComponentType<Record<string, unknown>>,
  'hero-3': Hero3 as React.ComponentType<Record<string, unknown>>,
};

export default heroRegistry;
