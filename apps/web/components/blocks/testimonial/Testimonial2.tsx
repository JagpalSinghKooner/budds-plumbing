import React from 'react';
import { Carousel2 as Carousel2Type } from '@/sanity.types';

type Testimonial2Props = Carousel2Type;

export default function Testimonial2({
  variant,
  ..._props
}: Testimonial2Props) {
  return (
    <div className="container py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Testimonial Variant: {variant || 'testimonial-2'}
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a stub component for Testimonial2
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace with actual implementation when design is ready
        </p>
      </div>
    </div>
  );
}
