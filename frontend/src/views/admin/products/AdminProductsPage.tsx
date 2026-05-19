"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import Pagination from "@/component/pagination/Pagination";
import { Plus, Search, Pencil, Trash2, Loader2, PackageSearch, Package, X, Upload, GripVertical } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AdminProductsVM } from "./AdminProductsVM";
import { formatVnd, getImageUrl, getProductPlaceholderImage, isBlankImageElement } from "@/core/utils/currency";

const AdminProductsPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminProductsVM();
    const csvInputRef = React.useRef<HTMLInputElement | null>(null);
    const {
        products, paging, isLoading, searchInput, deleteId, isDeleting,
        isModalOpen, isModalLoading, editItem, isSaving,
        categories, brands, form, formErrors, mainImagePreview, subImages, isImporting,
    } = config;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">{t.admin.product.page_title()}</h2>
                    {!isLoading && <p className="page-subtitle">{t.admin.product.items_count({ count: paging?.totalCount ?? products.length })}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            await action.handleCsvImport(file);
                            e.currentTarget.value = "";
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => csvInputRef.current?.click()}
                        disabled={isImporting}
                        className="btn btn-outline"
                    >
                        {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {isImporting ? t.admin.product.importing_csv() : t.admin.product.import_csv()}
                    </button>
                    <button onClick={action.openCreate} className="btn btn-primary">
                        <Plus size={18} />
                        {t.admin.product.add_new()}
                    </button>
                </div>
            </div>

            {/* Search toolbar */}
            <div className="admin-search-bar">
                <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => action.handleSearchChange(e.target.value)}
                        placeholder={t.admin.product.search_placeholder()}
                        aria-label={t.admin.product.search_placeholder()}
                        className="input"
                    />
                </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
                {t.admin.product.import_hint()}
            </p>

            {isLoading ? (
                <div className="admin-loading">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <PackageSearch size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">{t.admin.product.empty_title()}</h3>
                    <p className="empty-state-desc">{t.admin.product.empty_desc()}</p>
                </div>
            ) : (
                <div className="list-card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t.admin.product.col_product()}</th>
                                    <th>{t.admin.product.col_category()}</th>
                                    <th>{t.admin.product.col_brand()}</th>
                                    <th style={{ textAlign: 'right' }}>{t.admin.product.col_price()}</th>
                                    <th style={{ textAlign: 'right' }}>{t.admin.product.col_created()}</th>
                                    <th style={{ textAlign: 'center' }}>{t.admin.product.col_actions()}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="admin-product-cell">
                                                {getImageUrl(p.main_image_url) ? (
                                                    <img
                                                        src={getImageUrl(p.main_image_url)}
                                                        alt=""
                                                        className="admin-product-cell__img"
                                                        onLoad={(event) => {
                                                            if (isBlankImageElement(event.currentTarget)) {
                                                                event.currentTarget.src = getProductPlaceholderImage(p.name);
                                                            }
                                                        }}
                                                        onError={(event) => {
                                                            event.currentTarget.src = getProductPlaceholderImage(p.name);
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="admin-product-cell__placeholder">
                                                        <Package size={18} />
                                                    </span>
                                                )}
                                                <span className="admin-product-cell__name">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="admin-table__muted">{p.category_name}</td>
                                        <td className="admin-table__muted">{p.brand_name}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {p.sale_price ? (
                                                <div>
                                                    <span className="admin-table__sale-price">{formatVnd(p.sale_price)}</span>
                                                    <span className="admin-table__original-price">{formatVnd(p.price)}</span>
                                                </div>
                                            ) : (
                                                <span className="admin-table__price">{formatVnd(p.price)}</span>
                                            )}
                                        </td>
                                        <td className="admin-table__muted" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            {new Date(p.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td>
                                            <div className="admin-list__actions" style={{ justifyContent: 'center' }}>
                                                <button onClick={() => action.openEdit(p)}
                                                    className="icon-btn" aria-label={t.common.edit()}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => action.setDeleteId(p.id)}
                                                    className="icon-btn icon-btn-danger" aria-label={t.common.delete()}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

            {/* ═══ Product create/edit modal ═══ */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-xl">
                        <div className="admin-modal__header">
                            <h3 className="admin-modal__title">
                                {editItem ? t.admin.product.form_title_edit() : t.admin.product.form_title_create()}
                            </h3>
                            <button onClick={action.closeModal} className="icon-btn" aria-label={t.common.close()}>
                                <X size={20} />
                            </button>
                        </div>

                        {isModalLoading ? (
                            <div className="admin-loading">
                                <Loader2 size={24} className="animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="admin-form__fields">
                                {/* Basic info */}
                                <div className="admin-form__section">
                                    <h4 className="admin-form__section-title">{t.admin.product.basic_info()}</h4>
                                    <div className="admin-form__fields">
                                        <div className="admin-form__group">
                                            <label className="label">{t.admin.product.label_name()} <span className="admin-form__required">*</span></label>
                                            <input value={form.name} onChange={(e) => action.setFormField('name', e.target.value)}
                                                className={`input${formErrors.name ? " admin-form__input--error" : ""}`} />
                                            {formErrors.name && <p className="admin-form__error">{formErrors.name}</p>}
                                        </div>

                                        <div className="admin-form__row admin-form__row--2">
                                            <div className="admin-form__group">
                                                <label className="label">{t.admin.product.label_category()} <span className="admin-form__required">*</span></label>
                                                <select value={form.category_id} onChange={(e) => action.setFormField('category_id', e.target.value)}
                                                    className={`select${formErrors.category_id ? " admin-form__input--error" : ""}`}>
                                                    <option value="">{t.admin.product.select_category()}</option>
                                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                                {formErrors.category_id && <p className="admin-form__error">{formErrors.category_id}</p>}
                                            </div>
                                            <div className="admin-form__group">
                                                <label className="label">{t.admin.product.label_brand()} <span className="admin-form__required">*</span></label>
                                                <select value={form.brand_id} onChange={(e) => action.setFormField('brand_id', e.target.value)}
                                                    className={`select${formErrors.brand_id ? " admin-form__input--error" : ""}`}>
                                                    <option value="">{t.admin.product.select_brand()}</option>
                                                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                </select>
                                                {formErrors.brand_id && <p className="admin-form__error">{formErrors.brand_id}</p>}
                                            </div>
                                        </div>

                                        <div className="admin-form__group">
                                            <label className="label">{t.admin.product.label_short_desc()}</label>
                                            <input value={form.short_description} onChange={(e) => action.setFormField('short_description', e.target.value)}
                                                className="input" />
                                        </div>

                                        <div className="admin-form__group">
                                            <label className="label">{t.admin.product.label_desc()}</label>
                                            <textarea value={form.description} onChange={(e) => action.setFormField('description', e.target.value)}
                                                rows={4} className="textarea" />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="admin-form__section">
                                    <h4 className="admin-form__section-title">{t.admin.product.pricing()}</h4>
                                    <div className="admin-form__row admin-form__row--3">
                                        <div className="admin-form__group">
                                            <label className="label">{t.admin.product.label_price()} <span className="admin-form__required">*</span></label>
                                            <div className="admin-form__price-wrap">
                                                <input type="text" inputMode="numeric" value={form.price} onChange={(e) => action.setFormField('price', e.target.value)}
                                                    placeholder="0"
                                                    className={`input admin-form__price-input${formErrors.price ? " admin-form__input--error" : ""}`} />
                                                <span className="admin-form__price-suffix">₫</span>
                                            </div>
                                            {formErrors.price && <p className="admin-form__error">{formErrors.price}</p>}
                                        </div>
                                        <div className="admin-form__group">
                                            <label className="label">{t.admin.product.label_sale_price()}</label>
                                            <div className="admin-form__price-wrap">
                                                <input type="text" inputMode="numeric" value={form.sale_price} onChange={(e) => action.setFormField('sale_price', e.target.value)}
                                                    placeholder="0"
                                                    className={`input admin-form__price-input${formErrors.sale_price ? " admin-form__input--error" : ""}`} />
                                                <span className="admin-form__price-suffix">₫</span>
                                            </div>
                                            {formErrors.sale_price && <p className="admin-form__error">{formErrors.sale_price}</p>}
                                        </div>
                                        <div className="admin-form__group">
                                            <label className="label">{t.admin.product.label_display_order()}</label>
                                            <input type="number" value={form.display_order} onChange={(e) => action.setFormField('display_order', e.target.value)}
                                                className="input" />
                                        </div>
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="admin-form__section">
                                    <h4 className="admin-form__section-title">{t.admin.product.label_main_image()} <span className="admin-form__required">*</span></h4>
                                    <div className="admin-form__fields">
                                        <div className="admin-form__image-row">
                                            {mainImagePreview ? (
                                                <div className="admin-form__image-preview">
                                                    <img
                                                        src={mainImagePreview}
                                                        alt="Main"
                                                        onLoad={(event) => {
                                                            if (isBlankImageElement(event.currentTarget)) {
                                                                event.currentTarget.src = getProductPlaceholderImage(form.name);
                                                            }
                                                        }}
                                                        onError={(event) => {
                                                            event.currentTarget.src = getProductPlaceholderImage(form.name);
                                                        }}
                                                    />
                                                    <button type="button"
                                                        onClick={() => { action.setMainImagePreview(''); action.setFormField('main_image_url', ''); }}
                                                        className="admin-form__image-remove">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="admin-form__upload-zone">
                                                    <Upload size={24} className="admin-form__upload-icon" />
                                                    <span className="admin-form__upload-text">{t.admin.product.upload_image()}</span>
                                                    <input type="file" accept="image/*"
                                                        onChange={(e) => e.target.files?.[0] && action.handleMainImageUpload(e.target.files[0])} />
                                                </label>
                                            )}
                                            <div className="admin-form__group" style={{ flex: 1 }}>
                                                <label className="label">{t.admin.product.change_image()}</label>
                                                <input value={form.main_image_url}
                                                    onChange={(e) => { action.setFormField('main_image_url', e.target.value); action.setMainImagePreview(e.target.value); }}
                                                    placeholder="https://..." className="input" />
                                            </div>
                                        </div>
                                        {formErrors.main_image_url && <p className="admin-form__error">{formErrors.main_image_url}</p>}
                                    </div>
                                </div>

                                {/* Sub images */}
                                <div className="admin-form__section">
                                    <h4 className="admin-form__section-title">{t.admin.product.label_sub_images()}</h4>
                                    <div className="admin-form__sub-images">
                                        {subImages.map((img, idx) => (
                                            <div key={img.id} className="admin-form__sub-image">
                                                {getImageUrl(img.image_url)
                                                    ? <img
                                                        src={getImageUrl(img.image_url)}
                                                        alt={`Sub ${idx + 1}`}
                                                        onLoad={(event) => {
                                                            if (isBlankImageElement(event.currentTarget)) {
                                                                event.currentTarget.src = getProductPlaceholderImage(form.name);
                                                            }
                                                        }}
                                                        onError={(event) => {
                                                            event.currentTarget.src = getProductPlaceholderImage(form.name);
                                                        }}
                                                    />
                                                    : <span className="admin-form__sub-image-placeholder"><Package size={20} /></span>
                                                }
                                                <div className="admin-form__sub-image-actions">
                                                    {idx > 0 && (
                                                        <button type="button" onClick={() => action.moveSubImage(idx, idx - 1)}
                                                            className="admin-form__sub-image-btn admin-form__sub-image-btn--move" aria-label="move">
                                                            <GripVertical size={12} />
                                                        </button>
                                                    )}
                                                    <button type="button" onClick={() => action.removeSubImage(img.id)}
                                                        className="admin-form__sub-image-btn admin-form__sub-image-btn--remove" aria-label="remove">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                                <span className="admin-form__sub-image-order">{img.sort_order}</span>
                                            </div>
                                        ))}
                                        <label className="admin-form__upload-zone admin-form__upload-zone--sm">
                                            <Upload size={20} className="admin-form__upload-icon" />
                                            <span className="admin-form__upload-text">{t.admin.product.add_sub_images()}</span>
                                            <input type="file" accept="image/*" multiple
                                                onChange={(e) => e.target.files && action.handleSubImagesUpload(e.target.files)} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal actions */}
                        {!isModalLoading && (
                            <div className="admin-modal__actions">
                                <button onClick={action.closeModal} className="btn btn-outline">
                                    {t.admin.common.cancel()}
                                </button>
                                <button onClick={action.handleSave} disabled={isSaving} className="btn btn-primary">
                                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                                    {editItem ? t.admin.common.update() : t.admin.common.create()}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ Delete confirmation ═══ */}
            {deleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal-panel modal-sm">
                        <h3 className="admin-delete__title">{t.admin.product.delete_title()}</h3>
                        <p className="admin-delete__desc">{t.admin.product.delete_confirm()}</p>
                        <div className="admin-delete__actions">
                            <button onClick={() => action.setDeleteId(null)} disabled={isDeleting} className="btn btn-outline">
                                {t.admin.common.cancel()}
                            </button>
                            <button onClick={action.handleDelete} disabled={isDeleting} className="btn btn-destructive">
                                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                                {isDeleting ? t.admin.common.deleting() : t.admin.common.delete()}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProductsPage;
