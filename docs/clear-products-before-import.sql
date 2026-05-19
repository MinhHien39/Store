SET @order_item_count = (SELECT COUNT(*) FROM order_items);

SET @cannot_clear_products = IF(
    @order_item_count > 0,
    'Products are referenced by order_items. Clear/cancel order data first, or do not hard-delete products.',
    NULL
);

SET @raise_if_needed = IF(
    @cannot_clear_products IS NULL,
    'SELECT 1',
    CONCAT('SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''', @cannot_clear_products, '''')
);

PREPARE stmt FROM @raise_if_needed;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DELETE FROM product_images;
DELETE FROM products;

ALTER TABLE product_images AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
