import json

from client.request_handler import RequestHandler
from constants.constants import ANTHROPIC_VERSION
from constants.prompts import IMAGE_VALIDATION

class ValidateImage():
    def __init__(self):
        self.req_handler = RequestHandler()
    
    def validate_image(self, image_data: str, object_name: str):
        body = json.dumps({
            "anthropic_version": ANTHROPIC_VERSION, 
            "max_tokens": 1024,
            "system": IMAGE_VALIDATION.get("SYSTEM_PROMPT"),
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": IMAGE_VALIDATION.get("USER_PROMPT").format(object_name)
                        }
                    ]
                }
            ]
        })

        response = self.req_handler.get_model_response(body)
        return False if response["content"][0]["text"].lower() == 'false' else True
