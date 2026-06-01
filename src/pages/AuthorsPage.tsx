import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AuthorForm } from '../features/authors/AuthorForm'
import { AuthorsTable } from '../features/authors/AuthorsTable'
import {
  createAuthor,
  getAuthors,
  deleteAuthor,
  updateAuthor,
  type Author,
} from '../features/authors/authors.api'
import type { AuthorFormValues } from '../features/authors/authors.schemas'
import { normalizeApiError } from '../lib/errors'

const AUTHORS_QUERY_KEY = ['authors']

export function AuthorsPage() {
  const queryClient = useQueryClient()
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>()

  const authorsQuery = useQuery({
    queryKey: AUTHORS_QUERY_KEY,
    queryFn: getAuthors,
  })

  const createMutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: async () => {
      toast.success('Author created')
      setServerFieldErrors(undefined)
      await queryClient.invalidateQueries({ queryKey: AUTHORS_QUERY_KEY })
    },
    onError: (error) => {
      const parsed = normalizeApiError(error)
      setServerFieldErrors(parsed.fieldErrors)
      toast.error(parsed.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: AuthorFormValues }) => updateAuthor(id, values),
    onSuccess: async () => {
      toast.success('Author updated')
      setEditingAuthor(null)
      setServerFieldErrors(undefined)
      await queryClient.invalidateQueries({ queryKey: AUTHORS_QUERY_KEY })
    },
    onError: (error) => {
      const parsed = normalizeApiError(error)
      setServerFieldErrors(parsed.fieldErrors)
      toast.error(parsed.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: async () => {
      toast.success('Author deleted')
      await queryClient.invalidateQueries({ queryKey: AUTHORS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const sortedAuthors = useMemo(
    () =>
      [...(authorsQuery.data ?? [])]
        .filter((a) => a.id !== undefined)
        .sort((a, b) => (a.id! - b.id!)),
    [authorsQuery.data],
  )

  async function handleSubmit(values: AuthorFormValues) {
    if (editingAuthor && editingAuthor.id !== undefined) {
      await updateMutation.mutateAsync({ id: editingAuthor.id, values })
      return
    }
    await createMutation.mutateAsync(values)
  }

  function handleDelete(author: Author) {
    if (author.id === undefined) return
    if (window.confirm(`Delete author '${author.name}'?`)) {
      deleteMutation.mutate(author.id)
    }
  }

  return (
    <section className="grid gap-6">
      <AuthorForm
        editingAuthor={editingAuthor}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancelEdit={() => {
          setEditingAuthor(null)
          setServerFieldErrors(undefined)
        }}
        serverFieldErrors={serverFieldErrors}
      />

      {authorsQuery.isLoading && <p className="text-sm text-[var(--muted)]">Loading authors...</p>}
      {authorsQuery.isError && (
        <p className="text-sm font-semibold text-[var(--danger)]">Failed to load authors. Check API connectivity.</p>
      )}
      {authorsQuery.isSuccess && (
        <AuthorsTable
          authors={sortedAuthors}
          onEdit={(author) => {
            setEditingAuthor(author)
            setServerFieldErrors(undefined)
          }}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </section>
  )
}
