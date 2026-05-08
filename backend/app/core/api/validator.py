from fastapi import UploadFile, File, HTTPException
from typing import List
import os
import secrets

ALLOWED_FILE_TYPES: List[str] = [
    # Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/heic",

    # PDF
    "application/pdf",

    # Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    # Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    # PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    # Text
    "text/plain",
    "text/csv",

    # Archive
    "application/zip",
    "application/x-zip-compressed",
]

class MultiFileValidator:

    def __init__(
        self,
        max_size_mb: int = 20,
        max_files: int = 10,
        allowed_types: list[str] = None
    ):
        self.max_size = max_size_mb * 1024 * 1024
        self.max_files = max_files
        self.allowed_types = allowed_types or ALLOWED_FILE_TYPES

    async def __call__(
        self,
        files: List[UploadFile] = File(default=[])
    ) -> List[UploadFile]:

        if not files:
            return []

        if len(files) > self.max_files:
            raise HTTPException(
                status_code=400,
                detail=f"Maximum {self.max_files} files allowed"
            )

        for file in files:

            # Validate content type
            if file.content_type not in self.allowed_types:
                raise HTTPException(
                    status_code=400,
                    detail=f"{file.filename} invalid file type"
                )

            # Validate size
            file.file.seek(0, 2)
            size = file.file.tell()
            file.file.seek(0)

            if size > self.max_size:
                raise HTTPException(
                    status_code=400,
                    detail=f"{file.filename} exceeds {self.max_size // (1024*1024)}MB"
                )

        return files