import io
from dotenv import load_dotenv
from google.cloud import videointelligence
from google.cloud import storage
from google.cloud import vision
from google.cloud import language_v1
import os
load_dotenv()

'''Initializations'''

likelihood_name = {
         0:"UNKNOWN" ,#0
         1:"VERY_UNLIKELY" ,#1
         2:"UNLIKELY",#2
         3:"POSSIBLE",#3
         4:"LIKELY",#4
         5:"VERY_LIKELY",#5
    }

bucket_name = os.environ.get("GCS_BUCKET_NAME")


def upload_blob(source_file_name, destination_blob_name, bucket_name=bucket_name):
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    
    generation_match_precondition = 0

    blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )
    return f'gs://{bucket_name}/{destination_blob_name}'

def analyze_video(link_to_video):
    video_client = videointelligence.VideoIntelligenceServiceClient()
    features = [videointelligence.Feature.EXPLICIT_CONTENT_DETECTION]
    operation = video_client.annotate_video(
    request={"features": features, "input_uri": link_to_video}
    )

    print("\nProcessing video for explicit content annotations:")
    result = operation.result(timeout=90)
    print("\nFinished processing.")
    # Retrieve first result because a single video was processed
    total_score = 0

    segment = result.annotation_results[0].segment
    start_time = segment.start_time_offset.seconds + segment.start_time_offset.microseconds / 1e6
    end_time = segment.end_time_offset.seconds + segment.end_time_offset.microseconds / 1e6
    video_duration = end_time - start_time

    for frame in result.annotation_results[0].explicit_annotation.frames:
        likelihood = videointelligence.Likelihood(frame.pornography_likelihood)
        frame_time = frame.time_offset.seconds + frame.time_offset.microseconds / 1e6
        frame_score = likelihood_name[likelihood.name]
        time_weight = 1 - abs((frame_time - (video_duration / 2)) / (video_duration / 2))
        total_score += frame_score * time_weight

    max_possible_score = len(result.annotation_results[0].explicit_annotation.frames) * 5 if len(result.annotation_results[0].explicit_annotation.frames) > 0 else 1
    safety_score = (total_score / max_possible_score) * 100

    return safety_score #0-25: safe | 25-50: moderate | 50-75: unsafe | 75-100: explicit


def analyze_image(link_to_image):
    """Detects unsafe features in the file."""

    image_client = vision.ImageAnnotatorClient()

    image = vision.Image()
    image.source.image_uri = link_to_image

    response = image_client.safe_search_detection(image=image)
    safe = response.safe_search_annotation
    print((safe))
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    print(safe.adult)
    print(safe.violence)
    # print(likelihood_name[str(safe.violence).split(':')[1]])
    return {"adult":int(safe.adult),
            "violence":int(safe.violence)
            }


def analyze_texts(text):
    """Analyzes text for toxicity using Cloud Natural Language API."""

    client = language_v1.LanguageServiceClient()
    document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)

    sentiment = client.analyze_sentiment(request={"document": document}).document_sentiment

    # Interpret sentiment results for toxicity
    if sentiment.score < -0.5 and sentiment.magnitude > 0.5:  # Adjust thresholds as needed
        toxicity_level = "High"
    elif sentiment.score < -0.2 and sentiment.magnitude > 0.3:
        toxicity_level = "Moderate"
    else:
        toxicity_level = "Low"

    return {
        "sentiment_score": sentiment.score,
        "sentiment_magnitude": sentiment.magnitude,
        "toxicity_level": toxicity_level,
    }


# print(img_score.adult)
# print(img_score.violence)

