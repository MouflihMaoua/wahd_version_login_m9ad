import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
    {
        name: 'Karim B.',
        role: 'Particulier · Casablanca',
        text: "J'ai trouvé un plombier excellent en moins de 20 minutes un dimanche matin. Service rapide, prix honnête, prestation parfaite. Je ne chercherai plus ailleurs !",
        rating: 5,
        tag: 'Plomberie',
        initial: 'K',
        color: '#3b82f6',
    },
    {
        name: 'Sophia L.',
        role: 'Architecte · Rabat',
        text: "En tant qu'architecte, je recommande 7rayfi à tous mes clients. Les profils sont complets, les avis authentiques et la prise de contact est simple.",
        rating: 5,
        tag: 'Menuiserie',
        initial: 'S',
        color: '#a855f7',
    },
    {
        name: 'Mehdi T.',
        role: 'Gérant de restaurant · Marrakech',
        text: "Urgence électrique en plein service. L'artisan est arrivé en 45 min et a tout réglé. La plateforme m'a sauvé la mise. Vraiment impressionnant.",
        rating: 5,
        tag: 'Électricité',
        initial: 'M',
        color: '#eab308',
    },
];

const StarRow = ({ n }) => (
    <div style={{ display: 'flex', gap: 3 }}>
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={16}
                fill={i < n ? '#FF6B35' : 'none'}
                color={i < n ? '#FF6B35' : '#d1d5db'}
            />
        ))}
    </div>
);

const Testimonials = () => {
    const [idx, setIdx] = useState(0);
    const prev = () => setIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length);
    const next = () => setIdx(i => (i + 1) % REVIEWS.length);
    const r = REVIEWS[idx];

    return (
        <section id="testimonials" style={{ background: '#fff', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,58,92,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div className="container mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <p className="section-label" style={{ justifyContent: 'center' }}>Témoignages</p>
                    <h2 className="section-title">Ce que disent <span>nos clients</span></h2>
                    <p className="section-sub" style={{ marginTop: '1rem' }}>
                        La confiance se bâtit sur des expériences réussies et des avis authentiques.
                    </p>
                </div>

                {/* Card */}
                <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>

                    {/* Nav prev */}
                    <button onClick={prev} style={{
                        position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)',
                        width: 44, height: 44, borderRadius: '50%',
                        background: '#fff', border: '1.5px solid #e8ecf0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 2,
                        transition: 'all 0.25s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,53,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecf0'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'; }}
                    >
                        <ChevronLeft size={20} color="#1A3A5C" />
                    </button>

                    {/* Review card */}
                    <div style={{
                        background: '#fff',
                        border: '1.5px solid #e8ecf0',
                        borderRadius: '1.75rem',
                        padding: '3rem',
                        boxShadow: '0 20px 60px rgba(26,58,92,0.07)',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                    }}>
                        {/* Quote mark */}
                        <div style={{ fontSize: '5rem', lineHeight: 1, color: 'rgba(255,107,53,0.12)', fontFamily: 'Georgia', marginBottom: '0.5rem' }}>"</div>

                        <StarRow n={r.rating} />

                        <p style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                            fontStyle: 'italic', color: '#3d4f61', lineHeight: 1.8,
                            margin: '1.5rem 0',
                        }}>"{r.text}"</p>

                        {/* Reviewer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: '50%',
                                background: `linear-gradient(135deg, ${r.color}, ${r.color}88)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 800, fontSize: '1.1rem',
                                fontFamily: 'var(--font-heading)',
                                boxShadow: `0 4px 14px ${r.color}44`,
                            }}>{r.initial}</div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, color: 'var(--blue-dark)', fontFamily: 'var(--font-heading)' }}>{r.name}</div>
                                <div style={{ fontSize: '0.82rem', color: '#9ba8b5', fontWeight: 600 }}>{r.role}</div>
                            </div>
                            <span style={{
                                background: 'rgba(255,107,53,0.1)', color: 'var(--orange-primary)',
                                fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.85rem',
                                borderRadius: 999, marginLeft: '0.5rem',
                            }}>{r.tag}</span>
                        </div>
                    </div>

                    {/* Nav next */}
                    <button onClick={next} style={{
                        position: 'absolute', right: -22, top: '50%', transform: 'translateY(-50%)',
                        width: 44, height: 44, borderRadius: '50%',
                        background: '#fff', border: '1.5px solid #e8ecf0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)', cursor: 'pointer', zIndex: 2,
                        transition: 'all 0.25s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,53,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecf0'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'; }}
                    >
                        <ChevronRight size={20} color="#1A3A5C" />
                    </button>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                        {REVIEWS.map((_, i) => (
                            <button key={i} onClick={() => setIdx(i)} style={{
                                width: i === idx ? 28 : 10, height: 10, borderRadius: 999,
                                background: i === idx ? 'var(--orange-primary)' : '#d1d5db',
                                border: 'none', cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
