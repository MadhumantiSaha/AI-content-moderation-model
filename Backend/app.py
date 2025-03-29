'''
Author: TEAM UNIQUE

Members: Snehel Basu
         Sounak Banerjee
        
'''
#import the neccessary packages and modules

import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from cloud_operations import upload_blob, analyze_image, analyze_video, analyze_texts
#For database
from Database_essentials import db_Calculations

# main code

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
    video: UploadFile = File(None),
    hashtags: Optional[str]=Form(None)
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
                
                # input data into the database (username, caption , file_link, reason, status)
                db_Calculations.insert_data(username, file_link, caption, hashtags, status ="Rejected", reason ="Violates policy")
                
                return JSONResponse(content={"error": "Image contains explicit content"}, status_code=400)
                
        elif video:
            # Perform video analysis
            vid_score = analyze_video(file_link)
            
            if vid_score>50:
                
                # input data into the database (username, hashtag, status, caption , file_link, reason)
                db_Calculations.insert_data(username, file_link, caption, hashtags, status ="Rejected", reason ="Violates policy")    
                            
                return JSONResponse(content={"error": "Video contains explicit content"}, status_code=400)
        
        caption = caption if caption else ""
        text_score = analyze_texts(caption)
        
        if text_score['toxicity_level']=="High":
            
            # input into database (username, caption , file_link, reason, status)
            db_Calculations.insert_data(username, file_link, caption, hashtags, status ="Rejected", reason ="Violates policy")            
           
            return JSONResponse(content={"error": "Caption contains explicit content"}, status_code=400)
            
        # input into the database (username, fiile_link, caption, hashtags, status:approved , reason:safe)
        db_Calculations.insert_data(username, file_link, caption, hashtags, status ="Approved", reason = "Safe")
       
        return JSONResponse(content={"message": "Post created successfully"}, status_code=201)

    except HTTPException as http_exception:
        return JSONResponse(content={"error": http_exception.detail}, status_code=http_exception.status_code)
    except Exception as e:
        print(e)
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
    
#For Frontend
   
@app.get('/dashboard')
def dashboard_data():
    # Retrieve data from database (total content reviwed, no. of unapproved status, approval rate, frequancy of hashtags )
    content_reviewed = db_Calculations.get_total_entries()
    unapproved_count = db_Calculations.get_unapproved_count()
    approval_rate = db_Calculations.calculate_approval_rate()
    # return as Tuples [needs Tuple unpacking before using]
    return JSONResponse(content={"content_reviewed": content_reviewed, "unapproved_status": unapproved_count, "approval_rate": approval_rate})
    


@app.get('/content_review') 
def content_review():
    # Retrieve data frhttps://cloud.google.com/video-intelligence/docs/feature-explicit-contentom database (username, caption, file_link, reason, status if unapproved)
    content_reviewed = db_Calculations.get_total_entries()
    '''username | type(image or video) | caption | Date & time | file link | approved/unapproved'''
    
    # return JSONResponse(username: username, type: type, caption: caption, date_and_time: date_and_time, file_link: file_link, status: status)

