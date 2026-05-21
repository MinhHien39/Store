"use client";

import React, { useState } from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { AdminProductViewsVM } from "./AdminProductViewsVM";
import { Link } from "react-router-dom";
import { AppRoutePath } from "@/application/AppRoutePath";
import { Eye, Loader2, Search } from "lucide-react";
import dayjs from "dayjs";

const AdminProductViewsPage: React.FC = () => {
    const { config, action } = AdminProductViewsVM();
    const [keyword, setKeyword] = useState("");

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Product view counts</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{config.stats.length} sản phẩm trong trang này</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <input
                    className="input max-w-sm"
                    placeholder="Tìm theo tên sản phẩm..."
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

            {config.isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : config.stats.length === 0 ? (
                <div className="empty-state">
                    <Eye size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">Chưa có lượt xem</h3>
                    <p className="empty-state-desc">Dữ liệu sẽ xuất hiện khi khách mở trang chi tiết sản phẩm.</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Sản phẩm</th>
                                    <th>Tổng views</th>
                                    <th>User views</th>
                                    <th>Anonymous views</th>
                                    <th>Unique visitors</th>
                                    <th>Lần xem mới nhất</th>
                                </tr>
                            </thead>
                            <tbody>
                                {config.stats.map((item) => (
                                    <tr key={item.product_id}>
                                        <td className="font-semibold">#{item.product_id}</td>
                                        <td className="font-medium">
                                            <Link
                                                className="text-primary hover:underline"
                                                to={AppRoutePath.ADMIN_PRODUCT_EDIT.replace(":id", String(item.product_id))}
                                            >
                                                {item.product_name}
                                            </Link>
                                        </td>
                                        <td className="font-semibold">{item.total_views}</td>
                                        <td>{item.authenticated_views}</td>
                                        <td>{item.anonymous_views}</td>
                                        <td>{item.unique_visitors}</td>
                                        <td className="text-muted-foreground whitespace-nowrap">
                                            {item.latest_viewed_at ? dayjs(item.latest_viewed_at).format("DD/MM/YYYY HH:mm") : "-"}
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
                            className={`btn btn-sm min-w-[36px] ${
                                page === config.page ? "btn-primary" : "btn-outline"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProductViewsPage;
