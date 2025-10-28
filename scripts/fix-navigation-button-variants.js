/**
 * Script to remove buttonVariant from regular navigation links
 * Run with: cd apps/studio && pnpm sanity exec ../../scripts/fix-navigation-button-variants.js --with-user-token
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

async function fixNavigationLinks() {
  console.log('Fixing navigation link button variants...\n');

  try {
    // Fetch the navigation document
    const navigation = await client.fetch(
      `*[_type == "navigation"][0]{ _id, _rev, links }`
    );

    if (!navigation) {
      console.log('❌ No navigation document found');
      return;
    }

    console.log(`Found navigation document: ${navigation._id}`);
    console.log(`Current links: ${navigation.links?.length || 0}\n`);

    if (!navigation.links || navigation.links.length === 0) {
      console.log('No links to update');
      return;
    }

    // Update links to remove buttonVariant from regular nav items
    const updatedLinks = navigation.links.map((link) => {
      // Keep buttonVariant only for explicit CTA buttons (like "Contact Us" with special styling)
      // For regular nav links, remove buttonVariant
      const { buttonVariant, ...rest } = link;

      // You can add logic here to keep buttonVariant for specific links
      // For example, if the link title is "Contact Us" and you want it styled as a button
      const shouldKeepButtonVariant =
        link.title === 'Get Quote' ||
        link.title === 'Book Now';

      if (shouldKeepButtonVariant) {
        console.log(`  ℹ️  Keeping buttonVariant for: ${link.title}`);
        return link;
      }

      console.log(`  ✓ Removing buttonVariant from: ${link.title}`);
      return rest;
    });

    // Update the navigation document
    await client
      .patch(navigation._id)
      .set({ links: updatedLinks })
      .commit();

    console.log('\n✓ Navigation links updated successfully!');
    console.log('  Regular navigation links no longer have button styling');
    console.log('  CTA buttons (if any) retain their button variants\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixNavigationLinks();
