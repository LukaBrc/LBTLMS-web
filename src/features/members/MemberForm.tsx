import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { FieldMessage } from '../../components/ui/field-message'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import type { Member } from './members.api'
import { memberFormSchema, type MemberFormValues } from './members.schemas'

interface MemberFormProps {
  editingMember: Member | null
  isSubmitting: boolean
  onSubmit: (values: MemberFormValues) => Promise<void>
  onCancelEdit: () => void
  serverFieldErrors?: Record<string, string>
}

export function MemberForm({
  editingMember,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  serverFieldErrors,
}: MemberFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: '',
      memberId: '',
      contact: '',
    },
  })

  useEffect(() => {
    if (!editingMember) {
      reset({ name: '', memberId: '', contact: '' })
      return
    }
    reset({
      name: editingMember.name ?? '',
      memberId: editingMember.memberId ?? '',
      contact: editingMember.contact ?? '',
    })
  }, [editingMember, reset])

  return (
    <Card>
      <h2 className="text-xl">{editingMember ? 'Edit Member' : 'Add Member'}</h2>
      <form
        className="mt-4 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
          if (!editingMember) {
            reset({ name: '', memberId: '', contact: '' })
          }
        })}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Member Name" {...register('name')} />
          {(errors.name?.message || serverFieldErrors?.name) && (
            <FieldMessage>{errors.name?.message || serverFieldErrors?.name}</FieldMessage>
          )}
        </div>
        <div>
          <Label htmlFor="memberId">Member ID</Label>
          <Input id="memberId" placeholder="Member ID" {...register('memberId')} />
          {(errors.memberId?.message || serverFieldErrors?.memberId) && (
            <FieldMessage>{errors.memberId?.message || serverFieldErrors?.memberId}</FieldMessage>
          )}
        </div>
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Input id="contact" placeholder="Contact" {...register('contact')} />
          {(errors.contact?.message || serverFieldErrors?.contact) && (
            <FieldMessage>{errors.contact?.message || serverFieldErrors?.contact}</FieldMessage>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editingMember ? 'Save Changes' : 'Add Member'}
          </Button>
          {editingMember && (
            <Button type="button" variant="ghost" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
