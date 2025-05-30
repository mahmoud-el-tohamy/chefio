import React from 'react';
import styles from '@/styles/home/Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const pagesToShow = 5; // Total number of page buttons/ellipsis to aim for (excluding first/last)
    const firstPage = 1;
    const lastPage = totalPages;

    if (totalPages <= pagesToShow + 2) { // If total pages are few, show all
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else { // Total pages are many, use ellipsis
        pageNumbers.push(firstPage);

        // Determine the range of pages around the current page to show
        let start = Math.max(firstPage + 1, currentPage - Math.floor(pagesToShow / 2));
        let end = Math.min(lastPage - 1, currentPage + Math.floor(pagesToShow / 2));

        // Adjust range if it extends too close to the beginning or end
        if (currentPage <= Math.ceil(pagesToShow / 2) + 1) {
             end = pagesToShow;
             start = 2;
        } else if (currentPage >= totalPages - Math.floor(pagesToShow / 2)) {
             start = totalPages - pagesToShow + 1;
             end = lastPage - 1;
        }

        // Add ellipsis before the range if needed
        if (start > firstPage + 1) {
            pageNumbers.push('...');
        }

        // Add pages in the calculated range
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        // Add ellipsis after the range if needed
        if (end < lastPage - 1) {
            pageNumbers.push('...');
        }

        // Add the last page
         if (lastPage !== firstPage) { // Ensure last page is added only if there's more than 1 page
            pageNumbers.push(lastPage);
         }
    }

    return pageNumbers;
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        &lt;
      </button>

      {/* Map through the generated page numbers and render buttons or ellipsis */}
      {renderPageNumbers().map((page, index) => (
        <React.Fragment key={index}> {/* Use index as key for fragment when rendering mixed types */}
          {typeof page === 'number' ? (
            <button
              onClick={() => onPageChange(page)}
              className={`${styles.paginationButton} ${
                currentPage === page ? styles.activeButton : ''
              }`}
               // Disabled prop is handled by the pagination logic itself (e.g., first/last page)
            >
              {page}
            </button>
          ) : (
            <span className={styles.ellipsis}>{page}</span>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        &gt;
      </button>

       <div className={styles.limitControl}>
         <select className={styles.limitSelect} value={limit} onChange={handleLimitChange}>
           <option value={8}>8 / page</option>
           <option value={12}>12 / page</option>
           <option value={20}>20 / page</option>
           <option value={30}>30 / page</option>
         </select>
       </div>

    </div>
  );
};

export default Pagination; 