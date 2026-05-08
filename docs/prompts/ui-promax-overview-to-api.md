# UI Pro Max Prompt (Overview -> API)

```text
You are a Senior Product Designer + Fullstack Solution Architect.
Use UI/UX Pro Max quality bar for visual system, interaction, and implementation-ready output.

Project context:
- Project name: StoreAmazon
- Frontend stack: Next.js (App Router)
- Backend stack: FastAPI + Pydantic + SQLModel
- Existing entities:
  users(id, full_name, email, password, phone, role_id, created_at, updated_at)
  categories(id, name, description, created_at, updated_at)
  brands(id, name, description, created_at, updated_at)
  products(id, category_id, brand_id, name, short_description, description, price, sale_price, main_image_url, display_order, created_at, updated_at)
  product_images(id, product_id, image_url, sort_order, created_at, updated_at)
- Existing relationships:
  products.category_id -> categories.id
  products.brand_id -> brands.id
  product_images.product_id -> products.id

Business scope (from spreadsheet Overview/Functions/Screens/Mappings/API):
- Roles:
  1) Admin: manage products/categories/brands
  2) User: browse products and contact via Facebook
- Core user flows:
  - View home
  - View product list
  - Search product
  - Filter by category
  - Filter by brand
  - Sort products
  - View product detail
- Screens required:
  - Home Page
  - Product List Page
  - Product Detail Page
  - Admin Login Page
  - Admin Product Management Page (CRUD)
  - (User Login, Cart, Checkout are future scope placeholders)

Current API baseline:
- GET /api/v1/products
- GET /api/v1/products/{id}
- POST /api/v1/admin/products
- PUT /api/v1/admin/products/{id}
- DELETE /api/v1/admin/products/{id}
- POST /api/v1/admin/products/{id}/images
- DELETE /api/v1/admin/product-images/{id}

Task:
Design a complete UI + API blueprint from Overview -> API, production-ready.

Output format (strict):
1) Product UX Summary
- Briefly summarize users, goals, constraints, and success metrics.

2) Design Direction (UI Pro Max)
- Visual style direction for ecommerce.
- Typography system.
- Color tokens (light mode first, optional dark mode extension).
- Spacing, radius, shadows, motion principles.
- Accessibility checklist (WCAG AA minimum).

3) Information Architecture
- Sitemap.
- Route map for Next.js App Router.
- Role-based navigation behavior.

4) Screen Specs (high fidelity text spec)
For each required screen:
- Layout structure
- Components list
- Empty/loading/error states
- Responsive behavior (mobile/tablet/desktop)
- Primary/secondary actions

5) Component Inventory
- Reusable components (cards, filters, product grid, image gallery, admin forms, tables, pagination, toast, modal confirm delete, etc.)
- Props contract for each component.

6) API Contract Refinement
For each endpoint:
- Method + path
- Query/path/body schema
- Success response schema
- Error response schema
- Validation rules
- RBAC rules
Also propose missing endpoints needed for full UX completeness (categories/brands listing, admin categories/brands CRUD, auth/session).

7) Data Validation Rules
- Product pricing rules
- Required/optional fields
- Sort/filter rules
- Image upload constraints

8) Implementation Plan
- Phase 1: User-facing pages
- Phase 2: Admin CRUD pages
- Phase 3: polish + optimization
- Include clear acceptance criteria per phase.

9) Deliverables
- Final output must include:
  - Next.js route tree
  - API endpoint table
  - UI token table
  - prioritized TODO checklist

Quality constraints:
- Avoid generic/boilerplate UI.
- Prioritize clear hierarchy, conversion-oriented ecommerce UX.
- Keep components implementation-friendly for Next.js + FastAPI teams.
- All recommendations must map back to the given spreadsheet scope.
```
