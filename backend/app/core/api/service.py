import re
from fastapi import Request

from typing import Optional, Type, TypeVar, Callable
from sqlmodel import Session

from ..auth.models import TokenPayload
from ..utils import DateUtils
from ..error import DataNotFoundException, ErrorMessage

T = TypeVar('T', bound='BaseService')


"""
Core API Service base class and factory
"""
def create_service(service_class: Type[T], db_dep, token_dep=None) -> Callable:
    """Factory to create service dependency with auto-injected db & token_payload"""

    if db_dep and token_dep:
        # If token_dep is provided, create a dependency that injects both db and token_payload
        def dependency(db=db_dep, token_payload=token_dep):
            return service_class(db=db, token_payload=token_payload)
        
    elif token_dep is None:
        # If only db_dep is provided, create a dependency that only injects db
        def dependency(db=db_dep):
            return service_class(db=db)
        
    elif db_dep is None:
        # If no db_dep is provided, create a simpler dependency that only injects token_payload
        def dependency(token_payload=token_dep):
            return service_class(token_payload=token_payload)
    else:
        # If neither is provided, create a simple dependency that just instantiates the service
        def dependency():
            return service_class()
  
    return dependency


# BaseService class
class BaseService:

    def __init__(
        self,
        db: Session,
        token_payload: Optional[TokenPayload] = None
    ):
        self.db = db
        self.token_payload = token_payload
    
    @property
    def current_user_name (self) -> str | None:
        """Get current user name from token payload"""
        return self.token_payload.user_name if self.token_payload else None
    
    @property
    def created_by(self) -> str | None:
        """Get current user name for created_by field"""
        return self.current_user_name

    @property
    def created_at(self):
        """Get current datetime for created_at field"""
        return DateUtils.now()
    
    @property
    def updated_by(self) -> str | None:
        """Get current user name for updated_by field"""
        return self.current_user_name

    @property
    def updated_at(self):
        """Get current datetime"""
        return DateUtils.now()
    

    def _get_domain_from_request(
        self,
        request: Request,
        is_frontend: bool = False
    ) -> str:
        """
        Return backend or frontend domain based on request.

        Local:
            backend  → http://localhost:8000
            frontend → http://localhost:3000

        Production:
            backend:
                api.domain.com
                api-stg.domain.com

            frontend:
                domain.com
                stg.domain.com
        """

        hostname = request.url.hostname or "localhost"
        scheme = request.url.scheme
        port = request.url.port

        # ========================
        # LOCAL ENV
        # ========================
        if hostname in ["localhost", "127.0.0.1"]:
            if is_frontend:
                return f"{scheme}://localhost:3000"
            return f"{scheme}://localhost:8000"

        # ========================
        # PRODUCTION ENV
        # ========================

        # If need backend → return original
        if not is_frontend:
            if port:
                return f"{scheme}://{hostname}:{port}"
            return f"{scheme}://{hostname}"

        # If need frontend → transform domain

        # api-env.domain.com → env.domain.com
        match = re.match(r"^api-([a-zA-Z0-9]+)\.(.+)", hostname)
        if match:
            env = match.group(1)
            domain = match.group(2)
            return f"{scheme}://{env}.{domain}"

        # api.domain.com → domain.com
        if hostname.startswith("api."):
            return f"{scheme}://{hostname[4:]}"

        # already frontend
        return f"{scheme}://{hostname}"

    def get_backend_domain(self, request: Request) -> str:
        return self._get_domain_from_request(request, is_frontend=False)
    
    def get_frontend_domain(self, request: Request) -> str:
        return self._get_domain_from_request(request, is_frontend=True)
            
