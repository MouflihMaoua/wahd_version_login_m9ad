import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, ChevronDown, LogOut, User, Settings, Wrench, Star, Sparkles, X, Clock, MapPin, Check, MessageSquare } from 'lucide-react';

export default function NavbarParticulier({ userName='Karim Bennani', userStatus='Client Or', avatarUrl=null }) {
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const notifRef       = useRef(null);
  const profileRef     = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setNotifOpen(false); setProfileOpen(false); }
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const initials  = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const firstName = userName.split(' ')[0];

  const notifications = [
    { id: 1, Icon: Check,         color: '#22C55E', bg: '#F0FDF4', title: 'Réservation confirmée',  desc: 'Ahmed Mansouri · Demain 10:00', time: 'Il y a 5 min',  unread: true  },
    { id: 2, Icon: MessageSquare, color: '#3B82F6', bg: '#EFF6FF', title: 'Nouveau message',         desc: 'Youssef Alami vous a écrit',    time: 'Il y a 23 min', unread: true  },
    { id: 3, Icon: Star,          color: '#F59E0B', bg: '#FFFBEB', title: 'Avis laissé',             desc: 'Said Benali — 5 étoiles',       time: 'Hier',          unread: false },
  ];

  const suggestions = searchQuery.length > 0
    ? [
        { label: 'Plombier à Casablanca', Icon: MapPin, tag: null      },
        { label: 'Électricien Maarif',    Icon: Wrench, tag: null      },
        { label: 'Ahmed Mansouri',        Icon: User,   tag: 'Artisan' },
      ]
    : [
        { label: 'Plombier',              Icon: Clock,  tag: 'Récent'  },
        { label: 'Électricien',           Icon: Clock,  tag: 'Récent'  },
        { label: 'Menuisier Casablanca',  Icon: Clock,  tag: 'Récent'  },
      ];

  const unread = notifications.filter(n => n.unread).length;

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .nb { position:fixed; top:0; left:0; right:0; height:64px; z-index:200; font-family:'Inter',sans-serif; background:rgba(255,255,255,0.95); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border-bottom:1px solid #e5e7eb; transition:border-color .25s,box-shadow .25s,background .25s; }
  .nb.nb-s { background:rgba(255,255,255,0.98); border-bottom-color:#d1d5db; box-shadow:0 1px 0 #d1d5db,0 4px 24px rgba(0,0,0,0.07); }
  .nb-inner { height:64px; padding:0 24px 0 calc(280px + 24px); display:flex; align-items:center; gap:10px; }
  .nb-pill { flex:1; max-width:360px; height:38px; display:flex; align-items:center; gap:8px; padding:0 14px; border-radius:10px; background:#f9fafb; border:1.5px solid #e5e7eb; cursor:pointer; color:#6b7280; font-size:13px; font-weight:500; transition:all .18s; font-family:'Inter',sans-serif; }
  .nb-pill:hover { border-color:#d1d5db; background:#f3f4f6; color:#374151; }
  .nb-kbd { margin-left:auto; display:flex; align-items:center; gap:2px; }
  .nb-kbd span { font-size:10px; font-weight:600; color:#9ca3af; background:#fff; border:1px solid #e5e7eb; border-radius:5px; padding:1px 5px; line-height:1.5; }
  .nb-ov { position:fixed; inset:0; z-index:400; background:rgba(0,0,0,0.4); backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:opacity .2s; }
  .nb-ov.o { opacity:1; pointer-events:all; }
  .nb-spot { position:fixed; top:72px; left:50%; z-index:401; transform:translateX(-50%) translateY(-10px); width:min(580px,calc(100vw - 32px)); background:#fff; border-radius:18px; border:1px solid #EEF2F7; box-shadow:0 8px 48px rgba(15,28,46,0.18),0 2px 8px rgba(15,28,46,0.08); overflow:hidden; opacity:0; pointer-events:none; transition:all .22s cubic-bezier(.22,1,.36,1); }
  .nb-spot.o { opacity:1; pointer-events:all; transform:translateX(-50%) translateY(0); }
  .nb-sir { display:flex; align-items:center; gap:10px; padding:0 18px; height:56px; border-bottom:1px solid #F4F6FA; }
  .nb-si { flex:1; border:none; outline:none; background:transparent; font-size:15px; font-weight:500; color:#0F1C2E; font-family:'DM Sans',sans-serif; }
  .nb-si::placeholder { color:#9BAFBF; }
  .nb-sc { width:26px; height:26px; border-radius:7px; border:1px solid #EEF2F7; background:#F4F6FA; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#526070; flex-shrink:0; transition:background .15s; }
  .nb-sc:hover { background:#E2E8F0; }
  .nb-sb { padding:8px; }
  .nb-sl { font-size:10px; font-weight:700; color:#9BAFBF; text-transform:uppercase; letter-spacing:.1em; padding:6px 10px 4px; }
  .nb-sr { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; cursor:pointer; font-size:13px; font-weight:500; color:#0F1C2E; transition:background .12s; }
  .nb-sr:hover { background:#F8FAFC; }
  .nb-sri { width:30px; height:30px; border-radius:8px; background:#F4F6FA; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#526070; }
  .nb-stag { margin-left:auto; font-size:10px; font-weight:700; padding:2px 8px; border-radius:99px; background:#F97316; color:#fff; }
  .nb-stag.r { background:#F4F6FA; color:#9BAFBF; }
  .nb-right { display:flex; align-items:center; gap:6px; margin-left:auto; }
  .nb-sep { width:1px; height:22px; background:#EEF2F7; margin:0 4px; flex-shrink:0; }
  .nb-ib { position:relative; width:38px; height:38px; border-radius:10px; border:none; background:transparent; cursor:pointer; color:#526070; display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
  .nb-ib:hover,.nb-ib.a { background:#F4F6FA; color:#0F1C2E; }
  .nb-bdg { position:absolute; top:5px; right:5px; min-width:16px; height:16px; border-radius:99px; background:#F97316; color:#fff; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; padding:0 3px; border:2px solid #fff; line-height:1; }
  .nb-drop { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border:1px solid #EEF2F7; border-radius:16px; box-shadow:0 4px 32px rgba(15,28,46,0.13),0 1px 4px rgba(15,28,46,0.06); overflow:hidden; opacity:0; pointer-events:none; transform:translateY(-6px); transition:all .2s cubic-bezier(.22,1,.36,1); z-index:250; }
  .nb-drop.o { opacity:1; pointer-events:all; transform:translateY(0); }
  .nb-nd { width:316px; }
  .nb-dh { display:flex; align-items:center; justify-content:space-between; padding:14px 16px 10px; border-bottom:1px solid #F4F6FA; }
  .nb-dht { font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:14px; color:#0F1C2E; letter-spacing:-0.02em; }
  .nb-dha { font-size:11px; font-weight:700; color:#F97316; background:none; border:none; cursor:pointer; padding:0; }
  .nb-ni { display:flex; align-items:flex-start; gap:10px; padding:11px 14px; cursor:pointer; transition:background .12s; position:relative; }
  .nb-ni.u { background:#FFFBF7; }
  .nb-ni:hover { background:#F8FAFC; }
  .nb-ni.u:hover { background:#FFF5EC; }
  .nb-niw { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .nb-nid { position:absolute; top:16px; right:14px; width:7px; height:7px; border-radius:50%; background:#F97316; }
  .nb-df { padding:10px 14px; border-top:1px solid #F4F6FA; text-align:center; }
  .nb-df a { font-size:12px; font-weight:700; color:#F97316; text-decoration:none; }
  .nb-pd { width:232px; }
  .nb-ph { display:flex; align-items:center; gap:10px; padding:14px 14px 12px; border-bottom:1px solid #F4F6FA; }
  .nb-ml { padding:6px; }
  .nb-mi { display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:10px; cursor:pointer; font-size:13px; font-weight:500; color:#0F1C2E; text-decoration:none; transition:background .12s; }
  .nb-mi:hover { background:#F8FAFC; }
  .nb-mi.d { color:#EF4444; }
  .nb-mi.d:hover { background:#FEF2F2; }
  .nb-mii { width:27px; height:27px; border-radius:7px; background:#F4F6FA; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#526070; }
  .nb-mi.d .nb-mii { background:#FEF2F2; color:#EF4444; }
  .nb-ms { height:1px; background:#e5e7eb; margin:4px 6px; }
  .nb-ab { display:flex; align-items:center; gap:8px; padding:4px 8px 4px 4px; border-radius:12px; border:1px solid #e5e7eb; background:transparent; cursor:pointer; height:44px; font-family:'Inter',sans-serif; transition:all .18s; }
  .nb-ab:hover,.nb-ab.a { background:#f9fafb; border-color:#d1d5db; }
  .nb-ac { width:32px; height:32px; border-radius:9px; flex-shrink:0; background:linear-gradient(135deg,#f97316,#ea580c); display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-size:11px; font-weight:700; color:#fff; letter-spacing:.05em; }
  .nb-an { font-size:13px; font-weight:600; color:#111827; white-space:nowrap; line-height:1.2; }
  .nb-ar { font-size:10px; font-weight:600; color:#f97316; display:flex; align-items:center; gap:3px; white-space:nowrap; }
  .nb-ch { color:#6b7280; transition:transform .2s; flex-shrink:0; }
  .nb-ch.r { transform:rotate(180deg); }
  @media(max-width:1024px){.nb-inner{padding-left:24px;}}
  @media(max-width:640px){.nb-pill{display:none;}.nb-an,.nb-ar,.nb-ch{display:none;}.nb-ab{padding:4px;border:none;}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
`}</style>

      {/* Search overlay */}
      <div className={`nb-ov ${searchOpen ? 'o' : ''}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
      <div className={`nb-spot ${searchOpen ? 'o' : ''}`}>
        <div className="nb-sir">
          <Search size={15} color="#9BAFBF" style={{ flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            className="nb-si"
            placeholder="Rechercher un artisan, un service..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="nb-sc" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
            <X size={12} />
          </button>
        </div>
        <div className="nb-sb">
          <p className="nb-sl">{searchQuery ? 'Résultats' : 'Recherches récentes'}</p>
          {suggestions.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div key={i} className="nb-sr">
                <div className="nb-sri"><Icon size={13} /></div>
                <span>{s.label}</span>
                {s.tag && <span className={`nb-stag ${s.tag === 'Récent' ? 'r' : ''}`}>{s.tag}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navbar */}
      <header className={`nb ${scrolled ? 'nb-s' : ''}`}>
        <div className="nb-inner">

          {/* Search pill */}
          <button className="nb-pill" onClick={() => setSearchOpen(true)}>
            <Search size={14} />
            <span>Rechercher un artisan ou service…</span>
            <span className="nb-kbd"><span>⌘</span><span>K</span></span>
          </button>

          {/* Right */}
          <div className="nb-right">

            {/* Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className={`nb-ib ${notifOpen ? 'a' : ''}`} onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}>
                <Bell size={18} />
                {unread > 0 && <span className="nb-bdg">{unread}</span>}
              </button>

              <div className={`nb-drop nb-nd ${notifOpen ? 'o' : ''}`}>
                <div className="nb-dh">
                  <span className="nb-dht">Notifications</span>
                  <button className="nb-dha">Tout lu</button>
                </div>
                {notifications.map(n => {
                  const Icon = n.Icon;
                  return (
                    <div key={n.id} className={`nb-ni ${n.unread ? 'u' : ''}`}>
                      <div className="nb-niw" style={{ background: n.bg }}><Icon size={15} color={n.color} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F1C2E', marginBottom: '2px' }}>{n.title}</p>
                        <p style={{ fontSize: '11px', color: '#526070', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.desc}</p>
                        <p style={{ fontSize: '10px', color: '#9BAFBF', marginTop: '3px' }}>{n.time}</p>
                      </div>
                      {n.unread && <div className="nb-nid" />}
                    </div>
                  );
                })}
                <div className="nb-df">
                  <Link to="/dashboard/particulier/notifications" onClick={() => setNotifOpen(false)}>
                    Voir toutes les notifications →
                  </Link>
                </div>
              </div>
            </div>

            <div className="nb-sep" />

            {/* Profile */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <button className={`nb-ab ${profileOpen ? 'a' : ''}`} onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}>
                {avatarUrl
                  ? <img src={avatarUrl} style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover', display: 'block' }} alt={userName} />
                  : <div className="nb-ac">{initials}</div>
                }
                <div style={{ textAlign: 'left' }}>
                  <p className="nb-an">{firstName}</p>
                  <p className="nb-ar"><Sparkles size={8} fill="#F97316" color="#F97316" />{userStatus}</p>
                </div>
                <ChevronDown size={14} className={`nb-ch ${profileOpen ? 'r' : ''}`} />
              </button>

              <div className={`nb-drop nb-pd ${profileOpen ? 'o' : ''}`}>
                <div className="nb-ph">
                  {avatarUrl
                    ? <img src={avatarUrl} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} alt={userName} />
                    : <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#0F1C2E,#1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Bricolage Grotesque,sans-serif', fontSize: 12, fontWeight: 800, color: '#fff' }}>{initials}</span>
                      </div>
                  }
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0F1C2E', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userName}</p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#F97316', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <Sparkles size={9} fill="#F97316" color="#F97316" /> {userStatus}
                    </p>
                  </div>
                </div>

                <div className="nb-ml">
                  {[
                    { label: 'Mon profil',   Icon: User,     to: '/dashboard/particulier/profil'   },
                    { label: 'Mes missions', Icon: Wrench,   to: '/dashboard/particulier/missions' },
                    { label: 'Paramètres',   Icon: Settings, to: '/dashboard/particulier/settings' },
                  ].map(item => {
                    const Icon = item.Icon;
                    return (
                      <Link key={item.label} to={item.to} className="nb-mi" onClick={() => setProfileOpen(false)}>
                        <div className="nb-mii"><Icon size={13} /></div>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="nb-ms" />

                <div className="nb-ml">
                  <Link to="/auth" className="nb-mi d" onClick={() => setProfileOpen(false)}>
                    <div className="nb-mii"><LogOut size={13} /></div>
                    Déconnexion
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
