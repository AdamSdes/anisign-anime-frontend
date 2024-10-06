from fastapi import APIRouter
import logging

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s', filename='app.log')
health_check_router = APIRouter()


@health_check_router.get("/")
async def health_check():
    logging.info("Health check started")
    return {
        "status_code": 200,
        "detail": "ok",
    }