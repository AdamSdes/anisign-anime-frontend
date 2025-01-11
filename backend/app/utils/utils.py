import bcrypt

KIND_ENUM = ["tv", "tv_special", "ona", "movie", "ova", "special"]
RATING_ENUM = ["g","pg","r_plus","r","pg_13"]
STATUS_ENUM = ["anons", "ongoing", "released"]
ANIME_SAVE_LIST_ENUM = ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"]

async def hash_password(password: str) -> str:
    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
