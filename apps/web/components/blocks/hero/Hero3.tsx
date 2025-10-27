import React from 'react';
import { PAGE_QUERYResult } from '@/sanity.types';

type Hero3Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'hero-1' }
> & { variant?: 'hero-1' | 'hero-2' | 'hero-3' };

export default function Hero3({ variant, ..._props }: Hero3Props) {
  return (
    <div className="container dark:bg-background py-20 lg:pt-40">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Hero Variant: {variant || 'hero-3'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Hero3
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
