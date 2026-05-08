from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
from typing import ClassVar, Dict, Any, Optional
from app.core.utils import DateFormat
from enum import Enum

class SortDirection(str, Enum):
    """
    Sort direction for query parameters
    """
    ASC = "asc"
    DESC = "desc"
    
class Base(BaseModel):
    """
    Base class for all models with date validation support.

    This base supports:
    - Optional date fields (None is allowed)
    - Custom date format validation
    - Optional date range comparison (start <= end)
    - Dynamic field names (not hard-coded)

    Validation is fully controlled by `date_config` defined in child models.

    Example date_config:
    {
        "fields": ["period_start", "period_end"],
        "format": DateFormat.YYYY_MM_DD_MINUS,
        "range": {
            "enabled": True,
            "start": "period_start",
            "end": "period_end"
        }
    }
    """

    # Configuration for date validation (must be overridden by child models)
    # If None or empty → no validation will be applied
    date_config: ClassVar[Optional[Dict[str, Any]]] = None

    # ------------------------------------------------------------------
    # Field-level validation: validate date format for individual fields
    # ------------------------------------------------------------------
    @field_validator("*")
    @classmethod
    def validate_date_format(cls, value, info):
        """
        Validate date format for individual fields.

        Rules:
        - Validation is skipped if `date_config` is not provided
        - Validation is applied only to fields listed in date_config["fields"]
        - None values are allowed (optional fields)
        """

        date_config = cls.date_config
        if not date_config:
            return value

        # Allow optional fields (None or empty string)
        if not value:
            return None

        date_fields = date_config.get("fields", [])
        if info.field_name not in date_fields:
            return value

        date_format = date_config.get("format", DateFormat.YYYY_MM_DD_MINUS)

        try:
            datetime.strptime(value, date_format)
        except ValueError:
            raise ValueError(
                f"{info.field_name} must be in format {date_format}"
            )

        return value

    # ------------------------------------------------------------------
    # Model-level validation: validate date range (start <= end)
    # ------------------------------------------------------------------
    @model_validator(mode="after")
    def validate_date_range(self):
        """
        Validate date range logic across multiple fields.

        Rules:
        - Validation is skipped if date_config or range config is missing
        - Validation is skipped if range.enabled is False
        - Validation is applied only when both start and end values exist
        - Optional fields are supported
        """

        date_config = self.date_config
        if not date_config:
            return self

        range_config = date_config.get("range")
        if not range_config or not range_config.get("enabled"):
            return self

        start_field = range_config.get("start")
        end_field = range_config.get("end")

        if not start_field or not end_field:
            return self

        start_value = getattr(self, start_field, None)
        end_value = getattr(self, end_field, None)

        # Optional fields → validate only if both values exist
        if not start_value or not end_value:
            return self

        date_format = date_config.get("format", DateFormat.YYYY_MM_DD_MINUS)

        start_date = datetime.strptime(start_value, date_format)
        end_date = datetime.strptime(end_value, date_format)

        if end_date < start_date:
            raise ValueError(
                f"{end_field} must be greater than or equal to {start_field}"
            )

        return self


class BaseQuery(Base):
    pass

class BaseFilterQuery(BaseQuery):
    page: int = Field(default=1, ge=1, examples={"value": 1})
    per_page: int = Field(default=20, ge=1, le=100, examples={"value": 20})
    search_term: str | None = Field(default=None)

    def get_offset_limit(self) -> tuple[int, int]:
        offset = (self.page - 1) * self.per_page
        limit = self.per_page
        return offset, limit


class BaseRequest(Base):

    def to_dict(self, exclude_fields: set[str] | None = None) -> dict:
        return self.model_dump(exclude=exclude_fields)