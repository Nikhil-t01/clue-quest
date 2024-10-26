import cv2
import os

from constants.constants import NUM_FRAMES

def extract_frames(video_path, frames_dir, overwrite=False):
    if os.path.exists(frames_dir):
        if overwrite:
            for file in os.listdir(frames_dir):
                os.remove(os.path.join(frames_dir, file))
        else:
            return

    os.makedirs(frames_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error: Could not open video.")
        return
    
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    steps = set([i for i in range(0, frame_count, int(frame_count / NUM_FRAMES))])

    for i in range(frame_count):
        ret, frame = cap.read()
        if ret:
            if i in steps:
                cv2.imwrite(os.path.join(frames_dir, f"frame_{i:04d}.jpg"), frame)
        else:
            break

    cap.release()
    cv2.destroyAllWindows()
