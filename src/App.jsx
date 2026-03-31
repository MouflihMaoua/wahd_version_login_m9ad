import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './core/lib/react-query';
import { Toaster } from 'react-hot-toast';
import MainLayout from './shared/navbar/MainLayout';
import ProtectedRoute from "./shared/components/ProtectedRoute";
import ParticulierLayout from './shared/layouts/ParticulierLayout';
import ArtisanLayout from './shared/layouts/ArtisanLayout';
import PublicLayout from './shared/layouts/PublicLayout';
import { supabase } from './core/services/supabaseClient';
import AuthCallback from './shared/pages/AuthCallback';
import RegisterGoogle from './shared/pages/RegisterGoogle.jsx';
import RegisterArtisan from './shared/pages/RegisterArtisan.jsx';
import CreateDevis from './shared/pages/CreateDevis.jsx';
import DemandeInvitation from './shared/pages/DemandeInvitation.jsx'; 

import AdminLayout from './admin/layout/AdminLayout';
import AdminOverview from './admin/pages/OverviewPage';
import AdminArtisans from './admin/pages/ArtisansPage';
import AdminParticuliers from './admin/pages/ParticuliersPage';
import AdminDemandes from './admin/pages/DemandesPage';
import AdminDevis from './admin/pages/DevisPage';
import AdminAvis from './admin/pages/AvisPage';
import AdminModeration from './admin/pages/ModerationPage';
import AdminSettings from './admin/pages/SettingsPage';

// ── Pages publiques ───────────────────────────────────────
const Home          = lazy(() => import('./shared/pages/Home.jsx'));
const Search        = lazy(() => import('./shared/pages/Search.jsx'));
const SearchArtisan = lazy(() => import('./shared/pages/SearchArtisan.jsx'));
const ArtisanProfile = lazy(() => import('./shared/pages/ArtisanProfile.jsx'));
const ReputationPublic = lazy(() => import('./artisan/components/ReputationArtisanPublic'));

// ProfilArtisanPublic removed as route duplicate
import Login from './shared/pages/Login.jsx';
const RegisterManual = lazy(() => import('../auth/RegisterManual.jsx'));
const ForgotPassword = lazy(() => import('./shared/pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./shared/pages/ResetPassword.jsx'));
const Unauthorized = lazy(() => import('./shared/pages/Unauthorized.jsx'));

// ── Dashboards ────────────────────────────────────────────
const ClientDashboard  = lazy(() => import('./particulier/pages/DashboardClient'));
const ArtisanDashboard = lazy(() => import('./artisan/pages/Dashboard'));

// ── Todos Page (Test Supabase) ─────────────────────────────
function TodosPage() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos && todos.length > 0) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Liste des Todos</h2>
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li key={index} className="p-2 bg-gray-100 rounded">
            {JSON.stringify(todo)}
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="text-gray-500">Aucun todo trouvé</p>
      )}
    </div>
  )
}

// ── Loading screen ────────────────────────────────────────
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-brand-offwhite">
    <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>

              {/* ── Routes Publiques ────────────────────── */}
              <Route path="/" element={<Home />} />
              <Route path="/accueil" element={<Home />} />
              <Route path="/recherche" element={<PublicLayout><Search /></PublicLayout>} />
              <Route path="/artisan/:id" element={<PublicLayout><ArtisanProfile /></PublicLayout>} />
              <Route path="/artisan/:id/reputation" element={<PublicLayout><ReputationPublic /></PublicLayout>} />

              {/* Routes d'authentification - utilisent PublicLayout */}
              <Route path="/connexion" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/inscription" element={<PublicLayout><RegisterManual /></PublicLayout>} />
              <Route path="/inscription/artisan" element={<PublicLayout><RegisterArtisan /></PublicLayout>} />
              <Route path="/mot-de-passe-oublie" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
              <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />

              {/* ── Routes Particulier (utilisent ParticulierLayout) ───────────────────────── */}
              <Route path="/dashboard/particulier/*" element={
                <ProtectedRoute allowedRoles={['particulier']}>
                  <ParticulierLayout>
                    <ClientDashboard />
                  </ParticulierLayout>
                </ProtectedRoute>
              } />

              {/* Pages spécifiques Particulier - utilisent ParticulierLayout */}
              <Route path="/recherche-artisan" element={
                <ProtectedRoute allowedRoles={['particulier']}>
                  <ParticulierLayout>
                    <SearchArtisan />
                  </ParticulierLayout>
                </ProtectedRoute>
              } />
              <Route path="/mes-demandes" element={
                <ProtectedRoute allowedRoles={['particulier']}>
                  <ParticulierLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Mes demandes</h1>
                      <p>Cette page est en cours de développement.</p>
                    </div>
                  </ParticulierLayout>
                </ProtectedRoute>
              } />
              <Route path="/profil-particulier" element={
                <ProtectedRoute allowedRoles={['particulier']}>
                  <ParticulierLayout>
                    <Navigate to="/dashboard/particulier/profil" replace />
                  </ParticulierLayout>
                </ProtectedRoute>
              } />

              {/* ── Routes Artisan (utilisent ArtisanLayout) ───────────────────────── */}
              <Route path="/dashboard/artisan/*" element={
                <ProtectedRoute allowedRoles={['artisan']}>
                  <ArtisanLayout>
                    <ArtisanDashboard />
                  </ArtisanLayout>
                </ProtectedRoute>
              } />

              {/* Pages spécifiques Artisan - utilisent ArtisanLayout */}
              <Route path="/invitations" element={
                <ProtectedRoute allowedRoles={['artisan']}>
                  <ArtisanLayout>
                    <DemandeInvitation />
                  </ArtisanLayout>
                </ProtectedRoute>
              } />
              <Route path="/devis/creer" element={
                <ProtectedRoute allowedRoles={['artisan']}>
                  <ArtisanLayout>
                    <CreateDevis />
                  </ArtisanLayout>
                </ProtectedRoute>
              } />
              <Route path="/profil-artisane" element={
                <ProtectedRoute allowedRoles={['artisan']}>
                  <ArtisanLayout>
                    <Navigate to="/dashboard/artisan/profil" replace />
                  </ArtisanLayout>
                </ProtectedRoute>
              } />

              {/* callback Google */}
              <Route path="/register-google" element={<RegisterGoogle />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Unauthorized page */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* ── Admin (7rayfi) ───────────────────────── */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="artisans" element={<AdminArtisans />} />
                <Route path="particuliers" element={<AdminParticuliers />} />
                <Route path="demandes" element={<AdminDemandes />} />
                <Route path="devis" element={<AdminDevis />} />
                <Route path="avis" element={<AdminAvis />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="parametres" element={<AdminSettings />} />
              </Route>

              {/* ── Fallback ────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4aed88',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;