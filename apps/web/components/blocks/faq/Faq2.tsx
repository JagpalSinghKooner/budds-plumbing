import React from 'react';
import { Faqs as FaqsType } from '@/sanity.types';

type Faq2Props = FaqsType;

export default function Faq2({ variant, ..._props }: Faq2Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          FAQ Variant: {variant || 'faq-2'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Faq2
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
