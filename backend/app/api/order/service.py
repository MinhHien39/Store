from sqlmodel import select
from sqlalchemy import func

from app.core import (
    BaseService,
    create_service,
    logger,
    DataNotFoundException,
    DefaultException,
    ErrorMessage,
    TokenPayloadDep,
    PagingHelper,
    PaginatedContent,
)
from app.db import (
    ReadDbSessionDep,
    WriteDbSessionDep,
    Order,
    OrderItem,
    Product,
)
from .schemas import CreateOrderRequest, UpdateOrderStatusRequest, OrderListQuery


class OrderService(BaseService):

    def create_order(self, request: CreateOrderRequest) -> dict:
        user_id = self.token_payload.user_id

        # Validate products and calculate total
        total_amount = 0
        order_items_data = []

        for item in request.items:
            product = self.db.exec(
                select(Product).where(
                    Product.id == item.product_id,
                    Product.is_deleted == False,
                    Product.status == 1,
                )
            ).first()

            if not product:
                raise DataNotFoundException(message=f"Product ID {item.product_id} not found")

            if product.stock_quantity < item.quantity:
                raise DefaultException(message=f"Insufficient stock for {product.name}")

            item_price = product.sale_price if product.sale_price else product.price
            total_amount += item_price * item.quantity
            order_items_data.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item_price,
            })

            # Deduct stock
            product.stock_quantity -= item.quantity
            self.db.add(product)

        # Create order
        order = Order(
            user_id=user_id,
            status=1,  # pending
            total_amount=total_amount,
            shipping_name=request.shipping_name,
            shipping_phone=request.shipping_phone,
            shipping_address=request.shipping_address,
            notes=request.notes,
            created_by=self.current_user_name,
        )
        self.db.add(order)
        self.db.flush()

        # Create order items
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                price=item_data["price"],
                created_by=self.current_user_name,
            )
            self.db.add(order_item)

        self.db.flush()

        return self._get_order_detail(order.id)

    def get_my_orders(self, query: OrderListQuery) -> PaginatedContent:
        user_id = self.token_payload.user_id
        where_sql = [
            Order.user_id == user_id,
            Order.is_deleted == False,
        ]
        if query.status is not None:
            where_sql.append(Order.status == query.status)

        offset, limit = query.get_offset_limit()

        total_count = self.db.exec(
            select(func.count()).select_from(Order).where(*where_sql)
        ).first() or 0

        orders = self.db.exec(
            select(Order)
            .where(*where_sql)
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(limit)
        ).all()

        items = [self._order_to_json(o) for o in orders]
        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()
        return PaginatedContent(items=items, paging=paging)

    def get_my_order_detail(self, order_id: int) -> dict:
        order = self.db.exec(
            select(Order).where(
                Order.id == order_id,
                Order.user_id == self.token_payload.user_id,
                Order.is_deleted == False,
            )
        ).first()
        if not order:
            raise DataNotFoundException(message="Order not found")
        return self._get_order_detail(order_id)

    # --- Admin methods ---

    def get_all_orders(self, query: OrderListQuery) -> PaginatedContent:
        where_sql = [Order.is_deleted == False]
        if query.status is not None:
            where_sql.append(Order.status == query.status)

        offset, limit = query.get_offset_limit()

        total_count = self.db.exec(
            select(func.count()).select_from(Order).where(*where_sql)
        ).first() or 0

        orders = self.db.exec(
            select(Order)
            .where(*where_sql)
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(limit)
        ).all()

        items = [self._order_to_json(o) for o in orders]
        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()
        return PaginatedContent(items=items, paging=paging)

    def get_order_detail_admin(self, order_id: int) -> dict:
        order = self.db.exec(
            select(Order).where(
                Order.id == order_id,
                Order.is_deleted == False,
            )
        ).first()
        if not order:
            raise DataNotFoundException(message="Order not found")
        return self._get_order_detail(order_id)

    def update_order_status(self, order_id: int, request: UpdateOrderStatusRequest) -> dict:
        order = self.db.exec(
            select(Order).where(
                Order.id == order_id,
                Order.is_deleted == False,
            )
        ).first()
        if not order:
            raise DataNotFoundException(message="Order not found")

        order.status = request.status
        order.updated_by = self.current_user_name
        order.updated_at = self.updated_at
        self.db.add(order)
        self.db.flush()

        return self._get_order_detail(order_id)

    # --- Helpers ---

    def _order_to_json(self, order: Order) -> dict:
        data = order.to_json()
        # Count items
        item_count = self.db.exec(
            select(func.count()).select_from(OrderItem).where(
                OrderItem.order_id == order.id,
                OrderItem.is_deleted == False,
            )
        ).first() or 0
        data["item_count"] = item_count
        return data

    def _get_order_detail(self, order_id: int) -> dict:
        order = self.db.exec(
            select(Order).where(Order.id == order_id, Order.is_deleted == False)
        ).first()
        if not order:
            raise DataNotFoundException(message="Order not found")

        items = self.db.exec(
            select(OrderItem).where(
                OrderItem.order_id == order_id,
                OrderItem.is_deleted == False,
            )
        ).all()

        order_items = []
        for item in items:
            product = self.db.exec(
                select(Product).where(Product.id == item.product_id)
            ).first()
            item_data = item.to_json()
            if product:
                item_data["product_name"] = product.name
                item_data["product_image"] = product.main_image_url
            order_items.append(item_data)

        data = order.to_json()
        data["items"] = order_items
        return data


get_order_service = create_service(OrderService, WriteDbSessionDep, TokenPayloadDep)
get_order_read_service = create_service(OrderService, ReadDbSessionDep, TokenPayloadDep)
