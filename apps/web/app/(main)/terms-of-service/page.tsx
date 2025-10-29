import { Metadata } from 'next';
import SectionRenderer from '@/components/SectionRenderer';
import { fetchSanityPageBySlug } from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import MissingSanityPage from '@/components/ui/missing-sanity-page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: 'terms-of-service' });

  return generatePageMetadata({ page, slug: 'terms-of-service' });
}

export default async function TermsOfServicePage() {
  const page = await fetchSanityPageBySlug({ slug: 'terms-of-service' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'terms-of-service' });
  }

  return <SectionRenderer sections={(page?.blocks ?? []) as any} />;
}
