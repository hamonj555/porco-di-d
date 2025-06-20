FROM python:3.10-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /

# Install RunPod
RUN pip install runpod

# Copy handler
COPY handler.py /

# Start container
CMD ["python", "-u", "/handler.py"]
