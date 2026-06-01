import { z } from 'zod'

export const borrowFormSchema = z.object({
  isbn: z.string().trim().min(1, 'ISBN is required'),
  memberId: z.string().trim().min(1, 'Member ID is required'),
})

export type BorrowFormValues = z.infer<typeof borrowFormSchema>
