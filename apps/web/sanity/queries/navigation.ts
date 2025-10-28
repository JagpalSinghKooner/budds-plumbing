import { groq } from 'next-sanity';

export const SERVICE_CATEGORIES_QUERY = groq`
  *[_type == "serviceCategory"] | order(orderRank) {
    _id,
    name,
    slug,
    "services": *[_type == "service" && references(^._id)] | order(name) {
      _id,
      name,
      slug
    }
  }
`;

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
      internalLink->{
        _type,
        _id,
        slug,
        name,
        title,
        "service": service->{slug},
        "location": location->{slug}
      },
      "resolvedLink": select(
        isExternal == true => href,
        internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "page" => select(
          internalLink->slug.current == "index" => "/",
          "/" + internalLink->slug.current
        ),
        internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "post" => "/blog/" + internalLink->slug.current,
        internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "service" => "/services/" + internalLink->slug.current,
        internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "location" => "/locations/" + internalLink->slug.current,
        internalLink._ref != null && internalLink->_type == "service-location" => "/" + internalLink->service->slug.current + "/in/" + internalLink->location->slug.current,
        "#"
      ),
      subLinks[]{
        _key,
        title,
        isExternal,
        href,
        target,
        internalLink->{
          _type,
          _id,
          slug,
          name,
          title,
          "service": service->{slug},
          "location": location->{slug}
        },
        "resolvedLink": select(
          isExternal == true => href,
          internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "page" => select(
            internalLink->slug.current == "index" => "/",
            "/" + internalLink->slug.current
          ),
          internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "post" => "/blog/" + internalLink->slug.current,
          internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "service" => "/services/" + internalLink->slug.current,
          internalLink._ref != null && defined(internalLink->slug.current) && internalLink->_type == "location" => "/locations/" + internalLink->slug.current,
          internalLink._ref != null && internalLink->_type == "service-location" => "/" + internalLink->service->slug.current + "/in/" + internalLink->location->slug.current,
          "#"
        )
      }
    }
  }
`;
