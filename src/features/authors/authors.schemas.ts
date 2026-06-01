import { z } from 'zod'

export const authorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(120, 'Name is too long'),
})

export type AuthorFormValues = z.infer<typeof authorFormSchema>
