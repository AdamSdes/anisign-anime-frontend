from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.services.anime_service import AnimeService  # заміни на свій сервіс
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()

def start_scheduler(anime_service: AnimeService):
    scheduler.add_job(
        anime_service.save_anime_list_in_db,
        trigger=IntervalTrigger(hours=3),  # Кожні 3 години
        id="update_anime_db",
        name="Update anime database from Shikimori API",
        replace_existing=True,
        next_run_time=datetime.utcnow(),
    )

    scheduler.start()
    logger.info("Anime DB update scheduler started.")