import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
  AuthorsPage,
  BooksPage,
  BorrowsPage,
  MembersPage,
  RootLayout,
} from './routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/authors" replace /> },
      { path: 'authors', element: <AuthorsPage /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'borrows', element: <BorrowsPage /> },
    ],
  },
])
