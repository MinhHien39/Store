import boto3

import json
from enum import Enum

from ..utils import logger
from ..config import settings

class LambdaInvocationType(Enum):
    EVENT = 'Event'
    REQUEST_RESPONSE = 'RequestResponse'


class LambdaHelper:

    def __init__(self):
        self.lambda_client = boto3.client('lambda', region_name=settings.AWS_REGION)
    
    """
    Helper class to invoke AWS Lambda functions
    invocation_type: 'Event' for asynchronous, 'RequestResponse' for synchronous
    """
    def invoke(
        self, 
        function_name: str,
        payload: dict, 
        invocation_type: LambdaInvocationType = LambdaInvocationType.EVENT
    ) -> dict:
        if not function_name:
            logger.error("Lambda function name is required")
            raise ValueError("Lambda function name is required")
        
        logger.info(f"Invoking Lambda function '{function_name}' with payload: {payload} and invocation type: {invocation_type.value}")
        try:
            # Log the payload for debugging
            response = self.lambda_client.invoke(
                FunctionName=function_name,
                InvocationType=invocation_type.value,
                Payload=json.dumps(payload, default=str).encode('utf-8')
            )

            # For synchronous invocation, read the response payload
            if invocation_type == LambdaInvocationType.REQUEST_RESPONSE:
                response_payload = response['Payload'].read().decode('utf-8')
                logger.info(f"Lambda function '{function_name}' responded with: {response_payload}")
                return json.loads(response_payload)
            
            # For asynchronous invocation, we can log the response metadata
            if invocation_type == LambdaInvocationType.EVENT:
                logger.info(f"LambdaHelper: Lambda invoked asynchronously with payload: {payload}")
                return {"message": "Lambda invoked successfully"}
            
            return {"message": "Lambda invoked with unknown invocation type"}
            
        except Exception as e:
            logger.error(f"Error invoking Lambda function: {e}")
            raise e

lambda_helper = LambdaHelper()