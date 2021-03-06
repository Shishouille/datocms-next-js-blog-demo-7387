import 'isomorphic-unfetch';

const API_URL = 'https://graphql.datocms.com';
const API_TOKEN = process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN;

// See: https://www.datocms.com/blog/offer-responsive-progressive-lqip-images-in-2020
const responsiveImageFragment = `
  fragment responsiveImageFragment on ResponsiveImage {
  srcSet
    webpSrcSet
    sizes
    src
    width
    height
    aspectRatio
    alt
    title
    bgColor
    base64
  }
`;

async function fetchAPI(query, { variables, preview } = {}) {
  const res = await fetch(API_URL + (preview ? '/preview' : ''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getPreviewPostBySlug(slug) {
  const data = await fetchAPI(
    `
    query PostBySlug($slug: String) {
      post(filter: {slug: {eq: $slug}}) {
        slug
      }
    }`,
    {
      preview: true,
      variables: {
        slug,
      },
    },
  );
  return data?.post;
}

export async function getAllPostsWithSlug() {
  const data = fetchAPI(`
    {
      allPosts {
        slug
      }
    }
  `);
  return data?.allPosts;
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    {
      allPosts(orderBy: date_DESC, first: 20) {
        title
        slug
        excerpt
        date
        coverImage {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        author {
          name
          picture {
            url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
          }
        }
      }
    }

    ${responsiveImageFragment}
  `,
    { preview },
  );
  return data?.allPosts;
}

export async function getPostAndMorePosts(slug, preview) {
  const data = await fetchAPI(
    `
  query PostBySlug($slug: String) {
    post(filter: {slug: {eq: $slug}}) {
      title
      slug
      content
      date
      ogImage: coverImage{
        url(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 })
      }
      coverImage {
        responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
          ...responsiveImageFragment
        }
      }
      author {
        name
        picture {
          url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
        }
      }
    }

    morePosts: allPosts(orderBy: date_DESC, first: 2, filter: {slug: {neq: $slug}}) {
      title
      slug
      excerpt
      date
      coverImage {
        responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
          ...responsiveImageFragment
        }
      }
      author {
        name
        picture {
          url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
        }
      }
    }
  }

  ${responsiveImageFragment}
  `,
    {
      preview,
      variables: {
        slug,
      },
    },
  );
  return data;
}

export async function getAllSpectacles(preview) {
  const data = await fetchAPI(
    `
    query getAllSpectacles {
      allSpectacles {
        id
        slug
        title
        toDate
        fromDate
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 300, h: 300 }) {
            ...responsiveImageFragment
          }
        }
        compositor {
          name
        }
        category {
          name
        }
      }
    }
    ${responsiveImageFragment}
  `,
    { preview },
  );
  return data?.allSpectacles;
}

export async function getAllSpectaclesWithSlug() {
  const data = await fetchAPI(`
    {
      allSpectacles {
        slug
      }
    }
  `);
  return data?.allSpectacles;
}

export async function getSpectacleBySlug(slug) {
  const data = await fetchAPI(
    `
    query OneSpectacle($slug: String) {
      spectacle(filter: {slug: {eq: $slug}}) {
        id
        slug
        title
        content
        credits
        firstSpectacle
        fromDate
        time
        toDate
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 700 }) {
            ...responsiveImageFragment
          }
        }
        lang {
          name
        }
        location {
          name
        }
        subscription {
          name
        }
        subtitles {
          name
        }
      }
    }
    ${responsiveImageFragment}
    `,
    {
      preview: true,
      variables: {
        slug,
      },
    },
  );
  return data?.spectacle;
}

export async function getAllArtists(preview) {
  const data = await fetchAPI(
    `
    query getAllArtists {
      allArtists {
        id
        slug
        category {
          name
        }
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 150, h: 150 }) {
            ...responsiveImageFragment
          }
        }
        name
      }
    }
    ${responsiveImageFragment} 
  `,
    { preview },
  );
  return data?.allArtists;
}

export async function getArtistHomePage(preview) {
  const data = await fetchAPI(
    `
    query getArtistHomePage {
      allArtists(orderBy: _createdAt_DESC, first: "1", filter: {showcase: {eq: "true"}}) {
        id
        slug
        category {
          name
        }
        excerpt
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 600, h: 400 }) {
            ...responsiveImageFragment
          }
        }
        name
        spectacle {
          title
        }
      }
    }
    ${responsiveImageFragment}
  `,
    { preview },
  );
  return data?.allArtists;
}

export async function getAllArtistsWithSlug() {
  const data = await fetchAPI(`
    {
      allArtists {
        slug
      }    
    }
  `);
  return data?.allArtists;
}

export async function getArtistbySlug(slug) {
  const data = await fetchAPI(
    `
    query OneArtist($slug: String)  {
      artist(filter: {slug: {eq: $slug}}) {
        id
        slug
        credits
        excerpt
        category {
          name
        }
        content
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 300, h: 300 }) {
            ...responsiveImageFragment
          }
        }
        name
        spectacle {
          slug
          title
        }
      }
    }
    ${responsiveImageFragment}    
    `,
    {
      preview: true,
      variables: {
        slug,
      },
    },
  );
  return data?.artist;
}

export async function getCalendarSpectacles(year, month) {
  const data = await fetchAPI(
    `
    query Calendar($year: IntType, $month: IntType) {
      allCalendars(filter: {year: {eq: $year}, month: {eq: $month}}, orderBy: day_ASC) {
        id
        day
        month
        year
        spectacle {
          id
          slug
          title
          time
          image {
            responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 100, h: 150 }) {
              ...responsiveImageFragment
            }
          }
          location {
            name
          }
        }
      }
    }
    ${responsiveImageFragment}
      `,
    {
      preview: true,
      variables: {
        year,
        month,
      },
    },
  );
  return data?.allCalendars;
}


export async function getAllVisits(preview) {
  const data = await fetchAPI(
    `
    query getAllVisits {
      allVisits {
        title
        price
        content
        excerpt
        location {
          name
          department
          city
          adress
        }
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 800 }) {
            ...responsiveImageFragment
          }
        }
      }
    }
    ${responsiveImageFragment}
  `,
    { preview },
  );
  return data?.allVisits;
}


export async function getAllSubscriptions(preview) {
  const data = await fetchAPI(
    `
    query getAllSubscriptions {
      allSubscriptions {
        price
        name
        excerpt
        content
        image {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 320, h: 420 }) {
            ...responsiveImageFragment
          }
        }
      }
    }
    ${responsiveImageFragment}
  `,
    { preview },
  );
  return data?.allSubscriptions;
}
