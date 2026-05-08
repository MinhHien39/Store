# StoreAmazon Codebase

Codebase nay duoc tao tu source `storeamazon` voi huong:
- Backend giu nguyen pattern cu: FastAPI + Pydantic + SQLModel.
- Frontend duoc doi sang Next.js.
- Day du stack: Nginx + MySQL + Redis + Docker Compose.
- Da copy repo UI/UX skill vao: `./ui-ux-pro-max-skill`.

## Cau truc chinh

- `backend/`: Backend tu source storeamazon (giu nguyen de tai su dung API pattern).
- `frontend/`: Next.js app (role-based UI: admin/user).
- `database/`: MySQL docker image + init script.
- `redis/`: Redis docker image.
- `nginx/`: Reverse proxy cho frontend/backend.
- `environment/`: Bien moi truong local/dev/prd cho StoreAmazon.
- `docs/prompts/opus-initial-prompt.md`: Prompt dau tien de dung voi Opus.
- `ui-ux-pro-max-skill/`: Repo skill UI/UX da duoc clone vao project.

## Chay local

1. Tao file env local neu can:
- Da co san: `environment/.env.local`

2. Chay he thong:
```bash
docker compose --profile local --env-file environment/.env.local -f compose.yml up --build
```

3. Truy cap:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

## Tai khoan demo phan quyen frontend

Frontend dang dung session cookie demo de chia role:
- Vao `/login`
- Chon role `admin` hoac `user`
- Admin vao `/admin`, user vao `/user`

## Ghi chu

- Backend hien duoc copy nguyen tu storeamazon de bao toan architecture va convention.
- Neu ban muon, buoc tiep theo minh se tao them module ecommerce API (products, carts, orders, permissions) theo dung pattern backend hien tai.
