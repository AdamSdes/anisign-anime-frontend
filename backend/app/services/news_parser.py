import requests
from bs4 import BeautifulSoup
from typing import List
from app.schemas.news_schemas import NewsBaseSchema

PAGE_SIZE = 10  # вертає за запит

async def parse_news() -> List[NewsBaseSchema]:
    results = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    for x in range(1, 6):
        url = f"https://www.goha.ru/anime?page={x}"
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        articles = soup.select(".article-snippet")

        for article in articles:
            title = article.select_one(".article-snippet__body-title").text.strip()
            link = article.select_one(".article-snippet__body-title a")["href"]
            full_link = f"https://www.goha.ru{link}" if link.startswith("/") else link
            text = article.select_one(".article-snippet__body-shortly-label").text.strip()
            date = article.select_one("span.article-snippet__body-date-label").text.strip()
            img = article.select_one(".article-snippet__image-wrapper img")["src"]
            

            results.append(NewsBaseSchema(
                title=title,
                link=full_link,
                img=img,
                text=text,
                date=date
            ))

    return results

 
async def get_news(page: int = 1) -> List[NewsBaseSchema]:
    all_news = await parse_news()
    start_index = (page - 1) * PAGE_SIZE
    end_index = start_index + PAGE_SIZE
    return all_news[start_index:end_index]