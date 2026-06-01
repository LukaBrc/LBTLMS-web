import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Card } from '../../components/ui/card'
import type { BorrowTransaction } from './borrows.api'

type BorrowsTableProps = {
  borrows: BorrowTransaction[]
  title: string
}

export function BorrowsTable({ borrows, title }: BorrowsTableProps) {
  const columns: ColumnDef<BorrowTransaction>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'bookIsbn', header: 'ISBN' },
    { accessorKey: 'memberId', header: 'Member ID' },
    { accessorKey: 'borrowDate', header: 'Borrowed', cell: ({ row }) => row.original.borrowDate ?? '-' },
    { accessorKey: 'dueDate', header: 'Due', cell: ({ row }) => row.original.dueDate ?? '-' },
    { accessorKey: 'returnDate', header: 'Returned', cell: ({ row }) => row.original.returnDate ?? '-' },
    { accessorKey: 'active', header: 'Active', cell: ({ row }) => row.original.active ? 'Yes' : 'No' },
  ]

  const table = useReactTable({
    data: borrows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card>
      <h3 className="text-lg mb-2">{title}</h3>
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
                  No records found.
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
