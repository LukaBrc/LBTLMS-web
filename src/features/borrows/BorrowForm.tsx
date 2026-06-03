import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { FieldMessage } from '../../components/ui/field-message'
import { Label } from '../../components/ui/label'
import { getBooks } from '../books/books.api'
import { getMembers } from '../members/members.api'
import { borrowFormSchema, type BorrowFormValues } from './borrows.schemas'

interface BorrowFormProps {
  isSubmitting: boolean
  onSubmit: (values: BorrowFormValues) => Promise<void>
  action: 'borrow' | 'return'
}

export function BorrowForm({ isSubmitting, onSubmit, action }: BorrowFormProps) {
  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  })
  const membersQuery = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const bookOptions = (booksQuery.data ?? [])
    .filter((book) => book.isbn !== undefined)
    .filter((book) => (action === 'borrow' ? (book.availableCopies ?? 0) > 0 : true))
    .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))

  const memberOptions = (membersQuery.data ?? [])
    .filter((member) => member.memberId !== undefined)
    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))

  const isSelectLoading = booksQuery.isLoading || membersQuery.isLoading
  const isSelectError = booksQuery.isError || membersQuery.isError

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: { isbn: '', memberId: '' },
  })

  useEffect(() => {
    reset({ isbn: '', memberId: '' })
  }, [action, reset])

  return (
    <Card>
      <h2 className="text-xl mb-2">{action === 'borrow' ? 'Borrow Book' : 'Return Book'}</h2>
      <form
        className="grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
          reset({ isbn: '', memberId: '' })
        })}
      >
        <div>
          <Label htmlFor="isbn">Book</Label>
          <select
            id="isbn"
            className="h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm outline-none ring-[var(--brand)] transition focus:ring-2"
            disabled={isSubmitting || isSelectLoading || isSelectError}
            {...register('isbn')}
          >
            <option value="">Select a book</option>
            {bookOptions.map((book) => (
              <option key={book.isbn} value={book.isbn}>
                {book.title ? `${book.title} (${book.isbn})` : book.isbn}
              </option>
            ))}
          </select>
          {booksQuery.isLoading && <p className="mt-1 text-xs text-[var(--muted)]">Loading books...</p>}
          {booksQuery.isError && <FieldMessage>Failed to load books. Please refresh and try again.</FieldMessage>}
          {errors.isbn?.message && <FieldMessage>{errors.isbn.message}</FieldMessage>}
        </div>
        <div>
          <Label htmlFor="memberId">Member</Label>
          <select
            id="memberId"
            className="h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm outline-none ring-[var(--brand)] transition focus:ring-2"
            disabled={isSubmitting || isSelectLoading || isSelectError}
            {...register('memberId')}
          >
            <option value="">Select a member</option>
            {memberOptions.map((member) => (
              <option key={member.memberId} value={member.memberId}>
                {member.name ? `${member.name} (${member.memberId})` : member.memberId}
              </option>
            ))}
          </select>
          {membersQuery.isLoading && <p className="mt-1 text-xs text-[var(--muted)]">Loading members...</p>}
          {membersQuery.isError && <FieldMessage>Failed to load members. Please refresh and try again.</FieldMessage>}
          {errors.memberId?.message && <FieldMessage>{errors.memberId.message}</FieldMessage>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (action === 'borrow' ? 'Borrowing...' : 'Returning...') : action === 'borrow' ? 'Borrow' : 'Return'}
        </Button>
      </form>
    </Card>
  )
}
