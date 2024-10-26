import base64
import glob
import json
import os

from client.request_handler import RequestHandler
from constants.constants import ANTHROPIC_VERSION
from constants.prompts import OBJECT_DETECTION


class DetectObject:
    def __init__(self):
        self.req_handler = RequestHandler()

    def detect_objects(self, image_dir: str):
        
        images = self.__get_images_data(image_dir)
        image_data_prompt = [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_data
                }
            } for image_data in images]

        prompt_content = [{"type": "text", "text": OBJECT_DETECTION.get("USER_PROMPT")}] + image_data_prompt

        body = json.dumps({
            "anthropic_version": ANTHROPIC_VERSION, 
            "max_tokens": 1024,
            "system": OBJECT_DETECTION.get("SYSTEM_PROMPT"),
            "messages": [
                {
                    "role": "user",
                    "content": prompt_content
                }
            ]
        })

        response = self.req_handler.get_model_response(body)
        return json.loads(response["content"][0]["text"])

    @staticmethod
    def __get_images_data(image_dir: str):
        buffers = []

        image_files = glob.glob(os.path.join(image_dir, '*'))

        for image_file in image_files:
            with open(image_file, 'rb') as image_file:
                data = base64.b64encode(image_file.read()).decode('utf-8')
                buffers.append(data)

        return buffers
