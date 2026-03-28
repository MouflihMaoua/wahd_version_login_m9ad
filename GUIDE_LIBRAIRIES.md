# 📚 GUIDE COMPLET DES LIBRAIRIES - ArtisanConnect

---

## 📦 TOUTES LES DÉPENDANCES EXPLIQUÉES

### 1️⃣ REACT & RENDERING

#### **react** (19.2.4)
- **Rôle**: Framework UI
- **Utilisé pour**: Composants, state, lifecycle
- **Code exemple**:
```jsx
import React, { useState, useEffect } from 'react';

function MyComponent() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
- **Status**: ✅ Obligatoire
- **Alternatives**: Vue.js, Svelte

---

#### **react-dom** (19.2.4)
- **Rôle**: Rendu React dans le DOM
- **Utilisé pour**: `ReactDOM.createRoot()` dans main.jsx
- **Status**: ✅ Obligatoire
- **Alternatives**: react-native (mobile)

---

### 2️⃣ BUNDLING & BUILD

#### **vite** (7.3.1)
- **Rôle**: Build tool et dev server
- **Config**: `vite.config.js`
- **Features**:
  - Dev server chaud (HMR) sur port 5177
  - Build ultra-rapide (Rollup)
  - ES modules natifs
- **Status**: ✅ Obligatoire
- **Alternatives**: Webpack, Parcel, esbuild

---

#### **@vitejs/plugin-react** (5.1.4)
- **Rôle**: Plugin Vite pour React
- **Features**: 
  - React Fast Refresh (HMR au fichier)
  - Transpilation JSX
  - Babel/SWC integration
- **Status**: ✅ Obligatoire
- **Alternatives**: @vitejs/plugin-react-swc

---

### 3️⃣ ROUTING

#### **react-router-dom** (7.13.0)
- **Rôle**: Routage client-side
- **Utilisé pour**: Naviguer entre pages sans rechargement
- **Code exemple**:
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

<BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
</BrowserRouter>
```
- **Fichiers** clés:
  - `src/App.jsx` - Routes définies ici
  - `src/components/common/ProtectedRoute.jsx` - Guard routes
- **Status**: ✅ Obligatoire
- **Alternatives**: Next.js, Remix, React Location

---

### 4️⃣ STATE MANAGEMENT

#### **zustand** (5.0.11)
- **Rôle**: State global simple et léger
- **Utilisé pour**: Auth store (`useAuthStore`)
- **Avantages**:
  - Plus simple que Redux
  - Très petit bundle
  - Middleware support (persist)
- **Code exemple**:
```javascript
// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null })
        }),
        { name: 'artisan-connect-auth' } // localStorage key
    )
);

// Usage
const { user, setAuth, logout } = useAuthStore();
const user = useAuthStore((state) => state.user); // Selector
```
- **Alternatives**: Redux, Jotai, Recoil, Context API

---

### 5️⃣ DATA FETCHING & CACHING

#### **@tanstack/react-query** (5.90.21)
- **Rôle**: Synchronisation données serveur/client
- **Features**:
  - Caching automatique
  - Retry logic
  - Background refetch
  - Stale-while-revalidate pattern
- **Config**: `src/lib/react-query.js`
```javascript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,      // 5 min
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});
```
- **Code exemple**:
```jsx
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['artisans'],
        queryFn: async () => {
            const response = await axios.get('/api/artisans');
            return response.data;
        }
    });

    if (isLoading) return <Loader />;
    if (error) return <Error />;
    return <div>{data.map(...)}</div>;
}
```
- **Status**: ✅ Installé mais **NON UTILISÉ** (pas d'API)
- **Alternatives**: SWR, Axios, Fetch API

---

#### **axios** (1.13.5)
- **Rôle**: HTTP client
- **Utilisé pour**: Appels API
- **Status**: ⚠️ **Installé mais NON UTILISÉ**
- **Code exemple (à implémenter)**:
```javascript
// À créer: src/lib/apiClient.js
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor JWT
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore((state) => state.token);
    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
});

export default apiClient;
```
- **Alternatives**: Fetch API, node-fetch, got

---

### 6️⃣ FORMS & VALIDATION

#### **react-hook-form** (7.71.2)
- **Rôle**: Gestion légère des formulaires
- **Avantages**:
  - Performance (pas re-render inutile)
  - Intégration Zod/Yup
  - Support validation HTML5
- **Code exemple**:
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} />
            {errors.email && <span>{errors.email.message}</span>}
            <button type="submit">Login</button>
        </form>
    );
}
```
- **Fichiers utilisent**: Login.jsx, Register.jsx, formulaires modales
- **Status**: ✅ Utilisé
- **Alternatives**: Formik, Final Form

---

#### **@hookform/resolvers** (5.2.2)
- **Rôle**: Intègre validation schemas (Zod, Yup) avec React Hook Form
- **Utilisé avec**: Zod validation
- **Status**: ✅ Utilisé
- **Alternatives**: Yup, Joi

---

#### **zod** (4.3.6)
- **Rôle**: Validation schemas TypeScript-first
- **Avantages**:
  - Validation + type inference
  - Très performant
  - Messages erreurs personnalisés
- **Code exemple**:
```javascript
import * as z from 'zod';

const loginSchema = z.object({
    email: z
        .string()
        .email('Email invalide'),
    password: z
        .string()
        .min(6, 'Minimum 6 caractères')
        .regex(/[A-Z]/, 'Une majuscule requise')
});

// Type inference
type LoginInput = z.infer<typeof loginSchema>;
```
- **Utilisé dans**: Login.jsx, Register.jsx, ReservationModal.jsx
- **Status**: ✅ Utilisé
- **Alternatives**: Yup, io-ts, Valibot

---

### 7️⃣ STYLING

#### **tailwindcss** (4.2.0)
- **Rôle**: CSS utility-first framework
- **Config**: `tailwind.config.js`
- **Features**:
  ```javascript
  theme: {
      extend: {
          colors: { 
              brand: { orange: '#F97316', dark: '#1C1917' }
          },
          fontFamily: { sans: ['Inter', 'Poppins'] },
          animation: { 'fade-in': 'fadeIn 0.5s ease-out' }
      }
  }
  ```
- **Code exemple**:
```jsx
<div className="flex items-center justify-center p-4 md:p-8 lg:p-16 bg-brand-offwhite hover:bg-gray-100 transition-colors">
    <h1 className="text-2xl md:text-4xl font-bold text-brand-dark">
        Bienvenue
    </h1>
</div>
```
- **Avantages**:
  - Small bundle (purge unused CSS)
  - Responsive (mobile-first)
  - Dark mode support
  - Theming intégré
- **Status**: ✅ Massivement utilisé
- **Alternatives**: Bootstrap, Material-UI, Styled-components, CSS Modules

---

#### **tailwind-merge** (3.5.0)
- **Rôle**: Fusionne classes Tailwind intelligemment
- **Code exemple**:
```jsx
import { twMerge } from 'tailwind-merge';

// Évite doublon/conflit classes
const buttonClass = twMerge(
    'px-4 py-2 bg-blue-500',
    'bg-red-500'  // ← Remplace bg-blue
);
// Résultat: 'px-4 py-2 bg-red-500'
```
- **Status**: ✅ Utilisé
- **Alternatives**: clsx, classnames

---

#### **@tailwindcss/postcss** (4.2.0)
- **Rôle**: Post-processor CSS (compatibilité navigateurs)
- **Config**: `postcss.config.js`
- **Status**: ✅ Utilisé
- **Alternatives**: Autoprefixer seul

---

#### **postcss** (8.5.6)
- **Rôle**: CSS transformer (plugins écosystème)
- **Utilisé pour**: Tailwind, Autoprefixer
- **Status**: ✅ Obligatoire pour Tailwind
- **Alternatives**: Sass, Less

---

#### **autoprefixer** (10.4.24)
- **Rôle**: Ajoute vendor prefixes CSS (-webkit-, -moz-, etc.)
- **Code exemple**:
```css
/* Input */
.gradient { background: linear-gradient(red, blue); }

/* Output avec autoprefixer */
.gradient {
    background: -webkit-linear-gradient(red, blue);
    background: linear-gradient(red, blue);
}
```
- **Status**: ✅ Utilisé
- **Alternatives**: Postcss-preset-env

---

### 8️⃣ ANIMATIONS

#### **framer-motion** (12.34.3)
- **Rôle**: Librairie animations React basées déclaratif
- **Features**:
  - Keyframes
  - Variants & orchestration
  - Gesture handling
  - SVG animations
- **Code exemple**:
```jsx
import { motion } from 'framer-motion';

<motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    className="..."
>
    Content
</motion.div>

// Stagger children
<motion.div variants={containerVariants} initial="hidden" animate="visible">
    {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
            {item}
        </motion.div>
    ))}
</motion.div>
```
- **Utilisé dans**: Home.jsx, composants cards, modals
- **Status**: ✅ Massivement utilisé
- **Alternatives**: React Spring, React Transition Group, CSS Animations

---

### 9️⃣ ICÔNES

#### **lucide-react** (0.575.0)
- **Rôle**: Librairie 200+ icônes SVG
- **Avantages**:
  - React components
  - Stroke/fill control
  - Tailles customisables
  - Très complet (UI patterns)
- **Code exemple**:
```jsx
import { Search, MapPin, Star, Menu, X, ChevronRight } from 'lucide-react';

<button>
    <Search size={24} color="currentColor" strokeWidth={1.5} />
    Rechercher
</button>
```
- **Icones disponibles**:
  - Navigation: Home, Menu, ChevronRight, ArrowRight
  - Utilitaires: Search, Filter, Calendar, Clock, Mail, Phone
  - Status: Star, CheckCircle, AlertCircle, Info
  - Social: Heart, Share2, MessageSquare
- **Utilisé partout** dans l'app
- **Status**: ✅ Massivement utilisé
- **Alternatives**: FontAwesome, Material Icons, Feather Icons, Heroicons

---

### 🔟 NOTIFICATIONS

#### **react-hot-toast** (2.6.0)
- **Rôle**: Toast notifications non-bloquantes
- **Features**:
  - Toast stacking
  - Auto-remove
  - Custom JSX
  - Promise handling
- **Code exemple**:
```jsx
import toast from 'react-hot-toast';

// Setup in layout
<Toaster position="top-right" />

// Usage
toast.success('Bienvenue!');
toast.error('Email invalide');
toast.loading('Chargement...');

// Custom
toast.custom((t) => (
    <div>{t.message}</div>
));

// Promise
toast.promise(
    apiCall(),
    {
        loading: 'Chargement...',
        success: 'Succès!',
        error: 'Erreur!'
    }
);
```
- **Utilisé dans**: Login.jsx, Register.jsx, formulaires
- **Status**: ✅ Utilisé
- **Alternatives**: SonnerJS, react-toastify, React Notifications

---

### 1️⃣1️⃣ UTILITIES

#### **clsx** (2.1.1)
- **Rôle**: Classes CSS conditionnelles simples
- **Code exemple**:
```jsx
import clsx from 'clsx';

<div className={clsx(
    'px-4 py-2',
    isActive && 'bg-blue-500',
    isDisabled && 'opacity-50 cursor-not-allowed'
)}>
    Button
</div>
```
- **Status**: moins utilisé (Tailwind suffit)
- **Alternatives**: classnames, tailwind-merge

---

### 1️⃣2️⃣ CALENDRIER

#### **@fullcalendar/react** (6.1.20)
#### **@fullcalendar/core** (6.1.20)
#### **@fullcalendar/daygrid** (6.1.20)
#### **@fullcalendar/timegrid** (6.1.20)
#### **@fullcalendar/interaction** (6.1.20)

- **Rôle**: Calendrier interactif professionnel
- **Utilisé**: Dashboard artisan `/dashboard/artisan/calendrier`
- **Code exemple**:
```jsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

<FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    events={[
        { 
            title: 'Intervention plomberie',
            start: '2025-02-27T10:00:00',
            end: '2025-02-27T12:00:00'
        }
    ]}
    editable={true}
    selectable={true}
    height="auto"
/>
```
- **Status**: ✅ Installé, peu utilisé
- **Alternatives**: React Big Calendar, React-Calendar, date-fns

---

### 1️⃣3️⃣ INTERNATIONALIZATION

#### **i18next** (25.8.13)
#### **react-i18next** (16.5.4)

- **Rôle**: Multilingue FR/AR
- **Config**: `src/i18n/config.js`
- **Code exemple**:
```javascript
// Configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        fr: {
            translation: {
                "welcome": "Bienvenue sur ArtisanConnect"
            }
        },
        ar: {
            translation: {
                "welcome": "مرحبًا بكم في ArtisanConnect"
            }
        }
    },
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    rtl: { ar: true }
});
```

```jsx
// Usage dans composants
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
- **Status**: ✅ Setup complet mais **NON UTILISÉ** activement
- **Alternatives**: react-intl, FormatJS, Polyglot.js

---

### 1️⃣4️⃣ COMMUNICATION TEMPS RÉEL

#### **socket.io-client** (4.8.3)

- **Rôle**: WebSocket client pour communication temps réel
- **Utilisé pour**: Chat en temps réel (non implémenté)
- **Code exemple (à implémenter)**:
```javascript
// src/lib/socket.js
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('new_message', (data) => {
    console.log('Nouveau message:', data);
});

socket.emit('send_message', {
    to_user_id: 123,
    content: 'Hello!'
});
```

```jsx
// Usage dans component
import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';

function ChatComponent() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        
        return () => socket.off('message');
    }, []);

    const send = (content) => {
        socket.emit('send_message', { content });
    };

    return <MessageList messages={messages} onSend={send} />;
}
```
- **Status**: ⚠️ **Installé mais NON IMPLÉMENTÉ**
- **Alternatives**: WebSocket natif, Pusher, Firebase Realtime

---

## 📊 TABLEAU COMPARATIF DÉPENDANCES

| Librairie | Version | Taille | Status | Critique |
|-----------|---------|--------|--------|----------|
| react | 19.2.4 | 44KB | ✅ | ⭐⭐⭐ |
| react-dom | 19.2.4 | 34KB | ✅ | ⭐⭐⭐ |
| react-router-dom | 7.13.0 | 48KB | ✅ | ⭐⭐⭐ |
| zustand | 5.0.11 | 1.8KB | ✅ | ⭐⭐⭐ |
| @tanstack/react-query | 5.90.21 | 27KB | ⚠️ | ⭐⭐⭐ |
| axios | 1.13.5 | 13.6KB | ⚠️ | ⭐⭐⭐ |
| react-hook-form | 7.71.2 | 19KB | ✅ | ⭐⭐⭐ |
| zod | 4.3.6 | 32KB | ✅ | ⭐⭐⭐ |
| tailwindcss | 4.2.0 | (PostCSS) | ✅ | ⭐⭐⭐ |
| framer-motion | 12.34.3 | 58KB | ✅ | ⭐⭐ |
| lucide-react | 0.575.0 | 160KB | ✅ | ⭐⭐ |
| react-hot-toast | 2.6.0 | 5.3KB | ✅ | ⭐⭐ |
| i18next | 25.8.13 | 19KB | ⚠️ | ⭐ |
| socket.io-client | 4.8.3 | 37KB | ⚠️ | ⭐⭐⭐ |
| @fullcalendar/* | 6.1.20 | 200KB | ⚠️ | ⭐ |

---

## ⚡ BUNDLE SIZE ANALYSIS

**Total approximatif**: ~600KB (non minifié)
**Après minification/gzip**: ~150-200KB

### Optimization opportunities:
- [ ] Tree-shake lucide-react (import icones spécifiques)
- [ ] Dynamic import @fullcalendar (chargement lazy)
- [ ] Image optimization
- [ ] Code splitting routes (déjà fait avec lazy())

---

## 🔄 FLUX D'INSTALLATION

```bash
# 1. Initialiser projet Vite + React
npm create vite@latest -- --template react

# 2. Installer dépendances
npm install

# 3. Installer Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Installer routing
npm install react-router-dom

# 5. Installer state management
npm install zustand

# 6. Installer forms
npm install react-hook-form @hookform/resolvers zod

# 7. Installer data fetching
npm install @tanstack/react-query axios

# 8. Installer animations
npm install framer-motion

# 9. Installer UI
npm install lucide-react react-hot-toast

# 10. Installer i18n
npm install i18next react-i18next

# 11. Dev tools
npm install -D @vitejs/plugin-react eslint
```

---

**Document généré**: 27 février 2026
