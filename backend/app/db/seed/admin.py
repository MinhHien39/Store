# app/db/seed/admin.py
from sqlmodel import Session, select
from app.core import logger, PasswordHelper, UserStatus
from app.db.core import engine
from app.db.models import Admin

DEFAULT_ADMIN_EMAIL = "admin@store.com"
DEFAULT_ADMIN_PASSWORD = "123456"


def seed_admin():
    with Session(engine) as db:
        stmt = select(Admin).where(Admin.email == DEFAULT_ADMIN_EMAIL)
        admin = db.exec(stmt).first()

        if admin:
            admin.password = PasswordHelper.hash_password(DEFAULT_ADMIN_PASSWORD)
            admin.full_name = admin.full_name or "Super Admin"
            admin.status = UserStatus.ACTIVE.to_value()
            admin.updated_by = "seed"
            db.add(admin)
            db.commit()
            logger.info("Admin user already exists, password reset successfully.")
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


if __name__ == "__main__":
    seed_admin()
