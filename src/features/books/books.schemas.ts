import { z } from 'zod'

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  authorId: z.coerce.number().int().min(1, 'Author is required'),
  isbn: z.string().trim().min(1, 'ISBN is required').max(20, 'ISBN is too long'),
  genre: z.string().trim().min(1, 'Genre is required').max(100, 'Genre is too long'),
  totalCopies: z.coerce.number().int().min(1, 'Total copies required'),
})

export type BookFormValues = z.infer<typeof bookFormSchema>
