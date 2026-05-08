from sqlmodel import Session, select
from app.core import logger, PasswordHelper, UserStatus
from app.db.core import engine
from app.db.models import StoreUser

USERS_DATA = [
    {"full_name": "Nguyễn Văn A", "email": "user1@gmail.com", "password": "User123456", "phone": "0901234567"},
    {"full_name": "Trần Thị B", "email": "user2@gmail.com", "password": "User123456", "phone": "0912345678"},
    {"full_name": "Lê Văn C", "email": "user3@gmail.com", "password": "User123456", "phone": "0923456789"},
]


def seed_users():
    with Session(engine) as db:
        existing = db.exec(select(StoreUser)).first()
        if existing:
            logger.info("Users already exist, skipping seeding.")
            return

        for data in USERS_DATA:
            user = StoreUser(
                full_name=data["full_name"],
                email=data["email"],
                password=PasswordHelper.hash_password(data["password"]),
                phone=data.get("phone"),
                status=UserStatus.ACTIVE.to_value(),
                created_by="seed",
            )
            db.add(user)

        db.commit()
        logger.info(f"Seeded {len(USERS_DATA)} users successfully")
