import React, { useEffect, useState } from "react";
import { Paging } from '@/data';
import "./Pagination.css";
import { AppConstant } from '@/core/utils';
import { t } from '@/core/localized';
import { useLanguage } from '@/provider/LanguageProvider';
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
    paging?: Paging | null;
    currentPage?: number;
    perPage?: number;
    totalCount?: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    maxVisiblePages?: number;
    style?: React.CSSProperties;
    fixedBottom?: boolean;
    showPerPage?: boolean;
}

const Pagination: React.FC<{ props: PaginationProps }> = ({ props }) => {
    useLanguage();
    const {
        paging,
        currentPage: currentPageProp,
        perPage: perPageProp,
        totalCount: totalCountProp,
        totalPages: totalPagesProp,
        onPageChange,
        onPerPageChange,
        maxVisiblePages = 7,
        style,
        fixedBottom = false,
        showPerPage = Boolean(onPerPageChange),
    } = props;

    const hasPaginationInput = Boolean(paging || currentPageProp !== undefined || totalPagesProp !== undefined);
    const currentPage = currentPageProp ?? paging?.currentPage ?? AppConstant.CURRENT_PAGE_DEFAULT;
    const perPage = perPageProp ?? paging?.perPage ?? AppConstant.PER_PAGE_DEFAULT;
    const totalCount = totalCountProp ?? paging?.totalCount ?? 0;
    const totalPages = totalPagesProp ?? paging?.totalPages ?? (perPage > 0 ? Math.ceil(totalCount / perPage) : 1);
    const pageStartItem = totalCount === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const pageEndItem = Math.min(totalCount, currentPage * perPage);

    const [perPageInput, setPerPageInput] = useState(perPage);

    useEffect(() => {
        setPerPageInput(perPage);
    }, [perPage]);

    if (!hasPaginationInput) {
        return null;
    }

    const isHidden = totalCount === 0 || currentPage <= 0;
    if (isHidden) {
        return null;
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

    const goPrev = () => {
        if (currentPage > 1) _onPageChange(currentPage - 1);
    };

    const goNext = () => {
        if (currentPage < totalPages) _onPageChange(currentPage + 1);
    };

    const _onPageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const _onPerPageChange = (perPage: number) => {
        if (onPerPageChange) {
            onPerPageChange(perPage);
        }
    };

    return (
        <>
            {fixedBottom && <div className="pagination-fixed-spacer" aria-hidden="true" />}
            <div
                className={`pagination-container ${fixedBottom ? "pagination-container--fixed" : ""}`}
                style={{ ...style }}
            >
                {showPerPage && (
                    <select
                        value={perPageInput}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setPerPageInput(value);
                            _onPerPageChange(value);
                        }}
                        className="pagination-per-page-select"
                        aria-label="Items per page"
                    >
                        {[5, 10, 20, 50, 100, 200].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}

                <div className="pagination-range">
                    {pageStartItem.toLocaleString("vi-VN")}-{pageEndItem.toLocaleString("vi-VN")} / {totalCount.toLocaleString("vi-VN")}
                </div>

                <button
                    className="pagination-btn pagination-btn--icon"
                    onClick={goPrev}
                    disabled={currentPage === 1}
                    aria-label={t.common.previous()}
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="pagination-pages">
                    {pages.map((page, idx) => (
                        <button
                            key={`${page}-${idx}`}
                            className={`pagination-btn ${page === currentPage ? "active" : ""} ${page === "..." ? "ellipsis" : ""}`}
                            onClick={() => handlePageClick(page)}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="pagination-btn pagination-btn--icon"
                    onClick={goNext}
                    disabled={currentPage === totalPages}
                    aria-label={t.common.next()}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </>
    );
};

export default Pagination;
