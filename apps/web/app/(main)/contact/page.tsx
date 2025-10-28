import { Metadata } from 'next';
import Blocks from '@/components/blocks';
import { fetchSanityPageBySlug } from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import MissingSanityPage from '@/components/ui/missing-sanity-page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: 'contact' });

  return generatePageMetadata({ page, slug: 'contact' });
}

export default async function ContactPage() {
  const page = await fetchSanityPageBySlug({ slug: 'contact' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'contact' });
  }

  return <Blocks blocks={page?.blocks ?? []} />;
}
