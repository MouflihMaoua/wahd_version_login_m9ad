import { useState, useEffect } from "react";
import { Star, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../core/services/supabaseClient';

// ─── HELPERS ─────────────────────────────────────────────────────
function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

// ─── BADGE CONFIG ────────────────────────────────────────────────
function getBadge(score, total) {
  if (score >= 4.8 && total >= 50) return { label:"Élite ⚡", color:"#d4a853", bg:"rgba(212,168,83,.12)", border:"rgba(212,168,83,.35)", desc:"Top 5% des artisans" };
  if (score >= 4.5 && total >= 20) return { label:"Expert 🏆", color:"#a855f7", bg:"rgba(168,85,247,.12)", border:"rgba(168,85,247,.35)", desc:"Artisan hautement qualifié" };
  if (score >= 4.0 && total >= 10) return { label:"Fiable ✓",  color:"#22c55e", bg:"rgba(34,197,94,.12)",  border:"rgba(34,197,94,.35)",  desc:"Artisan de confiance" };
  return                                 { label:"Nouveau 🌱", color:"#3b82f6", bg:"rgba(59,130,246,.12)", border:"rgba(59,130,246,.35)", desc:"Artisan en progression" };
}

// ─── HELPERS ─────────────────────────────────────────────────────
const avg = (arr) => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : "0.0";
const pct = (val, total) => total ? Math.round((val/total)*100) : 0;

function Stars({ note, size=14 }) {
  return (
    <span className="inline-flex gap-1">
      {[1,2,3,4,5].map(i=>(
        <span key={i}
          className="cursor-default transition-all duration-200 inline-block"
          style={{
            fontSize: size,
            color: note>=i ? "#f59e0b" : "#e5e7eb",
          }}
        >★</span>
      ))}
    </span>
  );
}

function Badge({ score, total }) {
  const b = getBadge(score, total);
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border" 
         style={{ background: b.bg, borderColor: b.border }}>
      <span className="text-lg">
        {score>=4.8&&total>=50?"⚡":score>=4.5&&total>=20?"🏆":score>=4.0&&total>=10?"✓":"🌱"}
      </span>
      <div>
        <div className="text-sm font-bold" style={{ color: b.color }}>{b.label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{b.desc}</div>
      </div>
    </div>
  );
}

// ─── SCORE RING ───────────────────────────────────────────────────
function ScoreRing({ score }) {
  const pct = ((score-1)/4)*100;
  const r=52, circ=2*Math.PI*r;
  const dashOffset = circ - (pct/100)*circ;
  const color = score>=4.5?"#f59e0b":score>=4?"#22c55e":score>=3?"#3b82f6":"#ef4444";
  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg width="130" height="130" className="transform -rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#374151" strokeWidth="8"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{filter:`drop-shadow(0 0 8px ${color}80)`}}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black tracking-tighter font-mono" 
             style={{ color, animation: "countUp 0.5s ease" }}>
          {score}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">/ 5.0</div>
      </div>
    </div>
  );
}

// ─── MINI BAR CHART (score évolution) ────────────────────────────
function ScoreChart({ data }) {
  const max = Math.max(...data.map(d=>d.score));
  const min = Math.min(...data.map(d=>d.score));
  return (
    <div className="flex items-end gap-1.5 h-16 px-1">
      {data.map((d,i)=>{
        const h = ((d.score-min)/(max-min+0.1))*60+10;
        const isLast = i===data.length-1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div className="text-xs font-mono font-medium" 
                 style={{ color: isLast ? "#f59e0b" : "#9ca3af" }}>
              {d.score}
            </div>
            <div className="w-full rounded-t-sm transition-all duration-800"
                 style={{
                   height: h,
                   background: isLast ? "linear-gradient(180deg, #f59e0b, #f97316)" : "#374151",
                   border: `1px solid ${isLast ? "#f59e0b33" : "#4b5563"}`,
                   boxShadow: isLast ? "0 0 14px rgba(245,158,11,.3)" : "none",
                 }}/>
            <div className="text-xs text-gray-400 font-mono">{d.mois}</div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function ReputationArtisanPublic() {
  const { id } = useParams();
  const [filterNote, setFilterNote] = useState(0);
  const [filterService, setFilterService] = useState("Tous");
  const [artisan, setArtisan] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // Charger les infos de l'artisan
        const { data: artisanData, error: artisanError } = await supabase
          .from('artisan')
          .select('*')
          .eq('id_artisan', id)
          .maybeSingle();

        if (artisanError) throw artisanError;
        if (!artisanData) { setError('Artisan non trouvé.'); return; }
        setArtisan(artisanData);

        // Charger les avis de l'artisan
        const { data: avisData, error: avisError } = await supabase
          .from('avis')
          .select('*')
          .eq('id_artisan', id)
          .order('date_avis', { ascending: false });

        if (avisError) throw avisError;
        setAvis(avisData || []);

      } catch (err) {
        setError(err.message || 'Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Chargement de la réputation...</p>
      </div>
    </div>
  );

  // ── Erreur ──
  if (error || !artisan) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Artisan non trouvé</h2>
        <p className="text-gray-600">{error || "Cet artisan n'existe pas."}</p>
      </div>
    </div>
  );

  // ── Données calculées ──
  const score = avis.length > 0 ? (avis.reduce((sum, a) => sum + (a.note || 0), 0) / avis.length).toFixed(1) : "0.0";
  const badge = getBadge(parseFloat(score), avis.length);
  const services = ["Tous", ...new Set(avis.map(a => a.service_type || 'Service').filter(Boolean))];

  const filtered = avis.filter(a => {
    if (filterNote > 0 && (a.note || 0) !== filterNote) return false;
    if (filterService !== "Tous" && (a.service_type || '') !== filterService) return false;
    return true;
  });

  const ratingBreakdown = [5,4,3,2,1].map(n=>({
    n, count:avis.filter(a=>(a.note || 0)===n).length,
    pct: pct(avis.filter(a=>(a.note || 0)===n).length, avis.length),
  }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── HEADER ── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-lg shadow-lg shadow-brand-orange/20">
              🔨
            </div>
            <div>
              <div className="text-sm font-bold">ArtisanPro</div>
              <div className="text-xs text-gray-500 font-mono">Réputation de l'artisan</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Vue publique • Informations vérifiées
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ════════════════════════════════════
            HERO SCORE SECTION
        ════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
          {/* Gradient header */}
          <div className="p-7 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-brand-orange/5 to-transparent"/>

            <div className="flex items-center gap-6 flex-wrap">

              {/* Score ring */}
              <ScoreRing score={score} />

              {/* Info */}
              <div className="flex-1 min-w-48">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h2 className="text-xl font-black tracking-tight">
                    {artisan.prenom_artisan || ''} {artisan.nom_artisan || ''}
                  </h2>
                  <Badge score={parseFloat(score)} total={avis.length}/>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Stars note={Math.round(parseFloat(score))} size={18}/>
                  <span className="text-sm text-gray-600 ml-1">
                    <strong className="text-gray-900">{avis.length}</strong> avis clients
                  </span>
                </div>

                <div className="flex gap-4 flex-wrap text-xs text-gray-600">
                  <span>📍 {artisan.ville || 'Non renseigné'}</span>
                  <span>🔧 {artisan.metier || 'Non renseigné'}</span>
                  <span>🗓 Membre depuis {artisan.created_at ? new Date(artisan.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Non renseigné'}</span>
                  <span>📊 {artisan.nombre_avis || 0} missions réalisées</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-0 border-l border-gray-200 pl-5">
                {[
                  {val:pct(avis.filter(a=>(a.note || 0)>=4).length, avis.length)+"%", label:"Satisfaction", color:"text-green-600"},
                  {val:avis.filter(a=>a.reponse_artisan).length+"/"+avis.length, label:"Réponses", color:"text-blue-600"},
                ].map((s,i)=>(
                  <div key={s.label} className={`
                    px-4 text-center ${i<1 ? "border-r border-gray-200" : ""}
                  `}>
                    <div className={`text-2xl font-black font-mono ${s.color} tracking-tight`}>{s.val}</div>
                    <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="p-6">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono font-semibold mb-3">
              Répartition des notes
            </div>
            {ratingBreakdown.map(r=>(
              <div key={r.n} className={`
                flex items-center gap-3 mb-2 cursor-pointer transition-opacity
                ${filterNote===0||filterNote===r.n ? "opacity-100" : "opacity-40"}
              `} onClick={()=>setFilterNote(filterNote===r.n?0:r.n)}>
                <span className="text-sm text-amber-500 w-6 flex-shrink-0 font-mono font-semibold">
                  {r.n}★
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-800" 
                       style={{width:r.pct+"%"}}/>
                </div>
                <span className="text-xs font-mono text-gray-500 w-7 text-right">
                  {r.count}
                </span>
                <span className="text-xs text-gray-400 w-8 text-right font-mono">
                  {r.pct}%
                </span>
              </div>
            ))}
            {filterNote>0&&(
              <button onClick={()=>setFilterNote(0)} className="
                mt-2 text-xs text-brand-orange font-semibold bg-transparent border-none cursor-pointer
              ">
                ✕ Réinitialiser filtre
              </button>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════
            FILTRES + AVIS LIST
        ════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

          {/* Filtres bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                Avis clients vérifiés
              </span>
              <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/25 px-2 py-1 rounded-full">
                {filtered.length}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Filtre par service */}
              {services.map(s=>(
                <button key={s} onClick={()=>setFilterService(s)} className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200
                  ${filterService===s 
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20 border border-brand-orange" 
                    : "bg-gray-100 text-gray-600 hover:text-gray-800"
                  }
                `}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Avis */}
          <div>
            {filtered.length===0&&(
              <div className="text-center py-10 text-gray-400">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm">Aucun avis pour ces filtres</div>
              </div>
            )}
            {filtered.map((avis,i)=>(
              <div key={avis.id} className={`
                border-b transition-colors duration-200 hover:bg-gray-50
                ${i<filtered.length-1 ? "border-gray-100" : "border-none"}
              `}>
                <div className="p-5">

                      <div className="flex items-start gap-3 mb-3">
                        <div className={`
                          w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-base border
                          bg-gray-100 text-gray-600 border-gray-200
                        `}>
                          {(avis.nom_client || 'C')[0] || '?'}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-sm">{avis.nom_client || 'Client anonyme'}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200 font-mono">
                              {avis.service_type || 'Service'}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              {avis.date_avis ? new Date(avis.date_avis).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date inconnue'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Stars note={avis.note || 0} size={14}/>
                            <span className={`
                              text-xs font-bold font-mono
                              ${(avis.note || 0)>=4 ? "text-amber-500" : (avis.note || 0)===3 ? "text-blue-500" : "text-red-500"}
                            `}>
                              {avis.note || 0}/5
                            </span>
                          </div>
                        </div>

                    {/* Note badge grande */}
                    <div className={`
                      w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center text-lg font-black font-mono border
                      ${(avis.note || 0)>=4 ? "bg-amber-50 text-amber-500 border-amber-200" : 
                        (avis.note || 0)===3 ? "bg-blue-50 text-blue-500 border-blue-200" : 
                        "bg-red-50 text-red-500 border-red-200"}
                    `}>
                      {avis.note || 0}
                    </div>
                  </div>

                  {/* Commentaire */}
                  <div className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-4 ml-12 italic">
                    "{avis.commentaire || 'Pas de commentaire'}"
                  </div>

                  {/* Tags */}
                  {avis.tags && avis.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap ml-12 mt-2">
                      {safeArray(avis.tags).map(tag=>(
                        <span key={tag} className="text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Réponse artisan existante */}
                  {avis.reponse_artisan&&(
                    <div className="ml-12 mt-3 p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-lg border-l-3 border-l-brand-orange">
                      <div className="text-xs font-bold text-brand-orange mb-1.5 flex items-center gap-1.5">
                        <span>👷</span> Réponse de {artisan.prenom_artisan || ''} {artisan.nom_artisan || ''}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {avis.reponse_artisan}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
