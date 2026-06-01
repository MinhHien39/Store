"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import Pagination from "@/component/pagination/Pagination";
import { AdminCustomerListVM } from "./AdminCustomerListVM";
import { Loader2, Mail, Pencil, Phone, Plus, Search, Trash2, Users, X } from "lucide-react";
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
    const { form, formErrors } = config;

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.customer.page_title()}</h2>
                    {!config.isLoading && (
                        <p className="page-subtitle">{t.admin.customer.items_count({ count: config.totalItems })}</p>
                    )}
                </div>
                <button onClick={action.openCreate} className="btn btn-primary">
                    <Plus size={18} />
                    {t.admin.customer.add_new()}
                </button>
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
                                    <th className="text-right">{t.admin.customer.col_actions()}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {config.customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="font-semibold">#{customer.id}</td>
                                        <td>
                                            <div className="customer-cell">
                                                <span className="customer-avatar">{(customer.full_name || customer.email || "?").slice(0, 1).toUpperCase()}</span>
                                                <span className="font-medium">{customer.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground">
                                            <span className="customer-inline"><Mail size={14} />{customer.email}</span>
                                        </td>
                                        <td className="text-muted-foreground">
                                            <span className="customer-inline"><Phone size={14} />{customer.phone || "—"}</span>
                                        </td>
                                        <td>{getStatusBadge(customer.status)}</td>
                                        <td className="text-muted-foreground whitespace-nowrap">
                                            {dayjs(customer.created_at).format("DD/MM/YYYY")}
                                        </td>
                                        <td>
                                            <div className="admin-list__actions justify-end">
                                                <button onClick={() => action.openEdit(customer)} className="icon-btn" aria-label={t.common.edit()}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => action.setDeleteId(customer.id)} className="icon-btn icon-btn-danger" aria-label={t.common.delete()}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
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

            {config.isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-md customer-modal">
                        <div className="admin-modal__header">
                            <h3 className="admin-modal__title">
                                {config.editItem ? t.admin.customer.modal_title_edit() : t.admin.customer.modal_title_create()}
                            </h3>
                            <button onClick={action.closeModal} className="icon-btn" aria-label={t.common.close()}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="admin-modal__fields">
                            <div className="admin-form__group">
                                <label className="label">{t.admin.customer.label_full_name()} <span className="admin-form__required">*</span></label>
                                <input
                                    value={form.fullName}
                                    onChange={(e) => action.setFormField("fullName", e.target.value)}
                                    className={`input${formErrors.fullName ? " admin-form__input--error" : ""}`}
                                />
                                {formErrors.fullName && <p className="admin-form__error">{formErrors.fullName}</p>}
                            </div>
                            <div className="admin-form__group">
                                <label className="label">{t.admin.customer.label_email()} <span className="admin-form__required">*</span></label>
                                <input
                                    value={form.email}
                                    onChange={(e) => action.setFormField("email", e.target.value)}
                                    className={`input${formErrors.email ? " admin-form__input--error" : ""}`}
                                />
                                {formErrors.email && <p className="admin-form__error">{formErrors.email}</p>}
                            </div>
                            <div className="admin-form__row admin-form__row--2">
                                <div className="admin-form__group">
                                    <label className="label">{t.admin.customer.label_phone()}</label>
                                    <input
                                        value={form.phone}
                                        onChange={(e) => action.setFormField("phone", e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <div className="admin-form__group">
                                    <label className="label">{t.admin.customer.label_status()}</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => action.setFormField("status", e.target.value)}
                                        className="select"
                                    >
                                        <option value="0">{t.admin.customer.status_pending()}</option>
                                        <option value="1">{t.admin.customer.status_active()}</option>
                                        <option value="2">{t.admin.customer.status_stopped()}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form__group">
                                <label className="label">
                                    {t.admin.customer.label_password()}
                                    {!config.editItem && <span className="admin-form__required"> *</span>}
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => action.setFormField("password", e.target.value)}
                                    placeholder={config.editItem ? t.admin.customer.password_optional() : ""}
                                    className={`input${formErrors.password ? " admin-form__input--error" : ""}`}
                                />
                                {formErrors.password && <p className="admin-form__error">{formErrors.password}</p>}
                            </div>
                        </div>
                        <div className="admin-modal__actions">
                            <button onClick={action.closeModal} className="btn btn-outline">
                                {t.admin.common.cancel()}
                            </button>
                            <button onClick={action.handleSave} disabled={config.isSaving} className="btn btn-primary">
                                {config.isSaving && <Loader2 size={14} className="animate-spin" />}
                                {config.editItem ? t.admin.common.update() : t.admin.common.create()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {config.deleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-sm">
                        <h3 className="admin-delete__title">{t.admin.customer.delete_title()}</h3>
                        <p className="admin-delete__desc">{t.admin.customer.delete_confirm()}</p>
                        <div className="admin-delete__actions">
                            <button onClick={() => action.setDeleteId(null)} disabled={config.isDeleting} className="btn btn-outline">
                                {t.admin.common.cancel()}
                            </button>
                            <button onClick={action.handleDelete} disabled={config.isDeleting} className="btn btn-destructive">
                                {config.isDeleting ? t.admin.common.deleting() : t.admin.common.delete()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .customer-cell,
                .customer-inline {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 0;
                }

                .customer-avatar {
                    display: inline-flex;
                    width: 34px;
                    height: 34px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #fff7ed, #fed7aa);
                    color: var(--color-primary);
                    font-size: 0.85rem;
                    font-weight: 900;
                    box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.2);
                }

                .customer-inline {
                    max-width: 260px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .customer-modal {
                    animation: customerModalIn 220ms ease both;
                }

                @keyframes customerModalIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </AdminLayout>
    );
};

export default AdminCustomerListPage;
