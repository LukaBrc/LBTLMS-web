import { Outlet } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { AuthorsPage } from '../pages/AuthorsPage'
import { BooksPage } from '../pages/BooksPage'
import { MembersPage } from '../pages/MembersPage'
import { BorrowsPage } from '../pages/BorrowsPage'

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export { RootLayout, AuthorsPage, BooksPage, MembersPage, BorrowsPage }
