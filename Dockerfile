FROM runpod/base:0.6.2-cuda12.1.0

# Install system FFmpeg with GPU support
RUN apt-get update && apt-get install -y ffmpeg

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy handler
COPY handler.py .

CMD ["python", "handler.py"]
