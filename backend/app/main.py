
from fastapi import FastAPI
from .routers.test_router import health_check_router
from .routers.user_router import user_router, auth_router
from .routers.anime_router import anime_router
from .routers.genre_router import genre_router
from .routers.anime_save_list_router import anime_save_list_router
from .routers.character_router import character_router
from .routers.comment_router import comment_router
import uvicorn
from .core.config import Settings
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


settings = Settings()
app = FastAPI(debug=settings.debug)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(health_check_router, prefix="/health", tags=["health_check"])
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(anime_router, prefix="/anime", tags=["Anime"])
app.include_router(genre_router, prefix="/genre", tags=["Genre"])
app.include_router(character_router, prefix="/character", tags=["Character"])
app.include_router(anime_save_list_router, prefix="/anime_save_list", tags=["AnimeSaveList"])
app.include_router(comment_router, prefix="/comment", tags=["Comment"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"] 
)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)