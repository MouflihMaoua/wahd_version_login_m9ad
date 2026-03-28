import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  jsonLd = null
}) => {
  const siteTitle = title ? `${title} | 7rayfi` : '7rayfi - Trouvez les meilleurs artisans du Maroc';
  const siteDescription = description || 'Plateforme de mise en relation entre artisans qualifiés et clients au Maroc';
  const siteImage = ogImage || '/assets/7rayfi-og-image.jpg';
  const url = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* Balises de base */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
      
      {/* No Index */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Données structurées */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
