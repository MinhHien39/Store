"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { Plus, Pencil, Trash2, Loader2, X, FolderTree } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { CATEGORY_ICON_OPTIONS, getCategoryIcon } from "@/core/utils/categoryIcon";
import { AdminCategoriesVM } from "./AdminCategoriesVM";

const AdminCategoriesPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminCategoriesVM();
    const { categories, isLoading, isModalOpen, editItem, deleteId, isDeleting, isSaving, formName, formDesc, formIcon, formError } = config;
    const SelectedIcon = getCategoryIcon(formIcon);

    return (
        <AdminLayout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.category.page_title()}</h2>
                    {!isLoading && <p className="page-subtitle">{t.admin.category.items_count({ count: categories.length })}</p>}
                </div>
                <button onClick={action.openCreate} className="btn btn-primary">
                    <Plus size={18} />
                    {t.admin.category.add_new()}
                </button>
            </div>

            {isLoading ? (
                <div className="admin-loading">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : categories.length === 0 ? (
                <div className="empty-state">
                    <FolderTree size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.category.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.category.empty_desc()}</p>
                </div>
            ) : (
                <div className="list-card">
                    {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.icon);
                        return (
                            <div key={cat.id} className="list-card-row">
                                <div className="flex items-center gap-3">
                                    <span className="icon-btn" aria-hidden="true">
                                        <Icon size={17} />
                                    </span>
                                    <div>
                                        <p className="admin-list__name">{cat.name}</p>
                                        {cat.description && <p className="admin-list__desc">{cat.description}</p>}
                                    </div>
                                </div>
                                <div className="admin-list__actions">
                                    <button onClick={() => action.openEdit(cat)} className="icon-btn" aria-label={t.common.edit()}>
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => action.setDeleteId(cat.id)} className="icon-btn icon-btn-danger" aria-label={t.common.delete()}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-md">
                        <div className="admin-modal__header">
                            <h3 className="admin-modal__title">{editItem ? t.admin.category.modal_title_edit() : t.admin.category.modal_title_create()}</h3>
                            <button onClick={action.closeModal} className="icon-btn" aria-label={t.common.close()}><X size={20} /></button>
                        </div>
                        <div className="admin-modal__fields">
                            <div className="admin-form__group">
                                <label className="label">{t.admin.category.label_name()} <span className="admin-form__required">*</span></label>
                                <input value={formName} onChange={(e) => action.setFormName(e.target.value)}
                                    className={`input${formError ? " admin-form__input--error" : ""}`} />
                                {formError && <p className="admin-form__error">{formError}</p>}
                            </div>
                            <div className="admin-form__group">
                                <label className="label">{t.admin.category.label_desc()}</label>
                                <textarea value={formDesc} onChange={(e) => action.setFormDesc(e.target.value)} rows={3}
                                    className="textarea" />
                            </div>
                            <div className="admin-form__group">
                                <label className="label">Icon</label>
                                <div className="flex items-center gap-2">
                                    <select value={formIcon} onChange={(e) => action.setFormIcon(e.target.value)}
                                        className="select flex-1">
                                        {CATEGORY_ICON_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="icon-btn" aria-hidden="true">
                                        <SelectedIcon size={18} />
                                    </span>
                                </div>
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
                        <h3 className="admin-delete__title">{t.admin.category.delete_title()}</h3>
                        <p className="admin-delete__desc">{t.admin.category.delete_confirm()}</p>
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

export default AdminCategoriesPage;
