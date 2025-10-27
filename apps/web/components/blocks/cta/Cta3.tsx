import React from 'react';
import { Cta1 as CtaType } from '@/sanity.types';

type Cta3Props = CtaType;

export default function Cta3({ variant, ..._props }: Cta3Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          CTA Variant: {variant || 'cta-3'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Cta3
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
