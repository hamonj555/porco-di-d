from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CinematicZoomRequest(BaseModel):
    video_url: str
    strength: float = 1.0

@app.get("/ping")
async def ping():
    return {"message": "pong"}

@app.get("/effects")
async def get_effects():
    return {
        "effects": [
            {
                "id": "cinematic-zoom",
                "name": "Cinematic Zoom",
                "category": "video",
                "description": "Zoom cinematografico"
            },
            {
                "id": "glitch-transition", 
                "name": "Glitch Transition",
                "category": "video",
                "description": "Transizione glitch"
            },
            {
                "id": "vhs-effect",
                "name": "VHS Effect", 
                "category": "video",
                "description": "Effetto VHS vintage"
            },
            {
                "id": "noir-filter",
                "name": "Noir Filter",
                "category": "video", 
                "description": "Filtro noir bianco e nero"
            }
        ]
    }

@app.post("/effects/cinematic-zoom")
async def cinematic_zoom(request: CinematicZoomRequest):
    # Per ora restituisce URL di test
    # Qui andrà implementata la pipeline FFmpeg/AI reale
    return {
        "status": "success",
        "processed_video_url": "https://example.com/processed_video.mp4",
        "original_url": request.video_url,
        "strength": request.strength,
        "processing_time": "5.2s"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888, reload=True)
