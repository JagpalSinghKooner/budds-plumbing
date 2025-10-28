import { groq } from "next-sanity";

export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  _type,
  siteName,
  businessName,
  phoneNumber,
  email,
  address {
    street,
    city,
    state,
    zip
  },
  businessHours[] {
    day,
    open,
    close
  },
  emergencyAvailable,
  licenseNumber,
  insuranceInfo,
  serviceRadius,
  primaryServiceArea,
  logo{
    dark{
      ...,
      asset->{
        _id,
        url,
        mimeType,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      }
    },
    light{
      ...,
      asset->{
        _id,
        url,
        mimeType,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      }
    },
    width,
    height,
  },
  copyright
}`;

// Alias for backwards compatibility
export const SITE_SETTINGS_QUERY = SETTINGS_QUERY;
