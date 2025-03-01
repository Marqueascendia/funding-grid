import React, { useEffect, useState } from "react";

function Pagination({
  currentPage,
  setCurrentPage,
  fetchPage,
  totalCount
}) {
  const maxVisiblePages = 5;
  const [displayCount, setDisplayCount] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [startPage, setStartPage] = useState(1);

  const handlePageBtn = (page) => {
    setCurrentPage(page);
    fetchPage();
  };

  const handlePrevRange = () => {
    if (startPage > 1) {
      setStartPage(Math.max(1, startPage - maxVisiblePages));
      setCurrentPage(startPage - maxVisiblePages);
    }
  };

  const handleNextRange = () => {
    if (startPage + maxVisiblePages <= totalPages) {
      setStartPage(
        Math.min(totalPages - maxVisiblePages + 1, startPage + maxVisiblePages)
      );
      setCurrentPage(startPage + maxVisiblePages);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / displayCount));
  }, [totalCount, displayCount]);

  return (
    <>
      <div className="pagination flex items-center justify-between bg-[#ffffff] py-2 px-[52px] w-screen fixed bottom-0 z-10">
        <div className="text-sm text-gray-800 font-semibold px-5">
          Total Entries: {totalCount}
        </div>
        <div className="page-right flex items-center gap-2">
          {/* ----------prev button ------- */}
          <button onClick={handlePrevRange} disabled={startPage === 1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
              />
            </svg>
          </button>

          {/* ----------page buttons ------- */}
          <div className="flex">
            {Array.from(
              { length: Math.min(maxVisiblePages, totalPages - startPage + 1) },
              (_, index) => (
                <button
                  disabled={currentPage === startPage + index}
                  key={index}
                  onClick={() => handlePageBtn(startPage + index)}
                  className={` text-sm md:text-base rounded-md md:rounded-xl w-8 md:w-10 h-8 md:h-10 ${
                    currentPage === startPage + index ? "bg-zinc-400 text-white font-semibold" : ""
                  }`}
                >
                  {startPage + index}
                </button>
              )
            )}
            {startPage + maxVisiblePages < totalPages && (
              <div className="mx-2">...</div>
            )}
            {startPage + maxVisiblePages < totalPages && (
              <button
                onClick={() => handlePageBtn(totalPages)}
                className={`rounded-xl w-10 h-10 ${
                  currentPage === totalPages ? "bg-[#EAFDF8]" : ""
                }`}
              >
                {totalPages}
              </button>
            )}
          </div>

          {/* ----------next button ------- */}
          <button
            onClick={handleNextRange}
            disabled={startPage + maxVisiblePages > totalPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Pagination;
