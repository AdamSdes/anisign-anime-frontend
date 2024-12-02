
from fastapi import FastAPI
from .routers.test_router import health_check_router
from .routers.user_router import user_router, auth_router
from .routers.anime_router import anime_router
import uvicorn
from .core.config import Settings
from fastapi.middleware.cors import CORSMiddleware

settings = Settings()
app = FastAPI(debug=settings.debug)

app.include_router(health_check_router, prefix="/health", tags=["health_check"])
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(anime_router, prefix="/anime", tags=["Anime"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"] 
)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)