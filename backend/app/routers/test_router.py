from fastapi import APIRouter
import logging
from app.db.postgresql_connection import check_connection
from app.db.redis_connection import check_redis_connection


logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s', filename='app.log')
health_check_router = APIRouter()


@health_check_router.get("/")
async def health_check():
    logging.info("Health check started")
    postgres = await check_connection()
    redis = await check_redis_connection()
    return {
        "status_code": 200,
        "detail": "ok",
        "postgres": f"{postgres}",
        "redis": f"{redis}"
    }
    