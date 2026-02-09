

function getPagination(
  totalPages,
  currentPage,
  max = 7
) {
  // 🛑 FIX: small page count
  if (totalPages <= max) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(max / 2);

  let start = Math.max(2, currentPage - half);
  let end = Math.min(totalPages - 1, currentPage + half);

  // Near start
  if (currentPage <= half + 1) {
    start = 2;
    end = max - 1;
  }

  // Near end
  if (currentPage >= totalPages - half) {
    start = totalPages - (max - 2);
    end = totalPages - 1;
  }

  // Absolute safety
  start = Math.max(start, 2);
  end = Math.min(end, totalPages - 1);

  pages.push(1);

  if (start > 2) pages.push('...');

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push('...');

  pages.push(totalPages);

  return pages;
}


export default function Pagination({
  currentPage,
  totalPages,
  handleNext,
  handlePrev,
  onPageClick,
}) {
  if (totalPages <= 1) return null;

  const pages = getPagination(totalPages, currentPage);

  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex gap-2 pt-2 align-items-center">
        {/* Prev */}
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={handlePrev}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`btn ${
                page === currentPage ? 'btn-secondary' : 'btn-light'
              }`}
              onClick={() => onPageClick(page)}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
