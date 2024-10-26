import boto3
import json

from constants.constants import CLAUDE_MODEL_ID

class RequestHandler:
    def __init__(self):
        self.bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')

    def get_model_response(self, body):
        response = self.bedrock_client.invoke_model(body=body, modelId=CLAUDE_MODEL_ID)
        return json.loads(response.get("body").read())
