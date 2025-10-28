import { Metadata } from 'next';
import Blocks from '@/components/blocks';
import { fetchSanityPageBySlug } from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import MissingSanityPage from '@/components/ui/missing-sanity-page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: 'locations' });

  return generatePageMetadata({ page, slug: 'locations' });
}

export default async function LocationsPage() {
  const page = await fetchSanityPageBySlug({ slug: 'locations' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'locations' });
  }

  return <Blocks blocks={page?.blocks ?? []} />;
}
