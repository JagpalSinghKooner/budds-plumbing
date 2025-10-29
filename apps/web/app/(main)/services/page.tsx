import { Metadata } from 'next';
import SectionRenderer from '@/components/SectionRenderer';
import { fetchSanityPageBySlug } from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import MissingSanityPage from '@/components/ui/missing-sanity-page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: 'services' });

  return generatePageMetadata({ page, slug: 'services' });
}

export default async function ServicesPage() {
  const page = await fetchSanityPageBySlug({ slug: 'services' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'services' });
  }

  return <SectionRenderer sections={(page?.blocks ?? []) as any} />;
}
