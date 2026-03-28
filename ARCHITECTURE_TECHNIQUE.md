# 🏗️ ARCHITECTURE TECHNIQUE DÉTAILLÉE - ArtisanConnect

---

## 📊 DIAGRAMME ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)               │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   PUBLIC     │  │   PROTECTED  │  │    ADMIN     │  │
│  │   ROUTES     │  │   ROUTES     │  │   ROUTES     │  │
│  │              │  │              │  │              │  │
│  │ - Home       │  │ - Client     │  │ - Dashboard  │  │
│  │ - Search     │  │   Dashboard  │  │ - Users Mgmt │  │
│  │ - Login      │  │ - Artisan    │  │ - Analytics  │  │
│  │ - Register   │  │   Dashboard  │  │              │  │
│  │ - Profiles   │  │ - Messaging  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                  │           │
│         └─────────────────┼──────────────────┘           │
│                           ↓                               │
│                   ┌──────────────┐                        │
│                   │   ROUTER     │                        │
│                   │  React Router│                        │
│                   │   v7.13.0    │                        │
│                   └──────────────┘                        │
│                           │                               │
│         ┌─────────────────┼─────────────────┐             │
│         ↓                 ↓                 ↓             │
│    ┌─────────┐     ┌─────────┐      ┌────────────┐      │
│    │   UI    │     │  STATE  │      │   DATA     │      │
│    │Components│     │ MANAGEMENT│    │  FETCHING  │      │
│    │         │     │         │      │            │      │
│    │·Navbar  │     │·Zustand │      │·React Query│      │
│    │·Sidebar │     │·Auth    │      │·Axios      │      │
│    │·Forms   │     │·Store   │      │·Mock Data  │      │
│    │·Cards   │     │         │      │            │      │
│    └─────────┘     └─────────┘      └────────────┘      │
│         │                                   │             │
│         └─────────────────┬──────────────────┘             │
│                           ↓                               │
│       ┌──────────────────────────────────┐                │
│       │     STYLING & ANIMATIONS         │                │
│       │                                  │                │
│       │ ·Tailwind CSS (utility-first)   │                │
│       │ ·Framer Motion (animations)     │                │
│       │ ·Lucide Icons                   │                │
│       │ ·React Hot Toast (notifications)│                │
│       └──────────────────────────────────┘                │
│                           │                               │
│         ┌─────────────────┴─────────────────┐             │
│         ↓                                   ↓             │
│  ┌────────────────┐              ┌───────────────────┐   │
│  │   VALIDATION   │              │  INTERNATIONALIZATION
│  │                │              │                   │   │
│  │·Zod Schemas   │              │ ·i18next (FR/AR)  │   │
│  │·React Hook Form│             │ ·Language Toggle  │   │
│  │·Form Errors   │              │                   │   │
│  └────────────────┘              └───────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
                           ↑
                           │ (API Calls)
                           ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Non implémenté)                    │
├─────────────────────────────────────────────────────────┤
│  Laravel Server (prévu)                                 │
│  - Authentication (JWT)                                 │
│  - User Management                                      │
│  - Artisan Management                                   │
│  - Reservations/Devis                                   │
│  - Messaging Service                                    │
│  - Ratings/Reviews                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 FLOW D'AUTHENTIFICATION

```
┌─────────────────────────────────────────────────┐
│         USER LANDING PAGE (/)                   │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    [LOGIN]            [REGISTER]
         │                   │
         ↓                   ↓
   ┌──────────────┐  ┌─────────────────┐
   │ Login.jsx    │  │ Register.jsx    │
   │ - Email      │  │ - Role select   │
   │ - Password   │  │ - Personal info │
   │ - Submit →   │  │ - Métier        │
   │   API Mock   │  │ - Submit → API  │
   └──────┬───────┘  └────────┬────────┘
          │                    │
          └────────┬───────────┘
                   ↓ (setAuth)
          ┌─────────────────────┐
          │  useAuthStore.js    │
          │ (Zustand)           │
          │ - user              │
          │ - token             │
          │ - role (client/     │
          │   artisan/admin)    │
          │ - isAuthenticated   │
          └────────┬────────────┘
                   ↓ (localStorage)
          ┌─────────────────────┐
          │   LOCAL STORAGE     │
          │ "artisan-connect-"  │
          │    auth"            │
          └──────────┬──────────┘
                     ↓
          ┌──────────────────────────────┐
          │ useNavigate() → dashboard    │
          │ - Client: /dashboard/        │
          │   particulier                │
          │ - Artisan: /dashboard/       │
          │   artisan                    │
          │ - Admin: /admin              │
          └──────────────────────────────┘
                     ↓
          ┌──────────────────────────────┐
          │ Protected Routes             │
          │ <ProtectedRoute>             │
          │ - Vérifie isAuthenticated    │
          │ - Vérifie role              │
          │ - Redirige vers login si non │
          └──────────────────────────────┘
```

---

## 🔐 FLOW DE PROTECTION CASCADE

```
APP.jsx (Routes)
    ↓
<Route allowedRoles={['artisan']}>
    ↓
<ProtectedRoute>
    ↓
Check: isAuthenticated === true?
    ├─ NO → Redirect /connexion
    └─ YES ↓
          Check: allowedRoles.includes(role)?
          ├─ NO → Redirect /dashboard/{appropriate}
          └─ YES → Render children ✅
```

---

## 📦 COMPONENT HIERARCHY

```
App.jsx (Root with Router)
├─ MainLayout (public pages)
│  ├─ Navbar
│  ├─ {children}
│  │  ├─ Home
│  │  │  ├─ HeroBanner
│  │  │  ├─ ScrollText
│  │  │  ├─ HowItWorks
│  │  │  ├─ Categories
│  │  │  ├─ Stats
│  │  │  └─ Testimonials
│  │  ├─ SearchArtisan
│  │  │  └─ ArtisanCard (x N)
│  │  ├─ ArtisanProfile
│  │  │  ├─ Hero section
│  │  │  ├─ Services
│  │  │  ├─ Portfolio
│  │  │  ├─ Reviews
│  │  │  └─ ReservationModal
│  │  ├─ Login
│  │  └─ Register
│  └─ Footer
│
├─ ProtectedRoute (role: 'client')
│  └─ Dashboard_Modern
│     ├─ Sidebar_Modern
│     └─ Routes
│        ├─ ProfilView_Modern
│        ├─ MissionsView_Modern
│        └─ MessagesView_Modern
│
├─ ProtectedRoute (role: 'artisan')
│  └─ ArtisanDashboard
│     ├─ NavbarArtisan
│     └─ Routes
│        ├─ ArtisanHome
│        ├─ ArtisanDemands
│        ├─ ArtisanMessages
│        ├─ ArtisanReviews
│        └─ ArtisanSettings
│
└─ ProtectedRoute (role: 'admin')
   └─ AdminDashboard
      ├─ Sidebar
      └─ Routes
         ├─ AdminHome
         ├─ UserManagement
         └─ Analytics
```

---

## 📡 DATA FLOW (Avec React Query)

```
Component Render
    ↓
useQuery({
    queryKey: ['artisans'],
    queryFn: async () => {
        return await axios.get('/api/artisans');
        // Currently: Returns mock data
    },
    staleTime: 5min,
    refetchOnWindowFocus: false,
    retry: 1
})
    ↓
Loading State
    ↓ (No data)
Data Cached? 
├─ NO → Make API Call
└─ YES → Return Cached
    ↓
Success/Error
    ├─ Success: Update UI with data
    └─ Error: Show error toast
```

---

## 🎨 STYLING ARCHITECTURE

### Tailwind CSS Hierarchy

```
tailwind.config.js
├─ Content Paths
│  └─ src/**/*.{js,jsx,ts,tsx}
│
├─ Theme Customization
│  ├─ Colors
│  │  ├─ brand.orange: #F97316
│  │  ├─ brand.dark: #1C1917
│  │  ├─ brand.offwhite: #FAFAF9
│  │  └─ surface.* (50-900 scale)
│  │
│  ├─ Fonts
│  │  └─ sans: [Inter, Poppins, ...]
│  │
│  └─ Animations
│     ├─ fade-in
│     └─ slide-up
│
└─ Plugins
   └─ [] (none used)
```

### CSS Precedence

```
1. PostCSS (autoprefixer)
2. Tailwind @directives
3. Custom CSS (index.css)
4. Inline styles (<motion /> from Framer)
5. Utility classes (className)
```

---

## 🎭 FORM HANDLING PATTERN

### Pattern utilisé: React Hook Form + Zod

```jsx
// 1. Define Schema (Zod)
const schema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Min 6 chars')
});

// 2. Initialize Form
const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ... }
});

// 3. Submit Handler
const onSubmit = async (data) => {
    try {
        const response = await axios.post('/api/login', data);
        setAuth(response.data.user, response.data.token);
        navigate('/dashboard');
    } catch (error) {
        toast.error(error.message);
    }
};

// 4. Render
<form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('email')} />
    {errors.email && <p>{errors.email.message}</p>}
    <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader /> : 'Submit'}
    </button>
</form>
```

---

## 🔔 NOTIFICATION SYSTEM

### react-hot-toast Implementation

```jsx
// Import
import toast from 'react-hot-toast';

// Usage
toast.success('Connexion réussie');
toast.error('Email invalide');
toast.loading('Chargement...');

// Setup in MainLayout
<Toaster position="top-right" />
```

### Custom Hook (Fallback - unused)
```javascript
// src/hooks/useToast.js
export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    
    const addToast = ({ message, type, duration }) => {
        // Custom implementation
    };
};
```

---

## 🌍 INTERNATIONALIZATION SETUP

### i18next Configuration

```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fr: {
                translation: {
                    "welcome": "Bienvenue...",
                    "login": "Connexion",
                    ...
                }
            },
            ar: {
                translation: {
                    "welcome": "مرحبًا...",
                    "login": "تسجيل الدخول",
                    ...
                }
            }
        },
        lng: 'fr',                    // Default language
        fallbackLng: 'fr',
        interpolation: { escapeValue: false },
        rtl: { ar: true }  // Right-to-left for Arabic
    });
```

### Usage
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t, i18n } = useTranslation();
    
    return (
        <>
            <h1>{t('welcome')}</h1>
            <button onClick={() => i18n.changeLanguage('ar')}>
                العربية
            </button>
        </>
    );
}
```

**Status**: ⚠️ Setup existant mais non utilisé activement dans les pages!

---

## 🎬 ANIMATION PATTERN (Framer Motion)

### Setup Pattern

```jsx
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
    initial={{ opacity: 0, y: 20 }}      // Starting state
    whileInView={{ opacity: 1, y: 0 }}   // When in viewport
    transition={{ duration: 0.6 }}       // Animation duration
    className="..."
>
    Content
</motion.div>

// Lists with AnimatePresence
<AnimatePresence>
    {items.map(item => (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
        >
            {item.content}
        </motion.div>
    ))}
</AnimatePresence>
```

---

## 🔗 CALENDAR INTEGRATION

### FullCalendar Setup

```jsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

<FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    events={[
        { title: 'Intervention', start: '2025-02-27', end: '2025-02-28' }
    ]}
    height="auto"
/>
```

**Location**: `/dashboard/artisan/calendrier`

---

## 📱 RESPONSIVE BREAKPOINTS (Tailwind)

```
Default (mobile): < 640px
sm:  640px+
md:  768px+
lg:  1024px+
xl:  1280px+
2xl: 1536px+
```

**Usage** (inconsistent in codebase):
```jsx
<div className="block md:hidden">Mobile</div>
<div className="hidden md:block">Desktop</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## ⚡ PERFORMANCE CONSIDERATIONS

### Current Status

✅ **Vite + React Plugin**:
- Fast refresh for development
- Optimized build output

⚠️ **Lazy Loading Routes**:
```javascript
const Home = lazy(() => import('./pages/public/Home'));
const Login = lazy(() => import('./pages/public/Login'));
//... Code-splitting enabled
```

❌ **Areas to improve**:
- No image optimization (Unsplash CDN external)
- No service worker/PWA
- Mock data increasing bundle
- No memoization (React.memo) used

### React Query Optimization

```javascript
// src/lib/react-query.js
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,      // 5 min
            refetchOnWindowFocus: false,   // No refetch on tab switch
            retry: 1                        // Retry failed requests 1x
        }
    }
});
```

---

## 🛠️ DEVELOPMENT WORKFLOW

```
1. Clone & npm install
2. npm run dev (Starts Vite on :5177)
3. Edit files → HMR (hot reload)
4. npm run lint (ESLint check)
5. npm run build (Production build)
6. npm run preview (Test production build locally)
```

### ESLint Configuration

```javascript
// eslint.config.js
// Configuration minimaliste (fichier présent)
// À configurer avec rules pour React, imports, etc.
```

---

## 🔄 STATE MANAGEMENT FLOW

### Auth Store (Zustand)

```javascript
// File: src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            role: null,
            
            // Actions
            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: !!token,
                role: user?.role || null
            }),
            
            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                role: null
            }),
            
            updateUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            }))
        }),
        {
            name: 'artisan-connect-auth'  // localStorage key
        }
    )
);
```

### Usage Pattern

```jsx
// In any component
const { user, isAuthenticated, logout } = useAuthStore();

// Or with selector
const role = useAuthStore((state) => state.role);
```

---

## 📊 DATABASE SCHEMA (Prévu - Non implémenté)

```
USERS
├─ id (PK)
├─ email (UNQ)
├─ password_hash
├─ prenom
├─ nom
├─ telephone
├─ role (ENUM: client, artisan, admin)
├─ avatar_url
├─ ville
├─ created_at
└─ updated_at

ARTISANS (EXTENDS USERS)
├─ metier
├─ description
├─ years_experience
├─ hourly_rate
├─ rating (AVG)
├─ verified (BOOL)
└─ verified_at

RESERVATIONS
├─ id (PK)
├─ client_id (FK→USERS)
├─ artisan_id (FK→ARTISANS)
├─ date
├─ time
├─ description
├─ status (pending/confirmed/completed)
├─ price
└─ created_at

REVIEWS
├─ id (PK)
├─ reservation_id (FK→RESERVATIONS)
├─ rating (1-5)
├─ comment
└─ created_at

MESSAGES
├─ id (PK)
├─ sender_id (FK→USERS)
├─ receiver_id (FK→USERS)
├─ content
├─ conversation_id
├─ created_at
└─ read_at (NULLABLE)
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Connect backend API (Laravel)
- [ ] Configure .env (API_URL, JWT_SECRET, etc.)
- [ ] Remove all mock data
- [ ] Implement real authentication
- [ ] Setup error boundaries
- [ ] Configure CORS
- [ ] Setup HTTPS/SSL
- [ ] Database migrations
- [ ] Image upload/storage
- [ ] Socket.io server
- [ ] Testing setup
- [ ] Performance audits (Lighthouse)
- [ ] Security audit
- [ ] SEO meta tags
- [ ] Analytics
