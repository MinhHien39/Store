# app/db/seed/admin.py
from sqlmodel import Session, select
from app.core import logger, PasswordHelper, UserStatus
from app.db.core import engine
from app.db.models import Admin

DEFAULT_ADMIN_EMAIL = "admin@store.com"
DEFAULT_ADMIN_PASSWORD = "Admin123456"


def seed_admin():
    with Session(engine) as db:
        stmt = select(Admin).where(Admin.email == DEFAULT_ADMIN_EMAIL)
        admin = db.exec(stmt).first()

        if admin:
            logger.info("Admin user already exists, skipping seeding.")
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