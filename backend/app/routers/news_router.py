from fastapi import APIRouter, Query
from typing import List
from app.schemas.news_schemas import NewsBaseSchema
from app.services.news_parser import get_news, PAGE_SIZE, parse_news

news_router = APIRouter()

@news_router.get("/", response_model=List[NewsBaseSchema])
async def get_news_list(page: int):
    return await get_news(page)

