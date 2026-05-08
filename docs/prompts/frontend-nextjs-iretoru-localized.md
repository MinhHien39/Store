# Prompt: Rewrite Frontend To Iretoru Pattern (Next.js)

Migrate frontend architecture to match Iretoru conventions while keeping Next.js App Router:

- Keep folder pattern:
  - `src/core/base` for `BaseView`, `BaseModel`, `BaseConfig`
  - `src/core/localized` for `Localized`, `LocaleKeys`, locale json files, `t` helper
  - `src/assets/styles/common|layout|modules` with `index.css` chain imports
- Remove hard-coded UI titles/labels.
- All visible titles/text must come from localization keys (`t.*`).
- Keep 2 roles only: `admin` and `user`.
- User can access all user UI without login.
- Admin routes require login.
- Replace any wording that contains `catalog` with product-list wording.
- Preserve existing backend API integration and Next.js proxy routes.
- Ensure mobile + desktop responsive behavior remains stable.
