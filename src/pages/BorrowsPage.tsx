import { Card } from '../components/ui/card'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BorrowForm } from '../features/borrows/BorrowForm'
import { BorrowsTable } from '../features/borrows/BorrowsTable'
import {
  borrowBook,
  returnBook,
  getActiveBorrows,
  getOverdueBorrows,
  type BorrowTransaction,
} from '../features/borrows/borrows.api'
import { normalizeApiError } from '../lib/errors'

const ACTIVE_QUERY_KEY = ['borrows', 'active']
const OVERDUE_QUERY_KEY = ['borrows', 'overdue']

type BorrowAction = 'borrow' | 'return'

export function BorrowsPage() {
  const queryClient = useQueryClient()
  const [action, setAction] = useState<BorrowAction>('borrow')

  const activeQuery = useQuery({
    queryKey: ACTIVE_QUERY_KEY,
    queryFn: getActiveBorrows,
  })
  const overdueQuery = useQuery({
    queryKey: OVERDUE_QUERY_KEY,
    queryFn: getOverdueBorrows,
  })

  const activeQueryError = activeQuery.isError ? normalizeApiError(activeQuery.error) : null
  const overdueQueryError = overdueQuery.isError ? normalizeApiError(overdueQuery.error) : null

  const borrowMutation = useMutation({
    mutationFn: borrowBook,
    onSuccess: async () => {
      toast.success('Book borrowed')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ACTIVE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: OVERDUE_QUERY_KEY }),
      ])
    },
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  const returnMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: async () => {
      toast.success('Book returned')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ACTIVE_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: OVERDUE_QUERY_KEY }),
      ])
    },
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  async function handleSubmit(values: { isbn: string; memberId: string }) {
    if (action === 'borrow') {
      await borrowMutation.mutateAsync(values)
    } else {
      await returnMutation.mutateAsync(values)
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex gap-2 mb-2">
        <button
          className={action === 'borrow' ? 'font-bold underline' : ''}
          onClick={() => setAction('borrow')}
        >
          Borrow Book
        </button>
        <button
          className={action === 'return' ? 'font-bold underline' : ''}
          onClick={() => setAction('return')}
        >
          Return Book
        </button>
      </div>
      <BorrowForm
        isSubmitting={borrowMutation.isPending || returnMutation.isPending}
        onSubmit={handleSubmit}
        action={action}
      />
      {activeQuery.isLoading && <p className="text-sm text-[var(--muted)]">Loading active borrows...</p>}
      {activeQuery.isError && (
        <p className="text-sm font-semibold text-[var(--danger)]">
          Failed to load active borrows. {activeQueryError?.message}
        </p>
      )}
      {activeQuery.isSuccess && (
        <BorrowsTable borrows={activeQuery.data} title="Active Borrows" />
      )}
      {overdueQuery.isLoading && <p className="text-sm text-[var(--muted)]">Loading overdue borrows...</p>}
      {overdueQuery.isError && (
        <p className="text-sm font-semibold text-[var(--danger)]">
          Failed to load overdue borrows. {overdueQueryError?.message}
        </p>
      )}
      {overdueQuery.isSuccess && (
        <BorrowsTable borrows={overdueQuery.data} title="Overdue Borrows" />
      )}
    </section>
  )
}
