import React from 'react';
import { Faqs as FaqsType } from '@/sanity.types';

type Faq3Props = FaqsType;

export default function Faq3({ variant, ..._props }: Faq3Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          FAQ Variant: {variant || 'faq-3'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Faq3
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
