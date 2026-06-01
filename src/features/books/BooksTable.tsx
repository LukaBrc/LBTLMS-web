import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Edit3, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import type { Book } from './books.api'

type BooksTableProps = {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
  isDeleting: boolean
}

export function BooksTable({ books, onEdit, onDelete, isDeleting }: BooksTableProps) {
  const columns: ColumnDef<Book>[] = [
    { accessorKey: 'isbn', header: 'ISBN' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'authorName', header: 'Author' },
    { accessorKey: 'genre', header: 'Genre' },
    { accessorKey: 'totalCopies', header: 'Total Copies' },
    { accessorKey: 'availableCopies', header: 'Available' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
            <Edit3 size={14} />
            Edit
          </Button>
          <Button size="sm" variant="danger" disabled={isDeleting} onClick={() => onDelete(row.original)}>
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b border-[var(--line)] px-3 py-2 font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-[var(--muted)]" colSpan={7}>
                  No books found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--line)]/50 last:border-b-0">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
