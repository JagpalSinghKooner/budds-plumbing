import React from 'react';
import { Cta1 as CtaType } from '@/apps/studio/sanity.types';

type Cta2Props = CtaType;

export default function Cta2({ variant, ..._props }: Cta2Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          CTA Variant: {variant || 'cta-2'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Cta2
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
