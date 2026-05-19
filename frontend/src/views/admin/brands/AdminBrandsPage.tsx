"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import Pagination from "@/component/pagination/Pagination";
import { Plus, Pencil, Trash2, Loader2, X, Award } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AdminBrandsVM } from "./AdminBrandsVM";

const AdminBrandsPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminBrandsVM();
    const { brands, paging, isLoading, isModalOpen, editItem, deleteId, isDeleting, isSaving, formName, formDesc, formError, page, perPage } = config;
    const pagedBrands = brands.slice((page - 1) * perPage, page * perPage);

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.brand.page_title()}</h2>
                    {!isLoading && <p className="page-subtitle">{t.admin.brand.items_count({ count: paging?.totalCount ?? brands.length })}</p>}
                </div>
                <button onClick={action.openCreate} className="btn btn-primary">
                    <Plus size={18} />
                    {t.admin.brand.add_new()}
                </button>
            </div>

            {isLoading ? (
                <div className="admin-loading">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : brands.length === 0 ? (
                <div className="empty-state">
                    <Award size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.brand.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.brand.empty_desc()}</p>
                </div>
            ) : (
                <div className="list-card">
                    {pagedBrands.map((brand) => (
                        <div key={brand.id} className="list-card-row">
                            <div>
                                <p className="admin-list__name">{brand.name}</p>
                                {brand.description && <p className="admin-list__desc">{brand.description}</p>}
                            </div>
                            <div className="admin-list__actions">
                                <button onClick={() => action.openEdit(brand)} className="icon-btn" aria-label={t.common.edit()}>
                                    <Pencil size={16} />
                                </button>
                                <button onClick={() => action.setDeleteId(brand.id)} className="icon-btn icon-btn-danger" aria-label={t.common.delete()}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {paging && (
                        <Pagination
                            props={{
                                paging,
                                onPageChange: action.handlePageChange,
                                onPerPageChange: action.handlePerPageChange,
                                style: { padding: "16px" },
                            }}
                        />
                    )}
                </div>
            )}

            {/* Create/Edit modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-md">
                        <div className="admin-modal__header">
                            <h3 className="admin-modal__title">{editItem ? t.admin.brand.modal_title_edit() : t.admin.brand.modal_title_create()}</h3>
                            <button onClick={action.closeModal} className="icon-btn" aria-label={t.common.close()}><X size={20} /></button>
                        </div>
                        <div className="admin-modal__fields">
                            <div className="admin-form__group">
                                <label className="label">{t.admin.brand.label_name()} <span className="admin-form__required">*</span></label>
                                <input value={formName} onChange={(e) => action.setFormName(e.target.value)}
                                    className={`input${formError ? " admin-form__input--error" : ""}`} />
                                {formError && <p className="admin-form__error">{formError}</p>}
                            </div>
                            <div className="admin-form__group">
                                <label className="label">{t.admin.brand.label_desc()}</label>
                                <textarea value={formDesc} onChange={(e) => action.setFormDesc(e.target.value)} rows={3}
                                    className="textarea" />
                            </div>
                        </div>
                        <div className="admin-modal__actions">
                            <button onClick={action.closeModal} className="btn btn-outline">
                                {t.admin.common.cancel()}
                            </button>
                            <button onClick={action.handleSave} disabled={isSaving} className="btn btn-primary">
                                {isSaving && <Loader2 size={14} className="animate-spin" />}
                                {editItem ? t.admin.common.update() : t.admin.common.create()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-sm">
                        <h3 className="admin-delete__title">{t.admin.brand.delete_title()}</h3>
                        <p className="admin-delete__desc">{t.admin.brand.delete_confirm()}</p>
                        <div className="admin-delete__actions">
                            <button onClick={() => action.setDeleteId(null)} disabled={isDeleting} className="btn btn-outline">
                                {t.admin.common.cancel()}
                            </button>
                            <button onClick={action.handleDelete} disabled={isDeleting} className="btn btn-destructive">
                                {isDeleting ? t.admin.common.deleting() : t.admin.common.delete()}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBrandsPage;
