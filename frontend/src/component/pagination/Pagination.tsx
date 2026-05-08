import React, { useEffect, useState } from "react";
import { Paging } from '@/data';
import "./Pagination.css";
import { AppConstant } from '@/core/utils';

export interface PaginationProps {
    paging: Paging;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    maxVisiblePages?: number;
    style?: React.CSSProperties;
}

const Pagination: React.FC<{ props: PaginationProps }> = ({ props }) => {
    const {
        paging,
        onPageChange,
        onPerPageChange,
        maxVisiblePages = 10,
        style
    } = props;


    if (paging === null || paging === undefined) {
        return null;
    }

    const currentPage = paging.currentPage || AppConstant.CURRENT_PAGE_DEFAULT;
    const perPage = paging.perPage || AppConstant.PER_PAGE_DEFAULT;
    const totalCount = paging.totalCount ?? 0;
    const totalPages = paging.totalPages ?? 0;

    const [perPageInput, setPerPageInput] = useState(perPage);

    useEffect(() => {
        setPerPageInput(perPage);
    }, [perPage]);

    const isHidden = totalCount === 0 || currentPage <= 0;
    if (isHidden) {
        return null; // Hide pagination if no data or only one page
    }

    const generatePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const firstPage = 1;
            const lastPage = totalPages;
            const siblingsCount = 1;

            const leftSiblingIndex = Math.max(currentPage - siblingsCount, 2);
            const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages - 1);

            pages.push(firstPage);

            if (leftSiblingIndex > 2) pages.push("...");

            for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                pages.push(i);
            }

            if (rightSiblingIndex < totalPages - 1) pages.push("...");

            pages.push(lastPage);
        }

        return pages;
    };

    const pages = generatePages();

    const handlePageClick = (page: number | string) => {
        if (page === "...") return;
        if (page !== currentPage) _onPageChange(page as number);
    };

    const goFirst = () => {
        if (currentPage !== 1) _onPageChange(1);
    };

    const goPrev = () => {
        if (currentPage > 1) _onPageChange(currentPage - 1);
    };

    const goNext = () => {
        if (currentPage < totalPages) _onPageChange(currentPage + 1);
    };

    const goLast = () => {
        if (currentPage !== totalPages) _onPageChange(totalPages);
    };

    const _onPageChange = (page: number) => {
        onPageChange(page);
    };

    const _onPerPageChange = (perPage: number) => {
        if (onPerPageChange) {
            onPerPageChange(perPage);
        }
    };

    return (
        <div className="pagination-container" style={{ ...style }}>
            <select
                value={perPageInput}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    _onPerPageChange(value);
                }}
                className="pagination-per-page-select"
            >
                {[5, 10, 20, 50, 100, 200].map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button
                className="pagination-btn"
                onClick={goFirst}
                disabled={currentPage === 1}
            >
                最初へ
            </button>
            <button
                className="pagination-btn"
                onClick={goPrev}
                disabled={currentPage === 1}
            >
                前へ
            </button>

            {pages.map((page, idx) => (
                <button
                    key={idx}
                    className={`pagination-btn ${page === currentPage ? "active" : ""
                        } ${page === "..." ? "ellipsis" : ""}`}
                    onClick={() => handlePageClick(page)}
                    disabled={page === "..."}
                >
                    {Number.isNaN(page) ? '' : page}
                </button>
            ))}

            <button
                className="pagination-btn"
                onClick={goNext}
                disabled={currentPage === totalPages}
            >
                次へ
            </button>
            <button
                className="pagination-btn"
                onClick={goLast}
                disabled={currentPage === totalPages}
            >
                最後へ
            </button>
        </div>
    );
};

export default Pagination;
