import { Card } from '../components/ui/card'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BookForm } from '../features/books/BookForm'
import { BooksTable } from '../features/books/BooksTable'
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  type Book,
} from '../features/books/books.api'
import { bookFormSchema, type BookFormValues } from '../features/books/books.schemas'
import { normalizeApiError } from '../lib/errors'

const BOOKS_QUERY_KEY = ['books']

export function BooksPage() {
  const queryClient = useQueryClient()
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>()

  const booksQuery = useQuery({
    queryKey: BOOKS_QUERY_KEY,
    queryFn: getBooks,
  })

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: async () => {
      toast.success('Book added')
      setServerFieldErrors(undefined)
      await queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY })
    },
    onError: (error) => {
      const parsed = normalizeApiError(error)
      setServerFieldErrors(parsed.fieldErrors)
      toast.error(parsed.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ isbn, values }: { isbn: string; values: BookFormValues }) => updateBook(isbn, values),
    onSuccess: async () => {
      toast.success('Book updated')
      setEditingBook(null)
      setServerFieldErrors(undefined)
      await queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY })
    },
    onError: (error) => {
      const parsed = normalizeApiError(error)
      setServerFieldErrors(parsed.fieldErrors)
      toast.error(parsed.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: async () => {
      toast.success('Book deleted')
      await queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const sortedBooks = useMemo(
    () =>
      [...(booksQuery.data ?? [])]
        .filter((b) => b.isbn !== undefined)
        .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
    [booksQuery.data],
  )

  async function handleSubmit(values: BookFormValues) {
    if (editingBook && editingBook.isbn) {
      await updateMutation.mutateAsync({ isbn: editingBook.isbn, values })
      return
    }
    await createMutation.mutateAsync(values)
  }

  function handleDelete(book: Book) {
    if (!book.isbn) return
    if (window.confirm(`Delete book '${book.title}'?`)) {
      deleteMutation.mutate(book.isbn)
    }
  }

  return (
    <section className="grid gap-6">
      <BookForm
        editingBook={editingBook}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancelEdit={() => {
          setEditingBook(null)
          setServerFieldErrors(undefined)
        }}
        serverFieldErrors={serverFieldErrors}
      />

      {booksQuery.isLoading && <p className="text-sm text-[var(--muted)]">Loading books...</p>}
      {booksQuery.isError && (
        <p className="text-sm font-semibold text-[var(--danger)]">Failed to load books. Check API connectivity.</p>
      )}
      {booksQuery.isSuccess && (
        <BooksTable
          books={sortedBooks}
          onEdit={(book) => {
            setEditingBook(book)
            setServerFieldErrors(undefined)
          }}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </section>
  )
}
