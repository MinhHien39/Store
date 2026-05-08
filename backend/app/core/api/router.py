# app/api/core/route.py
import time
import functools

from fastapi.routing import APIRoute, APIRouter
from fastapi.responses import Response

from app.core import logger

class BaseResponseRoute(APIRoute):
    """
    Docstring for BaseResponseRoute
    A custom APIRoute that automatically wraps responses in a BaseResponse structure.
    """ 
    def get_route_handler(self):
        original_handler = super().get_route_handler()

        route_name = self.name or "unknown_route"
        path = self.path
        methods = ",".join(self.methods) if self.methods else "unknown_methods"

        # Define the custom route handler
        @functools.wraps(original_handler)
        async def handler(request):
            start_time = time.time()
            logger.debug(f"[API START]: {methods} {path} -----> {route_name}")

            try:
                response: Response = await original_handler(request)
                return response
        
            finally:
                end_time = time.time()
                elapsed_time = (end_time - start_time) 
                logger.debug(f"[API END]: {methods} {path} -----> {route_name} - Time taken: {elapsed_time:.2f} seconds")

        return handler


class BaseApiRouter(APIRouter):

    """
    Docstring for BaseApiRouter
    A custom APIRouter that uses BaseResponseRoute as the default route class.
    """
    def __init__(
        self,
        *,
        prefix: str = "",
        tags: list[str] | None = None,
        dependencies: list | None = None,
        **kwargs
    ):
        super().__init__(
            prefix=prefix,
            tags=tags,
            route_class=BaseResponseRoute,
            dependencies=dependencies,
            **kwargs
        )
