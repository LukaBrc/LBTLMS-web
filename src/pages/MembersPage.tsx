import { Card } from '../components/ui/card'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MemberForm } from '../features/members/MemberForm'
import { MembersTable } from '../features/members/MembersTable'
import {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
  type Member,
} from '../features/members/members.api'
import { memberFormSchema, type MemberFormValues } from '../features/members/members.schemas'
import { normalizeApiError } from '../lib/errors'

const MEMBERS_QUERY_KEY = ['members']

export function MembersPage() {
  const queryClient = useQueryClient()
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>()

  const membersQuery = useQuery({
    queryKey: MEMBERS_QUERY_KEY,
    queryFn: getMembers,
  })

  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: async () => {
      toast.success('Member added')
      setServerFieldErrors(undefined)
      await queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY })
    },
    onError: (error) => {
      const parsed = normalizeApiError(error)
      setServerFieldErrors(parsed.fieldErrors)
      toast.error(parsed.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ memberId, values }: { memberId: string; values: MemberFormValues }) => updateMember(memberId, values),
    onSuccess: async () => {
      toast.success('Member updated')
      setEditingMember(null)
      setServerFieldErrors(undefined)
      await queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY })
    },
    onError: (error) => {
      const parsed = normalizeApiError(error)
      setServerFieldErrors(parsed.fieldErrors)
      toast.error(parsed.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: async () => {
      toast.success('Member deleted')
      await queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const sortedMembers = useMemo(
    () =>
      [...(membersQuery.data ?? [])]
        .filter((m) => m.memberId !== undefined)
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
    [membersQuery.data],
  )

  async function handleSubmit(values: MemberFormValues) {
    if (editingMember && editingMember.memberId) {
      await updateMutation.mutateAsync({ memberId: editingMember.memberId, values })
      return
    }
    await createMutation.mutateAsync(values)
  }

  function handleDelete(member: Member) {
    if (!member.memberId) return
    if (window.confirm(`Delete member '${member.name}'?`)) {
      deleteMutation.mutate(member.memberId)
    }
  }

  return (
    <section className="grid gap-6">
      <MemberForm
        editingMember={editingMember}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancelEdit={() => {
          setEditingMember(null)
          setServerFieldErrors(undefined)
        }}
        serverFieldErrors={serverFieldErrors}
      />

      {membersQuery.isLoading && <p className="text-sm text-[var(--muted)]">Loading members...</p>}
      {membersQuery.isError && (
        <p className="text-sm font-semibold text-[var(--danger)]">Failed to load members. Check API connectivity.</p>
      )}
      {membersQuery.isSuccess && (
        <MembersTable
          members={sortedMembers}
          onEdit={(member) => {
            setEditingMember(member)
            setServerFieldErrors(undefined)
          }}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </section>
  )
}
