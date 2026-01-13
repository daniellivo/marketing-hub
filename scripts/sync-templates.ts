#!/usr/bin/env tsx

/**
 * Templates Sync Script
 * Syncs markdown templates from templates/ to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { Database } from '../src/types/database'

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

type TemplateType = 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'

const templateMapping: Record<string, TemplateType> = {
  'template-pillar-content.md': 'pillar',
  'template-how-to-guide.md': 'how-to',
  'template-listicle.md': 'listicle',
  'template-case-study.md': 'case-study',
  'template-comparison.md': 'comparison',
  'template-thought-leadership.md': 'thought-leadership',
}

function extractTemplateName(filename: string): string {
  // Remove 'template-' prefix and '.md' extension, convert to title case
  return filename
    .replace('template-', '')
    .replace('.md', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function syncTemplates() {
  console.log('🚀 Starting Templates sync...\n')

  const templatesPath = path.join(process.cwd(), 'templates')

  // Check if templates directory exists
  if (!fs.existsSync(templatesPath)) {
    console.error(`❌ Error: templates directory not found at ${templatesPath}`)
    process.exit(1)
  }

  const files = fs.readdirSync(templatesPath).filter(f => f.endsWith('.md'))

  if (files.length === 0) {
    console.error('❌ Error: No markdown files found in templates/')
    process.exit(1)
  }

  console.log(`📁 Processing templates/ (${files.length} files)\n`)

  let totalSynced = 0
  let totalErrors = 0
  let totalSkipped = 0

  for (const file of files) {
    try {
      const filePath = path.join(templatesPath, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { content, data: frontmatter } = matter(fileContent)

      // Get template type from mapping
      const templateType = templateMapping[file]

      if (!templateType) {
        console.log(`   ⊘ Skipped: ${file} (not in mapping)`)
        totalSkipped++
        continue
      }

      // Extract template name
      const templateName = frontmatter.title || extractTemplateName(file)
      const description = frontmatter.description || `Template for ${templateName.toLowerCase()} content`

      // Prepare data for insert
      const { error } = await (supabase as any)
        .from('templates')
        .upsert({
          template_type: templateType,
          name: templateName,
          description: description,
          content: content,
          structure: frontmatter.structure || null,
          last_synced: new Date().toISOString(),
        }, {
          onConflict: 'template_type'
        })

      if (error) {
        console.error(`   ❌ Error syncing ${file}:`, error.message)
        totalErrors++
      } else {
        console.log(`   ✓ Synced: ${file} → ${templateType}`)
        totalSynced++
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error instanceof Error ? error.message : 'Unknown error')
      totalErrors++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Sync Summary:')
  console.log(`   ✓ Successfully synced: ${totalSynced} templates`)
  if (totalSkipped > 0) {
    console.log(`   ⊘ Skipped: ${totalSkipped}`)
  }
  if (totalErrors > 0) {
    console.log(`   ❌ Errors: ${totalErrors}`)
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (totalErrors > 0) {
    console.log('⚠️  Templates sync completed with errors')
    process.exit(1)
  } else {
    console.log('✅ Templates sync completed successfully!')
  }
}

// Run the sync
syncTemplates().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
