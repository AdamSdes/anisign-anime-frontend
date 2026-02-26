from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
import asyncio
import os

# Це об'єкт конфігурації Alembic, який надає доступ до значень у файлі .ini, що використовується.
config = context.config

# Інтерпретація файлу конфігурації для Python логування.
# Цей рядок налаштовує логери.
fileConfig(config.config_file_name)

# Додайте об'єкт MetaData вашої моделі тут для підтримки 'autogenerate'
from app.db.models import (
    User, Anime, Genre, Character, AnimeSaveList,
    Comment, ViewHistory, AnimeCurrentEpisode,
    UserFriendList, FriendRequest
)
from app.db.base_models import BaseTable  # Переконайтеся, що цей імпорт правильний
target_metadata = BaseTable.metadata

def get_url():
    """Побудова URL з змінних оточення або fallback на alembic.ini."""
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_name = os.getenv("DB_NAME")
    if db_user and db_password and db_host and db_name:
        return f"postgresql+asyncpg://{db_user}:{db_password}@{db_host}:5432/{db_name}"
    return config.get_main_option("sqlalchemy.url")

def run_migrations_offline():
    """Запуск міграцій в 'offline' режимі."""
    url = get_url()
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Запуск міграцій в 'online' режимі."""
    connectable = create_async_engine(
        get_url(),
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

def do_run_migrations(connection):
    context.configure(
        connection=connection, target_metadata=target_metadata
    )

    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())