from .admin import seed_admin
from .categories import seed_categories
from .brands import seed_brands
from .products import seed_products
from .users import seed_users


def main():
    seed_admin()
    seed_categories()
    seed_brands()
    seed_products()
    seed_users()
    print("All seed data inserted successfully!")


if __name__ == "__main__":
    main()
