import runpod
import subprocess
import base64
import tempfile
import os

def handler(job):
    try:
        job_input = job["input"]
        effect_type = job_input["effect_type"]
        media_data = job_input["media_data"] 
        params = job_input.get("params", {})
        
        print(f"🎬 Processing effect: {effect_type}")
        
        # Decode base64 → temp file
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_input:
            tmp_input.write(base64.b64decode(media_data))
            input_path = tmp_input.name
        
        output_path = tempfile.mktemp(suffix='.mp4')
        
        # Apply effect with FFmpeg
        if effect_type == 'cinematic_zoom':
            zoom = params.get("zoom", 1.2)
            cmd = [
                'ffmpeg', '-i', input_path,
                '-vf', f'scale=iw*{zoom}:ih*{zoom}',
                '-c:v', 'libx264', '-preset', 'fast',
                '-y', output_path
            ]
        elif effect_type == 'meme_fusion':
            cmd = [
                'ffmpeg', '-i', input_path,
                '-vf', 'scale=640:480,format=yuv420p',
                '-c:v', 'libx264', '-preset', 'fast',
                '-y', output_path
            ]
        else:
            # Default processing
            cmd = [
                'ffmpeg', '-i', input_path,
                '-c:v', 'libx264', '-preset', 'fast',
                '-y', output_path
            ]
        
        # Execute FFmpeg
        subprocess.run(cmd, check=True, capture_output=True)
        
        # Encode result to base64
        with open(output_path, 'rb') as f:
            result_data = base64.b64encode(f.read()).decode()
        
        # Cleanup
        os.unlink(input_path)
        os.unlink(output_path)
        
        return {
            "success": True,
            "result": result_data,
            "effect": effect_type
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

runpod.serverless.start({"handler": handler})
