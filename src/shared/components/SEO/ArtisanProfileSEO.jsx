import React from 'react';
import SEOHead from './Head';

const ArtisanProfileSEO = ({ artisan }) => {
  if (!artisan) return null;

  const title = `${artisan.prenom} ${artisan.nom} - ${artisan.metier}`;
  const description = `${artisan.metier} professionnel à ${artisan.ville}. ${artisan.description || 'Disponible pour vos projets de rénovation.'}`;
  const keywords = `${artisan.metier}, ${artisan.ville}, artisan, ${artisan.prenom} ${artisan.nom}, Maroc`;
  
  // Données structurées pour profil artisan
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${artisan.prenom} ${artisan.nom}`,
    "description": description,
    "url": window.location.href,
    "telephone": artisan.telephone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": artisan.ville,
      "postalCode": artisan.codePostal
    },
    "jobTitle": artisan.metier,
    "knowsAbout": artisan.metier,
    "areaServed": artisan.ville,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Services de ${artisan.metier}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Service ${artisan.metier}`,
            "description": description
          }
        }
      ]
    }
  };

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      ogImage={artisan.photo_profil || '/assets/default-artisan.jpg'}
      ogType="profile"
      jsonLd={jsonLd}
    />
  );
};

export default ArtisanProfileSEO;
