import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  Clock,
  AlertCircle,
  ChevronRight,
  Users,
  DollarSign,
  Briefcase,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Phone
} from 'lucide-react';
import { supabase } from '../../../core/services/supabaseClient';
import { useAuthStore } from '../../../core/store/useAuthStore';
import toast from 'react-hot-toast';

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-16 bg-gray-300 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
    <div className="h-48 flex items-end justify-between space-x-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex-1 bg-gray-200 rounded-t-lg" style={{ height: `${Math.random() * 100 + 20}%` }} />
      ))}
    </div>
  </div>
);

export default function ArtisanHome() {
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    demandes: 0,
    interventionsToday: 0,
    revenusMois: 0,
    noteMoyenne: 0,
    totalAvis: 0
  });
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [upcomingInterventions, setUpcomingInterventions] = useState([]);
  const [interventionDates, setInterventionDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { user } = useAuthStore();

  // Fetch dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Session non valide');
        return;
      }

      const userId = session.user.id;

      // Get artisan profile for online status
      const { data: artisanProfile } = await supabase
        .from('artisan')
        .select('disponibilite')
        .eq('id_artisan', userId)
        .single();
      
      if (artisanProfile) {
        setIsOnline(artisanProfile.disponibilite ?? true);
      }

      // Calculate date ranges
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfMonthISO = startOfMonth.toISOString();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      // Parallel data fetching with correct table names
      const [
        demandesResult,
        devisResult,
        evaluationResult,
        interventionsResult,
        upcomingResult
      ] = await Promise.all([
        // Count demandes from demande table
        supabase
          .from('demande')
          .select('*', { count: 'exact', head: true })
          .eq('id_artisan', userId),
        
        // Get devis for revenue calculation - current month
        supabase
          .from('devis')
          .select('montant_ttc, statut, created_at, date_acceptation')
          .eq('id_artisan', userId)
          .gte('created_at', startOfMonthISO),
        
        // Get evaluations for rating from evaluation table
        supabase
          .from('evaluation')
          .select('note, date_evaluation')
          .eq('id_artisan', userId),
        
        // Get interventions count for today/this month
        supabase
          .from('demande')
          .select('*', { count: 'exact' })
          .eq('id_artisan', userId)
          .eq('statut', 'accepté')
          .gte('date_demande', startOfMonthISO),
        
        // Get upcoming interventions (next 30 days)
        supabase
          .from('demande')
          .select(`
            id_demande,
            service,
            statut,
            date_demande,
            particulier:particulier(nom_particulier, prenom_particulier, telephone_particulier)
          `)
          .eq('id_artisan', userId)
          .eq('statut', 'accepté')
          .order('date_demande', { ascending: true })
          .limit(5)
      ]);

      // Calculate monthly revenue from accepted devis
      const totalRevenue = devisResult.data?.reduce((sum, d) => {
        return sum + (d.montant_ttc || 0);
      }, 0) || 0;

      // Calculate average rating from evaluation table
      const avgRating = evaluationResult.data?.length > 0
        ? evaluationResult.data.reduce((sum, a) => sum + (a.note || 0), 0) / evaluationResult.data.length
        : 0;

      // Set stats
      setStats({
        demandes: demandesResult.count || 0,
        interventionsToday: interventionsResult.count || 0,
        revenusMois: Math.round(totalRevenue),
        noteMoyenne: Math.round(avgRating * 10) / 10,
        totalAvis: evaluationResult.data?.length || 0
      });

      // Set upcoming interventions
      setUpcomingInterventions(upcomingResult.data || []);

      // Extract intervention dates for calendar
      const dates = upcomingResult.data?.map(d => new Date(d.date_demande)) || [];
      setInterventionDates(dates);

      // Calculate weekly revenue (last 7 days)
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        const dayRevenue = devisResult.data?.reduce((sum, d) => {
          const devisDate = new Date(d.created_at);
          return devisDate.toDateString() === date.toDateString()
            ? sum + (d.montant_ttc || 0)
            : sum;
        }, 0) || 0;
        return {
          jour: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
          montant: Math.round(dayRevenue),
          fullDate: date
        };
      });
      setWeeklyRevenue(weekData);

    } catch (err) {
      console.error('Error loading dashboard:', err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleToggleOnline = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('artisan')
          .update({ disponibilite: newStatus })
          .eq('id_artisan', session.user.id);
        
        if (error) throw error;
        
        toast.success(newStatus ? 'Vous êtes en ligne' : 'Vous êtes hors ligne');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Erreur lors de la mise à jour du statut');
      setIsOnline(!newStatus);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const isInterventionDate = (day) => {
    return interventionDates.some(date => 
      date.getDate() === day && 
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.montant), 1);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Chart Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header avec disponibilité */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.user_metadata?.prenom || user?.email?.split('@')[0] || 'Artisan'} 👋
          </h1>
          <p className="text-gray-600">Voici votre résumé du jour</p>
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          <span className="text-sm text-gray-600">Statut:</span>
          <button
            onClick={handleToggleOnline}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOnline ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOnline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </motion.div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Demandes reçues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.demandes}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Total
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interventions ce mois</p>
              <p className="text-2xl font-bold text-gray-900">{stats.interventionsToday}</p>
              <p className="text-xs text-gray-500 mt-1">Acceptées</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus du mois</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revenusMois.toLocaleString()} DH</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                Devis acceptés
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.noteMoyenne > 0 ? `${stats.noteMoyenne}/5` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalAvis} avis</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graphique revenus */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenus des 7 derniers jours</h2>
              <div className="text-sm text-gray-500">
                Total: {weeklyRevenue.reduce((sum, d) => sum + d.montant, 0).toLocaleString()} DH
              </div>
            </div>
            
            {weeklyRevenue.every(d => d.montant === 0) ? (
              <div className="h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucun revenu cette semaine</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-end justify-between space-x-2">
                {weeklyRevenue.map((jour, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ height: 0 }}
                    animate={{ height: `${(jour.montant / maxRevenue) * 150}px` }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <div 
                      className={`w-full rounded-t-lg transition-all ${
                        jour.montant > 0 
                          ? 'bg-gradient-to-t from-blue-500 to-blue-400 group-hover:from-blue-600 group-hover:to-blue-500' 
                          : 'bg-gray-200'
                      }`}
                      style={{ minHeight: jour.montant > 0 ? '4px' : '4px' }}
                    />
                    <p className="text-xs text-gray-600 mt-2 capitalize">{jour.jour}</p>
                    <p className="text-xs font-medium">{jour.montant} DH</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Interventions */}
          {upcomingInterventions.length > 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interventions à venir</h2>
              <div className="space-y-3">
                {upcomingInterventions.map((intervention, index) => (
                  <motion.div 
                    key={intervention.id_demande}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{intervention.service}</h3>
                      <p className="text-sm text-gray-500">
                        {intervention.particulier?.prenom_particulier} {intervention.particulier?.nom_particulier}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(intervention.date_demande).toLocaleDateString('fr-FR')}
                        </span>
                        {intervention.particulier?.telephone_particulier && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {intervention.particulier.telephone_particulier}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {intervention.statut}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Colonne droite - 1/3 */}
        <div className="space-y-6">
          {/* Calendrier */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date())}
                  className="p-1 hover:bg-gray-100 rounded text-xs"
                >
                  Aujourd'hui
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((jour, i) => (
                <div key={i} className="font-medium text-gray-500 py-1">{jour}</div>
              ))}
              
              {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="py-1" />
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const hasIntervention = isInterventionDate(day);
                const isTodayDate = isToday(day);
                
                return (
                  <div 
                    key={day}
                    className={`py-1 rounded-full text-sm cursor-pointer transition-all ${
                      isTodayDate 
                        ? 'bg-blue-600 text-white font-bold' 
                        : hasIntervention 
                          ? 'bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200' 
                          : 'hover:bg-gray-100'
                    }`}
                    title={hasIntervention ? 'Intervention programmée' : ''}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Aujourd'hui</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300" />
                <span>Intervention</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-2">
              <a 
                href="/dashboard/artisan/demandes"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Voir les demandes</span>
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </a>
              <a 
                href="/dashboard/artisan/devis"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Gérer mes devis</span>
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </a>
              <a 
                href="/dashboard/artisan/avis"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Voir mes avis</span>
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
