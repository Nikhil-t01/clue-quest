import json
from typing import List

from client.request_handler import RequestHandler
from constants.constants import ANTHROPIC_VERSION
from constants.prompts import MAP_CREATION

class CreateMap:
    def __init__(self):
        self.req_handler = RequestHandler()

    def create_map(self, objects: List[str], difficulty: str):
        body = json.dumps({
            "anthropic_version": ANTHROPIC_VERSION,
            "max_tokens": 65536,
            "system": MAP_CREATION.get("SYSTEM_PROMPT"),
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": MAP_CREATION.get("USER_PROMPT").format(", ".join(objects), difficulty)
                        }
                    ]
                }
            ]
        })

        response = self.req_handler.get_model_response(body)
        content = response["content"]
        if len(content) > 0:
            if content[0]["type"] == "text":
                treasure_map_response = content[0]["text"]
                treasure_map = json.loads(treasure_map_response)
                return treasure_map
            else:
                print("Text type response is missing in response")
                return None
        else:
            print("Content missing in GenAI API response")
            return None
