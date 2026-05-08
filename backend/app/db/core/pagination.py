from typing import Type, TypeVar, Callable, Any, Sequence
from sqlalchemy.sql import ColumnElement
from sqlmodel import Session, SQLModel, select
from sqlalchemy import func
from sqlalchemy.engine import ScalarResult

from app.core import PagingHelper, PaginatedContent

T = TypeVar("T", bound=SQLModel)
R = TypeVar("R")

def paginate_sqlmodel(
    *,
    db: Session,
    model: Type[T],
    where_sql: list,
    page: int,
    per_page: int,
    serializer: Callable[[T], R] | None = None,
    order_by: Sequence[ColumnElement] | None = None
) -> PaginatedContent:
    """
    Generic pagination helper for SQLModel
    """

    # 1️⃣ Total count (NO offset / limit)
    total_count = db.exec(
        select(func.count())
        .select_from(model)
        .where(*where_sql)
    ).first() or 0

    # 2️⃣ Offset / limit
    offset = (page - 1) * per_page
    limit = per_page

    sql_query = (
        select(model)
        .where(*where_sql)
    )

    if order_by is not None:
        sql_query = sql_query.order_by(*order_by)
        
    sql_query = sql_query.offset(offset).limit(limit)

    # 3️⃣ Query items
    result: ScalarResult[T] = db.exec(sql_query)

    items: list[Any]
    if serializer:
        items = [serializer(item) for item in result.all()]
    else:
        items = result.all()

    # 4️⃣ Paging meta
    paging = PagingHelper(
        current_page=page,
        per_page=per_page,
        total_count=total_count
    ).create_meta()

    # 5️⃣ Wrap result
    return PaginatedContent(
        items=items,
        paging=paging
    )

def paginate_join_sqlmodel(
    *,
    db: Session,
    query: Any,
    page: int,
    per_page: int,
    serializer: Callable[[T], R] | None = None
) -> PaginatedContent:
    """
    Generic pagination helper for SQLModel with JOIN queries
    
    Args:
        db: Database session
        query: SQLAlchemy Select statement (with JOINs and WHERE clauses already applied)
        page: Page number (starts from 1)
        per_page: Items per page
        serializer: Function to serialize model to dict
    
    Returns:
        PaginatedContent with items and paging metadata
    """
    
    # 1️⃣ Count total (use subquery to count correctly with JOINs)
    count_query = select(func.count()).select_from(query.subquery())
    total_count = db.exec(count_query).first() or 0
    
    # 2️⃣ Apply pagination
    offset = (page - 1) * per_page
    paginated_query = query.offset(offset).limit(per_page)
    
    # 3️⃣ Execute query
    result: ScalarResult[T] = db.exec(paginated_query)
    
    # 4️⃣ Serialize items
    items: list[Any]
    if serializer:
        items = [serializer(item) for item in result.all()]
    else:
        items = result.all()
    
    # 5️⃣ Create paging metadata
    paging = PagingHelper(
        current_page=page,
        per_page=per_page,
        total_count=total_count
    ).create_meta()
    
    # 6️⃣ Return paginated content
    return PaginatedContent(
        items=items,
        paging=paging
    )
