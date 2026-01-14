/**
 * OpenRouter API Client
 * Handles communication with OpenRouter for AI generation
 */

export interface GenerateOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Generate content using OpenRouter API
 */
export async function generateContent(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const {
    model = process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-sonnet-4.5',
    maxTokens = 4000,
    temperature = 0.7,
    stream = false,
  } = options

  // Validate environment variables
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://marketing-hub-liard.vercel.app',
      'X-Title': process.env.OPENROUTER_APP_TITLE || 'Livo Content Platform',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature,
      stream,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('OpenRouter API error:', errorData)
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
  }

  if (stream) {
    // Return the stream for streaming responses
    return response.body as any
  }

  const data = await response.json()

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response from OpenRouter API')
  }

  return data.choices[0].message.content
}

/**
 * Generate content with conversation history
 */
export async function generateWithHistory(
  messages: OpenRouterMessage[],
  options: GenerateOptions = {}
): Promise<string> {
  const {
    model = process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-sonnet-4.5',
    maxTokens = 4000,
    temperature = 0.7,
    stream = false,
  } = options

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://marketing-hub-liard.vercel.app',
      'X-Title': process.env.OPENROUTER_APP_TITLE || 'Livo Content Platform',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('OpenRouter API error:', errorData)
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
  }

  if (stream) {
    return response.body as any
  }

  const data = await response.json()

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response from OpenRouter API')
  }

  return data.choices[0].message.content
}

/**
 * Parse JSON response from AI
 * Handles cases where AI returns markdown-wrapped JSON
 */
export function parseAIJSON<T = any>(response: string): T {
  // Remove markdown code blocks if present
  let cleaned = response.trim()

  // Remove ```json or ``` wrappers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '')
  }

  try {
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', error)
    console.error('Raw response:', response)
    throw new Error('AI returned invalid JSON format')
  }
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English/Spanish
  return Math.ceil(text.length / 4)
}

/**
 * Check if API key is configured
 */
export function isConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}
