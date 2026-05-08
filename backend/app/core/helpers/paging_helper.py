# backend/app/core/helpers/paging_helper.py
import math

class PagingHelper:

    def __init__(self, current_page: int, per_page: int, total_count: int):
        self.current_page = max(1, current_page)
        self.per_page = max(1, per_page)
        self.total_count = max(0, total_count)

    def create_meta(self) -> dict:
        total_pages = math.ceil(self.total_count / self.per_page)

        next_page = (
            self.current_page + 1
            if self.current_page < total_pages
            else None
        )

        return {
            "total_count": self.total_count,
            "per_page": self.per_page,
            "current_page": self.current_page,
            "total_pages": total_pages,
            "next_page": next_page
        }
