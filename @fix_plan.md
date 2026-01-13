# Ralph Fix Plan

## High Priority

### Sprint 1: Core Editor Foundation (8-10h)

- [ ] Install Tiptap extension packages (@tiptap/starter-kit, @tiptap/extension-highlight, @tiptap/extension-link, @tiptap/extension-placeholder)
- [ ] Create `src/lib/editor/tiptap-config.ts` with StarterKit and extensions configuration
- [ ] Create `src/lib/editor/outline-converter.ts` with `outlineToTiptap()` function for JSON → Tiptap conversion
- [ ] Create `src/components/editor/tiptap-editor.tsx` base component with editable/readonly mode support
- [ ] Create `src/components/editor/editor-toolbar.tsx` with basic formatting buttons (bold, italic, strike, headings)
- [ ] Add TypeScript interfaces for OutlineContent and Section in appropriate location
- [ ] Test basic editor rendering and formatting in development environment

### Sprint 2: Pages and Auto-Save (10-12h)

- [ ] Create API route `src/app/api/outlines/route.ts` for GET (list all outlines)
- [ ] Create API route `src/app/api/outlines/[id]/route.ts` for GET (single outline) and PATCH (update)
- [ ] Create `src/app/(dashboard)/outlines/[id]/page.tsx` for outline visualization (readonly mode)
- [ ] Create `src/components/outlines/outline-metadata.tsx` component for displaying outline metadata
- [ ] Create `src/app/(dashboard)/outlines/[id]/edit/page.tsx` for outline editing with auto-save
- [ ] Create `src/components/editor/auto-save-indicator.tsx` with saving/saved/error states
- [ ] Implement auto-save hook with 2-second debounce using `use-debounce` or custom hook
- [ ] Implement error handling with automatic retry (3 attempts) for failed saves
- [ ] Test full edit flow: load → edit → auto-save → reload → verify persistence

### Sprint 3: List Page and Polish (8-10h)

- [ ] Create `src/app/(dashboard)/outlines/page.tsx` for outline listing
- [ ] Create `src/components/outlines/outline-card.tsx` for list item display
- [ ] Create `src/components/outlines/outline-list.tsx` for managing list state and filters
- [ ] Add navigation buttons between view/edit modes with proper state handling
- [ ] Implement "Cancel" button with unsaved changes confirmation dialog
- [ ] Implement "Save and Exit" button that saves before redirecting
- [ ] Add responsive design adjustments for mobile/tablet (test in DevTools)
- [ ] Add keyboard shortcut support and tooltips to toolbar buttons
- [ ] Perform manual testing of all user flows (UC-1 through UC-4 from PRD)
- [ ] Fix any bugs discovered during testing
- [ ] Add JSDoc comments to complex functions

## Medium Priority

- [ ] Implement `tiptapToOutline()` function for reverse conversion (Tiptap → JSON)
- [ ] Create `src/lib/editor/tiptap-utils.ts` with helper functions for editor operations
- [ ] Add loading states to all pages (skeleton screens or spinners)
- [ ] Implement optimistic UI updates for auto-save
- [ ] Add toast notifications for save errors using react-hot-toast or similar
- [ ] Improve toolbar with link insertion functionality
- [ ] Add undo/redo buttons to toolbar (already available via History extension)
- [ ] Make toolbar sticky on scroll for better UX
- [ ] Add filters to outline list page (by status, idea, date)
- [ ] Implement delete outline functionality with confirmation dialog
- [ ] Add "Generate Article" button (disabled) on view page for future Phase 7

## Low Priority

- [ ] Bundle size optimization (code splitting, lazy loading)
- [ ] Add placeholder text with instructions for new users
- [ ] Improve error messages with actionable guidance
- [ ] Add breadcrumb navigation to all outline pages
- [ ] Performance optimization for large outlines (>100 nodes)
- [ ] Add markdown export functionality (for testing/backup)
- [ ] Create unit tests for outline-converter functions
- [ ] Create integration tests for API routes
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Add dark mode support (if project has theme system)

## Completed

- [x] Project initialization (Ralph setup complete)

## Notes

### Database Schema Assumptions
The PRD mentions Supabase but doesn't provide the exact schema. Assume an `outlines` table with:
- `id` (uuid, primary key)
- `idea_id` (uuid, foreign key to ideas table)
- `content` (jsonb) - stores OutlineContent structure
- `template_used` (text)
- `status` (text)
- `generation_metadata` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Action**: Verify schema exists or create migration in first task.

### Phase 4 Integration
The PRD states "Phase 4 completed" with AI generating outlines in JSON format. Need to:
- [ ] Verify Phase 4 implementation exists in codebase
- [ ] Check how outlines are currently stored in database
- [ ] Ensure sample outline data exists for testing
- [ ] If no Phase 4 code exists, create mock data for development

### Extension Versions
Use latest stable v2.x versions of Tiptap packages. Check package.json to see if @tiptap/react is already installed (PRD states it is).

### Auto-Save Strategy
Implement using custom React hook or `use-debounce` library:
```typescript
const debouncedContent = useDebounce(content, 2000)
useEffect(() => {
  // Save debouncedContent
}, [debouncedContent])
```

### Conversion Edge Cases
Start with simple conversion (text + headings), then add:
1. Bullet lists
2. Ordered lists
3. Text formatting (bold, italic, strike)
4. Links
5. Highlights

Handle edge cases:
- Empty sections
- Missing fields (notes, h3s)
- Malformed JSON (show error + raw JSON fallback)

### Navigation Flow
```
/outlines → List all outlines
/outlines/[id] → View (readonly) + "Edit" button
/outlines/[id]/edit → Edit (editable) + "Cancel" / "Save and Exit"
```

### Performance Monitoring
Keep an eye on:
- Bundle size (use `npm run build` to check)
- First Contentful Paint (< 500ms target)
- Time to Interactive
- Editor responsiveness during typing

### Testing Checklist
Before marking task as complete, test:
- [ ] Desktop browsers (Chrome, Firefox, Safari)
- [ ] Mobile responsive (Chrome DevTools device emulation)
- [ ] Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+Z, Cmd+Shift+Z)
- [ ] Network errors (Chrome DevTools → Network → Offline)
- [ ] Large outlines (10+ sections)
- [ ] Empty/minimal outlines
- [ ] Rapid typing (performance)
- [ ] Page refresh (persistence)

### Useful Commands
```bash
# Install dependencies
npm install @tiptap/starter-kit @tiptap/extension-highlight @tiptap/extension-link @tiptap/extension-placeholder use-debounce

# Development
npm run dev

# Type checking
npm run type-check  # or tsc --noEmit

# Build (check bundle size)
npm run build

# Lint
npm run lint
```
