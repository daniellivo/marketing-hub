#!/usr/bin/env tsx

/**
 * Knowledge Base Sync Script
 * Syncs markdown files from knowledge-base/ to Supabase
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

type FileType = 'company' | 'seo' | 'geo' | 'quality'

async function syncKnowledgeBase() {
  console.log('🚀 Starting Knowledge Base sync...\n')

  const kbPath = path.join(process.cwd(), 'knowledge-base')

  // Check if knowledge-base directory exists
  if (!fs.existsSync(kbPath)) {
    console.error(`❌ Error: knowledge-base directory not found at ${kbPath}`)
    process.exit(1)
  }

  const categories: FileType[] = ['company', 'seo', 'geo', 'quality']
  let totalSynced = 0
  let totalErrors = 0

  for (const category of categories) {
    const categoryPath = path.join(kbPath, category)

    if (!fs.existsSync(categoryPath)) {
      console.log(`⚠️  Skipping ${category} (directory not found)`)
      continue
    }

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))

    if (files.length === 0) {
      console.log(`⚠️  No markdown files found in ${category}/`)
      continue
    }

    console.log(`📁 Processing ${category}/ (${files.length} files)`)

    for (const file of files) {
      try {
        const filePath = path.join(categoryPath, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { content, data: frontmatter } = matter(fileContent)

        // Prepare data for insert
        const filePathRelative = `${category}/${file}`

        const { error } = await (supabase as any)
          .from('knowledge_base_files')
          .upsert({
            file_path: filePathRelative,
            file_type: category,
            file_name: file,
            content: content,
            metadata: frontmatter && Object.keys(frontmatter).length > 0 ? frontmatter : null,
            last_synced: new Date().toISOString(),
          }, {
            onConflict: 'file_path'
          })

        if (error) {
          console.error(`   ❌ Error syncing ${filePathRelative}:`, error.message)
          totalErrors++
        } else {
          console.log(`   ✓ Synced: ${filePathRelative}`)
          totalSynced++
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${file}:`, error instanceof Error ? error.message : 'Unknown error')
        totalErrors++
      }
    }

    console.log('') // Empty line for readability
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Sync Summary:')
  console.log(`   ✓ Successfully synced: ${totalSynced} files`)
  if (totalErrors > 0) {
    console.log(`   ❌ Errors: ${totalErrors}`)
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (totalErrors > 0) {
    console.log('⚠️  Knowledge base sync completed with errors')
    process.exit(1)
  } else {
    console.log('✅ Knowledge base sync completed successfully!')
  }
}

// Run the sync
syncKnowledgeBase().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
