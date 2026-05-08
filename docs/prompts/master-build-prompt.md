# Master Build Prompt — StoreAmazon Web Bán Hàng

> **Mục tiêu**: Viết toàn bộ source code hoàn chỉnh cho hệ thống web bán hàng gồm Admin + User,
> lấy 100% code mẫu và format coding từ dự án Iretoru đã đính kèm.

---

## 0. THIẾT LẬP TRƯỚC KHI CODE

### 0.1 Clone UI-UX Pro Max Skill vào dự án

```bash
# Cài CLI
npm install -g uipro-cli

# Vào thư mục frontend
cd /Volumes/Working/StoreAmazon/frontend

# Cài skill cho Copilot / Cursor / Claude
uipro init --ai copilot   # GitHub Copilot
# hoặc
uipro init --ai cursor    # Cursor
# hoặc
uipro init --ai claude    # Claude Code
```

Kết quả: thư mục `.github/skills/ui-ux-pro-max/` (hoặc `.claude/skills/`) xuất hiện trong frontend.

### 0.2 Cấu trúc folder dự án (đã có, giữ nguyên)

```
StoreAmazon/
├── backend/              # FastAPI
├── frontend/             # Next.js 15 + Tailwind 4
├── database/             # MySQL
├── redis/
├── nginx/
├── environment/
├── compose.yml
└── compose.prd.yml
```

---

## 1. HIỂU SOURCE IRETORU (BẮT BUỘC ĐỌC TRƯỚC)

Đọc toàn bộ source tại `/Volumes/Working/iretoru/` để hiểu các pattern sau:

### 1.1 Backend Patterns (FastAPI)

**Core Layer** — `/Volumes/Working/iretoru/backend/app/core/`

| File | Mô tả |
|------|-------|
| `core/api/router.py` | `BaseApiRouter(APIRouter)` + `BaseResponseRoute(APIRoute)` |
| `core/api/service.py` | `BaseService(db, token_payload)` + `create_service()` factory |
| `core/api/response.py` | `SuccessResponse`, `ErrorResponse`, `PaginatedContent` |
| `core/api/request.py` | `BaseRequest(BaseModel)`, `BaseQuery` |
| `core/auth/token.py` | `TokenService` — tạo JWT access + refresh token |
| `core/auth/deps.py` | `require_token`, `require_admin`, `get_access_token`, `get_refresh_token` |
| `core/auth/models.py` | `TokenPayload(user_id, role_id, user_name, email, extra_data)` |
| `core/error/` | `AppException`, `DataNotFoundException`, `UnauthorizedException`, `ErrorHandler` |
| `core/config/settings.py` | `Settings` class đọc từ `.env` |
| `core/helpers/` | `PasswordHelper` (argon2), `DateUtils` |
| `core/cache/` | Redis client |
| `core/utils/` | `logger`, `UserRole`, `UserStatus` enum |

**DB Layer** — `/Volumes/Working/iretoru/backend/app/db/`

| File | Mô tả |
|------|-------|
| `db/models/base.py` | `BaseDbModel(created_at, updated_at, created_by, updated_by, is_deleted)` |
| `db/models/user.py` | `User(BaseDbModel)` → `Admin(User, table=True)`, cách dùng `get_model_type_by_role()` |
| `db/core/session.py` | engine, `ReadDbSessionDep`, `WriteDbSessionDep` |
| `db/seed/admin.py` | Pattern seed dữ liệu mẫu |

**API Route Pattern** — `/Volumes/Working/iretoru/backend/app/api/auth/`

```python
# router.py
router = BaseApiRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(
    request: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service_no_token),
):
    data = service.login(request=request, response=response)
    return SuccessResponse(data=data)
```

```python
# services.py — kế thừa BaseService
class AuthService(BaseService):
    def login(self, request: LoginRequest, response: Response) -> dict:
        user = self._login_user(request.email_or_user_id, request.password, request.role_id)
        token_payload = user.to_token_payload(role_id=request.role_id)
        tokens = TokenService.create(data=token_payload)
        # set cookies...
        return tokens

get_auth_service = create_service(AuthService, WriteDbSessionDep, TokenPayloadDep)
get_auth_service_no_token = create_service(AuthService, WriteDbSessionDep)
```

```python
# schemas.py — kế thừa BaseRequest
class LoginRequest(BaseRequest):
    email_or_user_id: str = Field(..., min_length=4, max_length=255, examples=["admin1@gmail.com"])
    password: str = Field(..., min_length=6, max_length=255, examples=["123456"])
    role_id: int = Field(examples=[1, 2])
```

### 1.2 Frontend Patterns (React / Next.js)

Tất cả từ `/Volumes/Working/iretoru/frontend/src/`:

**BaseView / BaseViewModel** — `src/core/base/`

```tsx
// Mọi page phải wrap bằng BaseView
const Page: React.FC = () => {
    const { config, action } = VM();
    return (
        <BaseView className="...">
            {/* content */}
        </BaseView>
    );
};
```

```tsx
// VM.tsx pattern
interface Config extends BaseConfig {
    items: Product[];
    isLoading: boolean;
}
interface Action extends BaseAction<Config> {
    onLoadMore: () => void;
}
export const VM: BaseViewModelFunc<Config, Action> = () => {
    const { config, action, globalUI, appNavigation } = useBaseViewModel<Config>(
        VM.name,
        { items: [], isLoading: false }
    );
    // logic
    return { config, action: { ...action, onLoadMore } };
};
```

**AppRoutePath** — định nghĩa toàn bộ route như enum:

```tsx
export enum AppRoutePath {
    HOME = "/",
    ADMIN_LOGIN = "/admin/login",
    ADMIN_DASHBOARD = "/admin/dashboard",
    // ...
}
```

**AppNavigation** — hook navigation + route guard:

```tsx
export const useAppNavigation = () => {
    const navigate = useNavigate();
    // push, replace, back, buildPath, ...
};
```

**Repository Pattern** — `src/data/repository/`:

```tsx
class ProductRepositoryImpl extends BaseRepository {
    async getList(query: ProductListQuery): Promise<ApiResult<ProductListResponse>> {
        return this.safeCall(() =>
            this.apiService.get("/api/v1/products", query)
        );
    }
}
```

**Provider Pattern** — `src/provider/AppContextProvider.tsx`:
- Khởi tạo tất cả repository một lần
- Dùng `useAppContext()` trong VM để lấy repository

**Localization** — `src/core/localized/`:
- Mọi text hiển thị phải qua `t.module.key()` — không hardcode string

---

## 2. TECH STACK (ĐỒNG BỘ VỚI STOREAMAZON HIỆN TẠI)

### Backend
```
FastAPI 0.128+
Pydantic 2.x
SQLModel 0.0.31
PyMySQL + cryptography
Alembic (migrations)
argon2-cffi (password hash)
PyJWT 2.x
redis 7.x
fastapi-mail
python-dotenv
pytest + pytest-asyncio (unit tests)
httpx (test client)
```

### Frontend
```
Next.js 15 (App Router) — giữ nguyên
React 19
TypeScript
Tailwind CSS 4
react-router-dom 7 (đang dùng BrowserRouter bên trong Next.js shell)
axios
lucide-react (icons)
dayjs
```

---

## 3. DATABASE SCHEMA

### 3.1 Bảng `admins` — giống Iretoru

```sql
CREATE TABLE admins (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255) UNIQUE INDEX,
    password    VARCHAR(255),
    full_name   VARCHAR(255) INDEX,
    phone_number VARCHAR(20),
    status      INT DEFAULT 1,
    created_at  DATETIME NOT NULL,
    created_by  VARCHAR(255),
    updated_at  DATETIME,
    updated_by  VARCHAR(255),
    is_deleted  BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.2 Bảng `users` (store user / customer)

```sql
CREATE TABLE users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(150) UNIQUE INDEX,
    password     VARCHAR(255),
    full_name    VARCHAR(100) INDEX,
    phone        VARCHAR(20),
    status       INT DEFAULT 1,
    role_id      INT DEFAULT 2,           -- 1=admin, 2=user
    created_at   DATETIME NOT NULL,
    created_by   VARCHAR(255),
    updated_at   DATETIME,
    updated_by   VARCHAR(255),
    is_deleted   BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.3 Bảng `categories`

```sql
CREATE TABLE categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL INDEX,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    image_url   VARCHAR(255),
    display_order INT DEFAULT 0,
    status      INT DEFAULT 1,
    created_at  DATETIME NOT NULL,
    created_by  VARCHAR(255),
    updated_at  DATETIME,
    updated_by  VARCHAR(255),
    is_deleted  BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.4 Bảng `brands`

```sql
CREATE TABLE brands (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL INDEX,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    logo_url    VARCHAR(255),
    display_order INT DEFAULT 0,
    status      INT DEFAULT 1,
    created_at  DATETIME NOT NULL,
    created_by  VARCHAR(255),
    updated_at  DATETIME,
    updated_by  VARCHAR(255),
    is_deleted  BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.5 Bảng `products`

```sql
CREATE TABLE products (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    category_id       INT,               -- FK → categories.id
    brand_id          INT,               -- FK → brands.id
    name              VARCHAR(255) NOT NULL INDEX,
    slug              VARCHAR(255) UNIQUE,
    short_description VARCHAR(255),
    description       TEXT,
    price             BIGINT NOT NULL,   -- VND, lưu nguyên không chia
    sale_price        BIGINT,
    stock_quantity    INT DEFAULT 0,
    main_image_url    VARCHAR(255),
    display_order     INT DEFAULT 0,
    status            INT DEFAULT 1,     -- 1=active, 0=inactive
    created_at        DATETIME NOT NULL,
    created_by        VARCHAR(255),
    updated_at        DATETIME,
    updated_by        VARCHAR(255),
    is_deleted        BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.6 Bảng `product_images`

```sql
CREATE TABLE product_images (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    product_id  INT NOT NULL,            -- FK → products.id
    image_url   VARCHAR(255) NOT NULL,
    sort_order  INT DEFAULT 0,
    created_at  DATETIME NOT NULL,
    created_by  VARCHAR(255),
    updated_at  DATETIME,
    updated_by  VARCHAR(255),
    is_deleted  BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.7 Bảng `orders`

```sql
CREATE TABLE orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,        -- FK → users.id
    status          INT DEFAULT 1,       -- 1=pending, 2=confirmed, 3=shipping, 4=delivered, 5=cancelled
    total_amount    BIGINT NOT NULL,
    shipping_name   VARCHAR(255),
    shipping_phone  VARCHAR(20),
    shipping_address VARCHAR(500),
    notes           VARCHAR(500),
    created_at      DATETIME NOT NULL,
    created_by      VARCHAR(255),
    updated_at      DATETIME,
    updated_by      VARCHAR(255),
    is_deleted      BOOLEAN DEFAULT FALSE NOT NULL
);
```

### 3.8 Bảng `order_items`

```sql
CREATE TABLE order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,            -- FK → orders.id
    product_id  INT NOT NULL,            -- FK → products.id
    quantity    INT NOT NULL,
    price       BIGINT NOT NULL,         -- giá tại thời điểm đặt
    created_at  DATETIME NOT NULL,
    is_deleted  BOOLEAN DEFAULT FALSE NOT NULL
);
```

---

## 4. ROLES & PERMISSIONS

| Role | role_id | Quyền |
|------|---------|-------|
| Admin | 1 | Login `/admin/login` → quản lý toàn bộ (products, categories, brands, orders, users) |
| User | 2 | Register / Login `/login` → browse sản phẩm, đặt hàng, xem lịch sử đơn |

---

## 5. API ENDPOINTS

### 5.1 Admin Auth — `/api/v1/admin/auth`

| Method | Path | Body / Params | Auth | Mô tả |
|--------|------|---------------|------|-------|
| POST | `/admin/auth/login` | `{email, password}` | ❌ | Login admin → set cookie |
| POST | `/admin/auth/logout` | — | Admin | Logout |
| GET | `/admin/auth/me` | — | Admin | Lấy thông tin admin hiện tại |

### 5.2 User Auth — `/api/v1/auth`

| Method | Path | Body | Auth | Mô tả |
|--------|------|------|------|-------|
| POST | `/auth/register` | `{full_name, email, password, phone?}` | ❌ | Đăng ký tài khoản |
| POST | `/auth/login` | `{email, password}` | ❌ | Login user |
| POST | `/auth/logout` | — | User | Logout |
| POST | `/auth/refresh_token` | — (cookie) | ❌ | Refresh token |
| GET | `/auth/me` | — | User | Info user hiện tại |
| PATCH | `/auth/change-password` | `{old_password, new_password}` | User | Đổi mật khẩu |
| POST | `/auth/forgot-password` | `{email}` | ❌ | Gửi mail reset |
| GET | `/auth/check-token` | `?token=...` | ❌ | Kiểm tra token reset |

### 5.3 Categories — `/api/v1/categories`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/categories` | ❌ | Danh sách (public) |
| GET | `/categories/{id}` | ❌ | Chi tiết (public) |
| POST | `/admin/categories` | Admin | Tạo mới |
| PUT | `/admin/categories/{id}` | Admin | Cập nhật |
| DELETE | `/admin/categories/{id}` | Admin | Xóa mềm |

### 5.4 Brands — `/api/v1/brands`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/brands` | ❌ | Danh sách (public) |
| GET | `/brands/{id}` | ❌ | Chi tiết (public) |
| POST | `/admin/brands` | Admin | Tạo mới |
| PUT | `/admin/brands/{id}` | Admin | Cập nhật |
| DELETE | `/admin/brands/{id}` | Admin | Xóa mềm |

### 5.5 Products — `/api/v1/products`

| Method | Path | Query Params | Auth | Mô tả |
|--------|------|-------------|------|-------|
| GET | `/products` | `keyword, category_id, brand_id, min_price, max_price, sort_by, sort_dir, page, page_size` | ❌ | Danh sách + filter + search |
| GET | `/products/{id}` | — | ❌ | Chi tiết |
| POST | `/admin/products` | — | Admin | Tạo sản phẩm |
| PUT | `/admin/products/{id}` | — | Admin | Cập nhật |
| DELETE | `/admin/products/{id}` | — | Admin | Xóa mềm |

### 5.6 Product Images — `/api/v1/admin/products/{id}/images`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/admin/products/{id}/images` | Admin | Upload ảnh (multipart, lưu disk `/backend/uploads/`) |
| DELETE | `/admin/product-images/{image_id}` | Admin | Xóa ảnh |
| PUT | `/admin/product-images/{image_id}/order` | Admin | Cập nhật thứ tự |

### 5.7 Admin Users — `/api/v1/admin/users`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/admin/users` | Admin | Danh sách user |
| GET | `/admin/users/{id}` | Admin | Chi tiết |
| POST | `/admin/users` | Admin | Tạo user |
| PUT | `/admin/users/{id}` | Admin | Cập nhật |
| DELETE | `/admin/users/{id}` | Admin | Xóa mềm |

### 5.8 Orders

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/orders` | User | Đặt hàng |
| GET | `/orders` | User | Lịch sử đơn của tôi |
| GET | `/orders/{id}` | User | Chi tiết đơn của tôi |
| GET | `/admin/orders` | Admin | Danh sách tất cả đơn |
| GET | `/admin/orders/{id}` | Admin | Chi tiết đơn |
| PUT | `/admin/orders/{id}/status` | Admin | Cập nhật trạng thái đơn |

### 5.9 Dashboard — `/api/v1/admin/dashboard`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/admin/dashboard/summary` | Admin | Tổng doanh thu, đơn hàng, sản phẩm, người dùng |

---

## 6. BACKEND — CODE IMPLEMENTATION

### 6.1 Cấu trúc thư mục backend

```
backend/app/
├── main.py
├── api/
│   ├── __init__.py
│   ├── constants/
│   ├── admin_auth/         # router.py, schemas.py, services.py
│   ├── auth/               # router.py, schemas.py, services.py
│   ├── category/           # router.py, schemas.py, service.py
│   ├── brand/              # router.py, schemas.py, service.py
│   ├── product/            # router.py, schemas.py, service.py
│   ├── product_image/      # router.py, schemas.py, service.py
│   ├── store_user/         # router.py, schemas.py, service.py
│   ├── order/              # router.py, schemas.py, service.py
│   └── dashboard/          # router.py, schemas.py, service.py
├── core/                   # COPY NGUYÊN TỪDÂN Iretoru
│   ├── __init__.py
│   ├── api/                # BaseService, BaseApiRouter, SuccessResponse, BaseRequest
│   ├── auth/               # TokenService, TokenPayload, deps.py
│   ├── cache/              # redis_client
│   ├── config/             # Settings
│   ├── error/              # AppException, ErrorHandler, ErrorCode, ErrorMessage
│   ├── file/               # FileService — upload/delete disk
│   ├── helpers/            # PasswordHelper, DateUtils
│   └── utils/              # logger, UserRole, UserStatus
├── db/
│   ├── core/               # engine, session deps
│   ├── models/
│   │   ├── base.py         # BaseDbModel — COPY TỪ Iretoru
│   │   ├── user.py         # Admin(User), StoreUser(User)
│   │   ├── category.py
│   │   ├── brand.py
│   │   ├── product.py
│   │   ├── product_image.py
│   │   ├── order.py
│   │   └── order_item.py
│   └── seed/
│       ├── __init__.py
│       ├── __main__.py
│       ├── admin.py
│       ├── categories.py
│       ├── brands.py
│       ├── products.py
│       └── users.py
└── migrations/
    └── versions/
        └── 0001_init.py    # Alembic migration
```

### 6.2 UserRole enum (thêm STORE_USER)

```python
# core/utils/enums.py
from enum import Enum

class UserRole(int, Enum):
    ADMIN = 1
    STORE_USER = 2

    def is_admin(self) -> bool:
        return self == UserRole.ADMIN

    def is_store_user(self) -> bool:
        return self == UserRole.STORE_USER
```

### 6.3 Model — `db/models/user.py` — theo đúng pattern Iretoru

```python
from .base import BaseDbModel
from typing import Optional
from sqlmodel import Field, select, Session
from app.core import UserRole, UserStatus, TokenPayload

class User(BaseDbModel, table=False):
    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    email: str = Field(max_length=255, index=True, nullable=True, unique=True)
    password: str | None = Field(default=None, max_length=255, nullable=True)
    full_name: str | None = Field(default=None, max_length=255, nullable=True, index=True)
    phone: str | None = Field(default=None, max_length=20, nullable=True)
    status: int = Field(default=1, nullable=True)

    def to_json(self) -> dict:
        data = super().to_json()
        del data["password"]
        return data

    def to_token_payload(self, role_id: int) -> TokenPayload:
        return TokenPayload(
            user_id=self.id,
            role_id=role_id,
            user_name=self.full_name,
            email=self.email,
            extra_data={}
        )

    @staticmethod
    def get_model_type_by_role(role_id: int) -> type["User"]:
        user_role = UserRole(role_id)
        if user_role == UserRole.ADMIN:
            return Admin
        elif user_role == UserRole.STORE_USER:
            return StoreUser
        raise ValueError(f"Invalid role_id: {role_id}")

class Admin(User, table=True):
    __tablename__ = "admins"

class StoreUser(User, table=True):
    __tablename__ = "users"
    role_id: int = Field(default=UserRole.STORE_USER.value, nullable=False)
```

### 6.4 File Upload Service — lưu ảnh lên disk

```python
# core/file/file_service.py
import uuid, os
from pathlib import Path
from fastapi import UploadFile
from app.core import settings

UPLOAD_DIR = Path("/backend/uploads")

class FileService:
    @staticmethod
    def save_upload(file: UploadFile, sub_dir: str = "products") -> str:
        """Lưu file vào disk, trả về path tương đối /uploads/..."""
        target_dir = UPLOAD_DIR / sub_dir
        target_dir.mkdir(parents=True, exist_ok=True)
        ext = Path(file.filename).suffix.lower()
        filename = f"{uuid.uuid4().hex}{ext}"
        dest = target_dir / filename
        with open(dest, "wb") as f:
            f.write(file.file.read())
        return f"/uploads/{sub_dir}/{filename}"

    @staticmethod
    def delete_file(path: str):
        full = UPLOAD_DIR / path.lstrip("/uploads/")
        if full.exists():
            full.unlink()
```

### 6.5 Auth router — `/api/v1/auth/router.py` — theo Iretoru

```python
from fastapi import Depends, Response, BackgroundTasks, Request
from app.core import SuccessResponse, BaseApiRouter, AccessTokenDep
from .schemas import RegisterRequest, LoginRequest, ChangePasswordRequest
from .services import AuthService, get_auth_service, get_auth_service_no_token

router = BaseApiRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(
    request: RegisterRequest,
    service: AuthService = Depends(get_auth_service_no_token),
):
    data = service.register(request=request)
    return SuccessResponse(data=data)

@router.post("/login")
async def login(
    request: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service_no_token),
):
    data = service.login(request=request, response=response)
    return SuccessResponse(data=data)

@router.post("/logout")
async def logout(
    response: Response,
    access_token: str = AccessTokenDep,
    service: AuthService = Depends(get_auth_service_no_token),
):
    service.logout(response=response, access_token=access_token)
    return SuccessResponse()

@router.get("/me")
async def me(service: AuthService = Depends(get_auth_service)):
    data = service.me()
    return SuccessResponse(data=data)
```

### 6.6 Product router — `/api/v1/product/router.py` — theo pattern hiện tại + RequireAdminDep

```python
from fastapi import Depends, UploadFile, File
from app.core import SuccessResponse, BaseApiRouter, RequireAdminDep
from .schemas import ProductCreateRequest, ProductUpdateRequest, ProductListQuery
from .service import get_product_service, get_product_write_service, ProductService

# Public routes
public_router = BaseApiRouter(prefix="/products", tags=["products"])
# Admin routes
admin_router = BaseApiRouter(
    prefix="/admin/products",
    tags=["admin-products"],
    dependencies=[RequireAdminDep]
)

@public_router.get("")
async def get_list(
    query: ProductListQuery = Depends(),
    service: ProductService = Depends(get_product_service),
):
    data = service.get_list(query=query)
    return SuccessResponse(data=data)

@public_router.get("/{id}")
async def get(id: int, service: ProductService = Depends(get_product_service)):
    data = service.get(id=id)
    return SuccessResponse(data=data)

@admin_router.post("")
async def create(
    request: ProductCreateRequest,
    service: ProductService = Depends(get_product_write_service),
):
    data = service.create(request=request)
    return SuccessResponse(data=data)

@admin_router.put("/{id}")
async def update(
    id: int,
    request: ProductUpdateRequest,
    service: ProductService = Depends(get_product_write_service),
):
    data = service.update(id=id, request=request)
    return SuccessResponse(data=data)

@admin_router.delete("/{id}")
async def delete(id: int, service: ProductService = Depends(get_product_write_service)):
    service.delete(id=id)
    return SuccessResponse()
```

---

## 7. SEED DATA

### 7.1 Seed Admin — `db/seed/admin.py` — theo đúng Iretoru

```python
from sqlmodel import Session, select
from app.core import logger, PasswordHelper, UserStatus
from app.db.core import engine
from app.db.models import Admin

DEFAULT_ADMIN_EMAIL = "admin@storeamazon.com"
DEFAULT_ADMIN_PASSWORD = "Admin123456"

def seed_admin():
    with Session(engine) as db:
        existing = db.exec(select(Admin).where(Admin.email == DEFAULT_ADMIN_EMAIL)).first()
        if existing:
            logger.info("Admin already exists, skipping.")
            return
        admin = Admin(
            email=DEFAULT_ADMIN_EMAIL,
            password=PasswordHelper.hash_password(DEFAULT_ADMIN_PASSWORD),
            full_name="Super Admin",
            status=UserStatus.ACTIVE.to_value(),
            created_by="seed",
        )
        db.add(admin)
        db.commit()
        logger.info("Admin seeded successfully")
```

### 7.2 Seed Categories — `db/seed/categories.py`

```python
CATEGORIES_DATA = [
    {"name": "Điện thoại", "slug": "dien-thoai", "description": "Điện thoại thông minh", "display_order": 1},
    {"name": "Laptop", "slug": "laptop", "description": "Máy tính xách tay", "display_order": 2},
    {"name": "Máy tính bảng", "slug": "may-tinh-bang", "description": "Tablet", "display_order": 3},
    {"name": "Phụ kiện", "slug": "phu-kien", "description": "Phụ kiện công nghệ", "display_order": 4},
    {"name": "Đồng hồ thông minh", "slug": "dong-ho-thong-minh", "description": "Smartwatch", "display_order": 5},
    {"name": "Tai nghe", "slug": "tai-nghe", "description": "Tai nghe & Loa", "display_order": 6},
    {"name": "Camera", "slug": "camera", "description": "Máy ảnh & Camera", "display_order": 7},
    {"name": "Thiết bị mạng", "slug": "thiet-bi-mang", "description": "Router, Switch, Access Point", "display_order": 8},
]
```

### 7.3 Seed Brands — `db/seed/brands.py`

```python
BRANDS_DATA = [
    {"name": "Apple", "slug": "apple", "display_order": 1},
    {"name": "Samsung", "slug": "samsung", "display_order": 2},
    {"name": "Xiaomi", "slug": "xiaomi", "display_order": 3},
    {"name": "Oppo", "slug": "oppo", "display_order": 4},
    {"name": "Dell", "slug": "dell", "display_order": 5},
    {"name": "Asus", "slug": "asus", "display_order": 6},
    {"name": "HP", "slug": "hp", "display_order": 7},
    {"name": "Sony", "slug": "sony", "display_order": 8},
    {"name": "JBL", "slug": "jbl", "display_order": 9},
    {"name": "Logitech", "slug": "logitech", "display_order": 10},
]
```

### 7.4 Seed Products — `db/seed/products.py`

```python
PRODUCTS_DATA = [
    {
        "name": "iPhone 15 Pro Max",
        "slug": "iphone-15-pro-max",
        "short_description": "Chip A17 Pro, camera 48MP, titanium",
        "description": "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ...",
        "price": 34990000,
        "sale_price": 32990000,
        "stock_quantity": 50,
        "display_order": 1,
        "category_slug": "dien-thoai",
        "brand_slug": "apple",
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "slug": "samsung-s24-ultra",
        "short_description": "Snapdragon 8 Gen 3, 200MP, S Pen",
        "price": 31990000,
        "sale_price": 29990000,
        "stock_quantity": 40,
        "display_order": 2,
        "category_slug": "dien-thoai",
        "brand_slug": "samsung",
    },
    {
        "name": "MacBook Pro M3 14\"",
        "slug": "macbook-pro-m3-14",
        "short_description": "Chip M3, 16GB RAM, 512GB SSD",
        "price": 49990000,
        "sale_price": None,
        "stock_quantity": 20,
        "display_order": 3,
        "category_slug": "laptop",
        "brand_slug": "apple",
    },
    # ... (thêm 10-15 sản phẩm đa dạng cho các category khác)
]
```

### 7.5 Seed Users — `db/seed/users.py`

```python
USERS_DATA = [
    {"full_name": "Nguyễn Văn A", "email": "user1@gmail.com", "password": "User123456", "phone": "0901234567"},
    {"full_name": "Trần Thị B", "email": "user2@gmail.com", "password": "User123456", "phone": "0912345678"},
    {"full_name": "Lê Văn C", "email": "user3@gmail.com", "password": "User123456", "phone": "0923456789"},
]
```

### 7.6 `__main__.py` — entry point seed

```python
from .admin import seed_admin
from .categories import seed_categories
from .brands import seed_brands
from .products import seed_products
from .users import seed_users

if __name__ == "__main__":
    seed_admin()
    seed_categories()
    seed_brands()
    seed_products()
    seed_users()
    print("All seed data inserted successfully!")
```

---

## 8. FRONTEND — CODE IMPLEMENTATION

### 8.1 Cấu trúc thư mục frontend

```
frontend/src/
├── application/
│   ├── AppRoutePath.tsx
│   ├── AppNavigation.tsx
│   ├── AppRouter.tsx
│   └── App.tsx
├── core/
│   ├── base/
│   │   ├── BaseView.tsx           # COPY TỪ Iretoru
│   │   ├── BaseViewModel.tsx      # COPY TỪ Iretoru
│   │   ├── BaseStatus.tsx
│   │   ├── BaseLoading.tsx
│   │   ├── BaseDialog.tsx
│   │   ├── BaseAlert.tsx
│   │   └── index.ts
│   ├── api/
│   │   ├── ApiService.tsx
│   │   ├── ApiError.tsx
│   │   ├── ApiResult.tsx
│   │   ├── ApiResponse.tsx
│   │   ├── AxiosClient.tsx
│   │   └── index.ts
│   ├── localized/               # Localization
│   ├── store/                   # LocalStorageService
│   ├── utils/                   # LogUtils, ValidateUtils, FormatUtils
│   └── values/                  # Colors, Constants
├── data/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   ├── Brand.ts
│   │   ├── Order.ts
│   │   └── index.ts
│   ├── repository/
│   │   ├── BaseRepository.tsx
│   │   ├── UserRepository.tsx
│   │   ├── ProductRepository.tsx
│   │   ├── CategoryRepository.tsx
│   │   ├── BrandRepository.tsx
│   │   ├── OrderRepository.tsx
│   │   └── index.ts
│   └── index.ts
├── provider/
│   ├── AppContextProvider.tsx
│   ├── AuthContextProvider.tsx
│   └── GlobalUIProvider.tsx
├── assets/
│   ├── images/
│   └── styles/
│       ├── index.css
│       ├── common/
│       ├── layout/
│       └── modules/
├── component/
│   ├── index.ts
│   ├── layout/
│   │   ├── StoreLayout.tsx      # Header + Footer cho trang user
│   │   └── AdminLayout.tsx      # Sidebar + Header cho admin
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── common/
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   └── EmptyState.tsx
│   └── cart/
│       └── CartIcon.tsx
└── views/
    ├── auth/
    │   ├── login/
    │   │   ├── LoginPage.tsx
    │   │   └── LoginVM.tsx
    │   ├── register/
    │   │   ├── RegisterPage.tsx
    │   │   └── RegisterVM.tsx
    │   └── forgot-password/
    │       ├── ForgotPasswordPage.tsx
    │       └── ForgotPasswordVM.tsx
    ├── home/
    │   ├── HomePage.tsx
    │   └── HomeVM.tsx
    ├── products/
    │   ├── ProductListPage.tsx
    │   └── ProductListVM.tsx
    ├── product-detail/
    │   ├── ProductDetailPage.tsx
    │   └── ProductDetailVM.tsx
    ├── cart/
    │   ├── CartPage.tsx
    │   └── CartVM.tsx
    ├── account/
    │   ├── OrderListPage.tsx
    │   ├── OrderListVM.tsx
    │   ├── OrderDetailPage.tsx
    │   └── OrderDetailVM.tsx
    ├── admin/
    │   ├── login/
    │   │   ├── AdminLoginPage.tsx
    │   │   └── AdminLoginVM.tsx
    │   ├── dashboard/
    │   │   ├── AdminDashboardPage.tsx
    │   │   └── AdminDashboardVM.tsx
    │   ├── products/
    │   │   ├── AdminProductListPage.tsx
    │   │   ├── AdminProductListVM.tsx
    │   │   ├── AdminProductFormPage.tsx
    │   │   └── AdminProductFormVM.tsx
    │   ├── categories/
    │   │   ├── AdminCategoryListPage.tsx
    │   │   └── AdminCategoryListVM.tsx
    │   ├── brands/
    │   │   ├── AdminBrandListPage.tsx
    │   │   └── AdminBrandListVM.tsx
    │   ├── orders/
    │   │   ├── AdminOrderListPage.tsx
    │   │   ├── AdminOrderListVM.tsx
    │   │   ├── AdminOrderDetailPage.tsx
    │   │   └── AdminOrderDetailVM.tsx
    │   └── customers/
    │       ├── AdminCustomerListPage.tsx
    │       └── AdminCustomerListVM.tsx
    └── others/
        └── NotFoundPage.tsx
```

### 8.2 AppRoutePath.tsx

```tsx
export enum AppRoutePath {
    // Public
    HOME = "/",
    PRODUCTS = "/products",
    PRODUCT_DETAIL = "/products/:id",
    CART = "/cart",
    CATEGORIES = "/categories",
    CATEGORY_DETAIL = "/categories/:slug",
    BRANDS = "/brands",
    SEARCH = "/search",

    // Auth (User)
    LOGIN = "/login",
    REGISTER = "/register",
    FORGOT_PASSWORD = "/forgot-password",
    RESET_PASSWORD = "/reset-password",

    // User (protected)
    ACCOUNT_ORDERS = "/account/orders",
    ACCOUNT_ORDER_DETAIL = "/account/orders/:id",

    // Admin
    ADMIN = "/admin",
    ADMIN_LOGIN = "/admin/login",
    ADMIN_FORGOT_PASSWORD = "/admin/forgot-password",
    ADMIN_DASHBOARD = "/admin/dashboard",
    ADMIN_PRODUCTS = "/admin/products",
    ADMIN_PRODUCT_CREATE = "/admin/products/create",
    ADMIN_PRODUCT_EDIT = "/admin/products/:id/edit",
    ADMIN_CATEGORIES = "/admin/categories",
    ADMIN_BRANDS = "/admin/brands",
    ADMIN_ORDERS = "/admin/orders",
    ADMIN_ORDER_DETAIL = "/admin/orders/:id",
    ADMIN_CUSTOMERS = "/admin/customers",

    // Others
    NOT_FOUND_404 = "/not-found-404",
}
```

### 8.3 Page VM Pattern — ví dụ ProductListVM.tsx

```tsx
import { useEffect } from "react";
import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import { Product } from "@/data";

interface Config extends BaseConfig {
    products: Product[];
    total: number;
    page: number;
    keyword: string;
    categoryId: number | null;
    brandId: number | null;
    isLoading: boolean;
}

interface Action extends BaseAction<Config> {
    onSearch: (keyword: string) => void;
    onFilterCategory: (id: number | null) => void;
    onFilterBrand: (id: number | null) => void;
    onPageChange: (page: number) => void;
}

export const ProductListVM: BaseViewModelFunc<Config, Action> = () => {
    const { productRepository } = useAppContext();
    const { config, action, globalUI } = useBaseViewModel<Config>(
        ProductListVM.name,
        { products: [], total: 0, page: 1, keyword: "", categoryId: null, brandId: null, isLoading: false }
    );

    useEffect(() => {
        loadProducts();
    }, [config.page, config.keyword, config.categoryId, config.brandId]);

    const loadProducts = async () => {
        action.setNewConfig({ ...config, isLoading: true });
        const result = await productRepository.getList({
            page: config.page,
            keyword: config.keyword,
            category_id: config.categoryId,
            brand_id: config.brandId,
        });
        if (result.type === ApiResultType.Success) {
            action.setNewConfig({ ...config, products: result.data.items, total: result.data.total, isLoading: false });
        } else {
            globalUI.handleApiError(result.error);
            action.setNewConfig({ ...config, isLoading: false });
        }
    };

    const onSearch = (keyword: string) => action.setNewConfig({ ...config, keyword, page: 1 });
    const onFilterCategory = (id: number | null) => action.setNewConfig({ ...config, categoryId: id, page: 1 });
    const onFilterBrand = (id: number | null) => action.setNewConfig({ ...config, brandId: id, page: 1 });
    const onPageChange = (page: number) => action.setNewConfig({ ...config, page });

    return { config, action: { ...action, onSearch, onFilterCategory, onFilterBrand, onPageChange } };
};
```

### 8.4 Page Component Pattern — ví dụ ProductListPage.tsx

```tsx
import React from "react";
import "./styles.css";
import BaseView from "@/core/base/BaseView";
import { t } from "@/core/localized";
import { ProductListVM } from "./ProductListVM";
import StoreLayout from "@/component/layout/StoreLayout";
import ProductGrid from "@/component/product/ProductGrid";
import FilterPanel from "@/component/common/FilterPanel";
import SearchBar from "@/component/common/SearchBar";
import Pagination from "@/component/common/Pagination";

const ProductListPage: React.FC = () => {
    const { config, action } = ProductListVM();

    return (
        <BaseView className="product-list-page">
            <StoreLayout>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="type-display text-2xl mb-6">{t.product.list.title()}</h1>
                    <SearchBar value={config.keyword} onChange={action.onSearch} />
                    <div className="grid grid-cols-[240px_1fr] gap-6 mt-6">
                        <FilterPanel
                            onCategoryChange={action.onFilterCategory}
                            onBrandChange={action.onFilterBrand}
                        />
                        <div>
                            <ProductGrid products={config.products} isLoading={config.isLoading} />
                            <Pagination
                                current={config.page}
                                total={config.total}
                                onChange={action.onPageChange}
                            />
                        </div>
                    </div>
                </div>
            </StoreLayout>
        </BaseView>
    );
};

export default ProductListPage;
```

### 8.5 UI Design — dùng UI-UX Pro Max

Sau khi cài `uipro init --ai copilot`, chạy lệnh:

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py \
  "ecommerce marketplace store" \
  --design-system \
  --persist \
  -p "StoreAmazon"
```

Dùng file `design-system/MASTER.md` sinh ra làm hướng dẫn màu sắc, typography.

**Định hướng UI từ skill (E-commerce General)**:
- Style: **Clean Minimal** + subtle depth
- Colors: Primary `#FF6600` (cam Amazon), Secondary `#232F3E` (navy dark), Background `#F5F5F5`
- Typography: `Inter` (UI) / `Poppins` (heading) — Google Fonts
- Card: subtle shadow `0 2px 8px rgba(0,0,0,0.08)`, radius `4px`
- CTA: primary button filled cam, hover `#E55A00`, transition 150ms
- Responsive: 375px / 768px / 1024px / 1440px
- No emojis as icons — dùng `lucide-react` icons
- `cursor-pointer` trên mọi clickable element
- Focus states rõ ràng cho keyboard nav

---

## 9. INFRASTRUCTURE

### 9.1 `compose.yml` — theo đúng pattern Iretoru

```yaml
services:
  db:
    profiles: ['local', 'dev']
    image: ${APP_NAME}-db-${ENV}
    container_name: ${APP_NAME}-db-${ENV}
    build:
      context: ./database
      dockerfile: Dockerfile
    environment:
      MYSQL_ROOT_PASSWORD: ${DATABASE_ROOT_PASSWORD}
      DATABASE_NAME: ${DATABASE_NAME}
      DATABASE_USER: ${DATABASE_USER}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      TZ: Asia/Ho_Chi_Minh
    ports:
      - ${DATABASE_PORT}:3306
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/mysql.cnf:/etc/mysql/conf.d/mysql.cnf
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost', '-u', '${DATABASE_USER}', '-p${DATABASE_PASSWORD}']
      interval: 10s
      timeout: 5s
      retries: 5
    mem_limit: 512m
    restart: unless-stopped

  redis:
    profiles: ['local', 'dev', 'prd']
    image: ${APP_NAME}-redis-${ENV}
    container_name: ${APP_NAME}-redis-${ENV}
    build:
      context: ./redis
      dockerfile: Dockerfile
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      TZ: Asia/Ho_Chi_Minh
    ports:
      - ${REDIS_PORT}:6379
    volumes:
      - redis-data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5
    mem_limit: 64m
    restart: unless-stopped

  backend:
    profiles: ['local', 'dev', 'prd']
    image: ${APP_NAME}-backend-${ENV}
    container_name: ${APP_NAME}-backend-${ENV}
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - ${BACKEND_PORT}:8000
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./environment:/environment
      - ./backend:/backend
      - backend-uploads:/backend/uploads  # ảnh lưu ở đây
      - backend-logs:/backend/logs
    mem_limit: 768m
    restart: always

  frontend:
    profiles: ['local']
    image: ${APP_NAME}-frontend-${ENV}
    container_name: ${APP_NAME}-frontend-${ENV}
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - ${FRONTEND_PORT}:3000
    volumes:
      - ./environment:/environment
      - ./frontend:/frontend
      - /frontend/node_modules
    restart: always

  nginx:
    profiles: ['dev', 'prd']
    image: ${APP_NAME}-nginx-${ENV}
    container_name: ${APP_NAME}-nginx-${ENV}
    build:
      context: .
      dockerfile: ./nginx/Dockerfile
    ports:
      - '80:80'
      - '443:443'
    depends_on:
      - backend
    mem_limit: 64m
    restart: unless-stopped
    volumes:
      - backend-uploads:/backend/uploads:ro  # serve static ảnh

volumes:
  mysql-data:
  redis-data:
  backend-uploads:
  backend-logs:
```

### 9.2 `nginx/default.conf`

```nginx
upstream backend_app {
    server backend:8000;
}

upstream frontend_app {
    server frontend:3000;
}

server {
    listen 80;
    server_name _;
    client_max_body_size 20M;

    # Static uploads (ảnh lưu disk)
    location /uploads/ {
        alias /backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://frontend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 10. UNIT TESTS

### 10.1 Setup — `backend/tests/conftest.py`

```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.db.core.session import get_read_db, get_write_db

# SQLite in-memory cho test
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_read_db] = get_session_override
    app.dependency_overrides[get_write_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
```

### 10.2 Test Auth — `tests/test_auth.py`

```python
import pytest
from fastapi.testclient import TestClient

def test_register_success(client: TestClient):
    res = client.post("/api/v1/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "Test123456",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

def test_register_duplicate_email(client: TestClient):
    payload = {"full_name": "User A", "email": "dup@example.com", "password": "Test123456"}
    client.post("/api/v1/auth/register", json=payload)
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 200
    assert res.json()["success"] is False

def test_login_success(client: TestClient):
    client.post("/api/v1/auth/register", json={
        "full_name": "Login User", "email": "login@example.com", "password": "Login123"
    })
    res = client.post("/api/v1/auth/login", json={
        "email": "login@example.com", "password": "Login123"
    })
    assert res.status_code == 200
    assert res.json()["success"] is True

def test_login_wrong_password(client: TestClient):
    res = client.post("/api/v1/auth/login", json={
        "email": "login@example.com", "password": "WRONG"
    })
    assert res.json()["success"] is False
```

### 10.3 Test Products — `tests/test_products.py`

```python
def test_get_products_public(client: TestClient):
    res = client.get("/api/v1/products")
    assert res.status_code == 200
    assert res.json()["success"] is True

def test_create_product_requires_admin(client: TestClient):
    res = client.post("/api/v1/admin/products", json={
        "name": "Test Product", "price": 100000
    })
    assert res.status_code == 403  # hoặc 401 tùy impl

def test_create_product_admin(client: TestClient, admin_token: str):
    res = client.post(
        "/api/v1/admin/products",
        json={"name": "Test Product", "price": 100000, "category_id": 1},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    assert res.json()["data"]["name"] == "Test Product"

def test_get_product_detail(client: TestClient):
    res = client.get("/api/v1/products/1")
    assert res.status_code in [200, 404]

def test_update_product_admin(client: TestClient, admin_token: str):
    # Create first
    create_res = client.post(
        "/api/v1/admin/products",
        json={"name": "Old Name", "price": 100000},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    product_id = create_res.json()["data"]["id"]
    # Update
    res = client.put(
        f"/api/v1/admin/products/{product_id}",
        json={"name": "New Name"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.json()["data"]["name"] == "New Name"

def test_delete_product_admin(client: TestClient, admin_token: str):
    create_res = client.post(
        "/api/v1/admin/products",
        json={"name": "To Delete", "price": 100000},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    product_id = create_res.json()["data"]["id"]
    res = client.delete(
        f"/api/v1/admin/products/{product_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.json()["success"] is True
```

### 10.4 Test Admin Auth — `tests/test_admin_auth.py`

```python
def test_admin_login(client: TestClient):
    # Seed admin trước
    res = client.post("/api/v1/admin/auth/login", json={
        "email": "admin@storeamazon.com",
        "password": "Admin123456",
    })
    assert res.json()["success"] is True
    assert "access_token" in res.json()["data"]

def test_admin_login_wrong_password(client: TestClient):
    res = client.post("/api/v1/admin/auth/login", json={
        "email": "admin@storeamazon.com", "password": "WRONG"
    })
    assert res.json()["success"] is False

def test_admin_me_requires_auth(client: TestClient):
    res = client.get("/api/v1/admin/auth/me")
    assert res.status_code in [401, 403]

def test_admin_me_with_token(client: TestClient, admin_token: str):
    res = client.get(
        "/api/v1/admin/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.json()["success"] is True
    assert res.json()["data"]["email"] == "admin@storeamazon.com"
```

---

## 11. ENVIRONMENT VARIABLES

```env
# environment/.env.local
APP_NAME=storeamazon
ENV=local

# Database
DATABASE_URL=mysql+pymysql://appuser:apppassword@db:3306/storeamazon_local
DATABASE_ROOT_PASSWORD=rootpassword
DATABASE_NAME=storeamazon_local
DATABASE_USER=appuser
DATABASE_PASSWORD=apppassword
DATABASE_PORT=3306

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-in-prod
JWT_ALGORITHM=HS256
JWT_EXPIRE_SECONDS=900

# Redis
REDIS_URL=redis://:redispassword@redis:6379/1
REDIS_PORT=6379
REDIS_PASSWORD=redispassword

# App URLs
BACKEND_PORT=8000
FRONTEND_PORT=3000
BACKEND_API_URL=http://localhost:8000
BACKEND_MEDIA_URL=http://localhost:8000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost

# Email (optional local)
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
MAIL_FROM=noreply@storeamazon.com
MAIL_PORT=587
```

---

## 12. CHECKLIST IMPLEMENTATION

### Phase 1 — Core (phải làm trước)
- [ ] Copy core/ layer từ Iretoru vào StoreAmazon backend (giữ nguyên 100%)
- [ ] Tạo `UserRole.ADMIN=1`, `UserRole.STORE_USER=2`
- [ ] Tạo models: Admin, StoreUser, Category, Brand, Product, ProductImage, Order, OrderItem
- [ ] Alembic migration `0001_init.py`
- [ ] Seed data (admin + categories + brands + products + users)
- [ ] API: admin_auth (login/logout/me)
- [ ] API: auth (register/login/logout/me)
- [ ] API: products (public list/detail + admin CRUD)
- [ ] API: categories (public + admin CRUD)
- [ ] API: brands (public + admin CRUD)
- [ ] API: product_images (upload/delete)
- [ ] API: orders (user + admin)
- [ ] API: dashboard summary
- [ ] Unit tests cho tất cả endpoint trên

### Phase 2 — Frontend
- [ ] Cài uipro-cli và generate design-system/MASTER.md
- [ ] Copy BaseView, BaseViewModel, BaseStatus từ Iretoru
- [ ] Setup AppContextProvider, AuthContextProvider, GlobalUIProvider
- [ ] Setup AppRoutePath, AppNavigation, AppRouter với RoleGuard
- [ ] Views user: Home, ProductList, ProductDetail, Cart
- [ ] Views auth: Login, Register, ForgotPassword
- [ ] Views account: OrderList, OrderDetail
- [ ] Views admin: Login, Dashboard, ProductList, ProductForm, CategoryList, BrandList, OrderList, CustomerList
- [ ] Localization: tất cả text qua `t.*` key

### Phase 3 — Infrastructure
- [ ] compose.yml với profiles local/dev/prd
- [ ] nginx config (proxy + serve static uploads)
- [ ] backend/Dockerfile
- [ ] frontend/Dockerfile (Next.js production build)
- [ ] README.md hướng dẫn chạy

---

## 13. HƯỚNG DẪN CHẠY LOCAL

```bash
# 1. Copy env
cp environment/.env.local.example environment/.env.local

# 2. Start services
docker compose --profile local -f compose.yml up --build

# 3. Seed data (sau khi backend healthy)
docker exec storeamazon-backend-local \
  python -m app.db.seed

# 4. Chạy migrations
docker exec storeamazon-backend-local \
  alembic upgrade head

# 5. Kiểm tra
# API docs: http://localhost:8000/docs
# Frontend: http://localhost:3000
# Admin login: admin@storeamazon.com / Admin123456
# User login:  user1@gmail.com / User123456

# 6. Chạy unit tests
docker exec storeamazon-backend-local \
  pytest tests/ -v
```

---

## 14. GHI CHÚ QUAN TRỌNG

1. **100% code mẫu từ Iretoru** — không tự ý tạo pattern mới, phải follow:
   - `BaseService` → tất cả service class đều kế thừa
   - `BaseApiRouter` → tất cả router đều dùng
   - `SuccessResponse(data=...)` → tất cả response đều wrap
   - `BaseDbModel` → tất cả model đều kế thừa
   - `BaseView` + `useBaseViewModel` → tất cả page đều dùng
   - `BaseViewModelFunc<Config, Action>` → tất cả VM đều theo type này

2. **Ảnh lưu disk** tại `/backend/uploads/` — không dùng S3. Nginx serve qua `/uploads/`.

3. **Không hardcode text** — tất cả string hiển thị qua `t.module.key()` localization.

4. **RBAC**:
   - Public route: không cần token
   - User route: cần `RequireUserDep` (role_id = 2)
   - Admin route: cần `RequireAdminDep` (role_id = 1)

5. **Google Sheets spec** — nếu cần đọc file excel từ link:
   ```
   https://docs.google.com/spreadsheets/d/1HFm2tJe0zdaeqTFZ92u1Ql22j0PUk41_AZFYLlVBQdQ/edit?gid=1374885674
   ```
   Mở trong browser (cần Google account), đọc sheets: Overview, Functions, Screens, Mappings, API để bổ sung thêm spec chi tiết nếu có.

6. **UI-UX Pro Max** — sau khi cài, luôn generate design system trước khi code UI:
   ```bash
   python3 .github/skills/ui-ux-pro-max/scripts/search.py \
     "ecommerce general store" --design-system -p "StoreAmazon"
   ```
