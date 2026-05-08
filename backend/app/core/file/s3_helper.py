import boto3
from botocore.exceptions import ClientError

import os
import uuid
from datetime import datetime

from ..error import S3Exception
from ..utils import logger, DateUtils
from ..config import settings


class S3Helper:

    def __init__(self):
        self.bucket_name = settings.S3_BUCKET_NAME
        self.s3_client = boto3.client('s3')

    def build_s3_path(self, original_name: str):

        # Use Unique timestamp seconds + UUID for file name to avoid conflicts, and generate the S3 path
        name, ext = os.path.splitext(original_name)
        # Normalize extension to lowercase
        ext = ext.lower()

        # Generate unique file name using UUID and timestamp
        uid = uuid.uuid4().hex
        # Use current timestamp in seconds for better readability and sorting
        timestamp = DateUtils.now().strftime("%Y%m%d%H%M%S")

        # Construct the S3 path
        path = f"{name}_{uid}_{timestamp}{ext}"
        return path

    def create_presigned_url(self, object_name: str, expires_in: int = 3600) -> str:
        """
        https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html
        Generate presigned URL for file

        :param object_name: S3 object name
        :param expires_in: Expiration time in seconds
        """
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_name
                },
                ExpiresIn=expires_in
            )
            return response

        except ClientError as e:
            logger.error(f"S3 presigned URL generation error: {e}")
            return None

    def get(self, url_path: str) -> str:
        """
        Get file from S3 bucket

        :param url_path: S3 object name
        """
        try:
            object_name = f"{url_path}"
            return self.create_presigned_url(object_name)
        except Exception as e:
            return None

    def upload(self, file, file_name: None, origin_file_name: bool = False) -> str:
        """
        Upload a file to an S3 bucket

        :param file: InMemoryUploadedFile or any file-like object to upload
        :param file_name: S3 object name. If not specified, file.name is used
        :param origin_file_name: If True, the original file name is used as the S3 key (with env prefix). If False, a unique name is generated.
        """
        file_name = file_name or file.name
        if origin_file_name:
            url_path = file_name
        else:
            url_path = self.build_s3_path(file_name)
        object_name = f"{url_path}"
        try:

            response = self.s3_client.upload_fileobj(
                file.file,
                self.bucket_name,
                object_name,
                ExtraArgs={
                    'ContentType': file.content_type
                }
            )
            logger.debug("S3 file was successfully uploaded")
            return url_path
        except Exception as e:
            raise S3Exception(message=str(e))

    def delete(self, url_path: str):
        try:
            object_name = f"{url_path}"
            response = self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=object_name
            )
            logger.debug("S3 file was successfully deleted")
            return True
        except Exception as e:
            raise S3Exception(message=str(e))

    def move(self, old_url_path: str, file_name: None) -> str:
        try:
            source_key = f"{old_url_path}"

            file_name = file_name or ""
            new_url_path = self.build_s3_path(file_name)
            destination_key = f"{new_url_path}"

            self.s3_client.copy_object(
                Bucket=self.bucket_name,
                CopySource={'Bucket': self.bucket_name, 'Key': source_key},
                Key=destination_key
            )

            self.delete(old_url_path)

            logger.debug(f"File moved from {source_key} to {destination_key}")

            return new_url_path
        except Exception as e:
            logger.error(str(e))
            raise S3Exception(message=str(e))


s3_helper = S3Helper()
