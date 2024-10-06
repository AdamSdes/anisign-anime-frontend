from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings