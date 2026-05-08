"use client";

import React from "react";
import AdminLayout from "@/component/layout/AdminLayout";
import { ArrowLeft, Upload, X, Loader2, GripVertical } from "lucide-react";
import { t } from "@/core/localized";
import { useLanguage } from "@/provider/LanguageProvider";
import { AdminProductFormVM } from "./AdminProductFormVM";

const AdminProductFormPage: React.FC = () => {
    useLanguage();
    const { config, action } = AdminProductFormVM();
    const { isEdit, form, errors, categories, brands, isLoading, isSaving, subImages, mainImagePreview } = config;

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="admin-loading">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-form">
                {/* Header */}
                <div className="admin-form__header">
                    <button
                        onClick={() => action.onCancel()}
                        className="icon-btn"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="page-title">
                        {isEdit ? t.admin.product.form_title_edit() : t.admin.product.form_title_create()}
                    </h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); action.onSubmit(); }} className="admin-form">
                    {/* Basic info */}
                    <div className="admin-form__section">
                        <h3 className="admin-form__section-title">{t.admin.product.basic_info()}</h3>
                        <div className="admin-form__fields">
                            <div className="admin-form__group">
                                <label htmlFor="name" className="label">{t.admin.product.label_name()} <span className="admin-form__required">*</span></label>
                                <input id="name" name="name" value={form.name} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                    className={`input${errors.name ? " admin-form__input--error" : ""}`}
                                />
                                {errors.name && <p className="admin-form__error">{errors.name}</p>}
                            </div>

                            <div className="admin-form__row admin-form__row--2">
                                <div className="admin-form__group">
                                    <label htmlFor="category_id" className="label">{t.admin.product.label_category()} <span className="admin-form__required">*</span></label>
                                    <select id="category_id" name="category_id" value={form.category_id} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                        className={`select${errors.category_id ? " admin-form__input--error" : ""}`}
                                    >
                                        <option value="">{t.admin.product.select_category()}</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.category_id && <p className="admin-form__error">{errors.category_id}</p>}
                                </div>
                                <div className="admin-form__group">
                                    <label htmlFor="brand_id" className="label">{t.admin.product.label_brand()} <span className="admin-form__required">*</span></label>
                                    <select id="brand_id" name="brand_id" value={form.brand_id} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                        className={`select${errors.brand_id ? " admin-form__input--error" : ""}`}
                                    >
                                        <option value="">{t.admin.product.select_brand()}</option>
                                        {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                    {errors.brand_id && <p className="admin-form__error">{errors.brand_id}</p>}
                                </div>
                            </div>

                            <div className="admin-form__group">
                                <label htmlFor="short_description" className="label">{t.admin.product.label_short_desc()}</label>
                                <input id="short_description" name="short_description" value={form.short_description} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="admin-form__group">
                                <label htmlFor="description" className="label">{t.admin.product.label_desc()}</label>
                                <textarea id="description" name="description" value={form.description} onChange={(e) => action.setFormField(e.target.name, e.target.value)} rows={5}
                                    className="textarea"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="admin-form__section">
                        <h3 className="admin-form__section-title">{t.admin.product.pricing()}</h3>
                        <div className="admin-form__row admin-form__row--3">
                            <div className="admin-form__group">
                                <label htmlFor="price" className="label">{t.admin.product.label_price()} <span className="admin-form__required">*</span></label>
                                <input id="price" name="price" type="number" value={form.price} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                    className={`input${errors.price ? " admin-form__input--error" : ""}`}
                                />
                                {errors.price && <p className="admin-form__error">{errors.price}</p>}
                            </div>
                            <div className="admin-form__group">
                                <label htmlFor="sale_price" className="label">{t.admin.product.label_sale_price()}</label>
                                <input id="sale_price" name="sale_price" type="number" value={form.sale_price} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                    className={`input${errors.sale_price ? " admin-form__input--error" : ""}`}
                                />
                                {errors.sale_price && <p className="admin-form__error">{errors.sale_price}</p>}
                            </div>
                            <div className="admin-form__group">
                                <label htmlFor="display_order" className="label">{t.admin.product.label_display_order()}</label>
                                <input id="display_order" name="display_order" type="number" value={form.display_order} onChange={(e) => action.setFormField(e.target.name, e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main image */}
                    <div className="admin-form__section">
                        <h3 className="admin-form__section-title">{t.admin.product.label_main_image()} <span className="admin-form__required">*</span></h3>
                        <div className="admin-form__fields">
                            {mainImagePreview ? (
                                <div className="admin-form__image-preview">
                                    <img src={mainImagePreview} alt="Main" />
                                    <button
                                        type="button"
                                        onClick={() => action.setMainImagePreview("")}
                                        className="admin-form__image-remove"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="admin-form__upload-zone">
                                    <Upload size={24} className="admin-form__upload-icon" />
                                    <span className="admin-form__upload-text">{t.admin.product.upload_image()}</span>
                                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) action.handleMainImageUpload(f); }} />
                                </label>
                            )}
                            <div className="admin-form__group">
                                <label htmlFor="main_image_url" className="label">{t.admin.product.change_image()}</label>
                                <input id="main_image_url" name="main_image_url" value={form.main_image_url} onChange={(e) => action.setMainImagePreview(e.target.value)}
                                    placeholder="https://..."
                                    className="input"
                                />
                            </div>
                            {errors.main_image_url && <p className="admin-form__error">{errors.main_image_url}</p>}
                        </div>
                    </div>

                    {/* Sub images */}
                    <div className="admin-form__section">
                        <h3 className="admin-form__section-title">{t.admin.product.label_sub_images()}</h3>
                        <div className="admin-form__sub-images">
                            {subImages.map((img, idx) => (
                                <div key={img.id} className="admin-form__sub-image">
                                    <img src={img.image_url} alt={`Sub ${idx + 1}`} />
                                    <div className="admin-form__sub-image-actions">
                                        {idx > 0 && (
                                            <button type="button" onClick={() => action.moveSubImage(idx, idx - 1)} className="admin-form__sub-image-btn admin-form__sub-image-btn--move" aria-label={t.common.edit()}>
                                                <GripVertical size={12} />
                                            </button>
                                        )}
                                        <button type="button" onClick={() => action.removeSubImage(img.id)} className="admin-form__sub-image-btn admin-form__sub-image-btn--remove" aria-label={t.common.delete()}>
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <span className="admin-form__sub-image-order">{img.sort_order}</span>
                                </div>
                            ))}
                            <label className="admin-form__upload-zone admin-form__upload-zone--sm">
                                <Upload size={20} className="admin-form__upload-icon" />
                                <span className="admin-form__upload-text">{t.admin.product.add_sub_images()}</span>
                                <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) action.handleSubImagesUpload(e.target.files); }} />
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="admin-form__actions">
                        <button
                            type="button"
                            onClick={() => action.onCancel()}
                            className="btn btn-outline"
                        >
                            {t.admin.common.cancel()}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn btn-primary"
                        >
                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                            {isEdit ? t.admin.common.update() : t.admin.common.create()}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminProductFormPage;
