import React from 'react';

const STEPS = [
    {
        num: '01',
        emoji: '🔍',
        title: 'Recherchez',
        desc: 'Saisissez votre besoin et votre ville pour trouver instantanément les artisans disponibles.',
    },
    {
        num: '02',
        emoji: '📅',
        title: 'Réservez',
        desc: 'Choisissez le professionnel qui vous convient et planifiez l\'intervention en ligne.',
    },
    {
        num: '03',
        emoji: '⭐',
        title: 'Évaluez',
        desc: 'Après l\'intervention, notez l\'artisan pour aider toute la communauté à mieux choisir.',
    },
];

const HowItWorks = () => (
    <section id="how-it-works" style={{ background: '#fff', padding: '6rem 0' }}>
        <div className="container mx-auto px-6">

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <p className="section-label" style={{ justifyContent: 'center' }}>Simple & Rapide</p>
                <h2 className="section-title">Comment ça <span>marche ?</span></h2>
                <p className="section-sub" style={{ marginTop: '1rem' }}>
                    En 3 étapes simples, trouvez et réservez l'artisan idéal.
                </p>
            </div>

            {/* Steps */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '2rem',
                position: 'relative',
            }}>
                {/* Connector line */}
                <div style={{
                    display: 'none',
                    position: 'absolute', top: '3.6rem',
                    left: '18%', right: '18%',
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(255,107,53,0.3), rgba(255,107,53,0.6), rgba(255,107,53,0.3))',
                    borderRadius: 999,
                }} className="md:block" />

                {STEPS.map((s, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}
                        className="group"
                    >
                        {/* Number circle */}
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1A3A5C, #234b73)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(26,58,92,0.2)',
                                transition: 'all 0.35s ease',
                                fontSize: '1.8rem',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B35, #FF9A6C)'; e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,107,53,0.35)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #1A3A5C, #234b73)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(26,58,92,0.2)'; }}
                            >
                                {s.emoji}
                            </div>
                            {/* Step number badge */}
                            <div style={{
                                position: 'absolute', top: -8, right: -8,
                                width: 26, height: 26, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 800, color: '#fff',
                                border: '3px solid #fff',
                                boxShadow: '0 2px 8px rgba(255,107,53,0.4)',
                                fontFamily: 'var(--font-heading)',
                            }}>{i + 1}</div>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--blue-dark)', marginBottom: '0.65rem' }}>
                            {s.title}
                        </h3>
                        <p style={{ color: '#7a8a9a', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 260 }}>
                            {s.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;
