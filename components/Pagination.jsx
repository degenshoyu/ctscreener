// components/Pagination.jsx

export default function Pagination({ tableRef, align = "center" }) {
  const pageIndex = tableRef.current?.getState().pagination.pageIndex ?? 0;
  const totalPages = tableRef.current?.getPageCount() ?? 1;

  return (
    <div className={`flex justify-${align} items-center gap-2 mt-4`}>
      <button
        onClick={() => tableRef.current?.setPageIndex(Math.max(0, pageIndex - 1))}
        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        disabled={pageIndex === 0}
      >
        Prev
      </button>

      <span className="text-sm text-gray-300">
        Page {pageIndex + 1} of {totalPages}
      </span>

      <button
        onClick={() => tableRef.current?.setPageIndex(Math.min(totalPages - 1, pageIndex + 1))}
        disabled={pageIndex + 1 === totalPages}
        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
