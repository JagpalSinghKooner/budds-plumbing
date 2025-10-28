import React from 'react';
import Testimonial1 from './Testimonial1';
import Testimonial2 from './Testimonial2';
import Testimonial3 from './Testimonial3';
import { Carousel2 as TestimonialType } from '@/sanity.types';

// Type for testimonial variants
export type TestimonialVariant =
  | 'testimonial-1'
  | 'testimonial-2'
  | 'testimonial-3';

// Common props interface for testimonial components
export interface TestimonialProps extends TestimonialType {
  variant?: TestimonialVariant;
}

// Type-safe registry mapping variant strings to React components
// Using Record<string, unknown> for props to avoid any while maintaining flexibility
const testimonialRegistry: {
  [K in TestimonialVariant]: React.ComponentType<Record<string, unknown>>;
} = {
  'testimonial-1': Testimonial1,
  'testimonial-2': Testimonial2,
  'testimonial-3': Testimonial3,
};

export default testimonialRegistry;
