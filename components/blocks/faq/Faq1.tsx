import React from 'react';
import FAQs from '../faqs';
import { Faqs as FaqsType } from '@/apps/studio/sanity.types';

// Faq1 uses the existing FAQs component
export default function Faq1(props: FaqsType) {
  return <FAQs {...props} />;
}
