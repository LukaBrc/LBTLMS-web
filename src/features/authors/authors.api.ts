import { apiClient } from '../../api/client'
import type { components } from '../../api/generated/schema'
import type { AuthorFormValues } from './authors.schemas'

export type Author = components['schemas']['AuthorResponse']
export type AuthorRequest = components['schemas']['AuthorRequest']

const AUTHORS_PATH = '/api/v1/authors'

function toPayload(values: AuthorFormValues): AuthorRequest {
  return {
    name: values.name,
  }
}

export async function getAuthors() {
  const { data } = await apiClient.get<Author[]>(AUTHORS_PATH)
  return data
}

export async function createAuthor(values: AuthorFormValues) {
  const { data } = await apiClient.post<Author>(AUTHORS_PATH, toPayload(values))
  return data
}

export async function updateAuthor(id: number, values: AuthorFormValues) {
  const { data } = await apiClient.put<Author>(`${AUTHORS_PATH}/${id}`, toPayload(values))
  return data
}

export async function deleteAuthor(id: number) {
  await apiClient.delete(`${AUTHORS_PATH}/${id}`)
}
