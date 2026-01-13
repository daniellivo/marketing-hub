'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useState } from 'react'

const ideaSchema = z.object({
  title: z.string().min(10, 'El título debe tener mínimo 10 caracteres'),
  description: z.string().optional(),
  target_audience: z.enum(['Healthcare Professionals', 'Healthcare Facilities', 'Industry'], {
    message: 'Selecciona una audiencia objetivo',
  }),
  job_category: z.enum(['All', 'Enfermería', 'TCAEs', 'Médicos'], {
    message: 'Selecciona una categoría de trabajo',
  }),
  template_type: z.enum(
    ['pillar', 'how-to', 'listicle', 'case-study', 'comparison', 'thought-leadership'],
    {
      message: 'Selecciona un tipo de template',
    }
  ),
  keywords: z.array(z.string()).min(1, 'Añade al menos 1 keyword'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
})

export type IdeaFormValues = z.infer<typeof ideaSchema>

interface IdeaFormProps {
  initialData?: Partial<IdeaFormValues>
  onSubmit: (data: IdeaFormValues) => Promise<void>
  submitLabel?: string
}

export function IdeaForm({ initialData, onSubmit, submitLabel = 'Guardar' }: IdeaFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      target_audience: initialData?.target_audience,
      job_category: initialData?.job_category,
      template_type: initialData?.template_type,
      keywords: initialData?.keywords || [],
      priority: initialData?.priority || 'medium',
    },
  })

  const keywords = form.watch('keywords')

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      form.setValue('keywords', [...keywords, trimmed])
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    form.setValue(
      'keywords',
      keywords.filter((k) => k !== keyword)
    )
  }

  const handleSubmit = async (data: IdeaFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cómo optimizar tu CV como enfermera" {...field} />
              </FormControl>
              <FormDescription>
                Título descriptivo de la idea (mínimo 10 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contexto adicional sobre esta idea..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="target_audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audiencia Objetivo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona audiencia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Healthcare Professionals">
                      Healthcare Professionals
                    </SelectItem>
                    <SelectItem value="Healthcare Facilities">Healthcare Facilities</SelectItem>
                    <SelectItem value="Industry">Industry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría de Trabajo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="Enfermería">Enfermería</SelectItem>
                    <SelectItem value="TCAEs">TCAEs</SelectItem>
                    <SelectItem value="Médicos">Médicos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="template_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Template</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pillar">Pillar Content</SelectItem>
                    <SelectItem value="how-to">How-to Guide</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="comparison">Comparison</SelectItem>
                    <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="keywords"
          render={() => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Añadir keyword..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddKeyword()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddKeyword}>
                    Añadir
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="gap-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormDescription>
                Presiona Enter o haz clic en "Añadir" para agregar keywords
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
