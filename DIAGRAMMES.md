# 🎨 DIAGRAMMES VISUELS - ArtisanConnect

---

## 1. USER FLOW DIAGRAM

```
┌─────────────────────┐
│   LANDING PAGE      │
│   (Accueil)         │
└──────────┬──────────┘
           │
      ┌────┴────┐
      ▼         ▼
   LOGIN    REGISTER
      │         │
   ┌──┴─────────┴──┐
   ▼  AUTH STORE  ▼
   │  (Zustand)   │
   │ (localStorage)│
   └──────┬────────┘
          │
    ┌─────┴──────────┐
    │ Redirect based │
    │ on role:       │
    └─────┬──────────┘
          │
    ┌─────┼───────────┐
    ▼     ▼           ▼
 CLIENT ARTISAN    ADMIN
  │      │         │
  ▼      ▼         ▼
 DASH   DASH      DASH
 (particulier)
```

---

## 2. COMPONENT TREE

```
App.jsx
├── QueryClientProvider
└── Router
    ├── Suspense
    └── Routes
        ├── MainLayout
        │   ├── Navbar (public)
        │   ├── Home/Search/etc
        │   └── Footer
        │
        ├── ProtectedRoute (client)
        │   └── Dashboard_Modern
        │       ├── Sidebar_Modern
        │       └── Routes
        │           ├── ProfilView
        │           ├── MissionsView
        │           └── MessagesView
        │
        ├── ProtectedRoute (artisan)
        │   └── ArtisanDashboard
        │       ├── NavbarArtisan
        │       └── Routes
        │           ├── ArtisanHome
        │           ├── ArtisanDemands
        │           ├── ArtisanMessages
        │           └── ArtisanReviews
        │
        └── ProtectedRoute (admin)
            └── AdminDashboard
                └── Routes
                    └── AdminHome
```

---

## 3. STATE MANAGEMENT FLOW

```
┌──────────────────┐
│   Component A    │
└────────┬─────────┘
         │ dispatch action
         ▼
┌─────────────────────────┐
│  useAuthStore(Zustand)  │
├─────────────────────────┤
│ state:                  │
│  - user: {id, role...}  │
│  - token: JWT           │
│  - isAuthenticated      │
│  - role: client/artisan │
├─────────────────────────┤
│ actions:                │
│  - setAuth()            │
│  - logout()             │
│  - updateUser()         │
└────────┬────────────────┘
         │ subscribe & update
         ▼
┌──────────────────┐
│  Component B     │
│  (automatic      │
│   re-render)     │
└──────────────────┘
         │
         └──► localStorage
              (persistence)
```

---

## 4. AUTHENTICATION FLOW

```
┌──────────────┐
│ Login.jsx    │
└──────┬───────┘
       │ form submit
       ▼
  ┌─────────────┐
  │ API Call    │
  │ (mocked)    │
  └──────┬──────┘
         │
         ▼
    ┌─────────────────┐
    │ setAuth()       │
    │ from store      │
    └────────┬────────┘
             │
    ┌────────▼──────────┐
    │ Zustand State:    │
    │ - user set        │
    │ - token set       │
    │ - role set        │
    │ - auth = true     │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │ persist to        │
    │ localStorage      │
    │ (key: artisan-    │
    │  connect-auth)    │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │ React Router      │
    │ navigates to      │
    │ /dashboard/...    │
    └────────┬──────────┘
             │
             ▼
    ┌─────────────────┐
    │ ProtectedRoute  │
    │ checks role     │
    │ ✅ Allow if OK  │
    │ ❌ Redirect     │
    └─────────────────┘
```

---

## 5. DATA FETCHING ARCHITECTURE

```
┌──────────────┐
│  Component   │
│  (useQuery)  │
└──────┬───────┘
       │ queryKey: ['artisans']
       ▼
  ┌────────────────────┐
  │ React Query Cache  │
  ├────────────────────┤
  │ Has cached data?   │
  └──┬────────────────┬┘
     │ YES             │ NO
     ▼                 ▼
  Return Cached   Make API Call
  (stale=true)    (Axios/Fetch)
     │                 │
     │      ┌──────────┘
     │      ▼
     │   ┌──────────────┐
     │   │ API Response │
     │   │ (mocked now) │
     │   └──────┬───────┘
     │          │
     └──────┬───┘
            ▼
     ┌─────────────────┐
     │ Component State │
     │ data = response │
     │ isLoading=false │
     └─────────────────┘
            │
            ▼
       UI Re-render
```

---

## 6. FORM VALIDATION FLOW

```
┌─────────────────────┐
│  Form Component     │
│ (Register.jsx)      │
└──────────┬──────────┘
           │
    ┌──────▼──────────┐
    │ useForm hook    │
    │ + zodResolver   │
    └──────┬──────────┘
           │
    ┌──────▼──────────────────┐
    │ User Types Input        │
    │ onChange event fired    │
    └──────┬──────────────────┘
           │
    ┌──────▼──────────────────┐
    │ Zod Schema Validation   │
    │ Real-time validation    │
    │ (as user types)         │
    └──────┬──────────────────┘
           │
    ┌──────┴─────────────────────┐
    ▼ Valid                      ▼ Invalid
 ┌─────────────┐           ┌──────────────┐
 │ Show green  │           │ Show error   │
 │ Remove icon │           │ in red text  │
 │ Enable btn  │           │ Disable btn  │
 └────┬────────┘           └──────┬───────┘
      │                           │
      │              ┌────────────┘
      │              │
      │    User fixes
      │    (re-validate)
      │              │
      └──────────────┘
             │
      ┌──────▼──────────┐
      │ form.handleSubmit
      │ fires onSubmit()
      └──────┬──────────┘
             │
      ┌──────▼──────────┐
      │ API Call        │
      │ + Error Catch   │
      │ + Toast notify  │
      └─────────────────┘
```

---

## 7. ROUTING PROTECTION

```
User navigates to:
/dashboard/artisan
       │
       ▼
React Router
match route
       │
       ▼
┌──────────────────────────┐
│ ProtectedRoute Component │
└──────────┬───────────────┘
           │
    ┌──────▼──────────────┐
    │ Check Auth Store:   │
    │ isAuthenticated?    │
    └──┬──────────────┬───┘
       │ NO             │ YES
       ▼                ▼
   Redirect         ┌─────────────────┐
   to /connexion    │ Check role in  │
                    │ allowedRoles?  │
                    └──┬──────────┬───┘
                       │ NO       │ YES
                       ▼         ▼
                    Redirect   ✅ ALLOW
                    to /dash   Render
                    board/     Children
                    client
```

---

## 8. RESPONSIVE DESIGN BREAKPOINTS

```
Mobile-First Approach (Tailwind):

Default (0px)    sm(640px)   md(768px)    lg(1024px)   xl(1280px)
┌──────────────┬──────────┬──────────┬──────────┬──────────┐
│   Phone      │ Tablet   │  Small   │ Desktop  │ HD Desk  │
│   320-639    │ (land)   │  Laptop  │ Monitor  │ Monitor  │
│              │          │          │          │          │
│ 1 column     │ 2 cols   │ 2-3 cols │ 4-12 col │ 12+ col  │
│ Stack vert   │ partial  │ balance  │ optimal  │ optimal  │
│              │ stack    │          │          │          │
└──────────────┴──────────┴──────────┴──────────┴──────────┘

Usage:
<div className="
  w-full                 // default full width
  sm:w-1/2              // 50% from 640px
  md:w-1/3              // 33% from 768px
  lg:w-1/4              // 25% from 1024px
">
```

---

## 9. FILE SYSTEM STRUCTURE

```
projet_pfe_0/
│
├─ src/
│  ├─ pages/
│  │  ├─ public/
│  │  │  ├─ Home.jsx (hero + sections)
│  │  │  ├─ Search.jsx
│  │  │  ├─ SearchArtisan.jsx
│  │  │  ├─ ArtisanProfile.jsx
│  │  │  ├─ Login.jsx
│  │  │  └─ Register.jsx
│  │  │
│  │  ├─ client/ (legacy)
│  │  │  └─ Dashboard.jsx (old version)
│  │  │
│  │  ├─ particulier/ (new - use this)
│  │  │  ├─ DashboardClient.jsx
│  │  │  ├─ ProfilView_Modern.jsx
│  │  │  ├─ MissionsView_Modern.jsx
│  │  │  └─ MessagesView_Modern.jsx
│  │  │
│  │  ├─ artisan/
│  │  │  ├─ Dashboard/index.jsx
│  │  │  ├─ demandes/
│  │  │  ├─ messages/
│  │  │  ├─ avis/
│  │  │  ├─ profil/
│  │  │  ├─ calendrier/
│  │  │  ├─ revenus/
│  │  │  └─ devis/
│  │  │
│  │  └─ admin/
│  │     └─ Dashboard.jsx
│  │
│  ├─ components/
│  │  ├─ common/ (shared UI)
│  │  ├─ dashboard/ (stats/cards)
│  │  ├─ artisan/ (artisan-specific)
│  │  ├─ client/ (client-specific)
│  │  ├─ ui/ (13 small components)
│  │  ├─ sections/ (homepage sections)
│  │  ├─ profil/ (profile editing)
│  │  ├─ layout/
│  │  └─ SEO/
│  │
│  ├─ store/
│  │  └─ useAuthStore.js (Zustand)
│  │
│  ├─ lib/
│  │  ├─ react-query.js
│  │  └─ utils.js
│  │
│  ├─ hooks/
│  │  └─ useToast.js
│  │
│  ├─ i18n/
│  │  └─ config.js (FR/AR setup)
│  │
│  ├─ utils/
│  │  └─ cn.js (Tailwind merge)
│  │
│  ├─ constants/
│  │  └─ theme.js (colors + fonts)
│  │
│  ├─ data/
│  │  └─ profilMock.js (fake data)
│  │
│  ├─ App.jsx (main router)
│  ├─ main.jsx (entry point)
│  └─ index.css (global styles)
│
├─ public/
│  └─ vite.svg
│
├─ Configuration:
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  ├─ eslint.config.js
│  └─ index.html
│
└─ Documentation:
   ├─ 00_LIRE_D_ABORD.md (this meta-doc)
   ├─ INDEX.md (navigation guide)
   ├─ RESUME_EXECUTIF.md (executive summary)
   ├─ ARCHITECTURE_TECHNIQUE.md (technical deep-dive)
   ├─ GUIDE_LIBRAIRIES.md (dependencies guide)
   ├─ ANALYSE_PROJET.md (complete analysis)
   └─ DIAGRAMMES.md (this file)
```

---

## 10. REQUEST/RESPONSE CYCLE (When Backend Ready)

```
┌─────────────────┐
│  React Component│
└────────┬────────┘
         │ onClick / onChange
         ▼
┌──────────────────────┐
│  Axios/Fetch API     │
│  POST /api/auth/     │
│  login               │
└────────┬─────────────┘
         │ Network
         ▼
┌──────────────────────┐
│  Backend Server      │
│  (Laravel/Node)      │
│  ├─ Authenticate     │
│  ├─ Check password   │
│  ├─ Generate JWT     │
│  └─ Return token     │
└────────┬─────────────┘
         │ Network
         ▼
┌──────────────────────┐
│  Axios Interceptor   │
│  Extract JWT token   │
│  Store in Zustand    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  All Future Requests │
│  Include header:     │
│  Authorization:      │
│  Bearer {JWT}        │
└──────────────────────┘
```

---

## 11. ANIMATION TIMING

```
Component Mounts
    │
    ▼
initial state
opacity: 0
y: 20px
    │
    ▼ (0ms)
animation starts
    │
    ▼ (100ms)
opacity: 0.5
y: 10px
    │
    ▼ (300ms)
opacity: 1
y: 0px (final state)
    │
    ▼ (600ms)
animation complete
Component fully visible
└─► User can interact
```

---

## 12. I18n Language Switching

```
Component with useTranslation()
    │
    ├─ t('welcome')
    │  ├─ IF lng === 'fr' → "Bienvenue"
    │  └─ IF lng === 'ar' → "مرحبًا"
    │
    │
    ├─ i18n.changeLanguage('ar')
    │  │
    │  └─► Trigger re-render
    │       └─► Update all t() calls
    │
    └─ HTML lang & dir attributes
       ├─ <html lang="ar" dir="rtl">
       └─ <html lang="fr" dir="ltr">
```

---

## 13. ERROR HANDLING FLOW

```
User Action (Form Submit)
    │
    ▼
Try API Call
    │
    ├─ Success
    │  └─► setState(data)
    │      └─► Re-render
    │          └─► toast.success()
    │
    └─ Error
       ├─ Network error
       │  └─► toast.error('No connection')
       │
       ├─ Auth error (401)
       │  └─► Redirect /connexion
       │      └─► Clear auth store
       │
       ├─ Validation error
       │  └─► toast.error(error.message)
       │      └─► Highlight field
       │
       └─ Server error (500)
          └─► toast.error('Server error')
             └─► Log to console
```

---

## 14. MODAL/DIALOG FLOW

```
Click "Book Artisan"
    │
    ▼
setShowModal(true)
    │
    ▼
Component conditionally renders:
{isOpen && (
  <AnimatePresence>
    <motion.div initial={{opacity:0}} exit={{opacity:0}}>
      <ReservationModal />
    </motion.div>
  </AnimatePresence>
)}
    │
    ▼
Modal becomes visible
User fills form
    │
    ▼
User clicks "Submit"
    │
    ▼
Validation + API call
    │
    ├─ Success
    │  └─► Close modal
    │      └─► Refresh list
    │          └─► toast.success()
    │
    └─ Error
       └─► Keep modal open
          └─► Show error in form
             └─► Highlight fields
```

---

## 15. DEPLOYMENT ARCHITECTURE (Target)

```
┌─────────────────────────────────────┐
│        CLIENT BROWSER               │
│     (React SPA running)             │
└────────────────┬────────────────────┘
                 │ HTTP/HTTPS
                 ▼
        ┌────────────────────┐
        │  CDN (Cloudflare)  │
        │  - Static assets   │
        │  - Cache busting   │
        └────────┬───────────┘
                 │ HTTPS
                 ▼
    ┌────────────────────────┐
    │  Frontend Server       │
    │  (Vercel/Netlify)      │
    │  - React SPA           │
    │  - Build artifacts     │
    │  - Static files        │
    └────────┬───────────────┘
             │ API calls
             │ (axios)
             ▼
    ┌────────────────────────┐
    │  Backend Server        │
    │  (Heroku/Linode)       │
    │  - Laravel/Node.js     │
    │  - JWT auth            │
    │  - REST API            │
    │  - socket.io           │
    └────────┬───────────────┘
             │ SQL queries
             ▼
    ┌────────────────────────┐
    │  Database              │
    │  (MySQL/PostgreSQL)    │
    │  - Users               │
    │  - Artisans            │
    │  - Reservations        │
    │  - Messages            │
    └────────────────────────┘
```

---

**Fin des diagrammes**

Pour plus de détails, consulter les autres documents de la documentation.
