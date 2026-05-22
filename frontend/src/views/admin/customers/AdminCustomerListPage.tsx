"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { AdminCustomerListVM } from "./AdminCustomerListVM";
import { Loader2, Search, Users } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import dayjs from "dayjs";

const getStatusBadge = (status: number) => {
    if (status === 1) return <span className="badge badge-success">{t.admin.customer.status_active()}</span>;
    if (status === 2) return <span className="badge badge-danger">{t.admin.customer.status_stopped()}</span>;
    return <span className="badge badge-warning">{t.admin.customer.status_pending()}</span>;
};

const AdminCustomerListPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminCustomerListVM();

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.customer.page_title()}</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{t.admin.customer.items_count({ count: config.customers.length })}</p>
                    )}
                </div>
            </div>

            {/* Search */}
            <form
                onSubmit={(e) => { e.preventDefault(); action.handleSearchSubmit(); }}
                className="flex gap-3 mb-6 max-w-lg"
            >
                <div className="search-input-wrapper flex-1">
                    <Search size={17} className="search-icon" />
                    <input
                        type="text"
                        value={config.searchInput}
                        onChange={(e) => action.setSearchInput(e.target.value)}
                        placeholder={t.admin.customer.search_placeholder()}
                        className="input"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {t.admin.common.search()}
                </button>
            </form>

            {config.isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : config.customers.length === 0 ? (
                <div className="empty-state">
                    <Users size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.customer.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.customer.empty_desc()}</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{t.admin.customer.col_full_name()}</th>
                                    <th>Email</th>
                                    <th>{t.admin.customer.col_phone()}</th>
                                    <th>{t.admin.customer.col_status()}</th>
                                    <th>{t.admin.customer.col_created()}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {config.customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="font-semibold">#{customer.id}</td>
                                        <td className="font-medium">{customer.full_name}</td>
                                        <td className="text-muted-foreground">{customer.email}</td>
                                        <td className="text-muted-foreground">{customer.phone || "—"}</td>
                                        <td>{getStatusBadge(customer.status)}</td>
                                        <td className="text-muted-foreground whitespace-nowrap">
                                            {dayjs(customer.created_at).format("DD/MM/YYYY")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {config.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: config.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => action.onPageChange(p)}
                            className={`btn btn-sm min-w-[36px] ${
                                p === config.page ? "btn-primary" : "btn-outline"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCustomerListPage;
