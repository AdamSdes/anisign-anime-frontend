from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str 
    port: int
    debug: bool = True
    
    db_user: str
    db_password: str
    db_host: str
    db_port: int
    db_name: str
    
    redis_host: str
    redis_port: int

    class Config:
        env_file = ".env"
