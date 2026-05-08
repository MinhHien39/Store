"""
String utility functions for sanitization and validation
"""
import re
import html
from typing import Optional


class StringUtils:
    """Utility class for string operations and sanitization"""

    @staticmethod
    def is_empty(value: Optional[str]) -> bool:
        """
        Check if string is None, empty, or only whitespace
        
        Args:
            value: String to check
            
        Returns:
            True if empty, False otherwise
        """
        return value is None or len(value.strip()) == 0

    @staticmethod
    def is_not_empty(value: Optional[str]) -> bool:
        """Check if string is not empty"""
        return not StringUtils.is_empty(value)

    @staticmethod
    def sanitize_html(value: str) -> str:
        """
        Sanitize HTML string to prevent XSS attacks
        Escapes HTML special characters
        
        Args:
            value: String to sanitize
            
        Returns:
            HTML-escaped string safe for rendering
            
        Example:
            >>> StringUtils.sanitize_html("<script>alert('xss')</script>")
            "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
        """
        if StringUtils.is_empty(value):
            return value
        
        # Use Python's html.escape for proper HTML escaping
        return html.escape(value, quote=True)

    @staticmethod
    def unescape_html(value: str) -> str:
        """
        Unescape HTML entities back to original characters
        
        Args:
            value: HTML-escaped string
            
        Returns:
            Unescaped string
        """
        if StringUtils.is_empty(value):
            return value
        
        return html.unescape(value)

    @staticmethod
    def sanitize_sql_like(value: str) -> str:
        """
        Sanitize string for use in SQL LIKE queries
        Escapes special LIKE wildcards (%, _) and dangerous characters
        
        Args:
            value: String to sanitize
            
        Returns:
            Sanitized string safe for SQL LIKE queries
            
        Example:
            >>> StringUtils.sanitize_sql_like("test%_value")
            "test\\%\\_value"
        """
        if StringUtils.is_empty(value):
            return value
        
        # Remove null bytes
        value = value.replace('\x00', '')
        
        # Escape SQL LIKE wildcards
        value = value.replace('\\', '\\\\')  # Escape backslash first
        value = value.replace('%', '\\%')
        value = value.replace('_', '\\_')
        
        # Remove potentially dangerous characters
        value = value.replace(';', '')
        value = value.replace('--', '')
        value = value.replace('/*', '')
        value = value.replace('*/', '')
        
        return value.strip()

    @staticmethod
    def sanitize_filename(value: str) -> str:
        """
        Sanitize string for use as filename
        Removes or replaces dangerous characters
        
        Args:
            value: Filename to sanitize
            
        Returns:
            Safe filename
            
        Example:
            >>> StringUtils.sanitize_filename("my/file<name>.txt")
            "my_file_name_.txt"
        """
        if StringUtils.is_empty(value):
            return value
        
        # Replace path separators and dangerous characters
        dangerous_chars = r'[<>:"/\\|?*\x00-\x1f]'
        value = re.sub(dangerous_chars, '_', value)
        
        # Remove leading/trailing dots and spaces
        value = value.strip('. ')
        
        # Limit length (most filesystems support 255 bytes)
        if len(value.encode('utf-8')) > 255:
            # Truncate while preserving extension
            name_parts = value.rsplit('.', 1)
            if len(name_parts) == 2:
                name, ext = name_parts
                max_name_len = 250 - len(ext.encode('utf-8'))
                value = name[:max_name_len] + '.' + ext
            else:
                value = value[:250]
        
        return value

    @staticmethod
    def normalize_whitespace(value: str) -> str:
        """
        Normalize whitespace in string
        Replaces multiple spaces with single space and trims
        
        Args:
            value: String to normalize
            
        Returns:
            Normalized string
            
        Example:
            >>> StringUtils.normalize_whitespace("hello    world  ")
            "hello world"
        """
        if StringUtils.is_empty(value):
            return value
        
        # Replace multiple whitespace with single space
        value = re.sub(r'\s+', ' ', value)
        
        return value.strip()

    @staticmethod
    def truncate(value: str, max_length: int, suffix: str = '...') -> str:
        """
        Truncate string to maximum length with suffix
        
        Args:
            value: String to truncate
            max_length: Maximum length including suffix
            suffix: Suffix to append if truncated
            
        Returns:
            Truncated string
            
        Example:
            >>> StringUtils.truncate("Hello World", 8)
            "Hello..."
        """
        if StringUtils.is_empty(value) or len(value) <= max_length:
            return value
        
        if max_length <= len(suffix):
            return value[:max_length]
        
        return value[:max_length - len(suffix)] + suffix

    @staticmethod
    def validate_email_format(email: str) -> bool:
        """
        Validate email format (basic check)
        
        Args:
            email: Email to validate
            
        Returns:
            True if valid format, False otherwise
        """
        if StringUtils.is_empty(email):
            return False
        
        # Basic email regex pattern
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

    @staticmethod
    def mask_sensitive_data(value: str, visible_chars: int = 4) -> str:
        """
        Mask sensitive data showing only last N characters
        
        Args:
            value: String to mask
            visible_chars: Number of characters to show at end
            
        Returns:
            Masked string
            
        Example:
            >>> StringUtils.mask_sensitive_data("1234567890", 4)
            "******7890"
        """
        if StringUtils.is_empty(value) or len(value) <= visible_chars:
            return value
        
        mask_length = len(value) - visible_chars
        return '*' * mask_length + value[-visible_chars:]
