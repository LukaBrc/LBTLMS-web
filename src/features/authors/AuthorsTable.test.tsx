import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthorsTable } from './AuthorsTable'

describe('AuthorsTable', () => {
  it('renders author rows', () => {
    render(
      <AuthorsTable
        authors={[
          { id: 1, firstName: 'Jane', lastName: 'Austen', birthDate: '1775-12-16' },
          { id: 2, firstName: 'Leo', lastName: 'Tolstoy', birthDate: '1828-09-09' },
        ]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        isDeleting={false}
      />,
    )

    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText('Tolstoy')).toBeInTheDocument()
  })
})
