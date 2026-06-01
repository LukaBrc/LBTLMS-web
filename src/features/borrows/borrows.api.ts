import { apiClient } from '../../api/client'
import type { components } from '../../api/generated/schema'

export type BorrowRequest = components['schemas']['BorrowRequest']
export type BorrowTransaction = components['schemas']['BorrowTransaction']

const BORROWS_PATH = '/api/v1/borrows'

export async function borrowBook(values: BorrowRequest) {
  const { data } = await apiClient.post(BORROWS_PATH, values)
  return data
}

export async function returnBook(values: BorrowRequest) {
  const { data } = await apiClient.post(`${BORROWS_PATH}/return`, values)
  return data
}

export async function getActiveBorrows() {
  const { data } = await apiClient.get<BorrowTransaction[]>(`${BORROWS_PATH}/active`)
  return data
}

export async function getOverdueBorrows() {
  const { data } = await apiClient.get<BorrowTransaction[]>(`${BORROWS_PATH}/overdue`)
  return data
}
