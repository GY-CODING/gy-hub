# GyHub - Asistente de IA Multi-Dominio

## 📋 Descripción General

**GyHub** es una aplicación web construida con **Next.js 15** y **React 19** que proporciona un sistema de asistentes de IA especializados en diferentes dominios. Utiliza **Google Gemini 2.5 Flash** como modelo de IA generativa y se integra con **MongoDB** para consultar bases de datos en tiempo real, **Auth0** para autenticación, y **Scryfall API** para datos de Magic: The Gathering.

La aplicación cuenta con control de acceso basado en roles (RBAC) donde solo usuarios con roles **IA**, **ADMIN** o **DEVELOPER** pueden acceder al sistema.

---

## 🏗️ Arquitectura del Proyecto

```
gy-hub/
├── app/
│   ├── api/                      # API Routes de Next.js
│   │   ├── auth/                 # Autenticación con Auth0
│   │   │   ├── [auth0]/route.ts  # Callback de Auth0
│   │   │   └── me/route.ts       # Endpoint de usuario actual
│   │   ├── assistants/           # 🆕 Asistentes de IA organizados por dominio
│   │   │   ├── shared/           # Infraestructura compartida
│   │   │   │   ├── types/        # Tipos base (assistant, gemini, response)
│   │   │   │   ├── services/     # Servicios compartidos
│   │   │   │   │   ├── gemini.service.ts      # Cliente Gemini centralizado
│   │   │   │   │   ├── file-loader.service.ts # Carga de archivos MD
│   │   │   │   │   └── mongodb.service.ts     # Cliente MongoDB
│   │   │   │   ├── constants/    # Prompts del sistema, mensajes de error
│   │   │   │   └── utils/        # Validación de requests, formateo
│   │   │   ├── gycoding/         # Asistente general GYCODING
│   │   │   │   ├── route.ts      # Handler de ruta (thin layer)
│   │   │   │   ├── service.ts    # Lógica de negocio
│   │   │   │   └── constants.ts  # Prompts específicos
│   │   │   ├── api-docs/         # Documentación de APIs (MongoDB)
│   │   │   │   ├── route.ts
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts      # ApiDoc interface
│   │   │   │   └── constants.ts
│   │   │   ├── code-review/      # Revisión de código GitHub
│   │   │   │   ├── route.ts
│   │   │   │   ├── service.ts
│   │   │   │   ├── types.ts      # GitHub types
│   │   │   │   └── constants.ts
│   │   │   ├── heralds/          # Heralds of Chaos
│   │   │   │   ├── route.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── constants.ts
│   │   │   ├── stormlight/       # Stormlight Archive RPG
│   │   │   │   ├── route.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── constants.ts
│   │   │   └── mtg/              # Magic: The Gathering
│   │   │       ├── route.ts
│   │   │       ├── service.ts    # 🆕 Lógica de negocio separada
│   │   │       └── types.ts      # ScryfallCard interface
│   │   └── metadata/route.ts     # Metadata de bases de datos
│   ├── components/               # Componentes React de UI
│   │   ├── AnimateAvatar.tsx     # Avatar animado con AnimateUI
│   │   ├── ChatPanel.tsx         # Panel principal del chat
│   │   ├── ChatResponse.tsx      # Renderizado de respuestas con markdown
│   │   ├── MagicCard.tsx         # 🆕 Componente para cartas MTG
│   │   ├── TopicSelector.tsx     # Selector de subtabs
│   │   ├── TabTriggerItem.tsx    # Item de tab personalizado
│   │   └── UserMenu.tsx          # Menú de usuario con avatar y logout
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout raíz
│   └── page.tsx                  # Página principal con RBAC
├── components/                   # Librería de componentes AnimateUI
│   └── animate-ui/               # Componentes de UI animados
├── hooks/                        # Hooks personalizados
│   ├── useChatState.ts           # Estado global del chat
│   ├── use-controlled-state.tsx  # State management helpers
│   ├── use-data-state.tsx        # Data state management
│   └── use-is-in-view.tsx        # Intersection observer hook
├── lib/                          # Librerías y utilidades
│   ├── auth0.ts                  # Configuración de Auth0
│   ├── auth-helpers.ts           # Helpers de autenticación
│   ├── mongodb.ts                # Cliente de MongoDB
│   ├── permissions.ts            # Sistema de permisos y roles
│   ├── tabs-config.tsx           # Configuración de tabs y endpoints
│   ├── utils.ts                  # Utilidades generales
│   └── get-strict-context.tsx    # Context API helper
├── public/
│   └── files/                    # Archivos estáticos (MD para contexto de IA)
│       ├── heralds-of-chaos-story.md
│       ├── STORMLIGHT_RPG_HANDBOOK-1.md
│       ├── STORMLIGHT_RPG_HANDBOOK-2.md
│       ├── STORMLIGHT_RPG_HANDBOOK-3.md
│       ├── STORMLIGHT_RPG_WORLD_GUIDE-1.md
│       └── STORMLIGHT_RPG_WORLD_GUIDE-2.md
├── middleware.ts                 # Middleware de Auth0
├── components.json               # Configuración de shadcn/ui
├── next.config.ts                # Configuración de Next.js
├── package.json
└── tsconfig.json
```

---

## 🔐 Sistema de Autenticación

### Auth0 Integration

- **Proveedor**: Auth0 con SDK \`@auth0/nextjs-auth0\`
- **Rutas**:
  - \`/auth/login\` - Inicio de sesión
  - \`/auth/logout\` - Cierre de sesión
  - \`/api/auth/[auth0]\` - Callback de Auth0
  - \`/api/auth/me\` - Información del usuario actual

### Control de Acceso Basado en Roles (RBAC)

\`\`\`typescript
// Roles permitidos
ALLOWED_ROLES = ['IA', 'ADMIN', 'DEVELOPER']

// Roles denegados
DENIED_ROLES = ['COMMON']
\`\`\`

El sistema verifica los roles del usuario en \`/api/auth/me\` que consulta:

- **GYAccounts.Metadata**: Datos del usuario y roles
- **GYBooks.Metadata**: Biografía y perfil extendido

### Middleware

\`middleware.ts\` protege todas las rutas excepto:

- \`/api/auth/\*\` - Rutas de autenticación
- \`/\_next/\*\` - Assets de Next.js
- \`/static/\*\` - Archivos estáticos
  `middleware.ts` protege todas las rutas excepto:

- `/api/auth/*` - Rutas de autenticación
- `/_next/*` - Assets de Next.js
- `/static/*` - Archivos estáticos
- Archivos públicos (`.ico`, `.png`, `.jpg`, `.svg`, etc.)

---

## 🤖 Sistema de IA Multi-Dominio

### 🆕 Nueva Arquitectura (Domain-Driven Design)

Todos los asistentes están organizados bajo `/api/assistants/` con una arquitectura limpia y escalable:

#### Patrón de Diseño

Cada asistente sigue el patrón **Separation of Concerns**:

```typescript
/api/assistants/[domain]/
├── route.ts      # Handler de ruta (thin layer)
│                 # - Validación de requests
│                 # - Llamada al servicio
│                 # - Formateo de respuestas
├── service.ts    # Lógica de negocio
│                 # - Interacción con Gemini
│                 # - Carga de contexto
│                 # - Procesamiento de datos
├── types.ts      # Tipos específicos del dominio
└── constants.ts  # Prompts, rutas de archivos, configuración
```

#### Infraestructura Compartida

```typescript
/api/assistants/shared/
├── services/
│   ├── gemini.service.ts      # Cliente Gemini centralizado (Singleton)
│   ├── file-loader.service.ts # Carga de archivos MD con caché
│   └── mongodb.service.ts     # Cliente MongoDB
├── types/
│   ├── assistant.ts           # Tipos base para todos los asistentes
│   ├── gemini.ts              # Tipos de Gemini API
│   └── response.ts            # Tipos de respuestas
├── constants/
│   └── index.ts               # Prompts del sistema, mensajes de error
└── utils/
    └── request.utils.ts       # Validación y formateo de requests
```

### Endpoints de Asistentes

Todos los endpoints siguen el mismo patrón:

```typescript
POST /api/assistants/[domain]
Body: { prompt: string, topic?: string }
Response: { text: string } | { type: string, data: any }
```

---

### 1. **GYCODING** (`/api/assistants/gycoding`)

**Propósito**: Asistente general sobre documentación de GYCODING

**Modelo**: `gemini-2.5-flash`

**Contexto**: Información general sobre la organización y proyectos

**Subtabs**:

- **API**: `/api/assistants/api-docs` - Consulta documentación de APIs desde MongoDB
- **Code Review**: `/api/assistants/code-review` - Revisa código de repositorios de GitHub

#### Subtab: API Docs (`/api/assistants/api-docs`)

**Base de Datos**: `APIGateway.APIDocs` (MongoDB)

**Funcionalidad**:

- Búsqueda semántica de APIs por nombre o descripción
- Consulta de endpoints específicos
- Información sobre autenticación, parámetros, respuestas

**Estructura de Datos**:

```typescript
interface ApiDoc {
  name: string;
  description: string;
  baseUrl: string;
  endpoints?: Array<{
    method: string;
    path: string;
    description: string;
    parameters?: Array<{ name; type; required; description }>;
    responses?: Array<{ status; description; schema }>;
  }>;
  authentication?: {
    type: string;
    description: string;
  };
}
```

#### Subtab: Code Review (`/api/assistants/code-review`)

**Proveedor**: GitHub API (org: `GY-CODING`)

**Funcionalidad**:

- Lista repositorios de la organización
- Revisa código de archivos específicos
- Analiza estructura de proyectos
- Proporciona feedback y mejoras

**Token**: `GITHUB_TOKEN` (variable de entorno)

---

### 2. **Heralds of Chaos** (`/api/assistants/heralds`)

**Propósito**: Asistente sobre la historia "Heralds of Chaos"

**Modelo**: `gemini-2.5-flash`

**Contexto**: Archivo `/public/files/heralds-of-chaos-story.md`

**Funcionalidad**:

- Responde preguntas sobre personajes, eventos, lugares
- Explica relaciones entre personajes
- Proporciona cronología de eventos

---

### 3. **Stormlight Archive** (`/api/assistants/stormlight`)

**Propósito**: Asistente sobre el RPG de Stormlight Archive

**Modelo**: `gemini-2.5-flash`

**Contexto**:

- Handbook (archivos 1, 2, 3)
- World Guide (archivos 1, 2)

#### 🆕 Sistema de Topics (Optimización)

Para evitar errores de rate limit (429) de Gemini, el asistente ahora carga solo los archivos relevantes según el topic seleccionado:

**Topics Disponibles**:

1. **`handbook`** - Reglas del Juego

   - Carga: `HANDBOOK-1.md`, `HANDBOOK-2.md`, `HANDBOOK-3.md`
   - Uso: Reglas, mecánicas, y sistema de juego

2. **`world-guide`** - Guía del Mundo

   - Carga: `WORLD_GUIDE-1.md`, `WORLD_GUIDE-2.md`
   - Uso: Lore, historia de Roshar, contexto del mundo

3. **`first-steps`** - Primeros Pasos

   - Carga: Solo `HANDBOOK-1.md`
   - Uso: Introducción rápida para nuevos jugadores

4. **Sin topic** (default)
   - Carga: Solo `HANDBOOK-1.md` + mensaje pidiendo seleccionar topic
   - Reduce contexto para respuestas generales

**Funcionalidad**:

- Explica reglas del juego
- Información sobre clases, razas, habilidades
- Contexto del mundo de Roshar
- Ayuda con creación de personajes

---

### 4. **Magic: The Gathering** (`/api/assistants/mtg`) 🆕

**Propósito**: Búsqueda y análisis de cartas de Magic: The Gathering

**Modelo**: `gemini-2.5-flash`

**API Externa**: [Scryfall API](https://api.scryfall.com)

#### 🆕 Arquitectura Refactorizada

**Problema Anterior**: Gemini alucinaba datos de cartas (mana cost, poder/resistencia incorrectos)

**Solución Actual**:

1. **Gemini solo extrae el nombre** de la carta del prompt del usuario
2. **Scryfall API proporciona datos autoritativos** (100% precisos)
3. **Componente `MagicCard`** renderiza los datos estructurados

#### Flujo de Datos

```typescript
Usuario: "busca Black Lotus"
    ↓
Gemini: Extrae intent y nombre → { intent: "specific", cardName: "Black Lotus" }
    ↓
Scryfall API: Busca carta → ScryfallCard data
    ↓
Response: { type: "card_data", card: {...}, explanation: "..." }
    ↓
Frontend: Renderiza MagicCard component + explicación de IA
```

#### Tipos de Búsqueda

```typescript
// 1. Carta aleatoria
"dame una carta aleatoria" → getRandomCard()

// 2. Búsqueda fuzzy (tolerante a errores)
"busca Black Lotus" → getCardByFuzzyName("Black Lotus")

// 3. Búsqueda por keywords
"cartas con tormenta" → searchCard("storm")
```

#### Métodos de Scryfall API

1. **`searchCard(query: string)`**

   - Búsqueda amplia por keywords
   - Endpoint: `/cards/search?q={query}`
   - Devuelve: Array de cartas

2. **`getCardByFuzzyName(name: string)`**

   - Búsqueda tolerante a errores de escritura
   - Endpoint: `/cards/named?fuzzy={name}`
   - Devuelve: 1 carta (mejor match)

3. **`getRandomCard()`**
   - Carta aleatoria de Scryfall
   - Endpoint: `/cards/random`
   - Devuelve: 1 carta

#### Formato de Respuesta Estructurada

```typescript
{
  type: "card_data",
  card: {
    id: string;
    name: string;
    mana_cost: string;
    type_line: string;
    oracle_text: string;
    power?: string;
    toughness?: string;
    rarity: string;
    set_name: string;
    image_uris: {
      normal: string;
      large: string;
      art_crop: string;  // 🆕 Arte sin marco
    };
    prices: {
      usd: string;
      eur: string;
    };
    legalities: Record<string, string>;
    scryfall_uri: string;
  },
  explanation: string,  // 🆕 Explicación generada por Gemini
  totalFound?: number   // Si hay múltiples resultados
}
```

#### Componente `MagicCard` 🆕

Renderiza cartas con diseño premium:

**Características**:

- ✅ Imagen completa de la carta (izquierda)
- ✅ Arte recortado (`art_crop`) al lado del nombre
- ✅ Barra de color lateral según identidad de color
- ✅ Mana cost, tipo, texto de oráculo
- ✅ Poder/resistencia, rareza (con indicador de color)
- ✅ Precios en USD y EUR
- ✅ Link a Scryfall
- ✅ Explicación de IA debajo de la carta

**Ejemplo Visual**:

```
┌─────────────────────────────────────────────────┐
│ [Carta]  [Arte] Black Lotus        {0}          │
│          Artifact                               │
│                                                 │
│  {T}, Sacrifice: Add three mana of any color   │
│                                                 │
│  [4/4] [Mythic] [Vintage Masters]              │
│  [$41.52] [Ver en Scryfall →]                  │
└─────────────────────────────────────────────────┘
Explicación de IA:
Black Lotus es una de las cartas más poderosas...
```

#### Generación de Explicaciones con IA

Después de obtener los datos de Scryfall, Gemini genera una explicación basándose en:

- Nombre, coste de maná, tipo
- Texto de oráculo (habilidades)
- Poder/resistencia
- Rareza, colores, set
- Legalidades

**Prompt de Explicación**:

```typescript
`Analiza esta carta y proporciona:
1. Breve explicación de qué hace (2-3 líneas)
2. En qué tipo de mazos es útil
3. Sinergias o combos conocidos

Sé conciso, directo y entusiasta. Máximo 4-5 líneas.`;
```

#### Componente `ManaCost` 🆕

Renderiza símbolos de mana usando SVGs oficiales de Magic: The Gathering.

**Ubicación**: `app/components/ManaCost.tsx`

**Características**:

- ✅ Parsea mana cost format: `{2}{U}{B}` → símbolos individuales
- ✅ Renderiza colores con SVGs (`/public/icons/colors/`)
- ✅ Mana genérico como círculos grises con números
- ✅ **Soporte para símbolos híbridos** mitad y mitad

**Símbolos Soportados**:

1. **Colores Básicos**:

   - `{W}` - Blanco (White)
   - `{U}` - Azul (Blue)
   - `{B}` - Negro (Black)
   - `{R}` - Rojo (Red)
   - `{G}` - Verde (Green)
   - `{C}` - Incoloro (Colorless)

2. **Mana Genérico**:

   - `{0}`, `{1}`, `{2}`, `{X}`, etc.
   - Renderizado: Círculo gris con el número/letra

3. **Símbolos Híbridos** (Nuevo):
   - `{C/W}`, `{C/U}`, `{C/B}`, `{C/R}`, `{C/G}`
   - Renderizado: Dividido verticalmente (mitad izquierda / mitad derecha)
   - Técnica: CSS `clip-path` para recortar cada SVG exactamente por la mitad
   - También soporta híbridos entre colores: `{W/U}`, `{B/R}`, `{G/W}`, etc.

**Componentes Internos**:

```typescript
// Componente individual de símbolo
<ManaSymbol symbol="{U}" size={20} />

// Componente de mana cost completo
<ManaCost manaCost="{2}{U}{B}" size={18} />

// Híbridos (renderizado automático)
<ManaSymbol symbol="{C/G}" size={20} />
  → <HybridManaSymbol left="C" right="G" size={20} />
```

**Ejemplo de Renderizado**:

Mana Cost: `{4}{C/G}{C/G}{C/G}{C/G}`

Renderiza como:

- Círculo gris con "4"
- 4 símbolos divididos verticalmente (mitad incoloro / mitad verde)

**Integración en MagicCard**:

```tsx
{
  card.mana_cost && (
    <div className="bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
      <ManaCost manaCost={card.mana_cost} size={18} />
    </div>
  );
}
```

---

## 🎨 Sistema de UI

### Componentes Principales

#### `ChatPanel.tsx`

Panel principal que gestiona:

- Tabs de diferentes asistentes
- Subtabs (si existen)
- Input de usuario
- Historial de mensajes
- Estado de carga

**State Management**: `useChatState` hook

#### `ChatResponse.tsx`

Renderiza respuestas de IA con:

- **ReactMarkdown**: Para formateo de texto
- **Renderizado de Componentes Estructurados**:
  - Detecta `type: "card_data"` y renderiza `MagicCard`
  - Muestra explicaciones de IA cuando están disponibles
- **Extracción de Imágenes Legacy**:
  - Detecta `**SCRYFALL_ID:**` y construye URLs
  - Fallback a markdown `![alt](url)`
  - Renderiza imágenes antes del texto

#### `MagicCard.tsx` 🆕

Componente dedicado para renderizar cartas de Magic: The Gathering:

**Props**: `{ card: ScryfallCard }`

**Secciones**:

- Imagen completa de la carta (izquierda)
- Arte recortado (`art_crop`) al lado del nombre
- Nombre y mana cost (con `ManaCost` component)
- Tipo de carta
- Texto de oráculo
- Poder/Resistencia (si aplica)
- Rareza con indicador de color
- Precios (USD, EUR)
- Link a Scryfall

**Diseño**:

- Barra de color lateral basada en color identity
- Layout responsive
- Hover effects
- Integrado con tema de la app

#### `ManaCost.tsx` 🆕

Componente para renderizar símbolos de mana de MTG:

**Props**: `{ manaCost: string, size?: number }`

**Funcionalidades**:

- Parsea formato Scryfall: `{2}{U}{B}`
- Renderiza SVGs de colores desde `/public/icons/colors/`
- Mana genérico como círculos numerados
- Símbolos híbridos divididos verticalmente
- Totalmente personalizable (tamaño, espaciado)

**Componentes Internos**:

- `ManaSymbol`: Renderiza un símbolo individual
- `HybridManaSymbol`: Renderiza símbolos híbridos (split)

- **Componentes Custom**:
  - Headings con estilos
  - Code blocks con syntax highlighting
  - Links con estilos
  - Listas con viñetas

**Regex para Scryfall ID**:
\`\`\`typescript
const scryfallIdRegex = /\*\*SCRYFALL_ID:\*\*\s\*([a-f0-9-]+)/gi;
\`\`\`

#### \`UserMenu.tsx\`

Muestra:

- Avatar del usuario (40x40)
- Username
- Roles con separador (•)
- Botón de logout

**Fetching**: \`/api/auth/me\` en \`useEffect\`

#### \`TopicSelector.tsx\`

Selector de subtabs con:

- Grid responsive
- Iconos y títulos
- Estado activo con estilos

---

## 📊 Base de Datos MongoDB

### Colecciones Utilizadas

#### \`APIGateway.APIDocs\`

Almacena documentación de APIs internas

\`\`\`typescript
{
\_id: ObjectId,
name: string,
description: string,
baseUrl: string,
version: string,
endpoints: Array<EndpointDoc>,
authentication: AuthDoc,
createdAt: Date,
updatedAt: Date
}
\`\`\`

#### \`GYAccounts.Metadata\`

Información de usuarios y permisos

\`\`\`typescript
{
\_id: ObjectId,
userId: string, // Auth0 user ID
username: string,
email: string,
roles: string[], // ['IA', 'ADMIN', 'DEVELOPER', 'COMMON']
picture: string,
profile: {
id: string
},
createdAt: Date,
updatedAt: Date
}
\`\`\`

#### \`GYBooks.Metadata\`

Perfiles extendidos y biografías

\`\`\`typescript
{
\_id: ObjectId,
profileId: string,
biography: string,
metadata: any,
createdAt: Date,
updatedAt: Date
}
\`\`\`

---

## ⚙️ Configuración

### Variables de Entorno

\`\`\`env

# Auth0

AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Google Gemini

GEMINI_API_KEY=your-gemini-api-key

# MongoDB

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# GitHub

GITHUB_TOKEN=ghp_your-github-token
\`\`\`

### Instalación

\`\`\`bash
npm install

# o

pnpm install
\`\`\`

### Desarrollo

\`\`\`bash
npm run dev

# o

pnpm dev
\`\`\`

La aplicación estará disponible en \`http://localhost:3000\`

---

## 🔄 Flujo de Funcionamiento

### 1. Autenticación

\`\`\`
Usuario → /auth/login → Auth0 → Callback → /api/auth/[auth0] → Sesión creada
\`\`\`

### 2. Verificación de Permisos

\`\`\`
page.tsx → useEffect → fetch(/api/auth/me) → MongoDB → Verificar roles → Renderizar UI
\`\`\`

### 3. Interacción con IA

\`\`\`
Usuario escribe prompt
↓
ChatPanel detecta tab activo
↓
POST /api/[endpoint] con { prompt }
↓
Endpoint consulta contexto (MongoDB/Archivos/APIs)
↓
Gemini genera respuesta
↓
Respuesta devuelta al frontend
↓
ChatResponse renderiza con markdown + imágenes
\`\`\`

### 4. Renderizado de Imágenes (MTG)

\`\`\`
Backend: Scryfall API → Obtiene card.id
↓
Backend: Incluye **SCRYFALL_ID:** {id} en contexto
↓
Gemini: Copia el ID en su respuesta
↓
ChatResponse: Extrae ID con regex
↓
ChatResponse: Construye URL de imagen
↓
<img src="https://cards.scryfall.io/normal/front/f/d/{id}.jpg" />
\`\`\`

---

## 🎯 Tabs y Endpoints

| Tab            | Icon | Endpoint                    | Descripción                    |
| -------------- | ---- | --------------------------- | ------------------------------ |
| **GYCODING**   | 🏢   | \`/api/gemini\`             | IA general de GYCODING         |
| ↳ API          | 🔌   | \`/api/gemini/api\`         | Consulta APIs en MongoDB       |
| ↳ Code Review  | 👨‍💻   | \`/api/gemini/code-review\` | Revisa código de GitHub        |
| **Heralds**    | ⚔️   | \`/api/heralds\`            | Historia de Heralds of Chaos   |
| **Stormlight** | 📖   | \`/api/stormlight\`         | RPG de Stormlight Archive      |
| **MTG**        | 🎴   | \`/api/gemini/mtg\`         | Cartas de Magic: The Gathering |

---

## 🚀 Características Clave

### ✅ Implementadas

- ✅ Autenticación con Auth0
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Sistema multi-tab con subtabs
- ✅ Integración con Google Gemini 2.5 Flash
- ✅ Consultas a MongoDB en tiempo real
- ✅ Integración con GitHub API
- ✅ Integración con Scryfall API (MTG)
- ✅ Renderizado de markdown con imágenes
- ✅ Construcción automática de URLs de imágenes desde IDs
- ✅ UI animada con AnimateUI
- ✅ Perfiles de usuario con avatares
- ✅ Sistema de permisos granular

### 🔮 Futuras Mejoras

- 📝 Historial de conversaciones persistente
- 🔍 Búsqueda en historial
- 📎 Subida de archivos para análisis
- 🎨 Temas personalizables
- 🌐 Internacionalización (i18n)
- 📊 Dashboard de analytics
- 🔔 Sistema de notificaciones

---

## 📝 Notas Técnicas

### Sistema de Imágenes

El sistema usa un enfoque **ID-based** en lugar de **URL-based** para evitar que la IA invente URLs incorrectas:

1. Backend extrae \`card.id\` de Scryfall
2. Backend pasa \`**SCRYFALL_ID:** {id}\` al contexto de Gemini
3. Gemini copia exactamente ese ID en su respuesta
4. Frontend extrae el ID con regex
5. Frontend construye la URL siguiendo el formato de Scryfall

**Ventajas**:

- URLs siempre válidas (no inventadas por IA)
- Menor probabilidad de errores 404
- IDs son más confiables que URLs completas

### MongoDB Connection

El cliente de MongoDB usa un patrón singleton:

\`\`\`typescript
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
if (cachedClient) return cachedClient;

cachedClient = new MongoClient(MONGODB_URI);
await cachedClient.connect();

return cachedClient;
}
\`\`\`

Esto evita crear múltiples conexiones en modo desarrollo (Hot Reload).

### Middleware de Auth0

El middleware protege rutas automáticamente pero permite rutas públicas:

\`\`\`typescript
export default auth0.middleware({
middleware: async (req) => {
const pathname = req.nextUrl.pathname;

    // Rutas públicas
    if (isPublicPath(pathname)) return NextResponse.next();

    // Verificar sesión
    const session = await auth0.getSession();
    if (!session) return NextResponse.redirect('/auth/login');

    return NextResponse.next();

}
});
\`\`\`

---

## 🤝 Contribución

Este es un proyecto interno de **GY-CODING**. Para contribuir:

1. Fork el repositorio
2. Crea una rama (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit tus cambios (\`git commit -m 'Añade nueva funcionalidad'\`)
4. Push a la rama (\`git push origin feature/nueva-funcionalidad\`)
5. Abre un Pull Request

---

## 📄 Licencia

Proyecto privado de **GY-CODING** - Todos los derechos reservados

---

## 👥 Autores

- **GY-CODING Team** - Desarrollo y mantenimiento

---

## 📞 Soporte

Para soporte interno, contactar al equipo de desarrollo de GY-CODING.
