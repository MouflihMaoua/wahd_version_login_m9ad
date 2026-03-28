import React from 'react';

const STATS = [
    { number: '2 000+', label: 'Artisans qualifiés', icon: '🔨' },
    { number: '15 000+', label: 'Clients satisfaits', icon: '🌟' },
    { number: '50+', label: 'Villes couvertes', icon: '📍' },
];

const Stats = () => (
    <section style={{
        background: 'var(--bg-dark)',
        paddingTop: '6rem',
        paddingBottom: '3.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1,
    }}>
        <div className="container mx-auto px-6">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.5rem',
            }}>
                {STATS.map((s, i) => (
                    <div key={i} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '2rem 1rem', textAlign: 'center',
                        borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        position: 'relative',
                    }}>
                        <span style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{s.icon}</span>
                        <span style={{
                            fontFamily: 'var(--font-heading)', fontWeight: 800,
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em', lineHeight: 1.1,
                            display: 'block',
                        }}>{s.number}</span>
                        <span style={{
                            color: 'rgba(255,255,255,0.6)', fontWeight: 600,
                            fontSize: '0.95rem', marginTop: '0.4rem', letterSpacing: '0.01em',
                        }}>{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Stats;
