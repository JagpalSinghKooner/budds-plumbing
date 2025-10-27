import { groq } from 'next-sanity';

export const NAVIGATION_QUERY = groq`
  *[_type == "navigation"]{
    _type,
    _key,
    links[]{
      _key,
      _type,
      title,
      buttonVariant,
      isExternal,
      href,
      target,
      "resolvedLink": select(
        isExternal => href,
        internalLink._type == "page" => "/" + internalLink->slug.current,
        internalLink._type == "post" => "/blog/" + internalLink->slug.current,
        internalLink._type == "service" => "/services/" + internalLink->slug.current,
        internalLink._type == "location" => "/locations/" + internalLink->slug.current,
        internalLink._type == "service-location" => "/locations/" + internalLink->location->slug.current + "/services/" + internalLink->service->slug.current,
        "#"
      ),
      subLinks[]{
        _key,
        title,
        isExternal,
        href,
        target,
        "resolvedLink": select(
          isExternal => href,
          internalLink._type == "page" => "/" + internalLink->slug.current,
          internalLink._type == "post" => "/blog/" + internalLink->slug.current,
          internalLink._type == "service" => "/services/" + internalLink->slug.current,
          internalLink._type == "location" => "/locations/" + internalLink->slug.current,
          internalLink._type == "service-location" => "/locations/" + internalLink->location->slug.current + "/services/" + internalLink->service->slug.current,
          "#"
        )
      }
    }
  }
`;
