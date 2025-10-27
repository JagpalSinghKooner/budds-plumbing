import React from 'react';
import { GridRow as PricingType } from '@/sanity.types';

type Pricing2Props = PricingType;

export default function Pricing2({ variant, ..._props }: Pricing2Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Pricing Variant: {variant || 'pricing-2'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Pricing2
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
