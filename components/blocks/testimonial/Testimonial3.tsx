import React from 'react';
import { Carousel2 as Carousel2Type } from '@/apps/studio/sanity.types';

type Testimonial3Props = Carousel2Type;

export default function Testimonial3({
  variant,
  ..._props
}: Testimonial3Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Testimonial Variant: {variant || 'testimonial-3'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Testimonial3
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
