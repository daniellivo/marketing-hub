# SEO Technical Checklist

## Índice

1. [Introducción](#introducción)
2. [Crawling y Indexación](#crawling-y-indexación)
3. [Arquitectura del Sitio](#arquitectura-del-sitio)
4. [Performance y Velocidad](#performance-y-velocidad)
5. [Mobile-First](#mobile-first)
6. [Structured Data (Schema)](#structured-data-schema)
7. [Seguridad y HTTPS](#seguridad-y-https)
8. [URLs y Redirecciones](#urls-y-redirecciones)
9. [XML Sitemaps](#xml-sitemaps)
10. [Core Web Vitals](#core-web-vitals)
11. [Herramientas de Auditoría](#herramientas-de-auditoría)

---

## Introducción

El SEO técnico es la **base fundamental** sobre la que se construye cualquier estrategia de contenido. Un sitio web técnicamente optimizado permite que:

1. **Google pueda crawlear** todas las páginas importantes
2. **Las páginas se indexen** correctamente
3. **Los usuarios tengan una experiencia rápida** y sin fricciones
4. **Los motores de búsqueda entiendan** el contenido mediante structured data

Este checklist está diseñado para ser ejecutado en **tres momentos clave**:

- **Pre-Launch**: Antes de lanzar nuevas páginas o secciones
- **Post-Launch**: Inmediatamente después del lanzamiento (verificación)
- **Maintenance**: Auditorías trimestrales de todo el sitio

### Niveles de Prioridad

- 🔴 **Critical**: Debe resolverse inmediatamente (bloquea indexación o experiencia de usuario)
- 🟡 **High**: Resolver en 1-2 semanas (impacto significativo en SEO)
- 🟢 **Medium**: Resolver en 1 mes (optimización deseable)
- ⚪ **Low**: Nice to have (impacto menor)

---

## Crawling y Indexación

### Robots.txt

**Objetivo**: Controlar qué partes del sitio pueden crawlear los motores de búsqueda.

#### ✅ Checklist

- [ ] 🔴 **Archivo robots.txt existe** y es accesible en `https://livo.es/robots.txt`
- [ ] 🔴 **No bloquea páginas importantes** (revisar con Google Search Console)
- [ ] 🟡 **Incluye referencia al sitemap**: `Sitemap: https://livo.es/sitemap.xml`
- [ ] 🟡 **Bloquea URLs no indexables**:
  - `/admin/`
  - `/api/`
  - `/private/`
  - Parámetros de URL innecesarios
- [ ] 🟢 **Especifica user-agents** si hay reglas específicas para diferentes bots

#### Ejemplo de robots.txt óptimo para Livo:

```
User-agent: *
Allow: /

# Bloquear admin y áreas privadas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /checkout/
Disallow: /cart/

# Bloquear parámetros de búsqueda y filtros
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*?page=

# Permitir crawling de assets
Allow: /assets/
Allow: /*.css$
Allow: /*.js$

# Sitemap
Sitemap: https://livo.es/sitemap.xml
Sitemap: https://livo.es/sitemap-blog.xml
Sitemap: https://livo.es/sitemap-locations.xml
```

#### 🔍 Verificación:

**Herramienta**: Google Search Console → robots.txt Tester

1. Probar URLs importantes (landing pages, blog posts)
2. Confirmar que no están bloqueadas
3. Probar URLs que deberían estar bloqueadas

---

### Meta Robots Tags

**Objetivo**: Control granular de indexación a nivel de página.

#### ✅ Checklist

- [ ] 🔴 **Páginas públicas tienen `index, follow`** (o sin meta robots tag)
- [ ] 🔴 **Páginas privadas tienen `noindex, nofollow`**:
  - Login/Signup pages
  - Panel de usuario
  - Páginas de checkout
  - Thank you pages
- [ ] 🟡 **Páginas duplicadas usan canonical** en lugar de noindex
- [ ] 🟡 **Páginas de paginación** (`/blog/page/2/`) tienen estrategia clara:
  - Opción A: `index, follow` + canonical a sí mismas
  - Opción B: `noindex, follow` (si hay mucha paginación)

#### Implementación:

**Para páginas indexables** (landing pages, blog, products):
```html
<!-- No meta robots tag necesaria (index, follow es default) -->
<!-- O explícitamente: -->
<meta name="robots" content="index, follow">
```

**Para páginas no indexables** (login, checkout):
```html
<meta name="robots" content="noindex, nofollow">
```

**Para páginas duplicadas** (usar canonical en su lugar):
```html
<link rel="canonical" href="https://livo.es/pagina-original/">
```

#### 🔍 Verificación:

**Herramienta**: Screaming Frog SEO Spider

1. Crawlear todo el sitio
2. Exportar "Meta Robots" tab
3. Revisar que páginas importantes no tienen `noindex`
4. Confirmar que páginas privadas sí tienen `noindex`

---

### Canonical URLs

**Objetivo**: Indicar a Google cuál es la versión preferida de contenido duplicado.

#### ✅ Checklist

- [ ] 🔴 **Todas las páginas tienen canonical tag**
- [ ] 🔴 **Canonical apunta a versión correcta**:
  - Con HTTPS (no HTTP)
  - Con o sin www (según configuración)
  - Sin parámetros de tracking
- [ ] 🟡 **Páginas self-canonical** (canonical apunta a sí mismas)
- [ ] 🟡 **Variaciones de parámetros canonicalizan** a versión sin parámetros:
  - `/blog?utm_source=newsletter` → canonical a `/blog`
- [ ] 🟡 **Páginas móviles separadas** (si existen) apuntan a versión desktop
- [ ] 🟢 **Páginas de paginación** tienen estrategia consistente

#### Implementación:

**Página estándar**:
```html
<link rel="canonical" href="https://livo.es/hospital/contratar-enfermeras-barcelona/">
```

**Página con parámetros de tracking**:
```html
<!-- URL: https://livo.es/blog/articulo/?utm_source=email -->
<link rel="canonical" href="https://livo.es/blog/articulo/">
```

**Versión móvil separada** (no recomendado, usar responsive):
```html
<!-- En m.livo.es/pagina/ -->
<link rel="canonical" href="https://livo.es/pagina/">
```

#### 🔍 Verificación:

**Herramienta**: Screaming Frog

1. Exportar "Canonical" tab
2. Verificar que todos los canonicals son absolutos (https://...)
3. Buscar canonical chains (A→B→C)
4. Identificar canonicals rotos (404, 301)

**Errores comunes a evitar**:
- ❌ Canonical relativo: `<link rel="canonical" href="/pagina/">`
- ❌ Canonical chain: A canonicaliza a B, B a C
- ❌ Canonical + noindex en misma página
- ❌ Canonical a URL 404

---

### X-Robots-Tag (HTTP Headers)

**Objetivo**: Control de indexación para archivos no HTML (PDFs, imágenes).

#### ✅ Checklist

- [ ] 🟡 **PDFs privados tienen `X-Robots-Tag: noindex`**
- [ ] 🟢 **Imágenes decorativas** no indexables tienen header
- [ ] 🟢 **Archivos descargables** (whitepapers) son indexables si tienen valor

#### Implementación (Nginx):

```nginx
location /private/ {
    add_header X-Robots-Tag "noindex, nofollow";
}
```

---

## Arquitectura del Sitio

### Jerarquía y Profundidad

**Objetivo**: Que todas las páginas estén a máximo 3 clics desde homepage.

#### ✅ Checklist

- [ ] 🔴 **Páginas importantes a ≤3 clics** desde homepage
- [ ] 🟡 **Estructura piramidal**:
  - Homepage (1 página)
  - Categorías principales (5-10 páginas)
  - Subcategorías (20-50 páginas)
  - Páginas individuales (ilimitadas)
- [ ] 🟡 **Navegación principal** incluye secciones críticas:
  - Productos (Pool, Offers, Interno)
  - Audiencias (Hospitales, Enfermeras)
  - Recursos (Blog)
  - Pricing
- [ ] 🟢 **Footer links** a páginas secundarias importantes
- [ ] 🟢 **Breadcrumbs** en todas las páginas (excepto homepage)

#### Estructura recomendada para Livo:

```
Homepage (livo.es)
│
├─ Productos
│  ├─ Livo Pool (/livo-pool/)
│  ├─ Livo Offers (/livo-offers/)
│  └─ Livo Interno (/livo-interno/)
│
├─ Hospitales (/hospital/)
│  ├─ Contratar Enfermeras Barcelona (/hospital/contratar-enfermeras-barcelona/)
│  ├─ Contratar Enfermeras Madrid (/hospital/contratar-enfermeras-madrid/)
│  ├─ Pool de Enfermeras (/hospital/pool-enfermeras/)
│  └─ Pricing (/hospital/pricing/)
│
├─ Enfermeras (/enfermeras/)
│  ├─ Turnos Enfermería Barcelona (/enfermeras/turnos-enfermeria-barcelona/)
│  ├─ Guardias Enfermería Madrid (/enfermeras/guardias-enfermeria-madrid/)
│  ├─ Cómo Funciona (/enfermeras/como-funciona/)
│  └─ App (/enfermeras/app/)
│
├─ Blog (/blog/)
│  ├─ Categoría: Hospitales (/blog/hospitales/)
│  │  └─ Artículo 1 (/blog/hospitales/como-reducir-absentismo/)
│  └─ Categoría: Enfermeras (/blog/enfermeras/)
│     └─ Artículo 2 (/blog/enfermeras/ventajas-turnos-flexibles/)
│
└─ Empresa
   ├─ Sobre Nosotros (/sobre-nosotros/)
   ├─ Contacto (/contacto/)
   └─ Opiniones (/opiniones/)
```

**Máximo 3 clics**:
- Homepage → Productos → Livo Pool = 2 clics ✅
- Homepage → Blog → Categoría → Artículo = 3 clics ✅
- Homepage → Hospitales → Contratar Barcelona = 2 clics ✅

#### 🔍 Verificación:

**Herramienta**: Screaming Frog → Reports → Crawl Depth

1. Identificar páginas con crawl depth >3
2. Añadir internal links desde páginas de nivel superior
3. Considerar añadir a navegación o footer

---

### Internal Linking

**Objetivo**: Distribuir PageRank y ayudar a Google a entender relaciones entre contenidos.

#### ✅ Checklist

- [ ] 🔴 **Todas las páginas tienen ≥1 internal link** apuntando a ellas
- [ ] 🟡 **Páginas prioritarias tienen 5-10+ internal links**:
  - Landing pages principales
  - Pillar content
  - Product pages
- [ ] 🟡 **Anchor text descriptivo** (no "click aquí"):
  - ✅ "contratar enfermeras en Barcelona"
  - ❌ "haz clic aquí"
- [ ] 🟡 **Hub and Spoke model** implementado:
  - Pillar page → Spokes
  - Spokes → Pillar
  - Spokes ↔ Spokes relacionados
- [ ] 🟢 **Enlaces contextuales en contenido** (no solo navegación)
- [ ] 🟢 **Enlaces a páginas relacionadas** al final de artículos

#### Estrategia de Internal Linking para Livo:

**Pillar Page**: "/hospital/contratar-enfermeras-barcelona/"

**Spokes** (blog posts relacionados):
1. "Cómo Cubrir Turnos de Enfermería en Barcelona"
2. "Reducir Absentismo en Hospitales de Barcelona"
3. "Pool de Enfermeras vs ETT en Barcelona"

**Internal links**:
- Pillar enlaza a 3 spokes (en sección "Artículos relacionados")
- Cada spoke enlaza al pillar (en intro o conclusión)
- Spokes se enlazan entre sí cuando es relevante

**Anchor text variación**:
- "contratar enfermeras en Barcelona"
- "contratación de enfermeras Barcelona"
- "cómo contratar enfermeras en Barcelona"
- "plataforma para contratar enfermeras Barcelona"

#### 🔍 Verificación:

**Herramienta**: Screaming Frog → Internal → Links

1. Identificar orphan pages (0 internal links)
2. Revisar páginas con pocos internal links (<3)
3. Añadir links desde páginas relacionadas

**Herramienta**: Ahrefs Site Audit → Internal Link Opportunities

Identifica automáticamente oportunidades para añadir internal links basándose en menciones de keywords.

---

### Navegación y UX

#### ✅ Checklist

- [ ] 🔴 **Navegación principal consistente** en todas las páginas
- [ ] 🟡 **Breadcrumbs visibles** y correctamente implementados
- [ ] 🟡 **Footer navigation** con enlaces a páginas secundarias
- [ ] 🟢 **Related content** al final de artículos de blog
- [ ] 🟢 **Sidebar** (si aplica) con enlaces a contenido relacionado

#### Implementación de Breadcrumbs:

**HTML**:
```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/">Inicio</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li><a href="/blog/hospitales/">Hospitales</a></li>
    <li aria-current="page">Cómo Reducir Absentismo</li>
  </ol>
</nav>
```

**Schema** (ver sección Structured Data para JSON-LD completo)

---

## Performance y Velocidad

### Page Speed

**Objetivo**: Cargar páginas en <3 segundos (idealmente <2s).

#### ✅ Checklist

- [ ] 🔴 **Time to First Byte (TTFB) <600ms**
- [ ] 🔴 **First Contentful Paint (FCP) <1.8s**
- [ ] 🟡 **Largest Contentful Paint (LCP) <2.5s** (ver Core Web Vitals)
- [ ] 🟡 **Speed Index <3.4s**
- [ ] 🟢 **Time to Interactive (TTI) <3.8s**

#### Optimizaciones:

**1. Server-Side**:
- [ ] 🔴 **CDN implementado** (Cloudflare, AWS CloudFront)
- [ ] 🟡 **Gzip/Brotli compression** habilitada
- [ ] 🟡 **Caching headers** correctos:
  - Assets estáticos: `Cache-Control: public, max-age=31536000, immutable`
  - HTML: `Cache-Control: public, max-age=3600, must-revalidate`
- [ ] 🟢 **HTTP/2 o HTTP/3** habilitado

**2. Assets**:
- [ ] 🔴 **Imágenes optimizadas**:
  - Formato WebP (fallback a JPG/PNG)
  - Comprimidas (TinyPNG, ImageOptim)
  - Dimensiones correctas (no cargar 3000px para mostrar 300px)
- [ ] 🟡 **Lazy loading de imágenes** below the fold:
  ```html
  <img src="imagen.webp" loading="lazy" alt="...">
  ```
- [ ] 🟡 **CSS minificado** y crítico inline
- [ ] 🟡 **JavaScript minificado** y defer/async:
  ```html
  <script src="app.js" defer></script>
  ```
- [ ] 🟢 **Fonts optimizadas**:
  - Subset de caracteres (solo español)
  - `font-display: swap`
  - Preload de fonts críticas

**3. Código**:
- [ ] 🟡 **Eliminar JavaScript no usado** (code splitting)
- [ ] 🟡 **Eliminar CSS no usado** (PurgeCSS)
- [ ] 🟢 **Preconnect a dominios externos**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  ```

#### 🔍 Verificación:

**Herramientas**:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Probar homepage
   - Probar landing page principal
   - Probar artículo de blog
   - Objetivo: Score >90 (mobile y desktop)

2. **WebPageTest**: https://www.webpagetest.org/
   - Más detalle técnico que PSI
   - Waterfall chart para identificar bottlenecks

3. **Chrome DevTools → Lighthouse**:
   - Performance audit
   - Identificar oportunidades específicas

---

### Images Optimization

#### ✅ Checklist

- [ ] 🔴 **Todas las imágenes tienen alt text** descriptivo
- [ ] 🔴 **Formato moderno** (WebP) con fallback:
  ```html
  <picture>
    <source srcset="imagen.webp" type="image/webp">
    <img src="imagen.jpg" alt="Descripción">
  </picture>
  ```
- [ ] 🟡 **Responsive images** con srcset:
  ```html
  <img src="imagen-800.jpg"
       srcset="imagen-400.jpg 400w, imagen-800.jpg 800w, imagen-1200.jpg 1200w"
       sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
       alt="...">
  ```
- [ ] 🟡 **Lazy loading** implementado (excepto hero image)
- [ ] 🟡 **Dimensiones específicas** en HTML (evitar layout shift):
  ```html
  <img src="..." width="800" height="600" alt="...">
  ```
- [ ] 🟢 **CDN para imágenes** (ej: Cloudinary, Imgix)
- [ ] 🟢 **Compresión agresiva** (80-85% quality para JPG)

#### Tamaños recomendados:

| Tipo de imagen | Ancho (px) | Peso máximo |
|----------------|------------|-------------|
| Hero image | 1920 | 200 KB |
| Blog featured image | 1200 | 150 KB |
| In-content image | 800 | 100 KB |
| Thumbnail | 400 | 50 KB |
| Logo | Variable | 20 KB |
| Icon | 64-128 | 10 KB |

---

## Mobile-First

**Concepto**: Google usa la versión móvil para indexar y rankear.

### Mobile Usability

#### ✅ Checklist

- [ ] 🔴 **Diseño responsive** (no mobile separado)
- [ ] 🔴 **Viewport meta tag** configurado:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ```
- [ ] 🔴 **Texto legible sin zoom** (mínimo 16px font-size)
- [ ] 🔴 **Tap targets ≥48px** de tamaño (botones, links)
- [ ] 🔴 **Contenido cabe en pantalla** (no scroll horizontal)
- [ ] 🟡 **No usa Flash** o tecnologías no soportadas
- [ ] 🟡 **Pop-ups intrusivos** evitados o delayed (3-5 segundos)
- [ ] 🟢 **Navegación mobile-friendly** (hamburger menu o similar)

#### 🔍 Verificación:

**Google Search Console → Mobile Usability**:
- Revisar errores reportados
- Corregir páginas con problemas

**Chrome DevTools → Device Mode**:
- Probar en diferentes tamaños (iPhone, Android, tablet)
- Verificar que todo el contenido es accesible

**PageSpeed Insights**:
- Score mobile debe ser >90

---

### Mobile Performance

#### ✅ Checklist específico mobile:

- [ ] 🔴 **LCP <2.5s en 4G**
- [ ] 🟡 **JavaScript reducido** (móviles tienen menos CPU)
- [ ] 🟡 **Imágenes smaller** para móviles (srcset)
- [ ] 🟢 **Service Worker** para caching (PWA)

---

## Structured Data (Schema)

**Objetivo**: Ayudar a Google a entender el contenido y obtener rich results.

### Schemas Prioritarios para Livo

#### ✅ Checklist

- [ ] 🔴 **Organization schema** en homepage
- [ ] 🟡 **LocalBusiness schema** en páginas locales (Barcelona, Madrid)
- [ ] 🟡 **Article schema** en todos los blog posts
- [ ] 🟡 **BreadcrumbList schema** en todas las páginas
- [ ] 🟡 **FAQPage schema** en páginas con FAQ
- [ ] 🟢 **Product schema** en páginas de productos (Pool, Offers)
- [ ] 🟢 **AggregateRating schema** si hay reviews

---

### 1. Organization Schema

**Dónde**: Homepage (livo.es)

**JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Livo",
  "alternateName": "Livo Pool",
  "url": "https://livo.es",
  "logo": "https://livo.es/assets/logo.png",
  "description": "Marketplace líder para contratar enfermeras y profesionales sanitarios en España. Conectamos hospitales con enfermeras cualificadas en menos de 5 horas.",
  "foundingDate": "2023",
  "founders": [
    {
      "@type": "Person",
      "name": "[Nombre fundador]"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Dirección]",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
    "postalCode": "[CP]",
    "addressCountry": "ES"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+34-XXX-XXX-XXX",
    "contactType": "Customer Service",
    "availableLanguage": ["Spanish", "Catalan", "English"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/livo",
    "https://twitter.com/livo",
    "https://www.instagram.com/livo"
  ]
}
```

---

### 2. LocalBusiness Schema

**Dónde**: Páginas locales (/hospital/contratar-enfermeras-barcelona/)

**JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Livo - Contratar Enfermeras Barcelona",
  "image": "https://livo.es/assets/barcelona-hero.jpg",
  "url": "https://livo.es/hospital/contratar-enfermeras-barcelona/",
  "telephone": "+34-XXX-XXX-XXX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.3851,
    "longitude": 2.1734
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "priceRange": "€€",
  "servesCuisine": "Healthcare Staffing"
}
```

---

### 3. Article Schema

**Dónde**: Todos los blog posts

**JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo Reducir el Absentismo en Hospitales: Guía 2026",
  "alternativeHeadline": "Estrategias efectivas para reducir el absentismo del personal de enfermería",
  "image": "https://livo.es/blog/images/absentismo-hospitales.jpg",
  "author": {
    "@type": "Person",
    "name": "Equipo Livo",
    "url": "https://livo.es/sobre-nosotros/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Livo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://livo.es/assets/logo.png"
    }
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-01-15",
  "description": "Descubre las mejores estrategias para reducir el absentismo del personal sanitario en hospitales. Guía completa con datos, casos de uso y soluciones prácticas.",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://livo.es/blog/hospitales/reducir-absentismo/"
  }
}
```

**Elementos opcionales** (añadir si aplica):
```json
{
  "wordCount": 2500,
  "articleSection": "Hospitales",
  "keywords": ["absentismo sanitario", "gestión personal enfermería", "reducir absentismo"]
}
```

---

### 4. BreadcrumbList Schema

**Dónde**: Todas las páginas (excepto homepage)

**JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://livo.es"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://livo.es/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Hospitales",
      "item": "https://livo.es/blog/hospitales/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Cómo Reducir el Absentismo",
      "item": "https://livo.es/blog/hospitales/reducir-absentismo/"
    }
  ]
}
```

---

### 5. FAQPage Schema

**Dónde**: Páginas con sección FAQ

**JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto tiempo tarda en cubrirse un turno con Livo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En promedio, los turnos se cubren en menos de 5 horas. El 85% de las solicitudes reciben respuestas en las primeras 2 horas, y contamos con una tasa de cobertura superior al 85%."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta contratar enfermeras con Livo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Livo cobra una comisión del 15-20% sobre la tarifa horaria del profesional, significativamente menor que las ETTs tradicionales (20-40%). No hay costes de setup ni cuotas mensuales, solo pagas por los turnos cubiertos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué diferencia a Livo de una ETT tradicional?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Livo es un marketplace tecnológico que conecta directamente hospitales con profesionales, reduciendo costes y tiempos. A diferencia de las ETTs, Livo ofrece transparencia total, cobertura en <5 horas, acceso a +50,000 profesionales verificados, y una plataforma digital intuitiva."
      }
    }
  ]
}
```

#### 🔍 Verificación de Structured Data:

**Herramientas**:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Pegar URL o código
   - Verificar que no hay errores

2. **Schema Markup Validator**: https://validator.schema.org/
   - Validación más estricta
   - Muestra warnings adicionales

3. **Google Search Console → Enhancements**:
   - Ver cómo Google procesa el schema
   - Identificar errores en producción

---

## Seguridad y HTTPS

### SSL/TLS Certificate

#### ✅ Checklist

- [ ] 🔴 **HTTPS habilitado** en todo el sitio
- [ ] 🔴 **Certificado válido** y no expirado
- [ ] 🔴 **Redirect HTTP → HTTPS** (301 permanent)
- [ ] 🟡 **HSTS header** implementado:
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```
- [ ] 🟡 **Mixed content** resuelto (todos los assets en HTTPS)
- [ ] 🟢 **HTTPS en todas las propiedades**:
  - Sitio principal
  - Subdominios (blog.livo.es, app.livo.es)
  - CDN

#### 🔍 Verificación:

**SSL Labs**: https://www.ssllabs.com/ssltest/
- Objetivo: Grade A o A+
- Verificar que no hay vulnerabilidades

**Chrome DevTools → Security tab**:
- Confirmar certificado válido
- No mixed content warnings

---

## URLs y Redirecciones

### URL Structure

#### ✅ Checklist

- [ ] 🔴 **URLs descriptivas** (no IDs numéricos):
  - ✅ `/blog/hospitales/reducir-absentismo/`
  - ❌ `/blog/post.php?id=123`
- [ ] 🔴 **Lowercase** siempre:
  - ✅ `/contratar-enfermeras/`
  - ❌ `/Contratar-Enfermeras/`
- [ ] 🔴 **Guiones** (no underscores):
  - ✅ `/pool-de-enfermeras/`
  - ❌ `/pool_de_enfermeras/`
- [ ] 🟡 **URLs cortas** (<60 caracteres idealmente)
- [ ] 🟡 **Sin parámetros innecesarios**:
  - ❌ `/blog/?page_id=42&cat=5`
  - ✅ `/blog/hospitales/`
- [ ] 🟡 **Estructura jerárquica clara**:
  - `/categoria/subcategoria/articulo/`
- [ ] 🟢 **Trailing slash consistente**:
  - Opción A: Siempre con `/` al final
  - Opción B: Nunca con `/`
  - (Elegir una y mantener en todo el sitio)

#### Ejemplos para Livo:

| Tipo de página | Estructura URL |
|----------------|----------------|
| Homepage | `/` |
| Product page | `/livo-pool/` |
| Landing B2B | `/hospital/contratar-enfermeras-barcelona/` |
| Landing B2C | `/enfermeras/turnos-enfermeria-madrid/` |
| Blog category | `/blog/hospitales/` |
| Blog post | `/blog/hospitales/reducir-absentismo/` |
| Static page | `/sobre-nosotros/` |

---

### Redirects

#### ✅ Checklist

- [ ] 🔴 **301 redirects para cambios permanentes**:
  - Páginas movidas
  - Reestructuración de URLs
  - HTTP → HTTPS
  - www → non-www (o viceversa)
- [ ] 🔴 **No redirect chains** (A→B→C):
  - Máximo 1 redirect
  - Redirect directamente a destino final
- [ ] 🟡 **Redirects de páginas 404** con tráfico:
  - Revisar GSC para páginas 404 con impresiones
  - Redirect a página relevante o crear contenido
- [ ] 🟡 **302 solo para cambios temporales**:
  - A/B tests
  - Mantenimiento temporal
- [ ] 🟢 **Redirects de old domain** (si aplica)

#### Implementación (Nginx):

**301 Redirect**:
```nginx
# Redirect HTTP a HTTPS
server {
    listen 80;
    server_name livo.es www.livo.es;
    return 301 https://livo.es$request_uri;
}

# Redirect www a non-www
server {
    listen 443 ssl;
    server_name www.livo.es;
    return 301 https://livo.es$request_uri;
}

# Redirect URL específica
location = /old-page/ {
    return 301 /new-page/;
}

# Redirect patrón
rewrite ^/blog/categoria/(.*)$ /blog/nueva-categoria/$1 permanent;
```

#### 🔍 Verificación:

**Screaming Frog**:
- Crawlear sitio
- Filtrar por "Redirection (3xx)"
- Identificar chains y loops

**Google Search Console → Coverage**:
- Ver páginas "Redirect error"
- Corregir chains

---

## XML Sitemaps

### Sitemap Structure

#### ✅ Checklist

- [ ] 🔴 **Sitemap.xml existe** en `/sitemap.xml`
- [ ] 🔴 **Sitemap submitted a GSC**
- [ ] 🟡 **Solo páginas indexables** (no noindex)
- [ ] 🟡 **URLs absolutas** (https://livo.es/page/)
- [ ] 🟡 **Lastmod actualizado** (cuando se modifica contenido)
- [ ] 🟡 **Priority y changefreq** (opcional pero recomendado)
- [ ] 🟢 **Sitemaps separados por tipo**:
  - `/sitemap.xml` (índice)
  - `/sitemap-pages.xml` (páginas estáticas)
  - `/sitemap-blog.xml` (blog posts)
  - `/sitemap-locations.xml` (páginas locales)
  - `/sitemap-images.xml` (imágenes importantes)

#### Estructura de Sitemap Index:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://livo.es/sitemap-pages.xml</loc>
    <lastmod>2026-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://livo.es/sitemap-blog.xml</loc>
    <lastmod>2026-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://livo.es/sitemap-locations.xml</loc>
    <lastmod>2026-01-15</lastmod>
  </sitemap>
</sitemapindex>
```

#### Sitemap de Páginas:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://livo.es/</loc>
    <lastmod>2026-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://livo.es/livo-pool/</loc>
    <lastmod>2026-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://livo.es/hospital/contratar-enfermeras-barcelona/</loc>
    <lastmod>2026-01-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

#### Guidelines de Priority:

| Tipo de página | Priority |
|----------------|----------|
| Homepage | 1.0 |
| Product pages principales | 0.9 |
| Landing pages prioritarias | 0.8 |
| Blog posts recientes | 0.7 |
| Blog posts antiguos | 0.5 |
| Páginas secundarias | 0.4 |

#### Guidelines de Changefreq:

| Tipo de página | Changefreq |
|----------------|------------|
| Homepage | weekly |
| Product pages | monthly |
| Blog posts | yearly |
| Landing pages | monthly |

#### 🔍 Verificación:

**Google Search Console → Sitemaps**:
- Submitted sitemaps
- Páginas discovered vs indexed
- Errores (URLs 404, redirects, noindex)

**Validador XML**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## Core Web Vitals

**Concepto**: Métricas de experiencia de usuario que son factores de ranking.

### Las 3 Métricas Core

#### 1. Largest Contentful Paint (LCP)

**Qué mide**: Tiempo hasta que el elemento más grande se renderiza.

**Objetivo**:
- 🟢 Good: <2.5s
- 🟡 Needs Improvement: 2.5-4.0s
- 🔴 Poor: >4.0s

**Optimizaciones**:
- [ ] 🔴 **Optimizar servidor** (TTFB <600ms)
- [ ] 🔴 **Preload hero image**:
  ```html
  <link rel="preload" as="image" href="hero.jpg">
  ```
- [ ] 🟡 **Usar CDN** para imágenes
- [ ] 🟡 **Eliminar render-blocking resources**:
  - CSS crítico inline
  - Defer non-critical CSS
  - Defer JavaScript

**Identificar LCP element**:
```javascript
// Chrome DevTools → Performance → LCP
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP element:', lastEntry.element);
}).observe({entryTypes: ['largest-contentful-paint']});
```

---

#### 2. First Input Delay (FID) / Interaction to Next Paint (INP)

**Qué mide**: Tiempo entre primera interacción y respuesta del navegador.

**Nota**: FID será reemplazado por INP en 2024.

**Objetivo**:
- 🟢 Good FID: <100ms
- 🟢 Good INP: <200ms
- 🟡 Needs Improvement INP: 200-500ms
- 🔴 Poor INP: >500ms

**Optimizaciones**:
- [ ] 🔴 **Reducir JavaScript execution time**:
  - Code splitting
  - Lazy loading de módulos
  - Eliminar código no usado
- [ ] 🟡 **Web Workers** para tareas pesadas
- [ ] 🟡 **Defer third-party scripts**:
  ```html
  <script src="analytics.js" async></script>
  ```
- [ ] 🟢 **Usar `requestIdleCallback`** para tareas no críticas

---

#### 3. Cumulative Layout Shift (CLS)

**Qué mide**: Cambios inesperados en el layout mientras se carga la página.

**Objetivo**:
- 🟢 Good: <0.1
- 🟡 Needs Improvement: 0.1-0.25
- 🔴 Poor: >0.25

**Optimizaciones**:
- [ ] 🔴 **Especificar dimensiones de imágenes**:
  ```html
  <img src="..." width="800" height="600" alt="...">
  ```
- [ ] 🔴 **Especificar dimensiones de ads/embeds**:
  ```html
  <div style="width: 728px; height: 90px;">
    <!-- Ad code -->
  </div>
  ```
- [ ] 🟡 **Preload fonts** y usar `font-display: swap`:
  ```css
  @font-face {
    font-family: 'MyFont';
    src: url('font.woff2');
    font-display: swap;
  }
  ```
- [ ] 🟡 **Evitar insertar contenido above the fold** dinámicamente
- [ ] 🟡 **Reserve espacio para dynamic content**:
  ```css
  .dynamic-content {
    min-height: 300px; /* Reserve space */
  }
  ```

**Identificar elementos causando CLS**:
```javascript
// Chrome DevTools → Performance → Experience
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('Layout shift:', entry);
    console.log('Elements:', entry.sources);
  });
}).observe({entryTypes: ['layout-shift']});
```

---

### Monitoring de Core Web Vitals

#### Real User Monitoring (RUM)

**Google Search Console → Core Web Vitals**:
- Data real de usuarios
- Segmentado por URL groups
- Mobile vs Desktop

**Chrome User Experience Report (CrUX)**:
- Data agregada de usuarios reales de Chrome
- Disponible en PageSpeed Insights

#### Lab Data

**Google PageSpeed Insights**:
- Simulated data en condiciones controladas
- Útil para testing pre-deploy

**Chrome DevTools → Lighthouse**:
- Local testing
- Métricas consistentes para comparar cambios

#### 🔍 Proceso de mejora:

1. **Identificar páginas problemáticas** (GSC → Core Web Vitals)
2. **Analizar con PSI** para ver métricas específicas
3. **Identificar oportunidades** (PSI suggestions)
4. **Implementar fixes**
5. **Re-test con Lighthouse** (local)
6. **Deploy y monitor** (GSC + CrUX data después de 28 días)

---

## Herramientas de Auditoría

### Herramientas Esenciales

#### 1. Google Search Console (Gratuito)

**Usos**:
- Performance de keywords
- Coverage (indexación)
- Mobile usability
- Core Web Vitals
- Sitemaps status
- Manual actions

**Frecuencia**: Revisar semanalmente

---

#### 2. Screaming Frog SEO Spider (Freemium)

**Usos**:
- Crawl completo del sitio
- Identificar errores técnicos:
  - 404s, 301 chains
  - Missing meta tags
  - Duplicate content
  - Orphan pages
- Exportar data para análisis

**Configuración óptima**:
```
Configuration → Spider:
- Follow internal links: Yes
- Crawl external links: No (unless doing backlink check)
- Respect robots.txt: Yes (for production), No (for pre-launch)

Configuration → Limits:
- Max URI length: 2083
- Max crawl depth: 5

Configuration → Speed:
- Max threads: 5 (para no sobrecargar servidor)
```

**Frecuencia**: Mensual (full crawl)

---

#### 3. Ahrefs Site Audit (De pago)

**Usos**:
- Health score del sitio
- Errores técnicos priorizados
- Internal linking analysis
- Keyword cannibalization
- Backlink health

**KPIs a monitorear**:
- Health score (objetivo: >90)
- Critical errors (objetivo: 0)
- Warnings (objetivo: <50)

**Frecuencia**: Configurar crawl automático semanal

---

#### 4. Google PageSpeed Insights (Gratuito)

**Usos**:
- Core Web Vitals
- Performance score
- Specific optimizations

**Páginas a probar**:
- Homepage
- Top 5 landing pages
- Top 5 blog posts
- Producto pages

**Frecuencia**: Mensual + antes/después de cambios

---

#### 5. GTmetrix (Freemium)

**Usos**:
- Performance testing
- Waterfall analysis
- Monitoring histórico

**Frecuencia**: Semanal (automated monitoring)

---

### Proceso de Auditoría Completa

**Frecuencia**: Trimestral

#### Checklist de Auditoría:

**1. Crawl y Indexación (2-3 horas)**:
- [ ] Crawl con Screaming Frog
- [ ] Analizar GSC Coverage
- [ ] Verificar robots.txt y sitemaps
- [ ] Identificar páginas 404 con tráfico
- [ ] Revisar redirect chains

**2. On-Page SEO (3-4 horas)**:
- [ ] Missing title tags / meta descriptions
- [ ] Duplicate titles/descriptions
- [ ] Thin content (<300 palabras)
- [ ] Missing H1s o H1s duplicados
- [ ] Missing alt text en imágenes
- [ ] Broken internal links

**3. Performance (2-3 horas)**:
- [ ] PSI score para páginas clave
- [ ] Core Web Vitals (GSC)
- [ ] Identificar páginas lentas
- [ ] Review de imágenes no optimizadas
- [ ] JavaScript/CSS bloating

**4. Mobile (1-2 horas)**:
- [ ] GSC Mobile Usability
- [ ] Test manual en dispositivos
- [ ] Mobile PSI score

**5. Structured Data (1-2 horas)**:
- [ ] Validar schemas existentes
- [ ] Identificar oportunidades (nuevos schemas)
- [ ] Revisar errores en GSC Enhancements

**6. Security (30 min)**:
- [ ] SSL cert validity
- [ ] Mixed content
- [ ] HTTPS redirects

**7. UX y Conversión (1-2 horas)**:
- [ ] Bounce rate por página
- [ ] Time on page
- [ ] Exit pages
- [ ] Conversion funnels

**Total**: ~12-18 horas para auditoría completa

---

## Conclusión

Este Technical SEO Checklist debe ser utilizado como **living document**:

- **Pre-launch**: Para nuevas páginas/secciones
- **Post-launch**: Verificación inmediata
- **Maintenance**: Auditorías trimestrales

### Priorización de Fixes

Cuando se identifican múltiples issues, priorizar por:

1. **🔴 Critical (resolver inmediatamente)**:
   - Bloquean indexación (robots.txt, noindex accidental)
   - Rompen experiencia de usuario (site down, errores JS críticos)
   - Penalizaciones (manual actions, malware)

2. **🟡 High (resolver en 1-2 semanas)**:
   - Impactan rankings significativamente (Core Web Vitals poor, mobile usability)
   - Muchas páginas afectadas (missing meta tags en 100+ páginas)

3. **🟢 Medium (resolver en 1 mes)**:
   - Optimizaciones deseables (structured data adicional, internal linking)
   - Mejoras incrementales (image optimization, minification)

4. **⚪ Low (backlog)**:
   - Nice to have (minor optimizations)
   - Low impact (pages con muy poco tráfico)

### Recursos Adicionales

**Documentación oficial**:
- Google Search Central: https://developers.google.com/search
- Schema.org: https://schema.org/
- Web.dev (Google): https://web.dev/

**Herramientas mencionadas**:
- Google Search Console: https://search.google.com/search-console
- Screaming Frog: https://www.screamingfrog.co.uk/seo-spider/
- Ahrefs: https://ahrefs.com/
- PageSpeed Insights: https://pagespeed.web.dev/

---

**Última actualización**: Enero 2026
**Versión**: 1.0
**Owner**: Equipo SEO Livo
