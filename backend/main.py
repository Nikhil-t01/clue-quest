from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
import pprint
import time

from engine.game_engine import GameEngine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

treasure_hunt_map = {}
game_engine = GameEngine()

@app.post("/validateimage/{answer}")
async def validateStep(answer: str, request: Request, file: UploadFile = File(...)):
    print(f"request = {request.url}, {request.headers}")
    file_content = await file.read()
    is_valid = game_engine.handle_input(file_content, answer)
    print(f"returning validateimage response = {{'is_valid': {is_valid}}}")
    return {"is_valid": is_valid}


@app.post("/uploadvideo/{difficulty}")
async def upload_file(difficulty: str, request: Request, file: UploadFile = File(...)):
    print(f"request = {request.url}, {request.headers}")
    file_content = await file.read()
    file_type = file.content_type
    file_name = file.filename

    time.sleep(10)
    # treasure_hunt_map = game_engine.handle_upload(file_content, file_type, file_name, difficulty)
    from constants.sample_response import SAMPLE_RESP
    treasure_hunt_map = SAMPLE_RESP

    pprint.pprint(f"uploadvideo response = {treasure_hunt_map}")
    return treasure_hunt_map
