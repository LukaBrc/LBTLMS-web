import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { FieldMessage } from '../../components/ui/field-message'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { borrowFormSchema, type BorrowFormValues } from './borrows.schemas'

interface BorrowFormProps {
  isSubmitting: boolean
  onSubmit: (values: BorrowFormValues) => Promise<void>
  action: 'borrow' | 'return'
}

export function BorrowForm({ isSubmitting, onSubmit, action }: BorrowFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: { isbn: '', memberId: '' },
  })

  useEffect(() => { reset({ isbn: '', memberId: '' }) }, [action])

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
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" placeholder="ISBN" {...register('isbn')} />
          {errors.isbn?.message && <FieldMessage>{errors.isbn.message}</FieldMessage>}
        </div>
        <div>
          <Label htmlFor="memberId">Member ID</Label>
          <Input id="memberId" placeholder="Member ID" {...register('memberId')} />
          {errors.memberId?.message && <FieldMessage>{errors.memberId.message}</FieldMessage>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (action === 'borrow' ? 'Borrowing...' : 'Returning...') : action === 'borrow' ? 'Borrow' : 'Return'}
        </Button>
      </form>
    </Card>
  )
}
