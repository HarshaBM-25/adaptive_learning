from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str = os.getenv("OPENAI_API_KEY")
    
    # Database Configuration
    database_url: str = os.getenv("DATABASE_URL")
    
    # JWT Configuration
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Granite Configuration
    granite_api_key: str = os.getenv("GRANITE_API_KEY")
    granite_api_url: str = os.getenv("GRANITE_API_URL")
    
    # Server Configuration
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings() 