import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(currentPage - halfVisiblePages, 1);
  let endPage = Math.min(
    startPage + maxVisiblePages - 1,
    totalPages
  );

  startPage = Math.max(
    endPage - maxVisiblePages + 1,
    1
  );

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <nav className="pagination" aria-label="상품 목록 페이지">
      <button
        type="button"
        className="pagination-button"
        aria-label="이전 페이지"
        disabled={disabled || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={`pagination-button ${
            currentPage === page
              ? "pagination-button-active"
              : ""
          }`}
          aria-current={
            currentPage === page ? "page" : undefined
          }
          disabled={disabled}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination-button"
        aria-label="다음 페이지"
        disabled={disabled || currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;