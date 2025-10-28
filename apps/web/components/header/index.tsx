import { ModeToggle } from '@/components/menu-toggle';
import { fetchSanitySettings, fetchSanityNavigation, fetchSanityServiceCategories } from '@/sanity/lib/fetch';
import { Navbar2 } from '@/components/header/navbar2';

export default async function Header() {
  const settings = await fetchSanitySettings();
  const navigation = await fetchSanityNavigation();
  const serviceCategories = await fetchSanityServiceCategories();

  return (
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-[100]">
      <div className="py-4">
        <Navbar2
          settings={settings}
          navigation={navigation}
          serviceCategories={serviceCategories}
          rightContent={<ModeToggle />}
          // Uncomment the lines below to add auth buttons
          // auth={{
          //   login: { title: "Login", url: "/login" },
          //   signup: { title: "Sign up", url: "/signup" },
          // }}
        />
      </div>
    </header>
  );
}
