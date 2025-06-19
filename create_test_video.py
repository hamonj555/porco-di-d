import subprocess
import base64
import json

# Create a 3-second test video with FFmpeg
def create_test_video():
    print("🎬 Creating test video...")
    
    # FFmpeg command to create a 3-second video with color bars
    cmd = [
        'ffmpeg',
        '-f', 'lavfi',
        '-i', 'testsrc=duration=3:size=320x240:rate=30',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-y', 'test_video.mp4'
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ FFmpeg error: {result.stderr}")
            return None
        
        # Read and encode to base64
        with open('test_video.mp4', 'rb') as f:
            video_data = f.read()
            
        base64_data = base64.b64encode(video_data).decode()
        
        print(f"✅ Video created: {len(video_data)} bytes")
        print(f"✅ Base64 length: {len(base64_data)} chars")
        
        return base64_data
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    video_b64 = create_test_video()
    if video_b64:
        # Update tests.json with real video data
        tests_data = {
            "tests": [
                {
                    "name": "test_cinematic_zoom",
                    "input": {
                        "effect_type": "cinematic_zoom",
                        "media_data": video_b64,
                        "params": {
                            "zoom": 1.2
                        }
                    },
                    "timeout": 30000
                }
            ],
            "config": {
                "gpuTypeId": "NVIDIA GeForce RTX 4090",
                "gpuCount": 1,
                "allowedCudaVersions": [
                    "12.7", "12.6", "12.5", "12.4"
                ]
            }
        }
        
        with open('.runpod/tests.json', 'w') as f:
            json.dump(tests_data, f, indent=2)
            
        print("✅ Updated .runpod/tests.json with real video data")
    else:
        print("❌ Failed to create test video")
