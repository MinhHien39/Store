"use client";

import React, { useState } from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { AdminProductReviewsVM } from "./AdminProductReviewsVM";
import { AppRoutePath } from "@/application/AppRoutePath";
import { Link } from "react-router-dom";
import { Loader2, MessageSquareText, Search, Star, Trash2 } from "lucide-react";
import dayjs from "dayjs";

const REVIEW_STATUS = {
    VISIBLE: 1,
    HIDDEN: 2,
} as const;

const getStatusLabel = (status: number) => (status === REVIEW_STATUS.VISIBLE ? "Hiển thị" : "Ẩn");

const AdminProductReviewsPage: React.FC = () => {
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
                    <h2 className="page-title">Quản lý đánh giá</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{config.reviews.length} đánh giá trong trang này</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    className="input max-w-sm"
                    placeholder="Tìm theo sản phẩm, khách hàng, comment..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") action.onSearch(keyword);
                    }}
                />
                <button className="btn btn-primary" onClick={() => action.onSearch(keyword)}>
                    <Search size={16} />
                    Tìm kiếm
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => action.onFilterStatus(null)}
                    className={`btn btn-sm ${config.statusFilter === null ? "btn-primary" : "btn-outline"}`}
                >
                    Tất cả
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
                    <h3 className="empty-state-title">Chưa có đánh giá</h3>
                    <p className="empty-state-desc">Đánh giá sẽ xuất hiện khi khách đăng nhập và gửi review.</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Sản phẩm</th>
                                    <th>Khách hàng</th>
                                    <th>Sao</th>
                                    <th>Comment</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
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
                                            <div className="font-medium">{review.user_name || "Khách hàng"}</div>
                                            <div className="text-xs text-muted-foreground">User #{review.user_id}</div>
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
                                                <option value={REVIEW_STATUS.VISIBLE}>Hiển thị</option>
                                                <option value={REVIEW_STATUS.HIDDEN}>Ẩn</option>
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
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {config.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: config.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => action.onPageChange(page)}
                            className={`btn btn-sm min-w-[36px] ${page === config.page ? "btn-primary" : "btn-outline"}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {config.deleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-sm">
                        <h3 className="admin-delete__title">Xoá đánh giá</h3>
                        <p className="admin-delete__desc">Đánh giá này sẽ bị xoá khỏi danh sách quản lý và trang sản phẩm.</p>
                        <div className="admin-delete__actions">
                            <button
                                onClick={() => action.setDeleteId(null)}
                                disabled={config.isDeleting}
                                className="btn btn-outline"
                            >
                                Huỷ
                            </button>
                            <button onClick={action.handleDelete} disabled={config.isDeleting} className="btn btn-destructive">
                                {config.isDeleting && <Loader2 size={14} className="animate-spin" />}
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProductReviewsPage;
