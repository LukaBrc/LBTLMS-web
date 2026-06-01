import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Edit3, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import type { Member } from './members.api'

type MembersTableProps = {
  members: Member[]
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  isDeleting: boolean
}

export function MembersTable({ members, onEdit, onDelete, isDeleting }: MembersTableProps) {
  const columns: ColumnDef<Member>[] = [
    { accessorKey: 'memberId', header: 'Member ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'contact', header: 'Contact' },
    { accessorKey: 'borrowedIsbns', header: 'Borrowed Books', cell: ({ row }) => (row.original.borrowedIsbns?.join(', ') || '-') },
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
    data: members,
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
                <td className="px-3 py-6 text-center text-[var(--muted)]" colSpan={5}>
                  No members found.
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
