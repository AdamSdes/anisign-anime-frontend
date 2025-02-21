from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_repository import AnimeRepository
from app.repositories.genre_repository import GenreRepository
from app.core.config import Settings
import requests
import json
import time
from fastapi import Depends ,Query ,Path ,Body
from typing import List
import logging
from fastapi import HTTPException
from datetime import datetime
from uuid import UUID

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnimeService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.anime_repository = AnimeRepository(db)
        self.genre_repository = GenreRepository(db)
    
    async def get_anime_list(self, page: int, limit: int):
        result = await self.anime_repository.get_anime_list(page, limit)
        return result
    
    async def delete_all(self):
        return await self.anime_repository.delete_all()
    
    async def get_anime_by_id(self, anime_id: str):
        return await self.anime_repository.get_anime_by_id(anime_id)
    
    
    async def parse_page_animes(self, page_num):
        animes = []
        base_url = "https://shikimori.one/api/graphql"
        
        headers = {
            'User-Agent': 'AnimeParser/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        query = f"""
        {{
            animes(page: {page_num}, limit: 50) {{
                id
                malId
                name
                russian
                licenseNameRu
                english
                japanese
                synonyms
                kind
                rating
                score
                status
                episodes
                episodesAired
                duration
                airedOn {{
                    year
                    month
                    day
                    date
                }}
                releasedOn {{
                    year
                    month
                    day
                    date
                }}
                season
                poster {{
                    id
                    originalUrl
                    mainUrl
                }}
                fansubbers
                fandubbers
                licensors
                createdAt
                updatedAt
                nextEpisodeAt
                isCensored
                genres {{
                    id
                    name
                    russian
                    kind
                }}
                studios {{
                    id
                    name
                    imageUrl
                }}
                externalLinks {{
                    id
                    kind
                    url
                    createdAt
                    updatedAt
                }}
                personRoles {{
                    id
                    rolesRu
                    rolesEn
                    person {{
                        id
                        name
                        poster {{
                            id
                        }}
                    }}
                }}
                characterRoles {{
                    id
                    rolesRu
                    rolesEn
                    character {{
                        id
                        name
                        poster {{
                            id
                        }}
                    }}
                }}
                related {{
                    id
                    anime {{
                        id
                        name
                    }}
                    manga {{
                        id
                        name
                    }}
                    relationKind
                    relationText
                }}
                videos {{
                    id
                    url
                    name
                    kind
                    playerUrl
                    imageUrl
                }}
                screenshots {{
                    id
                    originalUrl
                    x166Url
                    x332Url
                }}
                scoresStats {{
                    score
                    count
                }}
                statusesStats {{
                    status
                    count
                }}
                description
                descriptionHtml
                descriptionSource
            }}
        }}
        """

        try:
            response = requests.post(
                base_url,
                headers=headers,
                json={'query': query}
            )
            response.raise_for_status()
            
            data = response.json()
            if data["data"]["animes"]:
                for anime in data["data"]["animes"]:
                    character_ids = [character["character"]["id"] for character in anime.get("characterRoles", []) if character.get("character")]
                    related_anime_texts = [related["relationText"] for related in anime.get("related", []) if related.get("anime")]
                    related_anime_ids = [related["anime"]["id"] for related in anime.get("related", []) if related.get("anime")]
                    genres = [{"genre_id": genre["id"], "name": genre["name"], "russian": genre["russian"]} for genre in anime["genres"]]
                    poster_url = anime["poster"]["originalUrl"] if anime["poster"] is not None else None
                    
                    
                    transformed_anime = {
                        "anime_id": anime["id"],
                        "english": anime["english"],
                        "russian": anime["russian"],
                        "kind": anime["kind"],
                        "rating": anime["rating"],
                        "score": anime["score"],
                        "status": anime["status"],
                        "episodes": anime["episodes"],
                        "episodesAired": anime["episodesAired"],
                        "duration": anime["duration"],
                        "aired_on": f"{anime['airedOn']['year']}-{anime['airedOn']['month']}-{anime['airedOn']['day']}" if anime["airedOn"] else None,
                        "released_on": f"{anime['releasedOn']['year']}-{anime['releasedOn']['month']}-{anime['releasedOn']['day']}" if anime["releasedOn"] else None,
                        "season": anime["season"],
                        "poster_url": poster_url,
                        "createdAt": anime["createdAt"],
                        "updatedAt": anime["updatedAt"],
                        "nextEpisodeAt": anime["nextEpisodeAt"],
                        "isCensored": anime["isCensored"],
                        "screenshots": [s["originalUrl"] for s in anime["screenshots"]],
                        "description": anime["description"],
                        "genres": genres,
                        "related_anime_ids": related_anime_ids,
                        "related_anime_texts": related_anime_texts,
                        "character_ids": character_ids
                    }
                    animes.append(transformed_anime)
                logger.info(f"Page {page_num} fetched")
                print(f"Page {page_num} fetched")
                

                time.sleep(0.5)
                return animes        
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Error occurred: {e}")
            return None
    
    async def save_anime_list_in_db(self):
        for x in range(1, 500):
            animes = await self.parse_page_animes(x)
            if animes:
                for anime in animes:
                    genre_ids = []
                    genres = anime.pop("genres")
                    for genre in genres:
                        await self.genre_repository.create_genre_if_not_exists(genre)
                        genre_id = genre["genre_id"]
                        genre_ids.append(genre_id)
                    anime["genre_ids"] = genre_ids
                await self.anime_repository.save_anime_list(animes)
                logger.info(f"Anime list saved successfully page {x}")
            else:
                logger.info("No animes found")
                return {'message':"Anime list not saved"}
        return {'message':"Anime list saved successfully"}
    
    async def get_anime_by_name(self, name: str):
        result = await self.anime_repository.get_anime_by_name(name)
        return result
    
    async def get_anime_by_genre(self, genre_id: str, page: int, limit: int):
        result = await self.anime_repository.get_anime_by_genre(genre_id, page, limit)
        if not result:
            raise HTTPException(status_code=404, detail="No anime found")
        return result
    
    async def get_anime_list_by_kind(self, kind: str, page: int, limit: int):
        result = await self.anime_repository.get_anime_list_by_kind(kind, page, limit)
        if not result:
            raise HTTPException(status_code=404, detail="No anime found")
        return result
    
    async def get_anime_list_by_rating(self, rating: str, page: int, limit: int):
        result = await self.anime_repository.get_anime_list_by_rating(rating, page, limit)
        if not result:
            raise HTTPException(status_code=404, detail="No anime found")
        return result
    
    async def get_anime_list_by_status(self, status: str, page: int, limit: int):
        result = await self.anime_repository.get_anime_list_by_status(status, page, limit)
        if not result:
            raise HTTPException(status_code=404, detail="No anime found")
        return result
    
    async def get_anime_by_year_range(self, start_year: int, end_year: int):
        result = await self.anime_repository.get_anime_by_year_range(start_year, end_year)
        if not result:
            raise HTTPException(status_code=404, detail="No anime found")
        return result
    
    async def get_anime_list_filtered(self, genre_id: List[str], kind: str = None, rating: str = None, status: str = None, start_year: int = None, end_year: int = None, page: int = 1, limit: int = 10, sort_by: str = None, sort_order: str = 'asc', filter_by_score: bool = False, filter_by_date: bool = False, filter_by_name: bool = False):
        genre_ids_list = list(set(genre_id)) if genre_id is not None else []
        result = await self.anime_repository.get_anime_list_filtered(genre_ids_list, kind, rating, status, start_year, end_year, page, limit, sort_by, sort_order , filter_by_score, filter_by_date, filter_by_name)
        if not result:
            raise HTTPException(status_code=404, detail="No anime found")
        return result
    
    async def get_all_kinds(self):
        result = await self.anime_repository.get_all_kinds()
        return result
    
    async def get_all_ratings(self):
        result = await self.anime_repository.get_all_ratings()
        return result
        
        
    async def get_current_episode(self, anime_id: UUID, user_id: UUID):
        result = await self.anime_repository.get_current_episode(anime_id, user_id)
        return result
    
    async def update_current_episode(self, anime_id: UUID, user_id: UUID, episode_number: int):
        result = await self.anime_repository.update_current_episode(anime_id, user_id, episode_number)
        return result