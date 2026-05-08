export enum AppRoutePath {
    // Public
    HOME = "/",
    PRODUCTS = "/products",
    PRODUCT_DETAIL = "/products/:id",
    CART = "/cart",
    CHECKOUT = "/checkout",
    CATEGORIES = "/categories",
    CATEGORY_DETAIL = "/categories/:slug",
    BRANDS = "/brands",
    SEARCH = "/search",
    
    // Auth
    LOGIN = "/login",
    REGISTER = "/register",
    FORGOT_PASSWORD = "/forgot-password",
    RESET_PASSWORD = "/reset-password",

    // User
    ACCOUNT = "/account",
    ORDERS = "/account/orders",
    ORDER_DETAIL = "/account/orders/:id",
    WISHLIST = "/account/wishlist",

    // Admin
    ADMIN = "/admin",
    ADMIN_LOGIN = "/admin/login",
    ADMIN_DASHBOARD = "/admin/dashboard",
    ADMIN_PRODUCTS = "/admin/products",
    ADMIN_PRODUCT_CREATE = "/admin/products/create",
    ADMIN_PRODUCT_EDIT = "/admin/products/:id/edit",
    ADMIN_CATEGORIES = "/admin/categories",
    ADMIN_BRANDS = "/admin/brands",
    ADMIN_ORDERS = "/admin/orders",
    ADMIN_ORDER_DETAIL = "/admin/orders/:id",
    ADMIN_CUSTOMERS = "/admin/customers",

    // Others
    NOT_FOUND_404 = "/not-found-404",
}
