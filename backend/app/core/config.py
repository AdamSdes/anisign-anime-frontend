from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str 
    port: int
    debug: bool = True
    
    db_user: str = 'postgres'
    db_password: str = 'admin'
    db_host: str = 'postgres'
    db_port: int = 5432
    db_name: str = 'postgres'
    
    redis_host: str
    redis_port: int

    class Config:
        env_file = ".env"
