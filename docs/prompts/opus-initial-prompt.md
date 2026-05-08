# Opus Prompt 01

Title: Tao web ban hang gom admin va user co phan quyen

```text
Ban la kien truc su fullstack senior.
Hay doc source backend hien tai trong du an nay de tao API theo dung pattern dang co.

Yeu cau ky thuat:
1) Backend:
- Bat buoc giu FastAPI + Pydantic, giu convention va style coding cua source hien tai.
- Uu tien tai su dung core layer, auth layer, error handler, response wrapper, router structure tu source cu.
- Tao he thong API cho web ban hang gom 2 role: admin va user.
- Co phan quyen ro rang theo role cho endpoint.
- Co module auth, users, products, categories, carts, orders, dashboard.
- Co migration cho cac bang can thiet.
- Co seed data local.

2) Frontend:
- Dung Next.js (khong dung React Vite nua).
- UI theo huong dan trong repo ui-ux-pro-max-skill da duoc copy vao source.
- Co giao dien rieng cho admin va user, co middleware/route guard theo role.
- Co dashboard admin, danh sach san pham, gio hang, don hang.

3) Infrastructure:
- Day du Nginx + DB + Redis + Docker Compose.
- Moi service co healthcheck co ban.
- Cac bien moi truong tach theo local/dev/prd.

4) Output:
- Tao source code chay duoc local bang docker compose.
- Viet huong dan chay va test nhanh.

Luu y:
- Truoc khi code, hay tom tat ngan gon ban da hieu gi tu source backend hien tai.
- Neu co diem nao thieu thong tin, dua ra gia dinh hop ly va tiep tuc implement.
```
