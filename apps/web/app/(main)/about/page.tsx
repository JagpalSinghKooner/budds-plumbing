import { Metadata } from 'next';
import SectionRenderer from '@/components/SectionRenderer';
import { fetchSanityPageBySlug } from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import MissingSanityPage from '@/components/ui/missing-sanity-page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: 'about' });

  return generatePageMetadata({ page, slug: 'about' });
}

export default async function AboutPage() {
  const page = await fetchSanityPageBySlug({ slug: 'about' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'about' });
  }

  return <SectionRenderer sections={(page?.blocks ?? []) as any} />;
}
