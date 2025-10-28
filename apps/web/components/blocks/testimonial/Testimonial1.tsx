import React from 'react';
import Carousel2 from '../carousel/carousel-2';
import { Carousel2 as Carousel2Type } from '@/sanity.types';

// Testimonial1 uses the existing Carousel2 component
export default function Testimonial1(props: Carousel2Type) {
  return (
    <Carousel2 {...(props as unknown as Parameters<typeof Carousel2>[0])} />
  );
}
