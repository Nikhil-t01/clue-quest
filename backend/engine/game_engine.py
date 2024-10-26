import base64
import os

from constants.constants import FILE_STORAGE_PATH
from service.frame_extraction import extract_frames
from service.image_validation import ValidateImage
from service.object_detection import DetectObject
from service.map_creation import CreateMap

class GameEngine():
    def __init__(self):
        self.object_detection = DetectObject()
        self.map_creation = CreateMap()
        self.image_validation = ValidateImage()
    
    def handle_upload(self, video_content, content_type, file_name, difficulty):
        # save video
        self.__save_video(video_content, file_name)
        print("Video saved.....")
        # extract frames
        frame_dir = os.path.join(FILE_STORAGE_PATH, "frames")
        extract_frames(os.path.join(FILE_STORAGE_PATH, file_name), frame_dir, overwrite=True)
        print("Frames extracted.....")
        # detect objects
        objects = self.object_detection.detect_objects(frame_dir)
        print("Objects detected.....")
        # create treasure map
        treasure_map = self.map_creation.create_map(objects, difficulty)
        print("Treasure map created.....")
        return treasure_map

    def handle_input(self, image_content, answer):
        image_content_data = base64.b64encode(image_content).decode('utf-8')
        is_valid = self.image_validation.validate_image(image_content_data, answer)
        return is_valid

    @staticmethod
    def __save_video(video_content, file_name):
        file_path = os.path.join(FILE_STORAGE_PATH, file_name)
        with open(file_path, "wb") as f:
            f.write(video_content)
