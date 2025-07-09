from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.exc import OperationalError
from app.core.config import Settings

settings = Settings()

DATABASE_URL = f"postgresql+asyncpg://{settings.db_user}:{settings.db_password}@{settings.db_host}:5432/{settings.db_name}"

# Async engine для веб-запитів (великий пул)
engine_web = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=20,       # збільшений пул
    max_overflow=10
)

async_session = async_sessionmaker(
    bind=engine_web,
    class_=AsyncSession,
    expire_on_commit=False
)

# Async engine для фонового процесу (менший пул)
engine_worker = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=5,        # менший пул, щоб не блокувати
    max_overflow=5
)

async_session_worker = async_sessionmaker(
    bind=engine_worker,
    class_=AsyncSession,
    expire_on_commit=False
)

# Залежність для фонового процесу
async def get_worker_session():
    async with async_session_worker() as session:
        yield session

async def check_connection():
    async with async_session() as session:
        try:
            # Проста перевірка через селект 1
            await session.execute("SELECT 1")
            return "Connected to PostgreSQL server"
        except OperationalError as e:
            return f"Failed to connect to PostgreSQL server. Error: {str(e)}"

async def get_session():
    async with async_session() as session:
        yield session
