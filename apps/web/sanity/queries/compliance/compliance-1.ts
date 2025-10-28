import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const compliance1Query = groq`
  _type == "compliance-1" => {
    _type,
    _key,
    padding,
    colorVariant,
    tagLine,
    title,
    body,
    badges[]{
      _key,
      image {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      label
    },
    features[]{
      _key,
      icon,
      title,
      description
    }
  }
`;
