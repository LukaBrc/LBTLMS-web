import { apiClient } from '../../api/client'
import type { components, operations } from '../../api/generated/schema'

export type Book = components['schemas']['BookResponse']
export type BookRequest = components['schemas']['BookRequest']

const BOOKS_PATH = '/api/v1/books'

export async function getBooks() {
  const { data } = await apiClient.get<Book[]>(BOOKS_PATH)
  return data
}

export async function createBook(values: BookRequest) {
  const { data } = await apiClient.post<Book>(BOOKS_PATH, values)
  return data
}

export async function updateBook(isbn: string, values: BookRequest) {
  const { data } = await apiClient.put<Book>(`${BOOKS_PATH}/${isbn}`, values)
  return data
}

export async function deleteBook(isbn: string) {
  await apiClient.delete(`${BOOKS_PATH}/${isbn}`)
}
