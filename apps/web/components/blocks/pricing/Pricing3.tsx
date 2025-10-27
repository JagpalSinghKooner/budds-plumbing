import React from 'react';
import { GridRow as PricingType } from '@/sanity.types';

type Pricing3Props = PricingType;

export default function Pricing3({ variant, ..._props }: Pricing3Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Pricing Variant: {variant || 'pricing-3'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Pricing3
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
