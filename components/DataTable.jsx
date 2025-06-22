"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import React, { useState, useImperativeHandle, forwardRef } from "react"

export const DataTable= forwardRef(function DataTable ({ columns, data, hideSearch }, ref) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  useImperativeHandle(ref, () => table, [table]);

  return (
    <div>
    {!hideSearch && (
      <div className="flex items-center py-4">
        <Input
          placeholder="Search tweets..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm bg-mainBg border-sidebarBorder text-zinc-200 placeholder:text-zinc-400"
        />
      </div>
    )}
      <div className="rounded-md border border-sidebarBorder">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-mainBg text-zinc-100">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-zinc-300 uppercase text-xs tracking-wider">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="hover:bg-sidebarBorder/30 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="text-zinc-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
             <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-zinc-400"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
