import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { FieldMessage } from '../../components/ui/field-message'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import type { Author } from './authors.api'
import { authorFormSchema, type AuthorFormValues } from './authors.schemas'

type AuthorFormProps = {
  editingAuthor: Author | null
  isSubmitting: boolean
  onSubmit: (values: AuthorFormValues) => Promise<void>
  onCancelEdit: () => void
  serverFieldErrors?: Record<string, string>
}

export function AuthorForm({
  editingAuthor,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  serverFieldErrors,
}: AuthorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (!editingAuthor) {
      reset({ name: '' })
      return
    }
    reset({ name: editingAuthor.name ?? '' })
  }, [editingAuthor, reset])

  return (
    <Card>
      <h2 className="text-xl">{editingAuthor ? 'Edit Author' : 'Create Author'}</h2>
      <form
        className="mt-4 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
          if (!editingAuthor) {
            reset({ name: '' })
          }
        })}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Author Name" {...register('name')} />
          {(errors.name?.message || serverFieldErrors?.name) && (
            <FieldMessage>{errors.name?.message || serverFieldErrors?.name}</FieldMessage>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editingAuthor ? 'Save Changes' : 'Create Author'}
          </Button>
          {editingAuthor && (
            <Button type="button" variant="ghost" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
