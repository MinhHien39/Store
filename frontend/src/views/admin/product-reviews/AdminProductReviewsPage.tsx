"use client";

import React, { useState } from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import Pagination from "@/component/pagination/Pagination";
import { AdminProductReviewsVM } from "./AdminProductReviewsVM";
import { AppRoutePath } from "@/application/AppRoutePath";
import { Link } from "react-router-dom";
import { Loader2, MessageSquareText, Search, Star, Trash2 } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import dayjs from "dayjs";

const REVIEW_STATUS = {
    VISIBLE: 1,
    HIDDEN: 2,
} as const;

const getStatusLabel = (status: number) => (status === REVIEW_STATUS.VISIBLE ? t.admin.productReview.status_visible() : t.admin.productReview.status_hidden());

const AdminProductReviewsPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminProductReviewsVM();
    const [keyword, setKeyword] = useState("");

    const renderStars = (rating: number) => (
        <span className="inline-flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={15}
                    fill={star <= rating ? "currentColor" : "none"}
                    className={star <= rating ? "text-amber-500" : "text-gray-300"}
                />
            ))}
        </span>
    );

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.productReview.page_title()}</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{t.admin.productReview.items_count({ count: config.totalItems })}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    className="input max-w-sm"
                    placeholder={t.admin.productReview.search_placeholder()}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") action.onSearch(keyword);
                    }}
                />
                <button className="btn btn-primary" onClick={() => action.onSearch(keyword)}>
                    <Search size={16} />
                    {t.admin.common.search()}
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => action.onFilterStatus(null)}
                    className={`btn btn-sm ${config.statusFilter === null ? "btn-primary" : "btn-outline"}`}
                >
                    {t.admin.common.all()}
                </button>
                {[REVIEW_STATUS.VISIBLE, REVIEW_STATUS.HIDDEN].map((status) => (
                    <button
                        key={status}
                        onClick={() => action.onFilterStatus(status)}
                        className={`btn btn-sm ${config.statusFilter === status ? "btn-primary" : "btn-outline"}`}
                    >
                        {getStatusLabel(status)}
                    </button>
                ))}
            </div>

            {config.isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : config.reviews.length === 0 ? (
                <div className="empty-state">
                    <MessageSquareText size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.productReview.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.productReview.empty_desc()}</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{t.admin.productReview.col_product()}</th>
                                    <th>{t.admin.productReview.col_customer()}</th>
                                    <th>{t.admin.productReview.col_rating()}</th>
                                    <th>{t.admin.productReview.col_comment()}</th>
                                    <th>{t.admin.productReview.col_status()}</th>
                                    <th>{t.admin.productReview.col_created()}</th>
                                    <th>{t.admin.productReview.col_actions()}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {config.reviews.map((review) => (
                                    <tr key={review.id}>
                                        <td className="font-semibold">#{review.id}</td>
                                        <td className="font-medium min-w-[220px]">
                                            <Link
                                                className="text-primary hover:underline"
                                                to={AppRoutePath.ADMIN_PRODUCT_EDIT.replace(":id", String(review.product_id))}
                                            >
                                                {review.product_name}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="font-medium">{review.user_name || t.common.customer()}</div>
                                            <div className="text-xs text-muted-foreground">{t.admin.productReview.user_id({ id: review.user_id })}</div>
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="max-w-[360px]">
                                            <p className="line-clamp-3 text-sm text-muted-foreground">
                                                {review.comment || "-"}
                                            </p>
                                        </td>
                                        <td>
                                            <select
                                                value={review.status}
                                                onChange={(event) => action.onUpdateStatus(review.id, Number(event.target.value))}
                                                className="select !min-h-[32px] !px-2 !text-xs !font-semibold !rounded-full"
                                            >
                                                <option value={REVIEW_STATUS.VISIBLE}>{t.admin.productReview.status_visible()}</option>
                                                <option value={REVIEW_STATUS.HIDDEN}>{t.admin.productReview.status_hidden()}</option>
                                            </select>
                                        </td>
                                        <td className="text-muted-foreground whitespace-nowrap">
                                            {dayjs(review.created_at).format("DD/MM/YYYY HH:mm")}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-destructive"
                                                onClick={() => action.setDeleteId(review.id)}
                                            >
                                                <Trash2 size={14} />
                                                {t.admin.productReview.delete_button()}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {config.totalItems > 0 && (
                <Pagination
                    props={{
                        currentPage: config.page,
                        perPage: config.perPage,
                        totalCount: config.totalItems,
                        totalPages: config.totalPages,
                        onPageChange: action.onPageChange,
                        showPerPage: false,
                    }}
                />
            )}

            {config.deleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-sm">
                        <h3 className="admin-delete__title">{t.admin.productReview.delete_title()}</h3>
                        <p className="admin-delete__desc">{t.admin.productReview.delete_confirm()}</p>
                        <div className="admin-delete__actions">
                            <button
                                onClick={() => action.setDeleteId(null)}
                                disabled={config.isDeleting}
                                className="btn btn-outline"
                            >
                                {t.admin.common.cancel()}
                            </button>
                            <button onClick={action.handleDelete} disabled={config.isDeleting} className="btn btn-destructive">
                                {config.isDeleting && <Loader2 size={14} className="animate-spin" />}
                                {t.admin.productReview.delete_button()}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProductReviewsPage;
