import React from 'react';
import GridRow from '../grid/grid-row';
import { GridRow as PricingType } from '@/apps/studio/sanity.types';

// Pricing1 uses the existing GridRow component
export default function Pricing1(props: PricingType) {
  return <GridRow {...props} />;
}
