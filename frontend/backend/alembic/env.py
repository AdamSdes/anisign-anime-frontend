from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
import asyncio

# Це об'єкт конфігурації Alembic, який надає доступ до значень у файлі .ini, що використовується.
config = context.config

# Інтерпретація файлу конфігурації для Python логування.
# Цей рядок налаштовує логери.
fileConfig(config.config_file_name)

# Додайте об'єкт MetaData вашої моделі тут для підтримки 'autogenerate'
from app.db.models import User, Anime  # Переконайтеся, що ці імпорти правильні
from app.db.base_models import BaseTable  # Переконайтеся, що цей імпорт правильний
target_metadata = BaseTable.metadata

def run_migrations_offline():
    """Запуск міграцій в 'offline' режимі."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Запуск міграцій в 'online' режимі."""
    connectable = create_async_engine(
        config.get_main_option("sqlalchemy.url"),
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