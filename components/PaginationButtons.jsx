export default function PaginationButtons({ page, pageSize, total, setPage }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
      >
        Prev
      </button>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page * pageSize >= total}
        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
