export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Israël Oriadé",
    url: "https://israeloriade.com",
    image: "https://israeloriade.com/images/P2.webp",
    sameAs: [
      "https://www.linkedin.com/in/israeloriade",
      "https://www.instagram.com/israeloriade",
    ],
    jobTitle: "Business Digital Mentor",
    description:
      "Mentor business digital spécialisé dans l'accompagnement d'entrepreneurs pour lancer, structurer et scaler leur activité en ligne.",
    knowsAbout: [
      "Business Digital",
      "Marketing Digital",
      "Entrepreneuriat",
      "Formations en ligne",
      "Growth Marketing",
    ],
    worksFor: {
      "@type": "Organization",
      name: "GrowthMentor",
      url: "https://israeloriade.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  date,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://israeloriade.com/blog/${slug}`,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Person",
      name: "Israël Oriadé",
      url: "https://israeloriade.com",
    },
    publisher: {
      "@type": "Organization",
      name: "GrowthMentor",
      url: "https://israeloriade.com",
      logo: {
        "@type": "ImageObject",
        url: "https://israeloriade.com/og-image.png",
      },
    },
    image: image ?? "https://israeloriade.com/og-image.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://israeloriade.com/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Israël Oriadé — GrowthMentor",
    url: "https://israeloriade.com",
    description:
      "Accompagnement personnalisé pour lancer, structurer et scaler ton activité digitale.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://israeloriade.com/ressources?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
