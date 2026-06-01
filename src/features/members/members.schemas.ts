import { z } from 'zod'

export const memberFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  memberId: z.string().trim().min(1, 'Member ID is required').max(40, 'Member ID is too long'),
  contact: z.string().trim().min(1, 'Contact is required').max(120, 'Contact is too long'),
})

export type MemberFormValues = z.infer<typeof memberFormSchema>
