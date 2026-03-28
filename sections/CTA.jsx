import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section style={{
            position: 'relative',
            padding: '8rem 0',
            backgroundColor: '#0D1B2A',
            overflow: 'hidden'
        }}>
            {/* Background Accents */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '140%',
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 60%)',
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />

            <div className="container mx-auto px-6" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    <h2 style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        lineHeight: 1.1,
                        letterSpacing: '-0.04em'
                    }}>
                        Prêt à donner vie à vos <span style={{ color: '#FF6B35' }}>projets</span> ?
                    </h2>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: 500,
                        lineHeight: 1.7,
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Rejoignez des milliers de marocains qui font confiance à 7rayfi pour leurs travaux.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        marginTop: '1rem'
                    }}>
                        <button
                            onClick={() => {
                                const el = document.getElementById('categories');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                else window.location.hash = '#categories';
                            }}
                            style={{
                                padding: '1.2rem 2.5rem',
                                backgroundColor: '#FF6B35',
                                color: '#FFFFFF',
                                borderRadius: '24px',
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 15px 35px rgba(255, 107, 53, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 45px rgba(255, 107, 53, 0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 107, 53, 0.3)';
                            }}>
                            Trouver un artisan <ArrowRight size={22} strokeWidth={3} />
                        </button>

                        <button
                            onClick={() => window.location.hash = '#/auth?role=artisan'}
                            style={{
                                padding: '1.2rem 2.5rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#FFFFFF',
                                borderRadius: '24px',
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            }}>
                            Je suis artisan
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
