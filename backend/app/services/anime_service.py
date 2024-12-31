from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.anime_repository import AnimeRepository
from app.core.config import Settings
import requests
import json
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnimeService:
    
    settings = Settings()
    def __init__(self, db: AsyncSession):
        self.anime_repository = AnimeRepository(db)
    
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
                        "poster_url": anime["poster"]["originalUrl"],
                        "createdAt": anime["createdAt"],
                        "updatedAt": anime["updatedAt"],
                        "nextEpisodeAt": anime["nextEpisodeAt"],
                        "isCensored": anime["isCensored"],
                        "screenshots": [s["originalUrl"] for s in anime["screenshots"]],
                        "description": anime["description"]
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
        for x in range(1, 10):
            animes = await self.parse_page_animes(x)
            if animes:
                logger.info(f"Animes found: {animes[0]['anime_id']}")
                await self.anime_repository.save_anime_list(animes)
                logger.info({'message':f"Anime list saved successfully page {x}"})
            else:
                logger.info("No animes found")
                return {'message':"Anime list not saved"}
        return {'message':"Anime list saved successfully"}
        
        
        # for num in range(1, 2):
        #     get_suka_list_anime(num)


    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        # api_token = self.settings.api_token
        # url = f"https://kodikapi.com/list?token={api_token}&limit=100"
        # response_total = requests.get(url)
        # total = json.loads(response_total.text)["total"]
        # items = []
        
        # while len(items) < total:
        #     response = requests.get(url)
        #     data = json.loads(response.text)
            
        #     items.extend(data["results"])
            
        #     if "next_page" in data and data["next_page"]:
        #         url = data["next_page"]
        #     else:
        #         break
        
        # result = await self.anime_repository.save_anime_list(items)
        # return {"message": f"{result}" , "total": f"{total}"}
        
            
        
        
        
        
