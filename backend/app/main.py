
from fastapi import FastAPI
from .routers.test_router import health_check_router
from .routers.user_router import user_router, auth_router
import uvicorn
from .core.config import Settings
from fastapi.middleware.cors import CORSMiddleware

settings = Settings()
app = FastAPI(debug=settings.debug)

app.include_router(health_check_router, prefix="/health", tags=["health_check"])
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"] 
 )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)