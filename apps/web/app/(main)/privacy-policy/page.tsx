import { Metadata } from 'next';
import Blocks from '@/components/blocks';
import { fetchSanityPageBySlug } from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import MissingSanityPage from '@/components/ui/missing-sanity-page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: 'privacy-policy' });

  return generatePageMetadata({ page, slug: 'privacy-policy' });
}

export default async function PrivacyPolicyPage() {
  const page = await fetchSanityPageBySlug({ slug: 'privacy-policy' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'privacy-policy' });
  }

  return <Blocks blocks={page?.blocks ?? []} />;
}
