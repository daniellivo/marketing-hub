'use client'

/**
 * OutlineSidebar Component
 * Displays SEO metadata, meta description, and internal linking suggestions
 * in a collapsible sidebar panel
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface OutlineSidebarProps {
  metaDescription?: string
  seoNotes?: {
    primary_keyword: string
    secondary_keywords: string[]
    keyword_density: string
    search_intent: string
  }
  internalLinking?: Array<{
    anchor: string
    target: string
    section: string
  }>
}

export function OutlineSidebar({
  metaDescription,
  seoNotes,
  internalLinking,
}: OutlineSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768
      if (isMobile && isOpen) {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isOpen])

  // Remember state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('outlineSidebarOpen')
    if (savedState !== null) {
      setIsOpen(savedState === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem('outlineSidebarOpen', String(newState))
  }

  return (
    <div
      className={`fixed right-0 top-20 h-[calc(100vh-5rem)] transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-12'
      } z-40`}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSidebar}
        className="absolute -left-3 top-4 h-8 w-8 rounded-full p-0 shadow-md z-50"
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar Content */}
      {isOpen && (
        <div className="h-full overflow-y-auto bg-white border-l border-gray-200 shadow-lg p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">SEO Metadata</h2>

          {/* Meta Description */}
          {metaDescription && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Meta Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-2">{metaDescription}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {metaDescription.length}/155 caracteres
                  </span>
                  {metaDescription.length >= 150 && metaDescription.length <= 155 ? (
                    <Badge variant="default" className="text-xs">
                      Óptimo
                    </Badge>
                  ) : metaDescription.length > 155 ? (
                    <Badge variant="destructive" className="text-xs">
                      Muy largo
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Corto
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Notes */}
          {seoNotes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">SEO Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Primary Keyword */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    🎯 Primary Keyword
                  </p>
                  <Badge variant="default">{seoNotes.primary_keyword}</Badge>
                </div>

                {/* Secondary Keywords */}
                {seoNotes.secondary_keywords?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      📍 Secondary Keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {seoNotes.secondary_keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyword Density */}
                {seoNotes.keyword_density && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      📊 Keyword Density
                    </p>
                    <p className="text-xs text-gray-700">{seoNotes.keyword_density}</p>
                  </div>
                )}

                {/* Search Intent */}
                {seoNotes.search_intent && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      🔍 Search Intent
                    </p>
                    <p className="text-xs text-gray-700">{seoNotes.search_intent}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Internal Linking */}
          {internalLinking && internalLinking.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Internal Linking Suggestions</CardTitle>
                <CardDescription className="text-xs">
                  Enlaces internos recomendados para este artículo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {internalLinking.map((link, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-blue-200 pl-3 py-2 space-y-1 bg-blue-50 rounded-r"
                  >
                    <p className="text-xs font-medium text-gray-900">
                      🔗 {link.anchor}
                    </p>
                    <p className="text-xs text-gray-600">→ {link.target}</p>
                    <p className="text-xs text-muted-foreground">📍 {link.section}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {!metaDescription && !seoNotes && (!internalLinking || internalLinking.length === 0) && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  No hay metadata SEO disponible para este outline.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
