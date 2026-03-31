import { supabase } from '../../core/services/supabaseClient';

const ORDER_RECENT = { ascending: false };

export async function fetchCounts() {
  const results = await Promise.all([
    supabase.from('artisan').select('*', { count: 'exact', head: true }),
    supabase.from('particulier').select('*', { count: 'exact', head: true }),
    supabase.from('invitations').select('*', { count: 'exact', head: true }),
    supabase.from('devis').select('*', { count: 'exact', head: true }),
    supabase
      .from('artisan')
      .select('*', { count: 'exact', head: true })
      .eq('statut_validation', false),
    supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('statut', 'en attente'),
  ]);

  const er = results.find((r) => r.error);
  if (er?.error) throw new Error(er.error.message);

  return {
    artisans: results[0].count ?? 0,
    particuliers: results[1].count ?? 0,
    demandes: results[2].count ?? 0,
    devis: results[3].count ?? 0,
    pendingArtisans: results[4].count ?? 0,
    pendingDemandes: results[5].count ?? 0,
  };
}

export async function fetchRecentActivity() {
  let inv = await supabase
    .from('invitations')
    .select('id, service, statut, created_at, id_particulier, id_artisan')
    .is('deleted_at', null)
    .order('created_at', ORDER_RECENT)
    .limit(12);

  if (inv.error) {
    inv = await supabase
      .from('invitations')
      .select('id, service, statut, created_at, id_particulier, id_artisan')
      .order('created_at', ORDER_RECENT)
      .limit(12);
  }

  const dev = await supabase
    .from('devis')
    .select('id, statut, service, montant_ttc, date_creation, created_at, id_artisan, numero_devis')
    .order('created_at', ORDER_RECENT)
    .limit(12);

  if (inv.error) throw new Error(inv.error.message);
  if (dev.error) throw new Error(dev.error.message);

  const act = [
    ...(inv.data ?? []).map((r) => ({
      kind: 'invitation',
      id: r.id,
      label: `Invitation · ${r.service ?? '—'}`,
      meta: r.statut,
      at: r.created_at,
    })),
    ...(dev.data ?? []).map((r) => ({
      kind: 'devis',
      id: r.id,
      label: `Devis · ${r.service ?? r.numero_devis ?? '—'}`,
      meta: r.statut,
      at: r.date_creation ?? r.created_at,
    })),
  ];

  act.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
  return act.slice(0, 15);
}

export async function fetchArtisans({ page = 0, pageSize = 12, search = '' }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from('artisan')
    .select('*', { count: 'exact' })
    .order('created_at', ORDER_RECENT)
    .range(from, to);

  if (search.trim()) {
    const raw = search.trim().replace(/,/g, '');
    const t = `%${raw}%`;
    q = q.or(`email.ilike.${t},nom.ilike.${t},prenom.ilike.${t},metier.ilike.${t},specialite.ilike.${t},cin.ilike.${t}`);
  }

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

export async function updateArtisanValidation(id_artisan, statut_validation) {
  const { error } = await supabase
    .from('artisan')
    .update({ statut_validation })
    .eq('id_artisan', id_artisan);
  if (error) throw new Error(error.message);
}

export async function fetchParticuliers({ page = 0, pageSize = 12, search = '', suspendedOnly = false }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from('particulier')
    .select('*', { count: 'exact' })
    .order('id_particulier', ORDER_RECENT)
    .range(from, to);

  if (suspendedOnly) {
    q = q.eq('compte_suspendu', true);
  }

  if (search.trim()) {
    const raw = search.trim().replace(/,/g, '');
    const t = `%${raw}%`;
    q = q.or(`email_particulier.ilike.${t},nom_particulier.ilike.${t},prenom_particulier.ilike.${t},ville.ilike.${t}`);
  }

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

export async function setParticulierSuspended(id_particulier, compte_suspendu) {
  const { error } = await supabase
    .from('particulier')
    .update({ compte_suspendu })
    .eq('id_particulier', id_particulier);
  if (error) throw new Error(error.message);
}

export async function deleteParticulier(id_particulier) {
  const { error } = await supabase.from('particulier').delete().eq('id_particulier', id_particulier);
  if (error) throw new Error(error.message);
}

export async function fetchInvitations({ page = 0, pageSize = 15, statut = 'tous', search = '' }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from('invitations')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', ORDER_RECENT)
    .range(from, to);

  if (statut !== 'tous') {
    q = q.eq('statut', statut);
  }

  if (search.trim()) {
    q = q.ilike('service', `%${search.trim()}%`);
  }

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

export async function fetchDevisList({ page = 0, pageSize = 12, statut = 'tous', search = '' }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  try {
    let q = supabase
      .from('devis')
      .select('id, service, description, statut, montant_ttc, id_artisan, id_particulier, date_creation, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (statut !== 'tous') {
      q = q.eq('statut', statut);
    }

    if (search.trim()) {
      const t = `%${search.trim()}%`;
      q = q.or(`service.ilike.${t},description.ilike.${t}`);
    }

    const { data, error, count } = await q;
    
    if (error) {
      console.error('Erreur fetchDevisList:', error);
      throw new Error(error.message);
    }
    
    console.log('Devis récupérés:', data?.length || 0, 'Total:', count);
    return { rows: data ?? [], total: count ?? 0 };
  } catch (err) {
    console.error('Exception fetchDevisList:', err);
    throw err;
  }
}

export async function fetchAvisList({ page = 0, pageSize = 15, search = '' }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from('evaluation')
    .select(`
      id_evaluation,
      id_artisan,
      id_particulier,
      note,
      commentaire,
      date_evaluation,
      particulier:particulier(nom_particulier, prenom_particulier, email_particulier)
    `, { count: 'exact' })
    .order('date_evaluation', ORDER_RECENT)
    .range(from, to);

  if (search.trim()) {
    const t = `%${search.trim()}%`;
    q = q.or(`commentaire.ilike.${t},particulier.nom_particulier.ilike.${t},particulier.prenom_particulier.ilike.${t}`);
  }

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);
  
  // Transform data to match expected format
  const rows = (data ?? []).map(item => ({
    id: item.id_evaluation,
    id_artisan: item.id_artisan,
    id_particulier: item.id_particulier,
    note: item.note,
    commentaire: item.commentaire,
    date_avis: item.date_evaluation,
    nom_client: item.particulier 
      ? `${item.particulier.prenom_particulier || ''} ${item.particulier.nom_particulier || ''}`.trim()
      : 'Anonyme',
    email_client: item.particulier?.email_particulier,
    service_type: 'Service', // Default since evaluation doesn't have service field
    created_at: item.date_evaluation
  }));
  
  return { rows, total: count ?? 0 };
}

export async function deleteAvis(id) {
  const { error } = await supabase.from('evaluation').delete().eq('id_evaluation', id);
  if (error) throw new Error(error.message);
}

export async function fetchReports({ page = 0, pageSize = 15, statut = 'tous' }) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from('content_reports')
    .select('*', { count: 'exact' })
    .order('created_at', ORDER_RECENT)
    .range(from, to);

  if (statut !== 'tous') {
    q = q.eq('statut', statut);
  }

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

export async function updateReportStatut(id, statut) {
  const { error } = await supabase
    .from('content_reports')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function insertReport(payload) {
  const row = {
    ...payload,
    target_id: payload.target_id && String(payload.target_id).trim() ? payload.target_id : null,
  };
  const { error } = await supabase.from('content_reports').insert([row]);
  if (error) throw new Error(error.message);
}

/** Distribution for mini charts */
export async function fetchDevisStatutDistribution() {
  const { data, error } = await supabase.from('devis').select('statut');
  if (error) throw new Error(error.message);
  const map = {};
  (data ?? []).forEach((r) => {
    const k = r.statut ?? '—';
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
}

export async function fetchInvitationStatutDistribution() {
  const { data, error } = await supabase.from('invitations').select('statut').is('deleted_at', null);
  if (error) throw new Error(error.message);
  const map = {};
  (data ?? []).forEach((r) => {
    const k = r.statut ?? '—';
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
}
