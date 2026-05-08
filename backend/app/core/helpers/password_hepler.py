from argon2 import PasswordHasher

ph = PasswordHasher()


class PasswordHelper:
    @staticmethod
    def hash_password(plain_password: str) -> str:
        """
        Hash password using passlib + bcrypt
        """
        return ph.hash(plain_password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify password against stored hash
        """
        if not hashed_password:
            return False
        try:
            return ph.verify(hashed_password, plain_password)
        except Exception:
            return False
