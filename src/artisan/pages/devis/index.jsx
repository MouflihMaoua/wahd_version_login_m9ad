// src/pages/artisan/devis/index.jsx
import { useState, useEffect } from 'react';
import {
  Search, Filter, FileText, Download, Send, Calendar, User,
  Mail, Phone, MapPin, Clock, Edit, Trash2, Eye, Plus, X, XCircle, Loader2
} from 'lucide-react';
import { supabase } from '../../../core/services/supabaseClient';
import { SERVICES_ARTISAN } from '../../../core/constants/services';

// ─── Helpers ──────────────────────────────────────────────────
const STATUS_COLORS = {
  brouillon: 'bg-gray-100 text-gray-700',
  envoyé:    'bg-blue-100 text-blue-700',
  accepté:   'bg-green-100 text-green-700',
  refusé:    'bg-red-100 text-red-700',
  expiré:    'bg-orange-100 text-orange-700',
};

const emptyNewDevis = {
  nom_particulier: '',
  adresse:         '',
  telephone:       '',
  email:           '',
  service:         '',
  description:     '',
  prix:            '',
  delai:           '',
  notes:           '',
};

// ══════════════════════════════════════════════════════════════
export default function DevisPage() {
  const [devisList,      setDevisList]      = useState([]);
  const [selectedDevis,  setSelectedDevis]  = useState(null);
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [searchTerm,     setSearchTerm]     = useState('');
  const [filterStatus,   setFilterStatus]   = useState('tous');
  const [newDevis,       setNewDevis]       = useState(emptyNewDevis);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState('');
  const [userId,         setUserId]         = useState(null);

  // ── Chargement ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: session } = await supabase.auth.getSession();
        const uid = session?.session?.user?.id;
        if (!uid) { setError('Utilisateur non connecté.'); return; }
        setUserId(uid);

        const { data, error: err } = await supabase
          .from('devis')
          .select('*')
          .eq('id_artisan', uid)
          .order('created_at', { ascending: false });

        if (err) throw err;
        setDevisList(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Créer un devis ──
  const handleAddDevis = async () => {
    if (!newDevis.nom_particulier || !newDevis.adresse || !newDevis.service || !newDevis.prix) return;

    try {
      setSaving(true);
      const prix = parseFloat(newDevis.prix);

      const { data, error: err } = await supabase
        .from('devis')
        .insert({
          id_artisan:      userId,
          nom_particulier: newDevis.nom_particulier,
          adresse:         newDevis.adresse,
          telephone:       newDevis.telephone,
          email:           newDevis.email,
          service:         newDevis.service,
          description:     newDevis.description || `Service de ${newDevis.service}`,
          notes:           newDevis.notes,
          delai:           newDevis.delai || 'À définir',
          montant_ht:      prix,
          montant_ttc:     prix * 1.2,
          date_validite:   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          articles: [{
            description:  newDevis.service,
            quantite:     1,
            prixUnitaire: prix,
            total:        prix,
          }],
          statut: 'brouillon',
        })
        .select()
        .single();

      if (err) throw err;
      setDevisList(prev => [data, ...prev]);
      setNewDevis(emptyNewDevis);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Changer statut ──
  const handleChangeStatut = async (id, statut) => {
    try {
      const { error: err } = await supabase
        .from('devis')
        .update({ statut })
        .eq('id', id);
      if (err) throw err;
      setDevisList(prev => prev.map(d => d.id === id ? { ...d, statut } : d));
      if (selectedDevis?.id === id) setSelectedDevis(prev => ({ ...prev, statut }));
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Supprimer ──
  const handleSupprimer = async (id) => {
    if (!confirm('Supprimer ce devis ?')) return;
    try {
      const { error: err } =await supabase.from('devis')
                              .update({
                                deleted_at: new Date().toISOString(),
                                deleted_by: userId,
                              })
                              .eq('id', id);
      if (err) throw err;
      setDevisList(prev => prev.filter(d => d.id !== id));
      if (selectedDevis?.id === id) setSelectedDevis(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Filtrage ──
  const filtered = devisList.filter(d => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (d.nom_particulier ?? '').toLowerCase().includes(q) ||
      (d.service          ?? '').toLowerCase().includes(q) ||
      (d.numero           ?? '').toLowerCase().includes(q);
    const matchStatus = filterStatus === 'tous' || d.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Loading / Error ──
  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
          <p className="text-gray-600">Gérez vos devis et estimations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau devis
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="tous">Tous les statuts</option>
          <option value="brouillon">Brouillons</option>
          <option value="envoyé">Envoyés</option>
          <option value="accepté">Acceptés</option>
          <option value="refusé">Refusés</option>
          <option value="expiré">Expirés</option>
        </select>
      </div>

      {/* Liste */}
      <div className="grid gap-4">
        {filtered.map((devis) => (
          <div key={devis.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{devis.numero}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[devis.statut] ?? STATUS_COLORS.brouillon}`}>
                    {devis.statut}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <User className="h-4 w-4" />{devis.nom_particulier}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FileText className="h-4 w-4" />{devis.service}
                  </div>
                  {devis.adresse && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />{devis.adresse}
                    </div>
                  )}
                  {devis.telephone && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="h-4 w-4" />{devis.telephone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="h-4 w-4" />
                    Créé: {new Date(devis.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  {devis.date_validite && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4" />
                      Valide jusqu'au: {new Date(devis.date_validite).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>HT: <strong>{devis.montant_ht} DH</strong></span>
                  <span>TVA: <strong>{devis.tva}%</strong></span>
                  <span>TTC: <strong className="text-green-600">{devis.montant_ttc} DH</strong></span>
                </div>
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={() => setSelectedDevis(devis)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Eye className="h-4 w-4" />Voir
                </button>

                {devis.statut === 'brouillon' && (
                  <button
                    onClick={() => handleChangeStatut(devis.id, 'envoyé')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <Send className="h-4 w-4" />Envoyer
                  </button>
                )}

                <button
                  onClick={() => handleSupprimer(devis.id)}
                  className="px-3 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm"
                >
                  <Trash2 className="h-4 w-4" />Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          {devisList.length === 0 ? 'Aucun devis créé pour le moment.' : 'Aucun devis trouvé.'}
        </div>
      )}

      {/* ── Modal Nouveau Devis ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Nouveau Devis</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du particulier *</label>
                <input type="text" value={newDevis.nom_particulier} onChange={(e) => setNewDevis(p => ({ ...p, nom_particulier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Nom complet" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="text" value={newDevis.telephone} onChange={(e) => setNewDevis(p => ({ ...p, telephone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="06XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={newDevis.email} onChange={(e) => setNewDevis(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="email@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <input type="text" value={newDevis.adresse} onChange={(e) => setNewDevis(p => ({ ...p, adresse: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Adresse du client" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                <select value={newDevis.service} onChange={(e) => setNewDevis(p => ({ ...p, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Sélectionnez un service</option>
                  {SERVICES_ARTISAN.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newDevis.description} onChange={(e) => setNewDevis(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" placeholder="Décrivez le travail à effectuer" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT (DH) *</label>
                  <input type="number" value={newDevis.prix} onChange={(e) => setNewDevis(p => ({ ...p, prix: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="0" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Délai</label>
                  <input type="text" value={newDevis.delai} onChange={(e) => setNewDevis(p => ({ ...p, delai: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="ex: 2 jours" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" value={newDevis.notes} onChange={(e) => setNewDevis(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Notes additionnelles" />
              </div>

              {newDevis.prix && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                  <p>Montant HT: <strong>{parseFloat(newDevis.prix || 0).toFixed(2)} DH</strong></p>
                  <p>TVA (20%): <strong>{(parseFloat(newDevis.prix || 0) * 0.2).toFixed(2)} DH</strong></p>
                  <p>Montant TTC: <strong className="text-green-600">{(parseFloat(newDevis.prix || 0) * 1.2).toFixed(2)} DH</strong></p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button
                onClick={handleAddDevis}
                disabled={saving || !newDevis.nom_particulier || !newDevis.adresse || !newDevis.service || !newDevis.prix}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Créer le devis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Détails Devis ── */}
      {selectedDevis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{selectedDevis.numero}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selectedDevis.statut]}`}>
                  {selectedDevis.statut}
                </span>
              </div>
              <button onClick={() => setSelectedDevis(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <XCircle className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informations particulier</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{selectedDevis.nom_particulier}</p>
                  {selectedDevis.adresse   && <p>{selectedDevis.adresse}</p>}
                  {selectedDevis.telephone && <p>{selectedDevis.telephone}</p>}
                  {selectedDevis.email     && <p>{selectedDevis.email}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informations devis</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Service: <strong>{selectedDevis.service}</strong></p>
                  <p>Créé le: <strong>{new Date(selectedDevis.created_at).toLocaleDateString('fr-FR')}</strong></p>
                  {selectedDevis.date_validite && (
                    <p>Valide jusqu'au: <strong>{new Date(selectedDevis.date_validite).toLocaleDateString('fr-FR')}</strong></p>
                  )}
                  {selectedDevis.delai && <p>Délai: <strong>{selectedDevis.delai}</strong></p>}
                </div>
              </div>
            </div>

            {selectedDevis.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedDevis.description}</p>
                {selectedDevis.notes && (
                  <p className="text-sm text-gray-500 mt-2"><strong>Notes:</strong> {selectedDevis.notes}</p>
                )}
              </div>
            )}

            {selectedDevis.articles?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Détail des articles</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Description</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-900">Qté</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-900">P.U</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDevis.articles.map((a, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-sm">{a.description}</td>
                          <td className="px-4 py-2 text-sm text-center">{a.quantite}</td>
                          <td className="px-4 py-2 text-sm text-right">{a.prixUnitaire} DH</td>
                          <td className="px-4 py-2 text-sm text-right font-medium">{a.total} DH</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-sm font-medium">Total HT:</td>
                        <td className="px-4 py-2 text-sm font-medium text-right">{selectedDevis.montant_ht} DH</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-sm font-medium">TVA ({selectedDevis.tva}%):</td>
                        <td className="px-4 py-2 text-sm font-medium text-right">
                          {(selectedDevis.montant_ttc - selectedDevis.montant_ht).toFixed(2)} DH
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-300">
                        <td colSpan="3" className="px-4 py-2 text-sm font-bold">Total TTC:</td>
                        <td className="px-4 py-2 text-sm font-bold text-right text-green-600">{selectedDevis.montant_ttc} DH</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {selectedDevis.statut === 'brouillon' && (
                <button
                  onClick={() => handleChangeStatut(selectedDevis.id, 'envoyé')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />Envoyer au particulier
                </button>
              )}
              {selectedDevis.statut === 'envoyé' && (
                <button
                  onClick={() => handleChangeStatut(selectedDevis.id, 'accepté')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  Marquer comme accepté
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}