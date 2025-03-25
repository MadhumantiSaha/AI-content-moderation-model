import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from cloud_operations import upload_blob, analyze_image, analyze_video, analyze_texts
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Allows requests from localhost:8080
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)
@app.get('/')
def index():
    return {"message": "Hello, World!"}

# Configure the temporary upload directory
TEMP_UPLOAD_DIR = "temp_uploads"
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)  # Create the directory if it doesn't exist

@app.post("/check_content")
async def create_post(
    username: str = Form(...),
    caption: str = Form(...),
    image: UploadFile = File(None),
    video: UploadFile = File(None)
):
    try:
        if not image and not video:
            # raise HTTPException(status_code=400, detail="Either image or video is required")
            pass

        file_data = image if image else video
        file_extension = os.path.splitext(file_data.filename)[1]
        temp_filename = f"{uuid.uuid4()}{file_extension}"
        temp_filepath = os.path.join(TEMP_UPLOAD_DIR, temp_filename)

        with open(temp_filepath, "wb") as buffer:
            while chunk := await file_data.read(1024 * 1024):
                buffer.write(chunk)

        file_link = upload_blob(temp_filepath, temp_filename)

        if image:
            # Perform image analysis
            img_score = analyze_image(file_link)
            print('\n\n',img_score)
            if img_score['adult']>3 or img_score['violence']>3:
                return JSONResponse(content={"error": "Image contains explicit content"}, status_code=400)
        elif video:
            # Perform video analysis
            vid_score = analyze_video(file_link)
            if vid_score>50:
                return JSONResponse(content={"error": "Video contains explicit content"}, status_code=400)
        
        caption = caption if caption else ""
        text_score = analyze_texts(caption)
        if text_score['toxicity_level']=="High":
            return JSONResponse(content={"error": "Caption contains explicit content"}, status_code=400)


        return JSONResponse(content={"message": "Post created successfully"}, status_code=201)

    except HTTPException as http_exception:
        return JSONResponse(content={"error": http_exception.detail}, status_code=http_exception.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
