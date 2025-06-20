import runpod
import subprocess
import base64
import tempfile
import os
import requests
from urllib.parse import urlparse

def handler(event):
    """
    Standard Effects Handler for Mocky
    Processes: zoom, glitch, vhs, filters
    """
    effect_type = event['input']['effect_type']
    media_data = event['input']['media_data']  # base64 or URL
    params = event['input'].get('params', {})
    
    print(f"🎬 Processing effect: {effect_type}")
    print(f"🔧 GPU available: {has_gpu()}")
    
    if effect_type == 'cinematic_zoom':
        return process_zoom(media_data, params)
    elif effect_type == 'glitch_transition':
        return process_glitch(media_data, params)
    elif effect_type == 'vhs_effect':
        return process_vhs(media_data, params)
    elif effect_type == 'meme_fusion':
        return process_meme_fusion(media_data, params)
    else:
        return {"error": f"Unknown effect: {effect_type}"}

def has_gpu():
    """Check if GPU is available"""
    try:
        result = subprocess.run(['nvidia-smi'], capture_output=True, text=True)
        return result.returncode == 0
    except:
        return False

def download_from_url(url):
    """Download file from URL and return local path"""
    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        # Get file extension from URL
        parsed = urlparse(url)
        ext = os.path.splitext(parsed.path)[1] or '.mp4'
        
        # Create temp file
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(response.content)
            return tmp.name
    except Exception as e:
        raise Exception(f"Failed to download from URL: {str(e)}")

def process_zoom(media_data, params):
    """Cinematic zoom effect with GPU/CPU fallback"""
    try:
        # Check if input is URL or base64
        if media_data.startswith(('http://', 'https://')):
            # Download from URL
            input_path = download_from_url(media_data)
        else:
            # Fix base64 padding
            media_data = media_data.replace(' ', '+')
            missing_padding = len(media_data) % 4
            if missing_padding:
                media_data += '=' * (4 - missing_padding)
            
            # Decode base64 to temp file
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_input:
                tmp_input.write(base64.b64decode(media_data))
                input_path = tmp_input.name
        
        output_path = tempfile.mktemp(suffix='.mp4')
        zoom_factor = params.get("zoom", 1.2)
        
        # Try GPU first, fallback to CPU
        gpu_available = has_gpu()
        
        if gpu_available:
            # GPU command
            cmd = [
                'ffmpeg', '-hwaccel', 'cuda',
                '-i', input_path,
                '-vf', f'scale_cuda=iw*{zoom_factor}:ih*{zoom_factor}',
                '-c:v', 'h264_nvenc',
                '-preset', 'fast',
                '-y', output_path
            ]
        else:
            # CPU fallback command
            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-vf', f'scale=iw*{zoom_factor}:ih*{zoom_factor}',
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-y', output_path
            ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"FFmpeg error: {result.stderr}")
        
        # Read result and encode to base64
        with open(output_path, 'rb') as f:
            result_data = base64.b64encode(f.read()).decode()
        
        # Cleanup
        os.unlink(input_path)
        os.unlink(output_path)
        
        return {
            "success": True,
            "result": result_data,
            "effect": "cinematic_zoom",
            "params": params,
            "gpu_used": gpu_available
        }
        
    except Exception as e:
        return {"error": str(e), "effect": "cinematic_zoom"}

def process_glitch(media_data, params):
    """Glitch transition effect with GPU/CPU fallback"""
    try:
        # Check if input is URL or base64
        if media_data.startswith(('http://', 'https://')):
            # Download from URL
            input_path = download_from_url(media_data)
        else:
            # Fix base64 padding
            media_data = media_data.replace(' ', '+')
            missing_padding = len(media_data) % 4
            if missing_padding:
                media_data += '=' * (4 - missing_padding)
            
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_input:
                tmp_input.write(base64.b64decode(media_data))
                input_path = tmp_input.name
        
        output_path = tempfile.mktemp(suffix='.mp4')
        intensity = params.get("intensity", 0.5)
        
        gpu_available = has_gpu()
        
        if gpu_available:
            cmd = [
                'ffmpeg', '-hwaccel', 'cuda',
                '-i', input_path,
                '-vf', f'noise=alls={int(intensity*20)}:allf=t',
                '-c:v', 'h264_nvenc',
                '-y', output_path
            ]
        else:
            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-vf', f'noise=alls={int(intensity*20)}:allf=t',
                '-c:v', 'libx264',
                '-y', output_path
            ]
        
        subprocess.run(cmd, check=True)
        
        with open(output_path, 'rb') as f:
            result_data = base64.b64encode(f.read()).decode()
        
        os.unlink(input_path)
        os.unlink(output_path)
        
        return {
            "success": True,
            "result": result_data,
            "effect": "glitch_transition",
            "gpu_used": gpu_available
        }
        
    except Exception as e:
        return {"error": str(e), "effect": "glitch_transition"}

def process_vhs(media_data, params):
    """VHS vintage effect with GPU/CPU fallback"""
    try:
        # Check if input is URL or base64
        if media_data.startswith(('http://', 'https://')):
            # Download from URL
            input_path = download_from_url(media_data)
        else:
            # Fix base64 padding
            media_data = media_data.replace(' ', '+')
            missing_padding = len(media_data) % 4
            if missing_padding:
                media_data += '=' * (4 - missing_padding)
            
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_input:
                tmp_input.write(base64.b64decode(media_data))
                input_path = tmp_input.name
        
        output_path = tempfile.mktemp(suffix='.mp4')
        
        gpu_available = has_gpu()
        
        if gpu_available:
            cmd = [
                'ffmpeg', '-hwaccel', 'cuda',
                '-i', input_path,
                '-vf', 'curves=vintage,noise=alls=10:allf=t',
                '-c:v', 'h264_nvenc',
                '-y', output_path
            ]
        else:
            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-vf', 'curves=vintage,noise=alls=10:allf=t',
                '-c:v', 'libx264',
                '-y', output_path
            ]
        
        subprocess.run(cmd, check=True)
        
        with open(output_path, 'rb') as f:
            result_data = base64.b64encode(f.read()).decode()
        
        os.unlink(input_path)
        os.unlink(output_path)
        
        return {
            "success": True,
            "result": result_data,
            "effect": "vhs_effect",
            "gpu_used": gpu_available
        }
        
    except Exception as e:
        return {"error": str(e), "effect": "vhs_effect"}

def process_meme_fusion(media_data, params):
    """Meme fusion effect (image + audio)"""
    try:
        # This is a placeholder for meme fusion logic
        return {
            "success": True,
            "result": media_data,  # Return original for now
            "effect": "meme_fusion",
            "note": "Placeholder implementation"
        }
        
    except Exception as e:
        return {"error": str(e), "effect": "meme_fusion"}

# Start RunPod serverless handler
runpod.serverless.start({"handler": handler})
