import React, { useState, useEffect } from 'react';
import {
  CheckCircle, MapPin, Star, MessageSquare, Send, Plus,
  Calendar, ShieldCheck, ChevronRight, Hammer, Wrench,
  Award, Clock, TrendingUp, X, ArrowUpRight, Eye,
  Zap, Package, User
} from 'lucide-react';

import { COLORS as C } from '../constants/theme';
import { Stat, PortfolioItem, ServiceRow, ReviewCard } from '../components/profile/ProfileComponents';

/* ══════════════════════════════ DATA ══════════════════════════════ */
const ARTISAN = {
  name: "Ahmed Bennani",
  namePart1: "Ahmed",
  namePart2: "Bennani",
  job: "Menuisier Ébéniste",
  location: "Casablanca, Maroc",
  rating: 4.9,
  reviewsCount: 124,
  bio: "Artisan passionné avec plus de 15 ans d'expérience dans la création de meubles sur mesure et la restauration de boiseries anciennes. Spécialisé dans le style marocain moderne.",
  projectsDone: 450,
  postsCount: 56,
  experience: 15,
  isAvailable: true,
  responseRate: "98%",
  skills: ["Menuiserie", "Ébénisterie", "Sculpture sur bois", "Vernissage", "Rénovation", "Mobilier sur mesure"],
  publications: [
    { id: 1, url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop" },
    { id: 2, url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop" },
    { id: 3, url: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=600&auto=format&fit=crop" },
    { id: 4, url: "https://images.unsplash.com/photo-1541604193435-22077a11bd48?q=80&w=600&auto=format&fit=crop" },
    { id: 5, url: "https://images.unsplash.com/photo-1536412597336-ade7205e94b4?q=80&w=600&auto=format&fit=crop" },
  ],
  services: [
    { name: "Cuisine sur mesure", desc: "Design & pose complète", price: "À partir de 5 000 DH" },
    { name: "Restauration de meuble", desc: "Ancien & contemporain", price: "À partir de 800 DH" },
    { name: "Porte en bois massif", desc: "Bois noble & ferronnerie", price: "À partir de 2 500 DH" },
    { name: "Dressing sur mesure", desc: "Organisation & finition", price: "À partir de 3 500 DH" },
  ],
  reviews: [
    { id: 1, user: "Yassine K.", date: "Janvier 2024", rating: 5, text: "Excellent travail sur ma nouvelle cuisine. Ahmed est très professionnel, ponctuel et ses finitions sont impeccables. Je recommande vivement." },
    { id: 2, user: "Sara M.", date: "Décembre 2023", rating: 5, text: "Un véritable artiste. Il a restauré une commode de famille à la perfection. Le résultat dépasse toutes mes attentes." },
    { id: 3, user: "Karim B.", date: "Novembre 2023", rating: 5, text: "Dressing sur mesure réalisé avec soin et dans les délais prévus. Bois de qualité, finitions soignées." },
  ],
  barData: { 5: 92, 4: 6, 3: 1, 2: 0.5, 1: 0.5 },
};

/* ══════════════════════════════ MODAL ══════════════════════════════ */
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="ap-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ap-modal">
        <div className="ap-modal-header">
          <span className="ap-modal-title">{title}</span>
          <button className="ap-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="ap-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ MAIN ══════════════════════════════ */
export default function ArtisanProfile() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [requestOpen, setRequestOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);

  const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services & Tarifs' },
    { id: 'reviews', label: 'Témoignages' },
  ];

  return (
    <div className="ap-root">
      {/* ── HERO ── */}
      <div className="ap-hero">
        <div className="ap-hero-noise" style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")', opacity: 1, pointerEvents: 'none' }} />
        <div className="ap-hero-orb1" style={{ position: 'absolute', top: -120, right: -80, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,26,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="ap-hero-orb2" style={{ position: 'absolute', bottom: 0, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,150,255,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="ap-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <div className="ap-hero-inner" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 48 }}>
            <div className="ap-badge">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF5C1A' }} />
              Artisan Certifié 7rayfi
            </div>

            <div className="ap-hero-layout" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 56, alignItems: 'end', width: '100%' }}>
              <div className="ap-avatar-wrap" style={{ position: 'relative' }}>
                <div className="ap-avatar-frame">
                  <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400&auto=format&fit=crop" alt={ARTISAN.name} />
                </div>
                <div className="ap-verified" style={{ position: 'absolute', top: -10, right: -10, width: 36, height: 36, borderRadius: '50%', background: '#FF5C1A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #0F2035' }}>
                  <CheckCircle size={16} color="white" strokeWidth={2.5} />
                </div>
              </div>

              <div className="ap-hero-info" style={{ paddingBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                  {ARTISAN.job} · {ARTISAN.location}
                </div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: 'white', marginBottom: 8, letterSpacing: '-0.02em', fontWeight: 400 }}>
                  {ARTISAN.namePart1} <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>{ARTISAN.namePart2}</em>
                </h1>

                <div className="ap-stats-strip" style={{ display: 'flex', gap: 0, marginBottom: 36 }}>
                  <Stat num={ARTISAN.postsCount} label="Réalisations" />
                  <Stat num={ARTISAN.projectsDone} label="Projets" />
                  <Stat num={ARTISAN.rating} label="Satisfaction" gold />
                  <Stat num={ARTISAN.experience} label="Expérience" />
                </div>

                <div className="ap-ctas" style={{ display: 'flex', gap: 12 }}>
                  <button className="ap-btn-primary" onClick={() => setRequestOpen(true)} style={{ background: '#FF5C1A', color: 'white', padding: '16px 32px', borderRadius: '20px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Send size={18} strokeWidth={2.5} /> Lancer un projet
                  </button>
                  <button className="ap-btn-ghost" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', padding: '16px 32px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MessageSquare size={18} /> Demander un devis
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="ap-nav-wrap" style={{ marginTop: 48, position: 'sticky', top: 0, zIndex: 40, background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(15,32,53,0.08)' }}>
            <nav className="ap-nav" style={{ display: 'flex', padding: 0 }}>
              {tabs.map(t => (
                <button key={t.id} className={`ap-nav-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)} style={{ position: 'relative', padding: '20px 28px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {t.label}
                  {activeTab === t.id && <div className="ap-nav-indicator" style={{ position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, background: '#FF5C1A' }} />}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="ap-main" style={{ padding: '64px 0 120px' }}>
        <div className="ap-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <div className="ap-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>
            <div>
              <div className="ap-about" style={{ background: 'white', borderRadius: 28, border: '1px solid rgba(15,32,53,0.08)', padding: 40, marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, marginBottom: 32 }}>À propos</h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(15,32,53,0.65)', marginBottom: 24 }}>{ARTISAN.bio}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, background: '#FAFAF8', border: '1px solid rgba(15,32,53,0.08)', padding: '8px 14px', borderRadius: 100 }}>
                  <MapPin size={13} color="#FF5C1A" /> {ARTISAN.location}
                </span>
              </div>

              {activeTab === 'portfolio' && (
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, marginBottom: 32 }}>Portfolio</h2>
                  <div className="ap-portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <button className="ap-add-btn" onClick={() => setPostOpen(true)}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: '#FF5C1A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={24} strokeWidth={2.5} /></div>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(15,32,53,0.4)' }}>Ajouter</span>
                    </button>
                    {ARTISAN.publications.map(p => (
                      <PortfolioItem key={p.id} img={p.url} meta={<><Eye size={14} /> Voir le projet</>} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, marginBottom: 32 }}>Expertises & Tarifs</h2>
                  {ARTISAN.services.map((s, i) => (
                    <ServiceRow key={i} name={s.name} sub={s.desc} price={s.price} priceSub="TTC" />
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, marginBottom: 32 }}>Témoignages</h2>
                  <div className="ap-rating-hero" style={{ display: 'flex', gap: 48, alignItems: 'center', padding: 40, background: '#0F2035', borderRadius: 28, marginBottom: 20 }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 80, color: 'white', lineHeight: 1 }}>{ARTISAN.rating}</div>
                      <div style={{ display: 'flex', gap: 4, margin: '8px 0' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FFB347" color="#FFB347" />)}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{ARTISAN.reviewsCount} avis vérifiés</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5, 4, 3, 2, 1].map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', width: 10 }}>{s}</span>
                          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg, #FF5C1A, #FFB347)', width: `${ARTISAN.barData[s]}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {ARTISAN.reviews.map(r => (
                    <ReviewCard key={r.id} name={r.user} date={r.date} rating={r.rating} text={r.text} initials={r.user.charAt(0)} />
                  ))}
                </div>
              )}
            </div>

            <aside className="ap-sidebar-sticky" style={{ position: 'sticky', top: 80 }}>
              <div className="ap-booking-card" style={{ background: 'white', borderRadius: 28, border: '1px solid rgba(15,32,53,0.08)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,32,53,0.1)' }}>
                <div className="ap-booking-header" style={{ padding: '32px 36px', background: '#0F2035', color: 'white' }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, marginBottom: 4 }}>Réserver</h3>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Demande de prestation</div>
                  <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(34,197,94,0.15)', borderRadius: 100, fontSize: 11, fontWeight: 700, color: '#4ade80' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /> Disponible maintenant
                  </div>
                </div>
                <div className="ap-booking-body" style={{ padding: '32px 36px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(15,32,53,0.4)', marginBottom: 8, display: 'block' }}>Date souhaitée</label>
                    <input type="date" style={{ width: '100%', padding: '15px 16px', borderRadius: 20, border: '1.5px solid rgba(15,32,53,0.08)', background: '#FAFAF8' }} />
                  </div>
                  <button style={{ width: '100%', padding: 18, background: '#FF5C1A', color: 'white', borderRadius: 20, border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    Confirmer la demande
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Modal isOpen={requestOpen} onClose={() => setRequestOpen(false)} title="Lancer un projet">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: '#FAFAF8', borderRadius: 28, marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>{ARTISAN.name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(15,32,53,0.4)', textTransform: 'uppercase' }}>{ARTISAN.job}</div>
          </div>
        </div>
        <button className="ap-submit-btn" style={{ width: '100%', padding: 17, background: '#0F2035', color: 'white', border: 'none', borderRadius: 20, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Send size={18} /> Envoyer la demande
        </button>
      </Modal>
    </div>
  );
}