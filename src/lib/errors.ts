import { AxiosError } from 'axios'

export type NormalizedApiError = {
  message: string
  fieldErrors?: Record<string, string>
}

type ApiErrorLike = {
  message?: string
  errors?: Record<string, string>
  fieldErrors?: Array<{ field: string; message: string }>
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (!(error instanceof AxiosError)) {
    return { message: 'Unexpected error. Please try again.' }
  }

  const payload = error.response?.data as ApiErrorLike | undefined
  const fallbackMessage = error.message || 'Request failed'

  if (!payload) {
    return { message: fallbackMessage }
  }

  const fieldErrorsFromList = (payload.fieldErrors ?? []).reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.field] = item.message
      return acc
    },
    {},
  )

  return {
    message: payload.message || fallbackMessage,
    fieldErrors: {
      ...(payload.errors ?? {}),
      ...fieldErrorsFromList,
    },
  }
}
