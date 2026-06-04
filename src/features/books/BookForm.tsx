import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { FieldMessage } from '../../components/ui/field-message'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { getAuthors } from '../authors/authors.api'
import type { Book } from './books.api'
import { bookFormSchema, type BookFormValues } from './books.schemas'

interface BookFormProps {
  editingBook: Book | null
  isSubmitting: boolean
  onSubmit: (values: BookFormValues) => Promise<void>
  onCancelEdit: () => void
  serverFieldErrors?: Record<string, string>
}

export function BookForm({
  editingBook,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  serverFieldErrors,
}: BookFormProps) {
  const authorsQuery = useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
  })

  const authorOptions = (authorsQuery.data ?? [])
    .filter((author) => author.id !== undefined)
    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      authorId: 0,
      isbn: '',
      genre: '',
      totalCopies: 1,
    },
  })

  useEffect(() => {
    if (!editingBook) {
      reset({ title: '', authorId: 0, isbn: '', genre: '', totalCopies: 1 })
      return
    }
    reset({
      title: editingBook.title ?? '',
      authorId: editingBook.authorId ?? 0,
      isbn: editingBook.isbn ?? '',
      genre: editingBook.genre ?? '',
      totalCopies: editingBook.totalCopies ?? 1,
    })
  }, [editingBook, reset])

  return (
    <Card>
      <h2 className="text-xl">{editingBook ? 'Edit Book' : 'Add Book'}</h2>
      <form
        className="mt-4 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
          if (!editingBook) {
            reset({ title: '', authorId: 0, isbn: '', genre: '', totalCopies: 1 })
          }
        })}
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Book Title" {...register('title')} />
          {(errors.title?.message || serverFieldErrors?.title) && (
            <FieldMessage>{errors.title?.message || serverFieldErrors?.title}</FieldMessage>
          )}
        </div>
        <div>
          <Label htmlFor="authorId">Author</Label>
          {authorsQuery.isError ? (
            <Input
              id="authorId"
              type="number"
              min={1}
              placeholder="Author ID"
              disabled={isSubmitting}
              {...register('authorId', { valueAsNumber: true })}
            />
          ) : (
            <select
              id="authorId"
              className="h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm outline-none ring-[var(--brand)] transition focus:ring-2"
              disabled={isSubmitting || authorsQuery.isLoading}
              {...register('authorId', { valueAsNumber: true })}
            >
              <option value={0}>Select an author</option>
              {authorOptions.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name || `Author #${author.id}`}
                </option>
              ))}
            </select>
          )}
          {authorsQuery.isLoading && <p className="mt-1 text-xs text-[var(--muted)]">Loading authors...</p>}
          {authorsQuery.isError && (
            <div className="mt-1 flex items-center gap-2">
              <FieldMessage className="mt-0">Could not load authors list. Enter Author ID manually.</FieldMessage>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void authorsQuery.refetch()
                }}
                disabled={isSubmitting || authorsQuery.isFetching}
              >
                {authorsQuery.isFetching ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          )}
          {(errors.authorId?.message || serverFieldErrors?.authorId) && (
            <FieldMessage>{errors.authorId?.message || serverFieldErrors?.authorId}</FieldMessage>
          )}
        </div>
        <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" placeholder="ISBN" {...register('isbn')} />
          {(errors.isbn?.message || serverFieldErrors?.isbn) && (
            <FieldMessage>{errors.isbn?.message || serverFieldErrors?.isbn}</FieldMessage>
          )}
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" placeholder="Genre" {...register('genre')} />
          {(errors.genre?.message || serverFieldErrors?.genre) && (
            <FieldMessage>{errors.genre?.message || serverFieldErrors?.genre}</FieldMessage>
          )}
        </div>
        <div>
          <Label htmlFor="totalCopies">Total Copies</Label>
          <Input id="totalCopies" type="number" min={1} {...register('totalCopies', { valueAsNumber: true })} />
          {(errors.totalCopies?.message || serverFieldErrors?.totalCopies) && (
            <FieldMessage>{errors.totalCopies?.message || serverFieldErrors?.totalCopies}</FieldMessage>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editingBook ? 'Save Changes' : 'Add Book'}
          </Button>
          {editingBook && (
            <Button type="button" variant="ghost" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
