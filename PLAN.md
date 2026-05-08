# Project Plan

## Title

Build an e-commerce website with Admin/User role-based access.

## 1. Must Read First

- Old backend source: `/Volumes/Working/iretoru`
- UI/UX skill folder: `/Volumes/Working/Store/ui-ux-pro-max-skill`
- Main project spec file: `/Volumes/Working/Store/docs/prompts/master-build-prompt.md`
- Google Sheet spec: use the provided spreadsheet as the data, screen, function, and API reference.

Before implementation, read the files and folders above, then follow their patterns.

## 2. Tech Stack

- Backend: FastAPI, Pydantic, and the old backend structure.
- Frontend: Next.js.
- Database: follow the old backend source. If a new database is needed, use PostgreSQL.
- Redis: include for cache, session, or background jobs if needed.
- Nginx: reverse proxy for frontend, backend API, and static media files.
- Docker: include backend, frontend, nginx, database, and redis.
- Images: store product images on disk. Store only image paths or URLs in the database.

## 3. Roles

### Admin

- Manage products.
- Manage categories.
- Manage brands.
- Manage product images.

### User

- Browse products.
- View categories and brands.
- Search, filter, and sort products.
- View product details and image gallery.
- Contact through Facebook/Messenger.

User login, cart, checkout, and order flow should be prepared for future extension.

## 4. Main Models

- Users
- Categories
- Brands
- Products
- Product Images

Products belong to categories and brands.

Product images belong to products.

## 5. User Screens

- Home Page
- Categories Page
- Category Detail Page
- Brands Page
- Brand Detail Page
- Product List Page
- Product Detail Page
- User Login Page
- Cart Page
- Checkout Page

## 6. Admin Screens

- Admin Login Page
- Admin Dashboard
- Product Management Page
- Product Create Page
- Product Update Page
- Category Management Page
- Category Create Page
- Category Update Page
- Brand Management Page
- Brand Create Page
- Brand Update Page

## 7. User Features

- View home page.
- View all categories.
- View category detail and products under that category.
- View all brands.
- View brand detail and products under that brand.
- View product list.
- Search products by keyword.
- Filter products by category.
- Filter products by brand.
- Sort products by newest, lowest price, and highest price.
- View product detail.
- View product image gallery.
- View related products by same category or same brand.
- Click Facebook/Messenger contact button.
- Prepare login, add to cart, checkout, and order features for future extension.

## 8. Admin Features

- Admin login.
- Admin logout.
- View dashboard with total products, total categories, and total brands.
- Product CRUD: list, detail, create, update, delete.
- Category CRUD: list, detail, create, update, delete.
- Brand CRUD: list, detail, create, update, delete.
- Product image management: upload, update order, replace, and delete.

## 9. API Direction

- Do not split APIs into admin and user URL groups.
- Use shared APIs for all models.
- Handle permission by authentication and role-based authorization.
- Admin can create, update, and delete.
- User/public can read allowed resources.
- Product listing must support keyword search, category filter, brand filter, sorting, and pagination.
- Let the implementation AI define exact request and response schemas based on the old source and spec files.

## 10. Required API Groups

- Auth APIs
- Users APIs
- Categories APIs
- Brands APIs
- Products APIs
- Product Images APIs

Each model API group must support list, detail, create, update, and delete where applicable.

## 11. Frontend Direction

- Use Next.js.
<<<<<<< HEAD
- Read and follow `/Volumes/Working/StoreAmazon/ui-ux-pro-max-skill`.
- Follow `/Volumes/Working/StoreAmazon/docs/prompts/frontend-nextjs-iretoru-localized.md`.
=======
- Read and follow `/Volumes/Working/Store/ui-ux-pro-max-skill`.
- Follow `/Volumes/Working/Store/docs/prompts/frontend-nextjs-iretoru-localized.md`.
>>>>>>> af30aae (First Commit)
- Keep storefront pages and admin pages clearly separated.
- Protect admin screens with role-based route guards.
- Avoid hard-coded visible text if the existing frontend pattern requires localization.

## 12. Backend Direction

- Use FastAPI and Pydantic.
- Read and follow `/Volumes/Working/iretoru`.
- Reuse the old backend patterns for router, service, response, request, auth, error handling, config, database session, models, migrations, and seed data.
- Keep clear separation for models, schemas, routes, services, auth, config, migrations, seed data, and tests.
- Validate all inputs with Pydantic.
- Store uploaded product images on disk.
- Delete image files safely when related image records are deleted.

## 13. Seed Data Requirement

- Seed data is required.
- Create a seed data file or script following the old backend seed pattern.
- Include a default admin account.
- Include a sample user account.
- Include sample categories.
- Include sample brands.
- Include sample products.
- Include sample product images.
- Provide a dedicated command or instruction to run seed data.

## 14. API Unit Test Requirement

- API unit tests are required.
- Use the old backend test style if available. Otherwise use pytest.
- Test auth APIs.
- Test role-based access.
- Test product list, detail, search, filter, and sort.
- Test category CRUD.
- Test brand CRUD.
- Test product CRUD.
- Test product image upload and delete.
- Test validation errors.
- Test unauthorized, forbidden, not found, and invalid input cases.

## 15. Infrastructure

- Provide Docker Compose for all services.
- Provide Nginx config.
- Provide database migration setup.
- Provide Redis setup.
- Provide `.env.example`.
- Provide local development and Docker startup instructions.

## 16. Deliverables

- New project folder.
- Complete FastAPI backend.
- Complete Next.js frontend.
- UI/UX skill copied or installed inside the project.
- Docker Compose setup.
- Nginx config.
- Database migrations.
- Seed data file or script.
- API unit tests.
- README with setup, migration, seed, Docker, and test instructions.
