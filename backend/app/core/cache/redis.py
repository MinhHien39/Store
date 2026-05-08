import redis
from ..config import settings
from ..utils import logger

class RedisClient:

    def __init__(self):
        try:
            self.client = redis.Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True
            )
           
        except Exception as e:
            raise ValueError(f"Failed to connect to Redis. {e}")
    
    def set_token(self, key: str, value: str, ex: int = settings.JWT_EXPIRE_SECONDS) -> bool:
        """
        Store a token with a TTL (Time-To-Live).

        Args:
            token_key (str): Key name (e.g. "access:abc123").
            value (str): Value to store (e.g. user ID or token data).
            ttl (int): Expiration time in seconds. Default is 3600 (1 hour).

        Returns:
            bool: True if set successfully.
        """
        success = self.client.setex(name=key, time=ex, value=value)
        logger.debug(f"Set token in Redis: {key} with TTL {ex} seconds.")
        return success
    
    def get_token(self, key: str) -> str:
        """
        Retrieve a token's value.

        Args:
            token_key (str): Key to retrieve.

        Returns:
            str or None: The stored value, or None if key not found.
        """
        value = self.client.get(name=key)
        logger.debug(f"Retrieved token from Redis: {key}")
        return value
    
    def token_exists(self, key: str) -> bool:
        """
        Check if a token key exists.

        Args:
            token_key (str): Key to check.

        Returns:
            bool: True if the key exists, False otherwise.
        """
        return self.get_token(key) is not None

    
    def revoke_token(self, key: str) -> int:
        """
        Delete a token from Redis.

        Args:
            token_key (str): Key to delete.

        Returns:
            int: Number of keys that were removed.
        """
        return self.client.delete(key)
    
    def revoke_pattern(self, pattern: str) -> int:
        """
        Delete tokens matching a pattern.

        Args:
            pattern (str): Pattern to match keys (e.g. "access:uid_*").

        Returns:
            int: Number of keys that were removed.
        """
        cursor = 0
        deleted = 0

        while True:
            cursor, keys = self.client.scan(
                cursor=cursor,
                match=pattern,
                count=100
            )

            if keys:
                deleted += self.client.delete(*keys)

            if cursor == 0:
                break

        logger.debug(f"Revoked {deleted} tokens matching pattern: {pattern}")
        return deleted
    
    def extend_token(self, token_key: str, ttl: int) -> bool:
        """
        Extend the TTL of a token (reset timeout).

        Args:
            token_key (str): Key to update.
            ttl (int): New expiration time (in seconds).

        Returns:
            bool: True if key exists and was updated.
        """
        value = self.get_token(token_key)
        if value is not None:
            return self.set_token(token_key, value, ex=ttl)
        return False


redis_client = RedisClient()