import io
from dotenv import load_dotenv
from collections import Counter
from google.cloud import storage
from google.cloud import vision
from google.cloud import language_v1
import os
from datetime import timedelta
from typing import Optional, Sequence, cast

from google.cloud import videointelligence_v1 as vi
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

def analyze_video(
    video_uri: str,
    segments: Optional[Sequence[vi.VideoSegment]] = None,
) -> vi.VideoAnnotationResults:
    video_client = vi.VideoIntelligenceServiceClient()
    features = [vi.Feature.EXPLICIT_CONTENT_DETECTION]
    context = vi.VideoContext(segments=segments)
    request = vi.AnnotateVideoRequest(
        input_uri=video_uri,
        features=features,
        video_context=context,
    )

    print(f'Processing video "{video_uri}"...')
    operation = video_client.annotate_video(request)

    # Wait for operation to complete
    response = cast(vi.AnnotateVideoResponse, operation.result())
    # A single video is processed
    results = response.annotation_results[0]

    frames = results.explicit_annotation.frames
    likelihood_counts = Counter([f.pornography_likelihood for f in frames])

    print(f" Explicit content frames: {len(frames)} ".center(40, "-"))
    
    result = {}
    for likelihood in vi.Likelihood:
        result[likelihood.name] = likelihood_counts[likelihood]
    return result

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

