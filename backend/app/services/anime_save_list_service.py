from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_save_list_repository import AnimeSaveListRepository
from app.repositories.anime_repository import AnimeRepository
from app.repositories.genre_repository import GenreRepository
from uuid import UUID
import logging
import httpx
from fastapi import HTTPException
from app.db.models import AnimeSaveList
from typing import List, Optional
from datetime import datetime
from dateutil import parser as dateutil_parser

logger = logging.getLogger(__name__)

SHIKIMORI_GRAPHQL_URL = "https://shikimori.one/api/graphql"
SHIKIMORI_HEADERS = {
    "User-Agent": "AnimeParser/1.0",
    "Accept": "application/json",
    "Content-Type": "application/json",
}


class AnimeSaveListService:

    def __init__(self, db: AsyncSession):
        self.anime_save_list_repository = AnimeSaveListRepository(db)
        self.anime_repository = AnimeRepository(db)
        self.genre_repository = GenreRepository(db)

    async def _fetch_single_anime_from_shikimori(self, anime_id: str) -> Optional[dict]:
        """Fetch a single anime from Shikimori GraphQL API by its ID."""
        query = """
        {
            animes(ids: "%s", limit: 1) {
                id
                name
                russian
                english
                kind
                rating
                score
                status
                episodes
                episodesAired
                duration
                airedOn { year month day date }
                releasedOn { year month day date }
                season
                poster { id originalUrl mainUrl }
                createdAt
                updatedAt
                nextEpisodeAt
                isCensored
                genres { id name russian kind }
                characterRoles { id character { id } }
                related { id anime { id name } relationText }
                screenshots { id originalUrl }
                description
            }
        }
        """ % anime_id

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    SHIKIMORI_GRAPHQL_URL,
                    headers=SHIKIMORI_HEADERS,
                    json={"query": query},
                )
                response.raise_for_status()

            data = response.json()
            animes = data.get("data", {}).get("animes", [])
            if not animes:
                logger.warning(f"Anime {anime_id} not found on Shikimori")
                return None

            anime = animes[0]
            character_ids = [
                c["character"]["id"]
                for c in anime.get("characterRoles", [])
                if c.get("character")
            ]
            related_anime_ids = [
                r["anime"]["id"]
                for r in anime.get("related", [])
                if r.get("anime")
            ]
            related_anime_texts = [
                r["relationText"]
                for r in anime.get("related", [])
                if r.get("anime")
            ]
            genres = [
                {"genre_id": g["id"], "name": g["name"], "russian": g["russian"]}
                for g in anime.get("genres", [])
            ]
            poster_url = (
                anime["poster"]["originalUrl"] if anime.get("poster") else None
            )

            transformed = {
                "anime_id": anime["id"],
                "english": anime.get("english") or anime.get("name", ""),
                "russian": anime.get("russian") or anime.get("name", ""),
                "kind": anime.get("kind", ""),
                "rating": anime.get("rating"),
                "score": anime.get("score"),
                "status": anime.get("status", ""),
                "episodes": anime.get("episodes", 0),
                "episodesAired": anime.get("episodesAired"),
                "duration": anime.get("duration"),
                "aired_on": (
                    f"{anime['airedOn']['year']}-{anime['airedOn']['month']}-{anime['airedOn']['day']}"
                    if anime.get("airedOn") and anime["airedOn"].get("year")
                    else None
                ),
                "released_on": (
                    f"{anime['releasedOn']['year']}-{anime['releasedOn']['month']}-{anime['releasedOn']['day']}"
                    if anime.get("releasedOn") and anime["releasedOn"].get("year")
                    else None
                ),
                "season": anime.get("season"),
                "poster_url": poster_url or "",
                "createdAt": anime.get("createdAt"),
                "updatedAt": anime.get("updatedAt"),
                "nextEpisodeAt": anime.get("nextEpisodeAt"),
                "isCensored": anime.get("isCensored"),
                "screenshots": [s["originalUrl"] for s in anime.get("screenshots", [])],
                "description": anime.get("description"),
                "related_anime_ids": related_anime_ids,
                "related_anime_texts": related_anime_texts,
                "character_ids": character_ids,
                "genres": genres,
            }
            return transformed

        except Exception as e:
            logger.error(f"Failed to fetch anime {anime_id} from Shikimori: {e}")
            return None

    async def _ensure_anime_in_db(self, anime_id: str) -> None:
        """Check if anime exists in local DB; if not, fetch from Shikimori and save."""
        existing = await self.anime_repository.get_anime_by_id(anime_id)
        if existing:
            return

        logger.info(f"Anime {anime_id} not in local DB, fetching from Shikimori...")
        anime_data = await self._fetch_single_anime_from_shikimori(anime_id)
        if not anime_data:
            logger.warning(f"Could not import anime {anime_id} from Shikimori")
            return

        # Save genres first
        genres = anime_data.pop("genres", [])
        genre_ids = []
        for genre in genres:
            await self.genre_repository.create_genre_if_not_exists(genre)
            genre_ids.append(genre["genre_id"])
        anime_data["genre_ids"] = genre_ids

        # Save the anime using existing repository method
        await self.anime_repository.save_anime_list([anime_data])
        logger.info(f"Anime {anime_id} imported from Shikimori successfully")

    async def _enrich_save_list(self, save_list: AnimeSaveList) -> dict:
        """Enrich a save list with full anime data (AnimeShort)."""
        animes = []
        if save_list.anime_ids:
            animes = await self.anime_repository.get_animes_by_ids(save_list.anime_ids)
        return {
            "id": save_list.id,
            "list_name": save_list.list_name,
            "anime_ids": save_list.anime_ids or [],
            "animes": animes,
            "user_id": save_list.user_id,
        }

    async def initialize_anime_save_lists(self, user_id: UUID):
        return await self.anime_save_list_repository.initialize_anime_save_lists(user_id)

    async def create_anime_save_list(self, list_name: str, current_user_id: UUID) -> dict:
        # Check if list already exists
        existing = await self.anime_save_list_repository.get_anime_save_list_by_name(list_name, current_user_id)
        if existing:
            raise HTTPException(status_code=400, detail=f"List '{list_name}' already exists")
        save_list = await self.anime_save_list_repository.create_anime_save_list(list_name, current_user_id)
        return await self._enrich_save_list(save_list)

    async def delete_anime_list(self, current_user_id: UUID):
        return await self.anime_save_list_repository.delete_anime_list(current_user_id)

    async def get_anime_save_list_by_name(self, list_name: str, user_id: UUID) -> dict:
        result = await self.anime_save_list_repository.get_anime_save_list_by_name(list_name, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="List not found")
        return await self._enrich_save_list(result)

    async def get_all_anime_save_lists(self, user_id: UUID) -> List[dict]:
        save_lists = await self.anime_save_list_repository.get_all_anime_save_lists(user_id)
        return [await self._enrich_save_list(sl) for sl in save_lists]

    async def get_anime_list_status(self, anime_id: str, user_id: UUID) -> Optional[AnimeSaveList]:
        return await self.anime_save_list_repository.get_anime_list_status(anime_id, user_id)

    async def put_anime_id_in_list(self, list_name: str, anime_id: str, current_user_id: UUID) -> dict:
        # Ensure anime exists in local DB before adding to list
        await self._ensure_anime_in_db(anime_id)

        result = await self.anime_save_list_repository.put_anime_id_in_list(list_name, anime_id, current_user_id)
        if not result:
            raise HTTPException(status_code=404, detail=f"List '{list_name}' not found")
        return await self._enrich_save_list(result)

    async def delete_anime_id_from_list(self, anime_id: str, current_user_id: UUID) -> dict:
        result = await self.anime_save_list_repository.delete_anime_id_from_list(anime_id, current_user_id)
        if not result:
            raise HTTPException(status_code=404, detail="Anime not found in any list")
        return await self._enrich_save_list(result)
