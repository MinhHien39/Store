import React, { useState } from "react";
import { Paging } from '@/data';
import "./PaginationMobile.css";
import { AppConstant } from '@/core/utils';

export interface PaginationProps {
    paging: Paging;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    maxVisiblePages?: number;
}

const PaginationMobile: React.FC<PaginationProps> = (props) => {
    const {
        paging,
        onPageChange,
        onPerPageChange,
        maxVisiblePages = 3,
    } = props;

    if (!paging) {
        return null;
    }

    const currentPage = paging.currentPage || AppConstant.CURRENT_PAGE_DEFAULT;
    const perPage = paging.perPage || AppConstant.PER_PAGE_DEFAULT;
    const totalCount = paging.totalCount ?? 0;
    const totalPages = paging.totalPages ?? 0;

    const [perPageInput, setPerPageInput] = useState(perPage);

    if (totalCount === 0 || currentPage <= 0) {
        return null;
    }

    const generatePages = () => {
        const pages: number[] = [];

        let start = Math.max(currentPage - 1, 1);
        let end = start + maxVisiblePages - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - maxVisiblePages + 1, 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);

        return pages;
    };

    const pages = generatePages();

    const handlePageClick = (page: number | string) => {
        if (page !== currentPage) onPageChange(page as number);
    };

    const goFirst = () => {
        if (currentPage !== 1) onPageChange(1);
    };

    const goPrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const goNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const goLast = () => {
        if (currentPage !== totalPages) onPageChange(totalPages);
    };

    return (
        <div className="pagination-mobile-container">
            <select
                value={perPageInput}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setPerPageInput(value);
                    onPerPageChange?.(value);
                }}
                className="pagination-mobile-per-page-select"
            >
                {[5, 10, 20, 50, 100, 200].map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button
                className="pagination-mobile-btn"
                onClick={goFirst}
                disabled={currentPage === 1}
            >
                最初へ
            </button>
            <button
                className="pagination-mobile-btn"
                onClick={goPrev}
                disabled={currentPage === 1}
            >
                前へ
            </button>

            {pages.map((page, idx) => (
                <button
                    key={idx}
                    className={`pagination-mobile-btn ${page === currentPage ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className="pagination-mobile-btn"
                onClick={goNext}
                disabled={currentPage === totalPages}
            >
                次へ
            </button>
            <button
                className="pagination-mobile-btn"
                onClick={goLast}
                disabled={currentPage === totalPages}
            >
                最後へ
            </button>
        </div>
    );
};

export default PaginationMobile;
