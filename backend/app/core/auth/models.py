"""
Authentication Data Models - User roles, statuses, and token structures
"""
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, model_validator

from ..error import DataNotFoundException, ErrorMessage

class UserRole(int, Enum):
    """User role enumeration"""
    ADMIN = 1
    STORE_USER = 2

    def to_value(self) -> int:
        return self.value
    
    def is_admin(self) -> bool:
        return self == UserRole.ADMIN

    def is_store_user(self) -> bool:
        return self == UserRole.STORE_USER

class UserStatus(Enum):
    """User status enumeration"""
    ALL = -1
    TEMP = 0
    ACTIVE = 1
    INACTIVE = 2
   
    def to_value(self) -> int:
        return self.value

    def is_temp(self) -> bool:
        return self == UserStatus.TEMP

    def is_active(self) -> bool:
        return self == UserStatus.ACTIVE
    
    def is_inactive(self) -> bool:
        return self == UserStatus.INACTIVE
    
    @classmethod
    def from_raw_value(cls, value: int) -> "UserStatus":
        for status in cls:
            if status.value == value:
                return status
        return cls.TEMP  # Default to TEMP instead of NONE


class TokenPayload(BaseModel):
    """
    Structured token payload data from JWT
    Provides type-safe access to token claims
    
    Usage:
        payload = TokenPayload(**raw_token_dict)
        if payload.is_admin:
            # Admin logic
    """
    user_id: int = Field(..., description="User ID from token")
    role_id: int = Field(..., description="Role ID (1=Admin, 2=StoreUser)")
    user_name: Optional[str] = Field(None, description="User full name")
    extra_data: Dict[str, Any] = Field(default_factory=dict, description="Additional JWT fields (sid, iat, exp, nbf, etc.)")
    
    @model_validator(mode='before')
    @classmethod
    def extract_extra_fields(cls, data: Any) -> Any:
        """
        Extract fields not defined in the model into extra_data
        This handles JWT fields like sid, iat, exp, nbf
        """
        if isinstance(data, dict):
            # Define known fields
            known_fields = {'user_id', 'role_id', 'user_name', 'extra_data'}
            
            # Get existing extra_data or create new
            extra_data = data.get('extra_data', {})
            
            # Move unknown fields to extra_data
            for key in list(data.keys()):
                if key not in known_fields:
                    extra_data[key] = data.pop(key)
            
            # Set extra_data back
            data['extra_data'] = extra_data
        
        return data
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role_id == UserRole.ADMIN.value
    
    @property
    def is_store_user(self) -> bool:
        """Check if user is store user"""
        return self.role_id == UserRole.STORE_USER.value
    
    @property
    def role(self) -> UserRole:
        """Get UserRole enum"""
        return UserRole(self.role_id)
    
    def has_admin_access(self) -> bool:
        """Check if user has admin access"""
        return self.is_admin
    
    def to_dict(self) -> dict:
        """Convert to dict for JWT encoding"""
        return {
            "user_id": self.user_id,
            "role_id": self.role_id,
            "user_name": self.user_name,
            **self.extra_data  # Spread extra_data into main dict
        }
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "role_id": 1,
                "user_name": "Admin User",
                "extra_data": {}
            }
        }
