import { getCliClient } from 'sanity/cli';

const client = getCliClient();

const query =
  '*[_type in ["service", "location", "service-location"] && defined(orderRank)]';

export default async function removeOrderRank() {
  const documents = await client.fetch(query);

  console.log(`Found ${documents.length} documents with orderRank`);

  const transaction = client.transaction();

  documents.forEach((doc) => {
    console.log(`Removing orderRank from: ${doc._id}`);
    transaction.patch(doc._id, (patch) => patch.unset(['orderRank']));
  });

  await transaction.commit();

  console.log('✓ Done! All invalid orderRank values removed.');
  console.log(
    '\nNext: Go to Studio and click "Reset order" for Services and Locations'
  );
}
