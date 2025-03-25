import io
from dotenv import load_dotenv
from google.cloud import videointelligence

load_dotenv()

"""Detects explicit content from the GCS path to a video."""
video_client = videointelligence.VideoIntelligenceServiceClient()

features = [videointelligence.Feature.EXPLICIT_CONTENT_DETECTION]

operation = video_client.annotate_video(
    request={"features": features, "input_uri": 'gs://video_checking_bucket/vid_folder/VID-20220712-WA0026.mp4'}
)
print("\nProcessing video for explicit content annotations:")

result = operation.result(timeout=90)
print("\nFinished processing.")

# Retrieve first result because a single video was processed
for frame in result.annotation_results[0].explicit_annotation.frames:
    likelihood = videointelligence.Likelihood(frame.pornography_likelihood)
    frame_time = frame.time_offset.seconds + frame.time_offset.microseconds / 1e6
    print("Time: {}s".format(frame_time))
    print("\tpornography: {}".format(likelihood.name))