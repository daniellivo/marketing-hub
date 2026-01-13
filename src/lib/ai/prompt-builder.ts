/**
 * AI Prompt Builder
 * Constructs prompts for outline and article generation
 */

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type ContentIdea = Database['public']['Tables']['content_ideas']['Row']
type Template = Database['public']['Tables']['templates']['Row']
type KnowledgeBaseFile = Database['public']['Tables']['knowledge_base_files']['Row']
type Outline = Database['public']['Tables']['outlines']['Row']

/**
 * Get relevant knowledge base files
 */
export async function getRelevantKBFiles(): Promise<KnowledgeBaseFile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('knowledge_base_files')
    .select('*')
    .order('file_type', { ascending: true })

  if (error) {
    console.error('Error fetching KB files:', error)
    return []
  }

  return data || []
}

/**
 * Get template by type
 */
export async function getTemplate(templateType: string): Promise<Template | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('template_type', templateType)
    .single()

  if (error) {
    console.error('Error fetching template:', error)
    return null
  }

  return data
}

/**
 * Build prompt for outline generation
 */
export async function buildOutlinePrompt(
  idea: ContentIdea,
  template: Template,
  kbFiles: KnowledgeBaseFile[]
): Promise<string> {
  // Group KB files by type
  const companyFiles = kbFiles.filter(f => f.file_type === 'company')
  const seoFiles = kbFiles.filter(f => f.file_type === 'seo')
  const geoFiles = kbFiles.filter(f => f.file_type === 'geo')
  const qualityFiles = kbFiles.filter(f => f.file_type === 'quality')

  const prompt = `# CONTEXT
You are an expert SEO/GEO content strategist creating content for Livo, a healthcare staffing marketplace in Spain.

## Company Information
${companyFiles.map(f => `### ${f.file_name}\n${f.content}`).join('\n\n')}

## SEO Guidelines
${seoFiles.map(f => `### ${f.file_name}\n${f.content}`).join('\n\n')}

## GEO Guidelines
${geoFiles.map(f => `### ${f.file_name}\n${f.content}`).join('\n\n')}

${qualityFiles.length > 0 ? `## Quality Guidelines\n${qualityFiles.map(f => `### ${f.file_name}\n${f.content}`).join('\n\n')}` : ''}

## Template Structure
${template.content}

---

# TASK
Generate a detailed content outline for the following idea:

**Title**: ${idea.title}
**Description**: ${idea.description || 'No additional description provided'}
**Target Audience**: ${idea.target_audience}
**Job Category**: ${idea.job_category}
**Keywords**: ${idea.keywords.join(', ')}
**Priority**: ${idea.priority}

# REQUIREMENTS
1. Follow the template structure exactly
2. Apply all SEO and GEO principles from the guidelines
3. Use Livo's tone and voice (professional, empathetic, data-driven)
4. Include specific references to Livo products when relevant (Livo Pool, Livo Offers, Livo Interno)
5. Optimize for the target keywords naturally
6. Structure: H2s, H3s, bullet points with key messages
7. Include FAQ section ideas (minimum 5 questions)
8. Suggest internal linking opportunities
9. Include meta description suggestion (max 155 characters)
10. Consider the target audience and job category in all recommendations

# OUTPUT FORMAT
Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):

{
  "title": "SEO-optimized title (50-60 characters, include main keyword)",
  "meta_description": "Compelling meta description (150-155 characters)",
  "introduction": {
    "hook": "Attention-grabbing opening sentence",
    "context": "Brief context setting (2-3 sentences)",
    "key_points": ["Main point 1", "Main point 2", "Main point 3"]
  },
  "sections": [
    {
      "h2": "Section title (include keyword variation)",
      "h3s": ["Subsection 1", "Subsection 2", "Subsection 3"],
      "key_points": [
        "Important point to cover in this section",
        "Another key message",
        "Supporting data or example to include"
      ],
      "notes": "Additional context, tone guidance, or specific requirements for this section"
    }
  ],
  "faq": [
    {
      "question": "Frequently asked question?",
      "answer_guidance": "Key points to cover in the answer"
    }
  ],
  "conclusion": {
    "summary": "Key takeaways to summarize",
    "cta": "Call to action message",
    "next_steps": ["Step 1", "Step 2"]
  },
  "internal_linking": [
    {
      "anchor": "Suggested anchor text",
      "target": "Related topic or page to link to",
      "section": "Which section to place this link"
    }
  ],
  "seo_notes": {
    "primary_keyword": "Main target keyword",
    "secondary_keywords": ["Keyword variation 1", "Keyword variation 2"],
    "keyword_density": "Recommendation for keyword usage",
    "search_intent": "What user intent this content addresses"
  }
}

Generate the outline now:`

  return prompt
}

/**
 * Build prompt for article generation from outline
 */
export async function buildArticlePrompt(
  idea: ContentIdea,
  outline: Outline,
  kbFiles: KnowledgeBaseFile[],
  comments?: any[]
): Promise<string> {
  const companyFiles = kbFiles.filter(f => f.file_type === 'company')
  const seoFiles = kbFiles.filter(f => f.file_type === 'seo')
  const geoFiles = kbFiles.filter(f => f.file_type === 'geo')

  const commentsSection = comments && comments.length > 0
    ? `\n## Feedback and Comments\nThe following feedback has been provided on the outline:\n${comments.map(c => `- ${c.content}`).join('\n')}\n\nPlease incorporate this feedback into the article.`
    : ''

  const prompt = `# CONTEXT
You are an expert content writer creating SEO/GEO optimized content for Livo, a healthcare staffing marketplace in Spain.

## Company Context
${companyFiles.map(f => f.content).join('\n\n')}

## SEO/GEO Guidelines
${seoFiles.map(f => f.content).join('\n\n')}
${geoFiles.map(f => f.content).join('\n\n')}

---

# TASK
Write a complete, publication-ready article based on the following outline:

## Content Idea
**Title**: ${idea.title}
**Target Audience**: ${idea.target_audience}
**Job Category**: ${idea.job_category}
**Keywords**: ${idea.keywords.join(', ')}

## Approved Outline
${JSON.stringify(outline.content, null, 2)}

${commentsSection}

# REQUIREMENTS
1. Write in clear, professional Spanish
2. Use Livo's tone: professional, empathetic, and data-driven
3. Follow the outline structure exactly
4. Include all key points from the outline
5. Write engaging, natural content (avoid keyword stuffing)
6. Include specific examples and data points where relevant
7. Reference Livo products naturally in context
8. Optimize for featured snippets where applicable
9. Use proper heading hierarchy (H1 → H2 → H3)
10. Include the FAQ section at the end before conclusion
11. Total length: 1500-2500 words
12. Write as markdown format

# OUTPUT FORMAT
Return the article as markdown with proper formatting:
- Use # for H1 (title only)
- Use ## for H2 (main sections)
- Use ### for H3 (subsections)
- Use bullet points and numbered lists appropriately
- Use **bold** for emphasis on important terms
- Include line breaks between sections for readability

Generate the article now:`

  return prompt
}

/**
 * Build prompt for article revision
 */
export async function buildRevisionPrompt(
  article: string,
  comments: any[]
): Promise<string> {
  const prompt = `# TASK
Revise the following article based on the provided feedback.

## Current Article
${article}

## Feedback to Address
${comments.map((c, i) => `${i + 1}. ${c.content}\n   Section: ${c.section || 'General'}`).join('\n\n')}

# REQUIREMENTS
1. Address all feedback points
2. Maintain the overall structure and flow
3. Keep Livo's tone and voice consistent
4. Ensure SEO optimization is not compromised
5. Return the complete revised article in markdown format

Generate the revised article now:`

  return prompt
}
