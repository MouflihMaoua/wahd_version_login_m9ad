import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Wrench } from 'lucide-react';
import logoApp from '../../../assets/logo_app.png';

const Footer = () => {
  return (
    <footer style={{ fontFamily: "'DM Sans', sans-serif", background: '#0f0e0c', color: '#e8e4dc', padding: '72px 0 0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .ft-link { font-size: 14px; color: #7a7770; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
        .ft-link:hover { color: #e8723a; }
        .ft-social { width: 36px; height: 36px; border-radius: 50%; border: 0.5px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; }
        .ft-social:hover { border-color: #e8723a; background: rgba(232,114,58,0.1); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, paddingBottom: 64, borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 90, height: 50, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                <img 
                  src={logoApp} 
                  alt="7rayfi" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <span style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: '#fff' }}>
                <span style={{ color: '#e8723a' }}>7</span>rayfi<span style={{ color: '#e8723a' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#7a7770', lineHeight: 1.7, margin: '12px 0 24px', maxWidth: 260 }}>
              La plateforme n°1 au Maroc pour trouver des artisans qualifiés. Qualité, confiance et transparence garanties.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="ft-social">
                  <Icon size={14} color="#7a7770" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ width: 40, height: 2, background: '#e8723a', borderRadius: 2, marginBottom: 20 }} />
            <p style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', margin: '0 0 20px' }}>Navigation</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Trouver un artisan', '/recherche'], ['Devenir artisan', '/inscription'], ['Comment ça marche', '/#how-it-works'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={label}><Link to={path} className="ft-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Métiers */}
          <div>
            <div style={{ width: 40, height: 2, background: '#e8723a', borderRadius: 2, marginBottom: 20 }} />
            <p style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', margin: '0 0 20px' }}>Métiers</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Plomberie', 'plomberie'], ['Électricité', 'electricite'], ['Menuiserie', 'menuiserie'], ['Peinture', 'peinture'], ['Carrelage', 'carrelage']].map(([label, cat]) => (
                <li key={label}><Link to={`/recherche?cat=${cat}`} className="ft-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ width: 40, height: 2, background: '#e8723a', borderRadius: 2, marginBottom: 20 }} />
            <p style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', margin: '0 0 20px' }}>Contact</p>
            {[[MapPin, 'Nador, Maroc'], [Phone, '+212 5 22 00 00 00'], [Mail, 'contact@7rayfi.ma']].map(([Icon, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(232,114,58,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} color="#e8723a" />
                </div>
                <span style={{ fontSize: 13, color: '#7a7770', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0' }}>
          <p style={{ fontSize: 12, color: '#4a4843', margin: 0 }}>
            © 2026 <span style={{ color: '#e8723a' }}>7rayfi</span>. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ecc71', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, color: '#7a7770' }}>Plateforme active au Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;