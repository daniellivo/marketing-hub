# GEO Entity Optimization

## Índice

1. [Introducción](#introducción)
2. [¿Qué es una Entidad?](#qué-es-una-entidad)
3. [Knowledge Graphs y Entidades](#knowledge-graphs-y-entidades)
4. [Por Qué Entity Optimization es Crítico para GEO](#por-qué-entity-optimization-es-crítico-para-geo)
5. [Establecer Livo como Entidad](#establecer-livo-como-entidad)
6. [Entity Relationships (Relaciones)](#entity-relationships-relaciones)
7. [Entity Attributes (Atributos)](#entity-attributes-atributos)
8. [Brand Entity vs Topic Entity](#brand-entity-vs-topic-entity)
9. [Estrategias de Entity Building](#estrategias-de-entity-building)
10. [Medición de Entity Strength](#medición-de-entity-strength)

---

## Introducción

**Entity Optimization** es el proceso de establecer y fortalecer tu marca/organización como una **entidad reconocible** en los knowledge graphs de motores de búsqueda y LLMs.

### Definición Simple

**Entity** (Entidad): Cualquier cosa o concepto que existe de forma única y distinguible.

**Ejemplos**:
- **Personas**: "Steve Jobs", "Albert Einstein"
- **Organizaciones**: "Apple", "Google", "Livo"
- **Lugares**: "Barcelona", "Hospital Clínic"
- **Conceptos**: "Pool de enfermeras", "Inteligencia Artificial"
- **Productos**: "iPhone", "Livo Pool"

### Entity vs Keyword

| Keyword | Entity |
|---------|--------|
| **String de texto** | **Cosa/concepto real** |
| "apple" (puede ser fruta o empresa) | Apple Inc. (empresa específica) |
| No tiene atributos | Tiene atributos (fundación, CEO, ubicación) |
| No tiene relaciones | Tiene relaciones (con Steve Jobs, con iPhone) |
| Context-dependent | Context-independent |

**Para GEO**: LLMs trabajan con **entidades**, no solo keywords.

---

## ¿Qué es una Entidad?

### Características de una Entidad

**1. Unicidad**: Es única y distinguible.
   - "Livo" (la empresa) ≠ "livo" (palabra en otro idioma)

**2. Atributos**: Tiene propiedades verificables.
   - Livo: fundada 2023, ubicada Barcelona, 50,000+ profesionales

**3. Relaciones**: Se conecta con otras entidades.
   - Livo → opera en → España
   - Livo → ofrece → Livo Pool
   - Livo → compite con → Hublo

**4. Persistencia**: Existe a través del tiempo.
   - Livo en 2024 = Livo en 2025 = Livo en 2026 (misma entidad)

### Tipos de Entidades Relevantes para Livo

#### 1. Entidad de Marca (Brand Entity)

**Livo** como organización.

**Atributos**:
- Nombre: Livo
- Tipo: Organization, Technology Company, Healthcare Platform
- Fundada: 2023
- Ubicación: Barcelona, España
- Industria: Healthcare Staffing, HR Technology
- Productos: Livo Pool, Livo Offers, Livo Interno

**Relaciones**:
- Fundadores: [Nombres]
- Competidores: Hublo, Nursea, ETTs
- Clientes: Hospitales, Clínicas
- Usuarios: Enfermeras, TCAEs, Médicos

#### 2. Entidades de Producto (Product Entities)

**Livo Pool**, **Livo Offers**, **Livo Interno** como productos/servicios distintos.

**Ejemplo: Livo Pool**

**Atributos**:
- Nombre: Livo Pool
- Tipo: Software, Marketplace, Healthcare Technology
- Parte de: Livo
- Descripción: Marketplace de enfermeras eventuales
- Precio: Comisión 15-20%
- Lanzado: 2024

**Relaciones**:
- Alternativa a: ETTs, Agencias
- Usado por: Hospitales, Clínicas
- Para: Enfermeras, TCAEs, Matronas

#### 3. Entidades de Concepto (Concept Entities)

**"Pool de enfermeras"** como concepto del sector.

**Objetivo**: Asociar Livo con este concepto.

**Estrategia**:
- Crear contenido definitivo sobre "pool de enfermeras"
- Ser citado como fuente de referencia
- Aparecer en knowledge graph cuando se busca el concepto

#### 4. Entidades de Persona (Person Entities)

**Fundadores, equipo, expertos** asociados con Livo.

**Ejemplo**:
- Laura Martínez (Directora de Operaciones en Livo)
- Atributos: Nombre, Cargo, Empresa (Livo), LinkedIn, Expertise

**Valor**: Aportan autoridad (E-E-A-T) a la entidad Livo.

---

## Knowledge Graphs y Entidades

### ¿Qué es un Knowledge Graph?

Un **knowledge graph** es una base de datos de entidades y sus relaciones.

**Principales knowledge graphs**:
1. **Google Knowledge Graph** (Google)
2. **Bing Satori** (Microsoft)
3. **Wikidata** (público, usado por muchos LLMs)
4. **DBpedia** (basado en Wikipedia)

**Cómo se ve**:

```
[Livo] --tipo--> [Organization]
      |
      +--fundada--> [2023]
      |
      +--ubicada--> [Barcelona] --país--> [España]
      |
      +--ofrece--> [Livo Pool] --tipo--> [Software Service]
      |                      |
      |                      +--alternativa a--> [ETT]
      |                      |
      |                      +--usado por--> [Hospitales]
      |
      +--compite con--> [Hublo] --tipo--> [Organization]
      |
      +--industria--> [Healthcare Staffing]
```

### Cómo LLMs Usan Knowledge Graphs

**Cuando usuario pregunta**: "qué es livo"

**LLM**:
1. Busca entidad "Livo" en knowledge graph
2. Extrae atributos: tipo, fundación, ubicación, productos
3. Extrae relaciones: industria, competidores, clientes
4. Genera respuesta sintetizada:

```
"Livo es una plataforma tecnológica fundada en 2023 en Barcelona que conecta
hospitales con profesionales sanitarios (enfermeras, TCAEs) a través de su
marketplace Livo Pool. A diferencia de las ETTs tradicionales, Livo ofrece
tiempos de cobertura de 4-5 horas con comisiones del 15-20%."
```

**Sin entidad establecida en knowledge graph**: LLM tiene que "leer" y "entender" contenido → menos preciso, menos probable que cite.

---

## Por Qué Entity Optimization es Crítico para GEO

### 1. Reconocimiento Automático

**Con entidad fuerte**:
```
Usuario: "alternativas a ETTs en españa"

LLM busca en knowledge graph:
- Entidades con tipo "Healthcare Staffing"
- Entidades con relación "alternativa a ETT"
- Entidades ubicadas en "España"

→ Encuentra Livo automáticamente
→ Incluye en respuesta
```

**Sin entidad**:
```
LLM hace búsqueda de keywords en texto plano
→ Puede o no encontrar Livo
→ Menor probabilidad de citación
```

### 2. Contexto Semántico

**Entidad permite a LLM entender contexto**:

**Query**: "cómo funciona livo"

**Con entidad**:
```
LLM sabe: Livo = Organization de tipo Healthcare Platform
→ Busca información sobre cómo funciona la plataforma
→ Extrae proceso de Livo Pool
→ Responde con contexto correcto
```

**Sin entidad**:
```
LLM ve "livo" como keyword ambigua
→ Puede confundir con otras cosas llamadas "livo"
→ Respuesta menos precisa
```

### 3. Authority y Trust

**Entidades establecidas = Mayor autoridad percibida**

**Google/LLMs priorizan entidades con**:
- Presencia en múltiples fuentes autorizadas
- Menciones en medios reconocidos
- Relaciones con otras entidades establecidas
- Atributos verificables y consistentes

### 4. Branded Search Growth

**Entity fuerte → Más branded searches**

**Ciclo virtuoso**:
```
Entidad bien establecida
    ↓
LLM cita Livo frecuentemente
    ↓
Usuarios ven marca "Livo"
    ↓
Buscan "livo" directamente (branded search)
    ↓
Google ve ↑ volumen búsquedas "livo"
    ↓
Google refuerza entidad Livo en knowledge graph
    ↓
LLM cita Livo aún más
```

### 5. Semantic Topic Clusters (Clusters Temáticos Semánticos)

> **🧭 Objetivo**: Los LLMs priorizan fuentes que demuestran experiencia exhaustiva en un dominio. Construir clusters de contenido interconectado alrededor de temas core establece autoridad temática.

**Qué es un Semantic Topic Cluster**:

Una arquitectura de contenido donde:
1. **Página Pilar** (Hub): Guía exhaustiva sobre tema amplio
2. **Páginas Cluster** (Spokes): Artículos específicos sobre subtemas
3. **Internal Linking**: Enlaces bidireccionales entre pilar y clusters

**Ejemplo para Livo - Cluster "Contratación de Personal Sanitario"**:

```
                    [PÁGINA PILAR]
          Guía Completa: Contratación de Personal Sanitario
                    (5000+ palabras)
                           |
        ___________________|___________________
        |          |          |          |          |
    [CLUSTER]  [CLUSTER]  [CLUSTER]  [CLUSTER]  [CLUSTER]
    Pool vs    Cómo      Costes    Marco      Verificación
    ETT        Contratar            Legal      Profesionales
    (2000w)    (1500w)   (1800w)   (2200w)    (1600w)
        |          |          |          |          |
    [SUB]      [SUB]      [SUB]      [SUB]      [SUB]
    Ventajas   Paso 1     Tarifas    Contratos  Colegiación
    Pools      Publicar   Barcelona  Eventuales Enfermeras
```

**Best Practices para Livo**:

1. **Identificar temas core**:
   - Contratación de personal sanitario
   - Gestión de turnos hospitalarios
   - Reducción de costes en RRHH sanitario
   - Pools digitales de enfermeras

2. **Crear página pilar exhaustiva**:
   ```markdown
   # Contratación de Personal Sanitario: Guía Completa 2026
   
   [Tabla de contenidos]
   
   ## Qué es la Contratación de Personal Sanitario Eventual
   [Definición, contexto, importancia]
   
   ## Métodos de Contratación
   ### Pools Digitales (Livo Pool)
   [Overview + link a artículo cluster]
   
   ### ETTs Tradicionales
   [Overview + link a comparativa]
   
   ### Pools Internos
   [Overview + link a guía implementación]
   
   ## Costes y Presupuesto
   [Overview + link a artículo costes]
   
   ## Marco Legal
   [Overview + link a guía legal]
   
   ## Cómo Elegir el Método Adecuado
   [Decision framework]
   
   ## Casos de Uso por Tipo de Centro
   [Hospitales grandes, clínicas, centros sociosanitarios]
   
   ## FAQ
   [20+ preguntas frecuentes]
   ```

3. **Crear artículos cluster específicos**:
   - Cada uno profundiza en un subtema
   - 1500-2500 palabras
   - Link de vuelta a pilar
   - Links entre clusters relacionados

4. **Internal linking estratégico**:
   ```markdown
   En la página pilar:
   "Para una comparativa detallada, consulta [Pool vs ETT: Análisis Completo](/blog/pool-vs-ett/)"
   
   En artículo cluster:
   "Este artículo es parte de nuestra [Guía Completa de Contratación de Personal Sanitario](/guias/contratacion-personal-sanitario/)"
   ```

**Impacto en GEO**:
- LLM ve que Livo tiene contenido exhaustivo sobre el tema
- Mayor probabilidad de citación como "fuente autorizada"
- Asociación fuerte: Livo = experto en contratación sanitaria

---

## Establecer Livo como Entidad

### Paso 1: Crear Presencia en Fuentes Autorizadas

**Objetivo**: Aparecer en fuentes que motores usan para construir knowledge graphs.

#### A) Wikipedia (Más difícil, mayor impacto)

**Notabilidad requerida**:
- Cobertura en medios independientes (periódicos, revistas sector)
- Premios o reconocimientos
- Impacto significativo en el sector

**Si Livo cumple criterios**:
1. Crear artículo Wikipedia sobre Livo
2. Incluir referencias verificables (artículos medios)
3. Mantener tono neutral (no promocional)

**Nota**: Wikipedia es extremadamente estricta. Solo intentar si hay notabilidad clara.

#### B) Wikidata (Más fácil, importante para LLMs)

**Wikidata** es base de datos estructurada usada por muchos LLMs.

**Proceso**:
1. Crear cuenta: https://www.wikidata.org/
2. Crear item para Livo:
   - Label: "Livo"
   - Description: "Spanish healthcare staffing marketplace"
   - Aliases: "Livo Pool", "Livo Spain"

3. Añadir statements (atributos):
   ```
   instance of (P31): business (Q4830453)
   industry (P452): healthcare (Q31207)
   inception (P571): 2023
   headquarters location (P159): Barcelona (Q1492)
   country (P17): Spain (Q29)
   official website (P856): https://livo.es
   ```

4. Añadir identificadores externos:
   - LinkedIn company page
   - Crunchbase (si existe)
   - Official social media

**Impacto**: Muchos LLMs usan Wikidata como fuente. Estar ahí = Mayor probabilidad de reconocimiento.

#### C) Crunchbase

**Crunchbase** es base de datos de empresas usada por knowledge graphs.

**Proceso**:
1. Crear perfil: https://www.crunchbase.com/
2. Completar información:
   - Company name, description
   - Founding date, founders
   - Funding info (si aplica)
   - Number of employees
   - Industries, technologies

**Gratis vs Pro**: Versión gratuita limitada, pero suficiente para establecer entidad.

#### D) LinkedIn Company Page

**LinkedIn** es fuente para knowledge graphs (especialmente Microsoft/Bing).

**Optimización**:
1. **Completar 100% del perfil**:
   - Logo, cover image
   - About section (descripción completa)
   - Website, industry, company size
   - Specialties (keywords)

2. **Publicar regularmente**:
   - Updates sobre producto
   - Artículos del blog
   - Casos de éxito

3. **Conseguir followers**:
   - Empleados
   - Clientes
   - Partners

**Bonus**: Encouraging employees to add Livo in their work experience.

### Paso 2: Structured Data Exhaustivo

**JSON-LD Organization schema** en homepage (ver documento GEO Structured Data).

**Propiedades críticas para entity**:
- `@id`: Identificador único (ej: `https://livo.es/#organization`)
- `name`, `alternateName`
- `url`, `logo`
- `sameAs`: Links a perfiles sociales, Wikipedia, Wikidata
- `address`, `contactPoint`
- `foundingDate`, `founder`

**Ejemplo**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://livo.es/#organization",
  "name": "Livo",
  "legalName": "Livo Spain S.L.",
  "alternateName": "Livo Pool",
  "url": "https://livo.es",
  "logo": "https://livo.es/assets/logo.png",

  "sameAs": [
    "https://www.linkedin.com/company/livo",
    "https://www.wikidata.org/wiki/Q######",
    "https://www.crunchbase.com/organization/livo"
  ],

  "foundingDate": "2023",
  ...
}
```

**`sameAs` es crítico**: Conecta tu entidad en diferentes plataformas.

### Paso 3: Menciones en Medios y Third-Party Citations

**Objetivo**: Que fuentes autorizadas mencionen Livo.

**Estrategias**:

#### A) Press Releases

Publicar notas de prensa cuando hay noticias relevantes:
- Lanzamiento de nuevo producto
- Hitos (ej: 100,000 usuarios, 500 hospitales)
- Partnerships importantes
- Premios/reconocimientos

**Distribuir en**:
- Europa Press
- EFE
- Medios especializados (Diario Médico, Redacción Médica)

#### B) Guest Articles en Medios del Sector

Escribir artículos para publicaciones autorizadas:
- Diario Médico
- Redacción Médica
- Revistas de gestión sanitaria

**Mencionar Livo en author bio**:
```
Laura Martínez es Directora de Operaciones en Livo, plataforma líder de
contratación de personal sanitario en España.
```

#### C) Participación en Eventos del Sector

**Eventos ANDE, SEDISA, ASPE**:
- Patrocinios
- Ponencias
- Stands

**Resultado**: Menciones en:
- Programas del evento (PDF públicos)
- Artículos sobre el evento
- Social media coverage

#### D) Partnerships y Colaboraciones

**Asociarse con entidades establecidas**:
- ANDE (Asociación Nacional Directivos Enfermería)
- SEDISA (Sociedad Española Directivos Salud)
- Hospitales reconocidos

**Anunciar partnerships**:
```
"Livo se convierte en partner tecnológico de ANDE"
```

**Impacto**: Knowledge graph conecta Livo con entidades ya establecidas.

### Paso 4: Consistencia de NAP (Name, Address, Phone)

**NAP consistency** es crítico para entity.

**Regla**: Usar **exactamente** mismo formato en todas partes.

**Ejemplo NAP de Livo**:
```
Name: Livo Spain S.L.
Address: Calle [X], Barcelona 08001, España
Phone: +34 XXX XXX XXX
```

**Dónde mantener consistencia**:
- Sitio web (footer, contact page)
- Google Business Profile
- LinkedIn
- Crunchbase
- Wikidata
- Directorios (si aplica)
- Press releases

**❌ Inconsistencia** (confunde knowledge graphs):
```
Sitio web: "Livo Spain S.L., Calle X, 08001 Barcelona"
LinkedIn: "Livo, Barcelona, Spain"
Google: "Livo Pool, C/ X, Barcelona"
```

**✅ Consistencia**:
```
Todos: "Livo Spain S.L., Calle X, 08001 Barcelona, España"
```

---

## Entity Relationships (Relaciones)

### Tipos de Relaciones

**1. Relaciones Jerárquicas** (is-a, part-of):
```
Livo --es--> Organization
Livo Pool --parte de--> Livo
```

**2. Relaciones de Competencia**:
```
Livo --compite con--> Hublo
Livo --compite con--> Nursea
Livo --alternativa a--> ETTs
```

**3. Relaciones de Servicio**:
```
Livo --sirve a--> Hospitales
Livo --sirve a--> Clínicas
Livo --usado por--> Enfermeras
```

**4. Relaciones Geográficas**:
```
Livo --ubicada en--> Barcelona
Livo --opera en--> España
Livo --expandiendo a--> Italia, Polonia
```

**5. Relaciones de Industria**:
```
Livo --industria--> Healthcare Staffing
Livo --industria--> HR Technology
Livo --sector--> Healthcare
```

### Cómo Establecer Relaciones

#### A) En Contenido

**Mencionar relaciones explícitamente**:

```markdown
# Sobre Livo

Livo es una **plataforma de contratación de personal sanitario** con sede en
**Barcelona, España**. Fundada en **2023**, Livo compite con **Hublo** (Francia)
y **Nursea** (España), ofreciendo una alternativa tecnológica a las **ETTs
tradicionales**.

Livo sirve a **hospitales privados** y **clínicas** en toda España, con más de
**200 centros** usando la plataforma. **Enfermeras**, **TCAEs**, **matronas**
y **médicos** usan Livo para encontrar turnos eventuales.
```

**Entities mencionadas** (LLM extrae relaciones):
- Livo → ubicada en → Barcelona
- Livo → país → España
- Livo → fundada → 2023
- Livo → compite con → Hublo, Nursea
- Livo → alternativa a → ETTs
- Livo → sirve a → Hospitales, Clínicas
- Livo → usado por → Enfermeras, TCAEs, Matronas, Médicos

#### B) En Structured Data

**Organization schema con relaciones**:

```json
{
  "@type": "Organization",
  "name": "Livo",

  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressCountry": "ES"
  },

  "areaServed": {
    "@type": "Country",
    "name": "Spain"
  },

  "knowsAbout": [
    "Healthcare Staffing",
    "Nurse Recruiting",
    "Hospital Management",
    "Healthcare Technology"
  ],

  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Livo Pool",
        "category": "Healthcare Staffing Marketplace"
      }
    }
  ],

  "memberOf": {
    "@type": "Organization",
    "name": "ANDE - Asociación Nacional de Directivos de Enfermería"
  }
}
```

#### C) Internal Linking con Anchor Text Descriptivo

**Usar anchor text que define relaciones**:

```markdown
Livo es una [plataforma de contratación de personal sanitario](/) que compite
con [Hublo](/comparativas/livo-vs-hublo/) y ofrece una alternativa a las
[ETTs tradicionales](/blog/pool-vs-ett/).
```

**LLM extrae**:
- Livo = "plataforma de contratación de personal sanitario"
- Livo compite con Hublo
- Livo = alternativa a ETTs

---

## Entity Attributes (Atributos)

### Atributos Clave de Livo Entity

**Atributos a establecer claramente**:

#### 1. Atributos Básicos

- **Nombre**: Livo, Livo Spain S.L.
- **Nombres alternativos**: Livo Pool (producto principal)
- **Tipo**: Organization, Technology Company, Healthcare Platform
- **Fundación**: 2023 (o fecha específica si pública)
- **Sede**: Barcelona, Cataluña, España

#### 2. Atributos de Negocio

- **Industria**: Healthcare Staffing, HR Technology, Healthtech
- **Modelo de negocio**: Marketplace, SaaS
- **Mercado objetivo**: B2B (Hospitales), B2C (Enfermeras)
- **Geografía**: España (Barcelona, Madrid), expandiendo a Italia/Polonia
- **Tamaño**: 20-50 empleados, 200+ clientes, 50,000+ usuarios

#### 3. Atributos de Producto

- **Productos principales**:
  * Livo Pool (marketplace de turnos)
  * Livo Offers (reclutamiento)
  * Livo Interno (gestión interna)

- **Características clave**:
  * Cobertura en <5 horas
  * Comisión 15-20%
  * 50,000+ profesionales
  * 85% tasa cobertura <24h

#### 4. Atributos Comparativos

- **Competidores**: Hublo, Nursea, ETTs tradicionales
- **Diferenciadores**:
  * Tecnología vs manual
  * Rápido (4-5h) vs lento (48-72h)
  * Barato (15-20%) vs caro (20-40%)

#### 5. Atributos de Autoridad

- **Premios**: [Si aplica]
- **Partnerships**: ANDE, SEDISA, [otros]
- **Menciones en medios**: El País, Expansión, Diario Médico
- **Clientes destacados**: [Hospitales reconocidos que permitan mención pública]

### Cómo Establecer Atributos

#### A) Crear "About Us" Exhaustivo

**Página /sobre-nosotros/ debe incluir**:

```markdown
# Sobre Livo

## Quiénes Somos

Livo es una **plataforma tecnológica** fundada en **2023** en **Barcelona**
que está transformando la forma en que **hospitales y clínicas** contratan
**personal sanitario eventual** en España.

## Qué Hacemos

Conectamos **centros sanitarios** con **profesionales de enfermería** (enfermeras
DUE, auxiliares TCAE, matronas, médicos) a través de nuestro marketplace digital
**Livo Pool**, reduciendo tiempos de cobertura de 48-72 horas a **menos de 5 horas**
y costes en un **15-30%**.

## Nuestra Misión

[Mission statement]

## Nuestra Visión

[Vision statement]

## Valores

[Core values]

## El Equipo

[Founders, key team members con LinkedIn links]

## Nuestra Historia

**2023**: Fundación en Barcelona
**2024**: Lanzamiento Livo Pool, primeros 50 hospitales
**2025**: Expansión a Madrid, 200+ centros, 50,000 profesionales
**2026**: Planes de expansión internacional (Italia, Polonia)

## Reconocimientos

[Premios, menciones en medios, partnerships]

## Cifras Clave (2026)

- 50,000+ profesionales verificados
- 200+ centros sanitarios
- 5,000+ turnos cubiertos mensualmente
- 85% tasa de cobertura <24 horas
- 4.8/5 rating promedio
- Presencia en Cataluña y Madrid

## Industria

Healthcare Staffing, HR Technology, Healthtech

## Competidores

A diferencia de [Hublo](/comparativas/livo-vs-hublo/) (Francia) o [ETTs
tradicionales](/blog/pool-vs-ett/), Livo ofrece...
```

**LLM extrae todos estos atributos**.

#### B) Structured Data Rico

**Organization schema con máximo detalle** (ver ejemplos en documentos anteriores).

#### C) Menciones Consistentes

**Siempre mencionar atributos clave cuando hablas de Livo**:

```markdown
Livo, plataforma líder de contratación de personal sanitario en España con
50,000+ profesionales y 200+ centros, permite cubrir turnos en <5 horas...
```

**No**:
```markdown
Livo permite cubrir turnos rápidamente...
```

**Sí** (con atributos):
```markdown
Livo, con sede en Barcelona y operando en toda España, permite cubrir turnos
de enfermería en menos de 5 horas a través de su marketplace de 50,000+
profesionales verificados...
```

---

## Brand Entity vs Topic Entity

### Brand Entity: Livo

**Objetivo**: Establecer "Livo" como entidad de marca reconocible.

**Estrategias**:
- Presencia en knowledge graphs (Wikidata, Crunchbase)
- Structured data exhaustivo
- Menciones en medios
- Branded content
- Social media presence

**Medición**:
- Volumen búsquedas "livo"
- Knowledge panel en Google (si aparece)
- Citaciones en LLM responses

### Topic Entity: "Pool de Enfermeras"

**Objetivo**: Asociar Livo con el concepto "pool de enfermeras".

**Estrategias**:

#### A) Content Dominance

**Crear contenido definitivo sobre el topic**:
- "Pool de Enfermeras: Guía Definitiva" (5000+ palabras)
- Múltiples artículos relacionados (Hub & Spoke)
- Videos, infografías, estudios

**Objetivo**: Que cuando LLM busque info sobre "pool de enfermeras", siempre encuentre contenido de Livo.

#### B) Definition Ownership

**Establecer la definición**:

```markdown
## ¿Qué es un Pool de Enfermeras?

Un **pool de enfermeras** es un marketplace digital donde hospitales publican
turnos disponibles y enfermeras eventuales pueden aceptarlos directamente,
eliminando intermediarios como las ETTs.

[Incluir esta definición en múltiples páginas]
```

**Resultado esperado**: Cuando alguien pregunta "qué es un pool de enfermeras", LLM cita definición de Livo.

#### C) Schema para Concept

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Pool de Enfermeras",
  "description": "Marketplace digital donde hospitales publican turnos disponibles y enfermeras eventuales pueden aceptarlos directamente, eliminando intermediarios como las ETTs tradicionales.",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Glosario de Personal Sanitario Eventual"
  },
  "url": "https://livo.es/glosario/pool-de-enfermeras/"
}
</script>
```

#### D) Topical Authority

**Crear 15-20 artículos sobre pools de enfermeras**:
- Qué es
- Cómo funciona
- Ventajas y desventajas
- Pool vs ETT
- Pool vs agencia
- Pool interno vs externo
- Marco legal
- Casos de uso
- ROI
- Implementación
- [10 más]

**Internal linking fuerte** entre todos.

**Resultado**: Google/LLMs ven Livo como **autoridad en el topic "pool de enfermeras"**.

---

## Estrategias de Entity Building

### Estrategia 1: Omnipresencia Digital

**Crear perfiles en todas las plataformas relevantes**:

**Tier 1 (Crítico)**:
- [x] Website oficial (livo.es)
- [x] LinkedIn Company Page
- [ ] Google Business Profile
- [ ] Wikidata
- [ ] Crunchbase

**Tier 2 (Importante)**:
- [ ] Twitter/X
- [ ] Instagram
- [ ] Facebook
- [ ] YouTube
- [ ] Medium/Blog platforms

**Tier 3 (Nice to have)**:
- [ ] AngelList
- [ ] ProductHunt
- [ ] GitHub (si hay repos públicos)

**Clave**: Usar **mismo branding** (logo, descripción, links) en todos.

### Estrategia 2: Co-Mentions con Entidades Establecidas

**Aparecer junto a entidades ya reconocidas**:

**En contenido**:
```markdown
Livo, junto con Hublo (Francia) y Nursea (España), forma parte de la nueva
generación de plataformas tecnológicas que están transformando el mercado de
contratación de personal sanitario en Europa.
```

**En eventos**:
- Paneles con speakers de hospitales reconocidos
- Patrocinio de eventos ANDE/SEDISA

**En menciones de medios**:
- Press releases mencionando partnerships con hospitales conocidos

**Resultado**: Knowledge graph conecta Livo con entidades establecidas → Mayor autoridad.

### Estrategia 3: Entity-Focused Content

**Crear contenido que refuerza entidad**:

#### A) About Pages Completas

- /sobre-nosotros/
- /equipo/
- /historia/
- /valores/

#### B) Author Pages para Equipo

Cada miembro clave del equipo:
- Página personal en /equipo/[nombre]/
- Bio completa
- LinkedIn link
- Artículos escritos

**Schema Person** en cada página:
```json
{
  "@type": "Person",
  "name": "Laura Martínez",
  "jobTitle": "Directora de Operaciones",
  "worksFor": {
    "@type": "Organization",
    "name": "Livo",
    "url": "https://livo.es"
  },
  "sameAs": "https://www.linkedin.com/in/laura-martinez-livo/"
}
```

#### C) Timeline/History Page

Página con cronología de Livo:
```markdown
# Historia de Livo

## 2023: Fundación
[Detalles]

## 2024: Lanzamiento Livo Pool
[Milestones]

## 2025: Expansión Nacional
[Logros]

## 2026: Internacionalización
[Planes]
```

### Estrategia 4: Third-Party Validation

**Conseguir menciones de fuentes autorizadas**:

#### A) Guest Posts en Medios

Escribir para:
- Diario Médico
- Redacción Médica
- Blogs de gestión sanitaria

**Author bio siempre menciona Livo**:
```
[Nombre] es [Cargo] en Livo (livo.es), plataforma líder de contratación de
personal sanitario en España.
```

#### B) Entrevistas y Features

Pitch a periodistas:
- "Cómo la tecnología está solucionando la escasez de enfermeras"
- "El futuro de la contratación sanitaria en España"
- "Startups healthtech que están transformando el sector"

#### C) Awards y Reconocimientos

Aplicar a premios del sector:
- Premios Innovación en Salud
- Healthtech Awards
- Best Startup Awards

**Mencionar en web** cuando se ganen.

#### D) Case Studies con Clientes

Publicar casos de estudio de hospitales:
```markdown
# Caso de Estudio: Hospital Sant Pau

Cómo Hospital Sant Pau redujo costes de personal eventual en 28% con Livo Pool

[Detalles del caso]

"Livo ha transformado completamente nuestra gestión de personal eventual."
— Dra. Carmen López, Directora de Enfermería, Hospital Sant Pau
```

**Resultado**: Entidades de hospitales conocidos se asocian con entidad Livo.

---

## Medición de Entity Strength

### KPIs de Entity Optimization

#### 1. Knowledge Panel (Google)

**Qué es**: Box de información que aparece en Google al buscar marca.

**Ejemplo**: Buscar "Apple" en Google → Knowledge panel a la derecha con logo, descripción, fundación, CEO, etc.

**Para Livo**:
- Búsqueda "livo" en Google
- ¿Aparece knowledge panel?
- Si sí: ¿Información es correcta y completa?

**Target**: Tener knowledge panel en Q3-Q4 2026.

#### 2. Wikidata Entry Completeness

**Métrica**: % de atributos relevantes completados.

**Atributos clave**:
- [x] Name, description
- [ ] Founded, headquarters
- [ ] Industry, product/service
- [ ] Official website
- [ ] Social media profiles
- [ ] Identifiers (LinkedIn, Crunchbase)

**Target**: 100% atributos relevantes en Q2 2026.

#### 3. Brand Search Volume

**Métrica**: Volumen de búsquedas "livo" en Google.

**Herramientas**:
- Google Search Console (queries con "livo")
- Google Trends
- Ahrefs (keyword "livo")

**Target**:
- Q1 2026: 500 búsquedas/mes
- Q2 2026: 1,000 búsquedas/mes
- Q3 2026: 2,000 búsquedas/mes
- Q4 2026: 3,500 búsquedas/mes

#### 4. Entity Mentions en LLM Responses

**Métrica**: % de queries relacionadas donde LLM menciona Livo.

**Proceso**:
1. Definir 30 queries relacionadas:
   - "plataformas contratación enfermeras españa"
   - "alternativas ETTs sanitarias"
   - "marketplaces personal sanitario"
   - [27 más]

2. Testear mensualmente en ChatGPT, Perplexity, Google SGE

3. Contar menciones de Livo

**Target**: 40% mention rate en Q4 2026.

#### 5. Third-Party Citations

**Métrica**: Número de menciones en fuentes externas autorizadas.

**Fuentes a trackear**:
- Artículos en medios (Diario Médico, El País, etc.)
- Blog posts de terceros
- Estudios del sector
- Wikipedia/Wikidata citations

**Target**: 20+ menciones en fuentes autorizadas en 2026.

### Tools de Monitoring

#### 1. Google Alerts

**Setup**:
- Crear alerta para "Livo" (filtrando false positives)
- Recibir notificaciones cuando se menciona Livo en web

#### 2. Brand24 / Mention

**Herramientas de social listening**:
- Trackean menciones de marca en web, social media, blogs
- Alertas en tiempo real

#### 3. Ahrefs Brand Monitoring

**Content Explorer** → Buscar menciones de "Livo"
- Ver quién te menciona
- Identificar nuevas oportunidades de backlinks/citations

#### 4. Google Search Console

**Performance** → Filtrar queries con "livo"
- Ver volumen de branded searches
- Trend mensual

---

## Conclusión

**Entity optimization es el foundation de GEO**. Sin una entidad bien establecida, los LLMs tienen dificultad para reconocer, entender y citar tu marca.

**Prioridades para Livo**:

**Q1 2026**:
- [x] Structured data completo (Organization schema)
- [ ] Wikidata entry creada y completa
- [ ] Crunchbase profile optimizado
- [ ] LinkedIn Company Page 100% completa
- [ ] About Us page exhaustiva

**Q2 2026**:
- [ ] 3-5 menciones en medios del sector
- [ ] Partnership announcement (ANDE, SEDISA, hospital)
- [ ] Author pages para equipo clave
- [ ] 10+ artículos establishing topical authority en "pool de enfermeras"

**Q3 2026**:
- [ ] 10+ menciones en medios
- [ ] Google Knowledge Panel (objetivo)
- [ ] Wikipedia article (si notabilidad permite)
- [ ] Award/recognition

**Q4 2026**:
- [ ] Entity completamente establecida
- [ ] 40%+ mention rate en LLM responses
- [ ] 3,000+ branded searches/mes

**Medición continua**:
- Monthly: Brand search volume, LLM mentions
- Quarterly: Third-party citations, knowledge graph presence

**Resultado esperado**: Livo reconocido automáticamente como entidad authoritative en "healthcare staffing España" por todos los major knowledge graphs y LLMs.

---

**Última actualización**: Enero 2026
**Versión**: 1.0
**Owner**: Equipo GEO/Brand Livo
