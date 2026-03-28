import React from 'react';

const Head = ({ title, description }) => {
    return (
        <head>
            <title>{title ? `${title} | 7rayfi` : '7rayfi - Plateforme de mise en relation artisans'}</title>
            <meta name="description" content={description || 'Trouvez les meilleurs artisans au Maroc pour vos travaux de maison.'} />
        </head>
    );
};

export default Head;
