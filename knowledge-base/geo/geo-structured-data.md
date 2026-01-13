# GEO Structured Data Implementation

## Índice

1. [Introducción](#introducción)
2. [Por Qué Structured Data es Crítico para GEO](#por-qué-structured-data-es-crítico-para-geo)
3. [Schema.org: El Lenguaje de los LLMs](#schemaorg-el-lenguaje-de-los-llms)
4. [JSON-LD: Formato Recomendado](#json-ld-formato-recomendado)
5. [Schemas Prioritarios para Livo](#schemas-prioritarios-para-livo)
6. [Implementación Técnica](#implementación-técnica)
7. [Testing y Validación](#testing-y-validación)
8. [Advanced Schemas](#advanced-schemas)
9. [Monitoring y Maintenance](#monitoring-y-maintenance)

---

## Introducción

**Structured data** (datos estructurados) es información organizada en un formato estandarizado que las máquinas pueden leer y entender fácilmente. Para GEO, structured data es **crítico** porque los LLMs (Large Language Models) lo procesan más eficientemente que texto plano.

### Analogía

**Texto plano** (para humanos):
```
Livo es una plataforma para contratar enfermeras en España. Fue fundada en 2023
y tiene oficinas en Barcelona.
```

**Structured data** (para máquinas):
```json
{
  "@type": "Organization",
  "name": "Livo",
  "foundingDate": "2023",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressCountry": "ES"
  }
}
```

**Para LLMs**: La versión estructurada es mucho más fácil de procesar, extraer y usar en respuestas.

---

## Por Qué Structured Data es Crítico para GEO

> **🔑 Concepto clave**: Mientras que el contenido define qué entiende la IA, el GEO técnico determina si la IA puede **encontrar, parsear y confiar** en él. Los motores generativos dependen en gran medida de datos estructurados, señales claras del sitio y frameworks legibles por máquinas para identificar fuentes autorizadas.

### 1. LLMs Procesan Structured Data Directamente

**Los LLMs pueden**:
- **Extraer información** sin necesidad de "leer" y "comprender" párrafos
- **Validar datos** (tipo de dato, formato correcto)
- **Relacionar entidades** (Livo → Organization → Barcelona → City)
- **Inferir contexto** rápidamente

**Ejemplo**:

**Sin structured data**:
```html
<p>Livo Pool cuesta entre 15-20% de comisión</p>
```

**LLM debe**:
1. Leer texto
2. Identificar "Livo Pool" como producto
3. Extraer "15-20%" como rango de precio
4. Inferir que es comisión (no precio total)

**Con structured data**:
```json
{
  "@type": "Product",
  "name": "Livo Pool",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "15-20",
      "priceCurrency": "EUR",
      "unitText": "PERCENT"
    }
  }
}
```

**LLM lee directamente**: "Livo Pool, producto, precio 15-20%, moneda EUR, unidad porcentaje"

**Resultado**: **Mayor probabilidad de ser citado correctamente**.

### 2. Mejora Accuracy de Citaciones

**Problema sin structured data**:
```
LLM lee: "Livo fue fundada en Barcelona a finales de 2023 por un equipo con
experiencia en salud y tecnología"

LLM puede citar:
- "Livo fue fundada en 2023" ✓
- "Livo fue fundada en 2024" ✗ (error de interpretación)
- "Livo fue fundada en Barcelona en 2023" ✓
```

**Con structured data**:
```json
{
  "foundingDate": "2023-12-01"
}
```

**LLM cita**: "Livo fue fundada en diciembre de 2023" ✓✓✓ (datos precisos)

### 3. Entity Recognition y Knowledge Graphs

**Google Knowledge Graph**, **Bing Satori**, y otros sistemas de LLMs usan structured data para construir sus knowledge graphs.

**Con structured data robusto**:
```
Livo → Reconocido como Organization
      → Asociado con Healthcare Industry
      → Ubicado en Barcelona, Spain
      → Ofrece Service: Healthcare Staffing
      → Fundado 2023
      → Relacionado con: Hospitals, Nurses, Healthcare Professionals
```

**Impacto**: Cuando LLM necesita información sobre "plataformas de contratación sanitaria en España", **Livo aparece en su knowledge graph** como entidad relevante.

### 4. Voice Search y Conversational AI

**Búsquedas por voz** procesadas por AI usan heavily structured data:

**User**: "Hey Google, ¿cuánto cuesta contratar una enfermera en Barcelona?"

**Google Assistant**:
1. Busca en knowledge graph entidades relacionadas: "contratar enfermera", "Barcelona"
2. Encuentra Livo (Organization, location: Barcelona, service: healthcare staffing)
3. Extrae pricing de structured data
4. Responde: "Según Livo, contratar una enfermera en Barcelona cuesta €25-35 por hora más una comisión del 15-20%"

**Sin structured data**: Mucho menos probable que sea seleccionado como fuente.

---

## Schema.org: El Lenguaje de los LLMs

### ¿Qué es Schema.org?

**Schema.org** es un vocabulario estandarizado creado por Google, Microsoft, Yahoo y Yandex para describir contenido web de forma estructurada.

**Sitio oficial**: https://schema.org/

### Tipos de Schema (Types)

Schema.org tiene **800+ tipos** organizados jerárquicamente.

**Jerarquía ejemplo**:
```
Thing (raíz - todo hereda de Thing)
  ↓
Organization
  ↓
LocalBusiness
  ↓
HealthAndBeautyBusiness
    ↓
  MedicalBusiness
```

### Propiedades (Properties)

Cada tipo tiene **propiedades específicas**.

**Ejemplo: Organization**:
- `name`: Nombre de la organización
- `url`: Sitio web
- `logo`: Logo
- `foundingDate`: Fecha de fundación
- `address`: Dirección
- `contactPoint`: Información de contacto
- `sameAs`: Perfiles en redes sociales
- etc.

**Documentación**: https://schema.org/Organization

---

## JSON-LD: Formato Recomendado

### ¿Qué es JSON-LD?

**JSON-LD** (JSON for Linking Data) es un formato para escribir structured data en JSON.

**Por qué JSON-LD** (vs Microdata o RDFa):
- ✅ **Fácil de implementar**: Se añade en `<script type="application/ld+json">` en HTML
- ✅ **No afecta diseño**: Separado del HTML visible
- ✅ **Fácil de mantener**: Cambios en datos no requieren cambiar markup
- ✅ **Recomendado por Google**: Preferido para SEO y GEO
- ✅ **LLMs lo procesan directamente**: Formato nativo para AI

### Estructura Básica

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TypeName",
  "propertyName": "value",
  "anotherProperty": {
    "@type": "NestedType",
    "nestedProperty": "value"
  }
}
</script>
```

**Elementos**:
- `@context`: Siempre `"https://schema.org"` (define vocabulario)
- `@type`: Tipo de schema (Organization, Product, Article, etc.)
- Propiedades: Según el tipo de schema

---

## Schemas Prioritarios para Livo

### 1. Organization Schema (Homepage)

**Dónde**: Homepage (livo.es)

**Propósito**: Definir Livo como entidad organizacional.

**Implementación completa**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Livo",
  "legalName": "Livo Spain S.L.",
  "alternateName": "Livo Pool",
  "url": "https://livo.es",
  "logo": "https://livo.es/assets/logo.png",
  "description": "Marketplace líder para contratar enfermeras y profesionales sanitarios en España. Conectamos hospitales con más de 50,000 enfermeras verificadas en menos de 5 horas.",

  "foundingDate": "2023",

  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Calle y número]",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
    "postalCode": "[CP]",
    "addressCountry": "ES"
  },

  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+34-XXX-XXX-XXX",
      "contactType": "customer service",
      "areaServed": "ES",
      "availableLanguage": ["Spanish", "Catalan", "English"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "20:00"
      }
    },
    {
      "@type": "ContactPoint",
      "telephone": "+34-XXX-XXX-XXX",
      "contactType": "sales",
      "areaServed": "ES",
      "availableLanguage": ["Spanish", "Catalan"]
    }
  ],

  "sameAs": [
    "https://www.linkedin.com/company/livo",
    "https://twitter.com/livo",
    "https://www.instagram.com/livo",
    "https://www.facebook.com/livo"
  ],

  "founder": [
    {
      "@type": "Person",
      "name": "[Nombre Fundador 1]"
    },
    {
      "@type": "Person",
      "name": "[Nombre Fundador 2]"
    }
  ],

  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "20-50"
  },

  "areaServed": {
    "@type": "Country",
    "name": "Spain"
  },

  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Livo Pool",
        "description": "Marketplace de enfermeras eventuales"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Livo Offers",
        "description": "Plataforma de reclutamiento sanitario"
      }
    }
  ]
}
</script>
```

**Propiedades clave para GEO**:
- `description`: Resumen que LLMs pueden usar
- `foundingDate`: Contexto temporal
- `address`: Ubicación geográfica
- `sameAs`: Links a perfiles sociales (autoridad)
- `makesOffer`: Servicios que ofreces

### 2. LocalBusiness Schema (Páginas Locales)

**Dónde**: Páginas geográficas específicas
- /hospital/contratar-enfermeras-barcelona/
- /hospital/contratar-enfermeras-madrid/

**Propósito**: Señalar presencia local y operaciones en esa ciudad.

**Implementación**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Livo - Contratar Enfermeras Barcelona",
  "image": "https://livo.es/images/barcelona-hero.jpg",
  "@id": "https://livo.es/hospital/contratar-enfermeras-barcelona/",
  "url": "https://livo.es/hospital/contratar-enfermeras-barcelona/",

  "telephone": "+34-XXX-XXX-XXX",

  "priceRange": "€€",

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

  "areaServed": {
    "@type": "City",
    "name": "Barcelona"
  },

  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de Contratación de Enfermeras en Barcelona",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Contratar Enfermeras DUE",
          "description": "Enfermeras tituladas para hospitales en Barcelona"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Contratar TCAE",
          "description": "Auxiliares de enfermería para centros sanitarios"
        }
      }
    ]
  }
}
</script>
```

**Propiedades clave**:
- `geo`: Coordenadas geográficas (para búsquedas locales)
- `areaServed`: Ciudad específica
- `hasOfferCatalog`: Servicios ofrecidos en esa localidad

### 3. Article Schema (Blog Posts)

**Dónde**: Todos los blog posts

**Propósito**: Identificar contenido como artículo authoritative.

**Implementación**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Pool de Enfermeras vs ETT: Comparativa Completa 2026",
  "alternativeHeadline": "Análisis exhaustivo de pools digitales vs ETTs tradicionales para hospitales",

  "image": [
    "https://livo.es/blog/images/pool-vs-ett-hero.jpg",
    "https://livo.es/blog/images/pool-vs-ett-comparison.jpg"
  ],

  "datePublished": "2026-01-15T09:00:00+01:00",
  "dateModified": "2026-01-15T09:00:00+01:00",

  "author": {
    "@type": "Person",
    "name": "Laura Martínez",
    "url": "https://livo.es/equipo/laura-martinez/",
    "jobTitle": "Directora de Operaciones",
    "worksFor": {
      "@type": "Organization",
      "name": "Livo"
    },
    "sameAs": "https://www.linkedin.com/in/laura-martinez-livo/"
  },

  "publisher": {
    "@type": "Organization",
    "name": "Livo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://livo.es/assets/logo.png",
      "width": 600,
      "height": 60
    }
  },

  "description": "Comparativa detallada entre pools digitales de enfermeras y ETTs tradicionales: costes, tiempos, ventajas y cuándo elegir cada opción para tu hospital.",

  "articleBody": "[Primer párrafo del artículo...]",

  "wordCount": 2500,

  "articleSection": "Gestión Hospitalaria",

  "keywords": ["pool enfermeras", "ETT", "personal sanitario", "contratar enfermeras"],

  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://livo.es/blog/pool-vs-ett/"
  },

  "about": [
    {
      "@type": "Thing",
      "name": "Pool de Enfermeras"
    },
    {
      "@type": "Thing",
      "name": "ETT Sanitaria"
    }
  ]
}
</script>
```

**Propiedades clave para GEO**:
- `author`: Credenciales del autor (E-E-A-T)
- `datePublished` / `dateModified`: Frescura
- `keywords`: Topics cubiertos
- `wordCount`: Señal de profundidad

### 4. FAQPage Schema (Páginas con FAQ)

**Dónde**: Cualquier página con sección de FAQ

**Propósito**: LLMs extraen Q&A directamente para respuestas.

**Implementación**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto tiempo tarda en cubrirse un turno con Livo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<p>En promedio, los turnos se cubren en menos de 5 horas. El 85% de las solicitudes reciben confirmación en las primeras 24 horas. Para turnos urgentes (publicados con <24h de antelación), el 70% se cubren en menos de 4 horas.</p><p>Factores que afectan el tiempo:<ul><li>Especialidad requerida (DUE general vs especializada)</li><li>Día de la semana (fines de semana tardan 20% más)</li><li>Tarifa ofrecida (tarifas competitivas cubren 50% más rápido)</li></ul></p>"
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta contratar enfermeras con Livo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<p>Livo cobra una comisión del 15-20% sobre la tarifa horaria del profesional, significativamente menor que las ETTs tradicionales (20-40%).</p><p><strong>Ejemplo para Barcelona:</strong></p><ul><li>Tarifa enfermera DUE: €28/hora</li><li>Turno 12 horas: €336</li><li>Comisión Livo (17%): €57</li><li><strong>Total: €393</strong></li></ul><p>vs ETT tradicional (30% comisión): €437 total = <strong>Ahorro de €44 (10%)</strong></p><p>No hay costes de setup ni cuotas mensuales. Solo pagas por los turnos cubiertos.</p>"
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo se verifica la cualificación de las enfermeras?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<p>Todas las enfermeras en Livo pasan por un proceso de verificación riguroso:</p><ol><li><strong>Titulación oficial</strong>: Verificamos diploma de DUE, TCAE, matrona o médico</li><li><strong>Colegiación vigente</strong>: Confirmamos número de colegiado activo</li><li><strong>Documentación legal</strong>: NIE/DNI y permiso de trabajo (si aplica)</li><li><strong>Referencias</strong>: Contactamos empleadores anteriores</li><li><strong>Ratings</strong>: Sistema de valoraciones de hospitales (1-5 estrellas)</li></ol><p>Solo el 60% de aplicantes pasan nuestro proceso de verificación. El perfil de cada profesional muestra badges de verificación y rating promedio.</p>"
      }
    }
  ]
}
</script>
```

**Propiedades clave**:
- `name`: Pregunta exacta (como usuario la haría)
- `text`: Respuesta completa con HTML permitido
- Múltiples preguntas en array `mainEntity`

**Impacto GEO**: LLMs extraen directamente estas Q&As para responder queries.

### 5. Product Schema (Páginas de Productos)

**Dónde**: Páginas de productos (Livo Pool, Livo Offers)

**Propósito**: Describir producto/servicio estructuradamente.

**Implementación**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Livo Pool",
  "description": "Marketplace digital para contratar enfermeras eventuales en España. Conecta hospitales con 50,000+ profesionales verificados en menos de 5 horas.",

  "image": "https://livo.es/images/livo-pool-product.jpg",

  "brand": {
    "@type": "Brand",
    "name": "Livo"
  },

  "offers": {
    "@type": "Offer",
    "url": "https://livo.es/livo-pool/",
    "priceCurrency": "EUR",
    "price": "0",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "15-20",
      "priceCurrency": "EUR",
      "unitText": "PERCENT",
      "referenceQuantity": {
        "@type": "QuantitativeValue",
        "value": "1",
        "unitText": "turno"
      }
    },
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Livo"
    }
  },

  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "243",
    "bestRating": "5",
    "worstRating": "1"
  },

  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Carmen López"
      },
      "datePublished": "2025-12-15",
      "reviewBody": "Antes de Livo, cubrir turnos tardaba 3 días. Ahora, 4-5 horas. El cambio ha sido radical. Hemos reducido nuestra dependencia de ETTs en un 70%.",
      "name": "Transformó nuestra gestión de personal",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ],

  "category": "Healthcare Staffing Software"
}
</script>
```

**Propiedades clave**:
- `offers`: Pricing information (comisión 15-20%)
- `aggregateRating`: Reviews (trust signal)
- `review`: Testimonios específicos

### 6. HowTo Schema (Guías Paso a Paso)

**Dónde**: Artículos how-to (ej: "Cómo Contratar Enfermeras con Livo")

**Propósito**: LLMs pueden extraer proceso completo estructuradamente.

**Implementación**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cómo Contratar Enfermeras con Livo Pool",
  "description": "Guía paso a paso para contratar enfermeras eventuales en menos de 5 horas usando Livo Pool.",

  "image": "https://livo.es/images/how-to-livo-pool.jpg",

  "totalTime": "PT5H",

  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": "350-450"
  },

  "tool": [
    {
      "@type": "HowToTool",
      "name": "Cuenta Livo Pool"
    },
    {
      "@type": "HowToTool",
      "name": "Detalles del turno (fecha, horario, especialidad)"
    }
  ],

  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Información del servicio (ej: UCI, quirófano)"
    }
  ],

  "step": [
    {
      "@type": "HowToStep",
      "name": "Publicar el turno",
      "text": "Accede a tu cuenta Livo Pool y crea una nueva solicitud de turno especificando fecha, horario, especialidad requerida (DUE, TCAE, matrona) y tarifa ofrecida.",
      "image": "https://livo.es/images/step1-publicar.jpg",
      "url": "https://livo.es/blog/como-contratar-enfermeras-livo/#paso-1",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Recibir candidatas",
      "text": "Enfermeras verificadas cercanas a tu centro recibirán notificación push del turno. Las interesadas pueden aceptarlo con un clic. Típicamente recibirás 3-8 candidatas en las primeras 2 horas.",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Revisar perfiles",
      "text": "Revisa el perfil de cada candidata: experiencia, especialidades, ratings de otros hospitales (promedio 1-5 estrellas), distancia de tu centro, y disponibilidad.",
      "position": 3
    },
    {
      "@type": "HowToStep",
      "name": "Confirmar enfermera",
      "text": "Selecciona la candidata ideal y confírmala con un clic. La enfermera recibirá confirmación automática con todos los detalles del turno.",
      "position": 4
    },
    {
      "@type": "HowToStep",
      "name": "Coordinación pre-turno",
      "text": "1-3 horas antes del turno, la enfermera recibirá recordatorio con detalles del centro (dirección, parking, contacto de emergencia). Puedes comunicarte directamente via chat en la app si es necesario.",
      "position": 5
    }
  ]
}
</script>
```

**Propiedades clave**:
- `totalTime`: Duración del proceso
- `estimatedCost`: Coste estimado
- `step`: Array de pasos con `position`

### 7. BreadcrumbList Schema (Breadcrumbs)

**Dónde**: Todas las páginas (excepto homepage)

**Propósito**: Jerarquía del sitio para LLMs.

**Implementación**:

```html
<script type="application/ld+json">
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
      "name": "Gestión Hospitalaria",
      "item": "https://livo.es/blog/gestion-hospitalaria/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Pool de Enfermeras vs ETT",
      "item": "https://livo.es/blog/pool-vs-ett/"
    }
  ]
}
</script>
```

---

## Implementación Técnica

### Setup: Dónde Colocar JSON-LD

**Opción 1: Inline en HTML** (recomendado para páginas estáticas)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Pool de Enfermeras vs ETT | Livo</title>

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Pool de Enfermeras vs ETT: Comparativa"
    ...
  }
  </script>
</head>
<body>
  ...
</body>
</html>
```

**Opción 2: Via JavaScript** (para sitios dinámicos/SPAs)

```javascript
// React component example
const ArticleSchema = ({ article }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "datePublished": article.publishDate,
    ...
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

**Opción 3: Server-Side Rendering** (Next.js, etc.)

```jsx
// Next.js page
export default function ArticlePage({ article }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    ...
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <article>...</article>
    </>
  );
}
```

### Best Practices

#### 1. Un Schema por Script Tag

**❌ No hacer**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  ...
}
</script>
```

**✅ Hacer**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  ...
}
</script>
```

O usar array con `@graph`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      ...
    },
    {
      "@type": "BreadcrumbList",
      ...
    }
  ]
}
</script>
```

#### 2. Escapar HTML en Text

Si incluyes HTML en propiedades de texto (ej: FAQ answers):

```javascript
const answer = "<p>Los pools digitales cubren turnos en <strong>4-5 horas</strong>.</p>";

// Escapar < y >
const escapedAnswer = answer
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

// O usar JSON.stringify que escapa automáticamente
const schema = {
  "@type": "Answer",
  "text": answer  // JSON.stringify manejará el escape
};
```

#### 3. URLs Absolutas

**❌ URLs relativas**:
```json
{
  "url": "/blog/article/"
}
```

**✅ URLs absolutas**:
```json
{
  "url": "https://livo.es/blog/article/"
}
```

#### 4. Fechas en ISO 8601

```json
{
  "datePublished": "2026-01-15T09:00:00+01:00",
  "dateModified": "2026-01-20T14:30:00+01:00"
}
```

**Formato**: `YYYY-MM-DDTHH:MM:SS+TIMEZONE`

#### 5. Consistencia con Contenido Visible

**Regla**: Structured data debe reflejar contenido visible en la página.

**❌ No hacer**:
```html
<!-- Página visible dice: -->
<h1>Pool de Enfermeras: Guía 2025</h1>

<!-- Pero schema dice: -->
{
  "headline": "Pool de Enfermeras: Guía Completa 2026"
}
```

**✅ Hacer**:
```html
<h1>Pool de Enfermeras: Guía Completa 2026</h1>

{
  "headline": "Pool de Enfermeras: Guía Completa 2026"
}
```

---

## Testing y Validación

### Herramientas de Testing

#### 1. Google Rich Results Test

**URL**: https://search.google.com/test/rich-results

**Uso**:
1. Pega URL de tu página o código HTML
2. Click "Test URL" o "Test Code"
3. Revisa errores y warnings

**Qué testear**:
- No errores críticos (red Xs)
- Warnings aceptables (amarillo) pero resolver si es posible
- Preview de cómo Google ve el schema

#### 2. Schema Markup Validator

**URL**: https://validator.schema.org/

**Uso**: Más estricto que Google Rich Results Test.
- Valida contra spec completa de Schema.org
- Muestra warnings que Google no muestra

**Recomendación**: Pasar ambos tests (Google + Schema.org).

#### 3. Google Search Console

**Sección**: Enhancements

**Uso**:
- Ver schemas detectados en producción
- Errores reportados por Googlebot
- Coverage de páginas con schema válido

**Monitorizar semanalmente** para detectar errores en producción.

#### 4. Browser DevTools

**Chrome DevTools**:
1. Abrir página
2. F12 → Console
3. Ejecutar:
```javascript
JSON.parse(
  document.querySelector('script[type="application/ld+json"]').textContent
)
```

**Verifica**: JSON es válido (no syntax errors).

### Checklist de Validación

Antes de deploy:

- [ ] **JSON válido**: Sin syntax errors
- [ ] **@context presente**: `"@context": "https://schema.org"`
- [ ] **@type correcto**: Tipo apropiado para contenido
- [ ] **Propiedades requeridas**: Todas incluidas según schema.org
- [ ] **URLs absolutas**: No relativas
- [ ] **Fechas ISO 8601**: Formato correcto
- [ ] **Consistencia**: Refleja contenido visible
- [ ] **No duplicados**: No múltiples schemas idénticos
- [ ] **Google Rich Results**: Pasa sin errores
- [ ] **Schema.org Validator**: Pasa sin errores críticos

---

## Advanced Schemas

### 1. Dataset Schema (Para Data Studies)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Análisis de 50,000 Turnos de Enfermería en España (2025)",
  "description": "Estudio exhaustivo analizando tiempos de cobertura, tarifas, patrones de demanda y diferencias regionales en la contratación de enfermeras eventuales en España.",

  "url": "https://livo.es/estudios/analisis-turnos-2025/",

  "creator": {
    "@type": "Organization",
    "name": "Livo",
    "url": "https://livo.es"
  },

  "datePublished": "2026-01-10",
  "dateModified": "2026-01-10",

  "license": "https://creativecommons.org/licenses/by/4.0/",

  "temporalCoverage": "2025-01-01/2025-12-31",

  "spatialCoverage": {
    "@type": "Place",
    "geo": {
      "@type": "GeoShape",
      "address": "Spain"
    }
  },

  "distribution": [
    {
      "@type": "DataDownload",
      "encodingFormat": "application/pdf",
      "contentUrl": "https://livo.es/estudios/analisis-turnos-2025.pdf"
    },
    {
      "@type": "DataDownload",
      "encodingFormat": "text/csv",
      "contentUrl": "https://livo.es/estudios/analisis-turnos-2025-data.csv"
    }
  ],

  "variableMeasured": [
    {
      "@type": "PropertyValue",
      "name": "Tiempo de Cobertura",
      "description": "Horas desde publicación de turno hasta confirmación"
    },
    {
      "@type": "PropertyValue",
      "name": "Tarifa Horaria",
      "description": "Tarifa por hora según especialidad y ciudad"
    }
  ],

  "measurementTechnique": "Análisis de 50,327 turnos cubiertos a través de Livo Pool durante 2025 en 203 centros sanitarios de España",

  "keywords": ["enfermería", "personal sanitario", "hospitales", "turnos", "healthcare staffing"]
}
</script>
```

**Uso**: Para data studies, whitepapers, research reports.

### 2. Review Schema (Testimonios)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Service",
    "name": "Livo Pool",
    "image": "https://livo.es/images/livo-pool.jpg",
    "description": "Marketplace de enfermeras eventuales"
  },
  "author": {
    "@type": "Person",
    "name": "Carmen López",
    "jobTitle": "Directora de Enfermería",
    "worksFor": {
      "@type": "Organization",
      "name": "Hospital Quirónsalud Barcelona"
    },
    "sameAs": "https://www.linkedin.com/in/carmen-lopez-enfermeria/"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1"
  },
  "datePublished": "2025-12-15",
  "reviewBody": "Antes de Livo, cubrir turnos de fin de semana era una pesadilla de 3 días. Ahora, publico el turno el lunes y el viernes ya está cubierto. La diferencia ha sido radical. Hemos reducido nuestra dependencia de ETTs en un 70% y ahorramos aproximadamente €28,000 al año en comisiones."
}
</script>
```

### 3. Event Schema (Webinars, Congresos)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Webinar: Cómo Reducir Costes de Personal Eventual en Hospitales",
  "description": "Webinar gratuito donde compartiremos estrategias para reducir costes de personal eventual hasta un 30% usando pools digitales.",

  "startDate": "2026-02-15T17:00:00+01:00",
  "endDate": "2026-02-15T18:00:00+01:00",

  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",

  "location": {
    "@type": "VirtualLocation",
    "url": "https://livo.es/webinars/reducir-costes-personal-eventual/"
  },

  "image": "https://livo.es/images/webinar-costes.jpg",

  "organizer": {
    "@type": "Organization",
    "name": "Livo",
    "url": "https://livo.es"
  },

  "performer": {
    "@type": "Person",
    "name": "Laura Martínez",
    "jobTitle": "Directora de Operaciones, Livo"
  },

  "offers": {
    "@type": "Offer",
    "url": "https://livo.es/webinars/reducir-costes-personal-eventual/registro/",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-15T00:00:00+01:00"
  }
}
</script>
```

---

## Monitoring y Maintenance

### Proceso de Mantenimiento

#### Monthly Check

**Tareas**:
1. **Google Search Console** → Enhancements
   - Revisar errores de schemas
   - Ver nuevas páginas con schemas detectados
   - Corregir errores reportados

2. **Test sample de páginas**:
   - Homepage
   - 5 blog posts aleatorios
   - 3 landing pages
   - Usar Google Rich Results Test

3. **Actualizar schemas con datos nuevos**:
   - Reviews/ratings actualizados
   - Nuevos testimonios
   - Datos de estudios recientes

#### Quarterly Audit

**Tareas**:
1. **Crawl completo con Screaming Frog**:
   - Extraction → Structured Data → JSON-LD
   - Identificar páginas sin schema
   - Identificar schemas duplicados/inconsistentes

2. **Revisar schemas por tipo**:
   - ¿Todos los artículos tienen Article schema?
   - ¿Todas las FAQs tienen FAQPage schema?
   - ¿Productos tienen Product schema?

3. **Update schema templates** si hay cambios en Schema.org spec

---

## Conclusión

**Structured data es la base técnica de GEO**. Sin él, los LLMs tienen que "leer" y "entender" tu contenido como lo haría un humano. Con structured data, pueden procesar información directamente y con mayor precisión.

**Prioridades para Livo**:

**Nivel 1 (Crítico - Implementar primero)**:
- ✅ Organization schema (homepage)
- ✅ Article schema (todos los blog posts)
- ✅ FAQPage schema (páginas con FAQ)
- ✅ BreadcrumbList (todas las páginas)

**Nivel 2 (Alto - Implementar en Q1 2026)**:
- LocalBusiness schema (páginas locales)
- Product schema (Livo Pool, Livo Offers, Livo Interno)
- HowTo schema (guías paso a paso)

**Nivel 3 (Medio - Implementar en Q2 2026)**:
- Dataset schema (data studies)
- Review schema (testimonios)
- Event schema (webinars, eventos)

**Mantenimiento**: Auditoría mensual + updates cuando publiques nuevo contenido.

**Impacto esperado**: +40-60% en citation rate cuando structured data completo esté implementado.

---

**Última actualización**: Enero 2026
**Versión**: 1.0
**Owner**: Equipo Técnico/GEO Livo
