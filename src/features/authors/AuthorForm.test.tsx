import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { AuthorForm } from './AuthorForm'

describe('AuthorForm', () => {
  it('shows required validation messages', async () => {
    const user = userEvent.setup()

    render(
      <AuthorForm
        editingAuthor={null}
        isSubmitting={false}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onCancelEdit={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Create Author' }))

    expect(await screen.findByText('First name is required')).toBeInTheDocument()
    expect(await screen.findByText('Last name is required')).toBeInTheDocument()
  })
})
