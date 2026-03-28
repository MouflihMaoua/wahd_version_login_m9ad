import React from 'react';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
    { name: 'Plomberie', count: '120+ artisans', emoji: '🔧', color: '#3b82f6' },
    { name: 'Électricité', count: '95+ artisans', emoji: '⚡', color: '#eab308' },
    { name: 'Menuiserie', count: '80+ artisans', emoji: '🪚', color: '#a855f7' },
    { name: 'Peinture', count: '65+ artisans', emoji: '🎨', color: '#ec4899' },
    { name: 'Maçonnerie', count: '50+ artisans', emoji: '🧱', color: '#f97316' },
    { name: 'Climatisation', count: '40+ artisans', emoji: '❄️', color: '#06b6d4' },
    { name: 'Carrelage', count: '35+ artisans', emoji: '🏠', color: '#10b981' },
    { name: 'Jardinage', count: '30+ artisans', emoji: '🌿', color: '#22c55e' },
];

const Categories = () => (
    <section id="categories" style={{ background: 'var(--off-white)', padding: '6rem 0' }}>
        <div className="container mx-auto px-6">

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <p className="section-label" style={{ justifyContent: 'center' }}>Nos services</p>
                <h2 className="section-title">Catégories <span>Populaires</span></h2>
                <p className="section-sub" style={{ marginTop: '1rem' }}>
                    Explorez nos services les plus demandés par des milliers de clients satisfaits.
                </p>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '1.25rem',
            }}>
                {CATEGORIES.map((cat, i) => (
                    <a href={cat.name === 'Menuiserie' ? '#/profile' : '#'} key={i} style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: '#fff',
                            border: '1.5px solid #e8ecf0',
                            borderRadius: '1.25rem',
                            padding: '1.75rem 1.5rem',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                            gap: '0.7rem',
                            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                            cursor: 'pointer', position: 'relative', overflow: 'hidden',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(255,107,53,0.12)';
                                e.currentTarget.style.borderColor = '#FF6B35';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#e8ecf0';
                            }}
                        >
                            {/* Accent top bar */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                                background: `linear-gradient(90deg, ${cat.color}44, ${cat.color}cc)`,
                                borderRadius: '1.25rem 1.25rem 0 0',
                            }} />

                            {/* Icon circle */}
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: `${cat.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.9rem',
                                transition: 'transform 0.3s ease',
                            }}>
                                {cat.emoji}
                            </div>

                            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--blue-dark)' }}>
                                {cat.name}
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: '#9ba8b5', fontWeight: 600 }}>
                                {cat.count}
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <a href="#" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--orange-primary)', fontWeight: 700, fontSize: '0.95rem',
                    border: '2px solid rgba(255,107,53,0.2)',
                    padding: '0.7rem 1.6rem', borderRadius: 999,
                    transition: 'all 0.25s ease',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--orange-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--orange-primary)'; e.currentTarget.style.borderColor = 'rgba(255,107,53,0.2)'; }}
                >
                    Voir toutes les catégories <ArrowRight size={16} />
                </a>
            </div>
        </div>
    </section>
);

export default Categories;
