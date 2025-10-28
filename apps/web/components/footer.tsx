import { Footer15 } from '@/components/footer15';
import { fetchSanitySettings, fetchSanityNavigation } from '@/sanity/lib/fetch';

export default async function Footer() {
  const settings = await fetchSanitySettings();
  const navigation = await fetchSanityNavigation();

  return <Footer15 settings={settings} navigation={navigation} />;
}
