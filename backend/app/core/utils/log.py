import logging
import os
import sys
from logging.handlers import RotatingFileHandler

def setup_logger(name: str = "app") -> logging.Logger:
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    file_name = os.path.join(log_dir, "app.log")
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s"
    )

    # Console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # File (rotate)
    file_handler = RotatingFileHandler(
        filename=file_name,
        maxBytes=100 * 1024 * 1024,  # 100MB
        backupCount=5
    )
    file_handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

    return logger

logger = setup_logger()