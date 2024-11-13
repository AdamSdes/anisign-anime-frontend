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
    
    secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int

    class Config:
        env_file = ".env"
