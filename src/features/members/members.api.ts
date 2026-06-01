import { apiClient } from '../../api/client'
import type { components } from '../../api/generated/schema'

export type Member = components['schemas']['MemberResponse']
export type MemberRequest = components['schemas']['MemberRequest']

const MEMBERS_PATH = '/api/v1/members'

export async function getMembers() {
  const { data } = await apiClient.get<Member[]>(MEMBERS_PATH)
  return data
}

export async function createMember(values: MemberRequest) {
  const { data } = await apiClient.post<Member>(MEMBERS_PATH, values)
  return data
}

export async function updateMember(memberId: string, values: MemberRequest) {
  const { data } = await apiClient.put<Member>(`${MEMBERS_PATH}/${memberId}`, values)
  return data
}

export async function deleteMember(memberId: string) {
  await apiClient.delete(`${MEMBERS_PATH}/${memberId}`)
}
