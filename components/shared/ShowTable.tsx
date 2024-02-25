import React, { Fragment } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  Row,
} from '@tanstack/react-table'

export const columns: ColumnDef<any>[] = [
    {
      header: "Key",
      footer: props => props.column.id,
      columns: [
        {
          id: 'expander',
          header: () => null,
          cell: ({ row }) => {
            return row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' },
                }}
              >
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              '🔵'
            )
          },
        },
        {
          accessorKey: 'key',
          header: () => null,
          cell: ({ row, getValue }) => (
            <div
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              {getValue<string>()}
            </div>
          ),
        },
      ],
    },
    {
      header: 'Value',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'value',
          header: () => null,
          cell: ({ row, getValue }) => (
            <div
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              {getValue<string>()}
            </div>
          ),

        },
      ],
    },
  ]

  type TableProps<TData> = {
    data: TData[]
    columns: ColumnDef<TData>[]
    renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement
    getRowCanExpand: (row: Row<TData>) => boolean
  }
  
  export function Table({
    data,
    columns,
    renderSubComponent,
    getRowCanExpand,
  }: TableProps<any>): JSX.Element {
    const table = useReactTable<any>({
      data,
      columns,
      getRowCanExpand,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
    })
  
    return (
      <div className="p-2">
        <div className="h-2" />
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <Fragment key={row.id}>
                  <tr>
                    {/* first row is a normal row */}
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      {/* 2nd row is a custom 1 cell row */}
                      <td colSpan={row.getVisibleCells().length}>
                        {renderSubComponent({ row })}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
  
  export const renderSubComponent = ({ row }: { row: Row<any> }) => {
    return (
      <pre style={{ fontSize: '10px' }}>
        <code>{JSON.stringify(row.original, null, 2)}</code>
      </pre>
    )
  }

  export default Table

  