# AI Integration

Módulos para la integración con OpenRouter y generación de contenido con AI.

## Archivos

### `openrouter.ts`

Cliente para la API de OpenRouter que proporciona acceso a múltiples modelos de AI.

**Funciones principales:**

- `generateContent(prompt, options)` - Genera contenido usando un prompt
- `generateWithHistory(messages, options)` - Genera con historial de conversación
- `parseAIJSON(response)` - Parsea respuestas JSON de AI (maneja markdown wrappers)
- `isConfigured()` - Verifica si la API key está configurada

**Opciones:**

```typescript
{
  model?: string        // Default: anthropic/claude-3.5-sonnet
  maxTokens?: number    // Default: 4000
  temperature?: number  // Default: 0.7
  stream?: boolean      // Default: false
}
```

**Modelos recomendados:**

- `anthropic/claude-3.5-sonnet` - Mejor balance calidad/velocidad (recomendado)
- `anthropic/claude-3-opus` - Máxima calidad, más lento
- `anthropic/claude-3-haiku` - Más rápido, menor coste
- `openai/gpt-4-turbo` - Alternativa de OpenAI

### `prompt-builder.ts`

Construye prompts contextualizados para diferentes tipos de generación.

**Funciones principales:**

- `buildOutlinePrompt(idea, template, kbFiles)` - Construye prompt para generar outline
- `buildArticlePrompt(idea, outline, kbFiles, comments)` - Construye prompt para generar artículo
- `buildRevisionPrompt(article, comments)` - Construye prompt para revisar artículo
- `getRelevantKBFiles()` - Obtiene archivos de knowledge base
- `getTemplate(templateType)` - Obtiene template por tipo

**Estructura de prompts:**

Todos los prompts incluyen:
1. **Context**: Información sobre Livo, guidelines SEO/GEO
2. **Task**: Descripción específica de la tarea
3. **Requirements**: Lista detallada de requisitos
4. **Output Format**: Formato esperado de respuesta

## Uso

### Generar Outline

```typescript
import { buildOutlinePrompt, getTemplate, getRelevantKBFiles } from '@/lib/ai/prompt-builder'
import { generateContent, parseAIJSON } from '@/lib/ai/openrouter'

// 1. Obtener datos necesarios
const template = await getTemplate('pillar')
const kbFiles = await getRelevantKBFiles()

// 2. Construir prompt
const prompt = await buildOutlinePrompt(idea, template, kbFiles)

// 3. Generar con AI
const response = await generateContent(prompt, {
  model: 'anthropic/claude-3.5-sonnet',
  maxTokens: 4000,
})

// 4. Parsear respuesta
const outline = parseAIJSON(response)
```

### Generar Artículo

```typescript
const prompt = await buildArticlePrompt(idea, outline, kbFiles, comments)
const article = await generateContent(prompt, {
  maxTokens: 8000,  // Artículos necesitan más tokens
  temperature: 0.7,
})
```

### Revisar Artículo

```typescript
const prompt = await buildRevisionPrompt(articleContent, comments)
const revisedArticle = await generateContent(prompt, {
  temperature: 0.5,  // Menos creatividad en revisiones
})
```

## Variables de Entorno

```bash
# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_APP_URL=https://yourdomain.com
OPENROUTER_APP_TITLE=Livo Content Platform
```

## API Routes

Los endpoints de generación están en:

- `/api/ideas/[id]/generate-outline` - Genera outline para una idea
- `/api/outlines/[id]/generate-article` - Genera artículo desde outline (próximamente)
- `/api/articles/[id]/revise` - Revisa artículo con feedback (próximamente)

## Costos Aproximados

**Claude 3.5 Sonnet** (recomendado):
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Estimación por generación:**
- Outline: ~2,000 tokens input + 1,500 tokens output = $0.03
- Article: ~3,000 tokens input + 4,000 tokens output = $0.07
- Revision: ~5,000 tokens input + 2,000 tokens output = $0.05

**Total por artículo completo: ~$0.15**

## Error Handling

Todos los errores de AI se registran en la tabla `generation_history`:

```sql
SELECT * FROM generation_history
WHERE success = false
ORDER BY created_at DESC;
```

## Tips de Optimización

1. **Usa el modelo correcto:**
   - Outlines: Sonnet (balance)
   - Artículos complejos: Opus (calidad)
   - Revisiones simples: Haiku (velocidad)

2. **Ajusta temperatura:**
   - 0.5-0.6: Contenido más factual y consistente
   - 0.7-0.8: Balance (recomendado)
   - 0.9-1.0: Más creativo y variado

3. **Limita maxTokens:**
   - Outlines: 4000 tokens
   - Artículos: 6000-8000 tokens
   - Revisiones: 3000-4000 tokens

4. **Cachea knowledge base:**
   - Los archivos KB no cambian frecuentemente
   - Considera implementar caching en memoria o Redis

## Troubleshooting

### Error: "AI returned invalid JSON format"

La AI a veces envuelve JSON en markdown. La función `parseAIJSON()` maneja esto, pero si falla:

1. Revisa el prompt - asegúrate de pedir "ONLY a valid JSON object"
2. Aumenta `maxTokens` si la respuesta se cortó
3. Baja `temperature` para respuestas más consistentes

### Error: "OpenRouter API error: 401"

Verifica que `OPENROUTER_API_KEY` esté configurado correctamente.

### Error: "OpenRouter API error: 429"

Has excedido el rate limit. Espera unos segundos y reintenta.

### Respuestas incompletas

Si las respuestas se cortan a mitad:

1. Aumenta `maxTokens`
2. Simplifica el prompt
3. Divide la tarea en pasos más pequeños
