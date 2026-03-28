import React from 'react';
import { Search, MapPin, Briefcase, CheckCircle, Star, ArrowRight } from 'lucide-react';

const METIERS = ['Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Maçonnerie', 'Climatisation', 'Carrelage', 'Jardinage'];
const VILLES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda'];

/* Inline SVG craftsman illustration */
const HeroIllustration = () => (
    <svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 420 }}>
        {/* Background glow */}
        <circle cx="200" cy="220" r="180" fill="url(#heroGlow)" opacity="0.4" />
        {/* Workbench */}
        <rect x="60" y="310" width="280" height="20" rx="8" fill="#FF9A6C" opacity="0.6" />
        <rect x="90" y="330" width="12" height="70" rx="5" fill="#FF6B35" opacity="0.45" />
        <rect x="298" y="330" width="12" height="70" rx="5" fill="#FF6B35" opacity="0.45" />
        {/* Tool — wrench */}
        <g transform="translate(235,270) rotate(-35)">
            <rect x="-5" y="-50" width="10" height="65" rx="5" fill="white" opacity="0.85" />
            <ellipse cx="0" cy="-53" rx="13" ry="9" fill="white" opacity="0.85" />
            <ellipse cx="0" cy="-44" rx="9" ry="6" fill="#1A3A5C" opacity="0.4" />
        </g>
        {/* Tool — hammer */}
        <g transform="translate(155,260) rotate(22)">
            <rect x="-4" y="-55" width="8" height="62" rx="4" fill="white" opacity="0.8" />
            <rect x="-15" y="-72" width="30" height="20" rx="5" fill="#FF6B35" opacity="0.85" />
        </g>
        {/* Body */}
        <path d="M140 200 Q200 182 260 200 L255 305 Q200 320 145 305 Z" fill="#FF6B35" opacity="0.45" />
        {/* Pocket */}
        <rect x="170" y="248" width="36" height="26" rx="6" fill="white" opacity="0.18" />
        {/* Arms */}
        <ellipse cx="125" cy="238" rx="16" ry="46" fill="white" opacity="0.12" transform="rotate(-18 125 238)" />
        <ellipse cx="275" cy="238" rx="16" ry="46" fill="white" opacity="0.12" transform="rotate(18 275 238)" />
        {/* Head */}
        <circle cx="200" cy="158" r="44" fill="white" opacity="0.18" />
        {/* Hair */}
        <ellipse cx="200" cy="117" rx="38" ry="18" fill="#1A3A5C" opacity="0.55" />
        {/* Eyes */}
        <circle cx="187" cy="155" r="4.5" fill="#1A3A5C" opacity="0.5" />
        <circle cx="213" cy="155" r="4.5" fill="#1A3A5C" opacity="0.5" />
        {/* Smile */}
        <path d="M188 170 Q200 181 212 170" stroke="#1A3A5C" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
        {/* Helmet */}
        <path d="M158 136 Q200 104 242 136" fill="#FF6B35" opacity="0.72" />
        <rect x="153" y="134" width="94" height="12" rx="6" fill="#FF6B35" opacity="0.65" />
        {/* Sparkles */}
        <circle cx="288" cy="185" r="4" fill="#FF9A6C" opacity="0.65" />
        <circle cx="108" cy="195" r="2.5" fill="#FF9A6C" opacity="0.55" />
        <circle cx="305" cy="220" r="2" fill="white" opacity="0.45" />
        <circle cx="92" cy="280" r="3" fill="#FF6B35" opacity="0.35" />
        {/* Geometric accents */}
        <polygon points="340,30 368,8 375,52" fill="#FF6B35" opacity="0.4" />
        <polygon points="28,340 8,378 48,368" fill="#FF6B35" opacity="0.3" />
        <line x1="0" y1="80" x2="400" y2="30" stroke="#FF6B35" strokeWidth="1.5" opacity="0.2" />
        <line x1="0" y1="130" x2="400" y2="80" stroke="#FF9A6C" strokeWidth="1" opacity="0.15" />

        <defs>
            <radialGradient id="heroGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0096FF" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

const Hero = () => {
    return (
        <section style={{
            position: 'relative', background: 'var(--bg-dark)',
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', paddingTop: '6rem',
            zIndex: 2,
        }}>
            {/* ── Background layer (High Performance) ── */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {/* Modern Mesh Gradient */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '60%', height: '100%',
                    background: 'radial-gradient(circle at 70% 30%, rgba(255,107,53,0.12) 0%, transparent 60%)',
                    filter: 'blur(80px)', animation: 'pulse-ring 8s infinite alternate'
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0,
                    width: '50%', height: '80%',
                    background: 'radial-gradient(circle at 20% 70%, rgba(0,150,255,0.06) 0%, transparent 50%)',
                    filter: 'blur(100px)',
                }} />

                {/* Subtle Grid */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
                            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#ffffff" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* ── Content ── */}
            <div className="container mx-auto px-6" style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center',
                    paddingBottom: '8rem',
                    width: '100%',
                }}>

                    {/* Left — text */}
                    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                        <div className="section-label" style={{ background: 'rgba(255,107,53,0.12)', alignSelf: 'flex-start', border: '1px solid rgba(255,107,53,0.2)' }}>
                            <span className="animate-pulse">🇲🇦</span> Leader du service au Maroc <span className="opacity-0">v2.1</span>
                        </div>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)', fontWeight: 800,
                            fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
                            color: '#fff', lineHeight: 1.05, letterSpacing: '-0.04em',
                        }}>
                            L'excellence à votre<br />
                            portée,{' '}
                            <span className="text-gradient">sans compromis</span>.
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 520, fontWeight: 500 }}>
                            Accédez aux meilleurs artisans du Royaume. Vérifiés par nos experts,
                            évalués par vos voisins, disponibles immédiatement.
                        </p>

                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
                            <a href="#categories" className="btn-primary">
                                <Search size={22} strokeWidth={2.5} />
                                Explorer les services
                            </a>
                            <a href="#/auth?role=artisan" className="btn-ghost" style={{ border: '2px solid rgba(255,255,255,0.15)' }}>
                                <Briefcase size={22} strokeWidth={2.5} />
                                Devenir Partenaire
                            </a>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {['Zéro engagement', 'Top Artisans', '100% Sécurisé'].map(t => (
                                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                                    <CheckCircle size={18} className="text-[#FF6B35]" /> {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right — illustration (Premium Frame) */}
                    <div className="animate-fade-up-delay" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            position: 'relative',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '3rem',
                            padding: '3rem',
                            backdropFilter: 'blur(30px) saturate(150%)',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                            maxWidth: 460,
                            width: '100%',
                        }}>
                            <HeroIllustration />

                            {/* Floating rating badge (Ultra Modern) */}
                            <div className="pulse-live" style={{
                                position: 'absolute', top: '-10px', right: '-10px',
                                background: '#fff', borderRadius: '1.5rem',
                                padding: '1rem 1.25rem',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                                display: 'flex', flexDirection: 'column', gap: 4,
                                border: '1px solid rgba(26,58,92,0.05)'
                            }}>
                                <div style={{ display: 'flex', gap: 3 }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FFB800" color="#FFB800" />)}
                                </div>
                                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#1A3A5C', letterSpacing: '-0.02em' }}>4.92 / 5</span>
                                <span style={{ fontSize: '0.75rem', color: '#8a95a3', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</span>
                            </div>

                            {/* Floating artisan badge (Dark Glass) */}
                            <div className="animate-spring" style={{
                                position: 'absolute', bottom: '30px', left: '-20px',
                                background: 'rgba(26, 58, 92, 0.85)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1.5rem', padding: '1rem 1.25rem',
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 16px rgba(255,107,53,0.3)'
                                }}>
                                    <CheckCircle size={22} color="white" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>5 000+</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>Projets Réussis</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Search bar (State-of-the-Art) ── */}
            <div style={{
                position: 'absolute', bottom: 0, left: '50%',
                transform: 'translateX(-50%) translateY(50%)',
                width: '94%', maxWidth: 900, zIndex: 50,
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '2.5rem',
                    boxShadow: '0 30px 70px rgba(13,27,42,0.15)',
                    padding: '1rem',
                    display: 'flex', gap: '1rem', alignItems: 'stretch',
                    border: '1px solid rgba(26,58,92,0.05)',
                }}>
                    {/* métier */}
                    <div style={{
                        flex: 1.2, display: 'flex', alignItems: 'center', gap: '1rem',
                        background: '#f8fafc', borderRadius: '1.75rem',
                        padding: '1rem 1.5rem', border: '2px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onFocusCapture={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,107,53,0.05)'; }}
                        onBlurCapture={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <Briefcase size={22} className="text-[#FF6B35]" />
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Spécialité</span>
                            <select style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: '#1A3A5C', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-heading)', cursor: 'pointer' }}>
                                <option value="">Quel artisan ?</option>
                                {METIERS.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ville */}
                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '1rem',
                        background: '#f8fafc', borderRadius: '1.75rem',
                        padding: '1rem 1.75rem', border: '2px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onFocusCapture={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,107,53,0.05)'; }}
                        onBlurCapture={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <MapPin size={22} className="text-[#FF6B35]" />
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Localisation</span>
                            <select style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: '#1A3A5C', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-heading)', cursor: 'pointer' }}>
                                <option value="">Toutes les villes</option>
                                {VILLES.map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* search button */}
                    <a href="#/profile" style={{
                        background: 'linear-gradient(135deg, #1A3A5C, #0D1B2A)',
                        color: '#fff', borderRadius: '1.75rem',
                        padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                        fontWeight: 900, fontSize: '1.1rem', whiteSpace: 'nowrap',
                        boxShadow: '0 15px 35px rgba(26,58,92,0.3)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        textDecoration: 'none',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(26,58,92,0.4)'; e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B35, #FF9A6C)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(26,58,92,0.3)'; e.currentTarget.style.background = 'linear-gradient(135deg, #1A3A5C, #0D1B2A)'; }}
                    >
                        <Search size={22} strokeWidth={3} />
                        <span className="hidden sm:inline">Lancer</span>
                    </a>
                </div>
            </div>
        </section>
    );
};


export default Hero;
