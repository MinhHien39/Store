from sqlmodel import col, select
from sqlalchemy import func

from app.core import BaseService, create_service, PasswordHelper, DataNotFoundException, DefaultException, PagingHelper, PaginatedContent, UserRole, UserStatus
from app.db import ReadDbSessionDep, StoreUser, WriteDbSessionDep

from .schemas import StoreUserCreateRequest, StoreUserItem, StoreUserListQuery, StoreUserUpdateRequest


class StoreUserService(BaseService):
    def _to_item(self, user: StoreUser) -> StoreUserItem:
        return StoreUserItem(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            role_id=user.role_id,
            status=user.status,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    def get_list(self, query: StoreUserListQuery) -> PaginatedContent:
        where_sql = [StoreUser.is_deleted == False]

        if query.keyword:
            where_sql.append(
                col(StoreUser.full_name).contains(query.keyword)
                | col(StoreUser.email).contains(query.keyword)
            )

        if query.status is not None:
            where_sql.append(StoreUser.status == query.status)

        total_count = self.db.exec(
            select(func.count()).select_from(StoreUser).where(*where_sql)
        ).first() or 0

        offset, limit = query.get_offset_limit()
        users = self.db.exec(
            select(StoreUser)
            .where(*where_sql)
            .order_by(StoreUser.id.desc())
            .offset(offset)
            .limit(limit)
        ).all()

        items = [self._to_item(u) for u in users]
        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()
        return PaginatedContent(items=items, paging=paging)

    def get(self, user_id: int) -> StoreUserItem:
        user = self.db.exec(
            select(StoreUser).where(StoreUser.id == user_id, StoreUser.is_deleted == False)
        ).first()
        if not user:
            raise DataNotFoundException(message="User not found")
        return self._to_item(user)

    def create(self, payload: StoreUserCreateRequest) -> StoreUserItem:
        exists = self.db.exec(
            select(StoreUser).where(StoreUser.email == payload.email, StoreUser.is_deleted == False)
        ).first()
        if exists:
            raise DefaultException(message="Email already exists")

        user = StoreUser(
            full_name=payload.full_name,
            email=payload.email,
            password=PasswordHelper.hash_password(payload.password),
            phone=payload.phone,
            role_id=UserRole.STORE_USER.value,
            status=payload.status,
            created_by=self.created_by,
        )
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return self._to_item(user)

    def update(self, user_id: int, payload: StoreUserUpdateRequest) -> StoreUserItem:
        user = self.db.exec(
            select(StoreUser).where(StoreUser.id == user_id, StoreUser.is_deleted == False)
        ).first()
        if not user:
            raise DataNotFoundException(message="User not found")

        if payload.email is not None and payload.email != user.email:
            exists = self.db.exec(
                select(StoreUser).where(
                    StoreUser.email == payload.email,
                    StoreUser.id != user_id,
                    StoreUser.is_deleted == False,
                )
            ).first()
            if exists:
                raise DefaultException(message="Email already exists")
            user.email = payload.email

        if payload.full_name is not None:
            user.full_name = payload.full_name
        if payload.password is not None:
            user.password = PasswordHelper.hash_password(payload.password)
        if payload.phone is not None:
            user.phone = payload.phone
        if payload.status is not None:
            user.status = payload.status

        user.updated_by = self.updated_by
        user.updated_at = self.updated_at
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return self._to_item(user)

    def delete(self, user_id: int) -> dict:
        user = self.db.exec(
            select(StoreUser).where(StoreUser.id == user_id, StoreUser.is_deleted == False)
        ).first()
        if not user:
            raise DataNotFoundException(message="User not found")

        user.is_deleted = True
        user.updated_by = self.updated_by
        user.updated_at = self.updated_at
        self.db.add(user)
        return {"id": user_id}


get_store_user_read_service = create_service(StoreUserService, ReadDbSessionDep)
get_store_user_write_service = create_service(StoreUserService, WriteDbSessionDep)
