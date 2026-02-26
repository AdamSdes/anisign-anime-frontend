# AnimeSaveList — Система списков сохранённых аниме

## Модель (SQLAlchemy)

**Таблица:** `anime_save_list`

| Поле | Тип | Описание |
|---|---|---|
| `id` | `UUID` (PK, из BaseTable) | Уникальный идентификатор записи |
| `list_name` | `String`, indexed | Название списка (одно из 5 фиксированных значений) |
| `anime_ids` | `ARRAY(Text)`, default `[]` | Массив `anime_id` (строковых идентификаторов аниме из внешнего API, **не UUID**) |
| `user_id` | `UUID`, FK → `users.id`, ON DELETE CASCADE | Владелец списка |

**Связи:** `user = relationship('User', backref='anime_save_lists')`

## Допустимые имена списков (enum)

Определены в `app/utils/utils.py` как `ANIME_SAVE_LIST_ENUM`:

```
["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"]
```

## Архитектура

Трёхслойная: **Router → Service → Repository**. Все слои async. DB-сессия инжектится через FastAPI `Depends(get_session)`. Аутентификация — через `Depends(get_current_user_from_token)`.

---

## Эндпоинты (prefix: `/anime_save_list`)

### 1. `POST /create-anime-save-list/{list_name}`

- **Auth:** Требуется токен
- **Path param:** `list_name` — значение из `ANIME_SAVE_LIST_ENUM`
- **Логика:** Создаёт пустой список с `anime_ids=[]` для текущего юзера. Если список с таким именем уже существует у юзера — возвращает `400`
- **Response:** `AnimeSaveListResponse`

### 2. `DELETE /delete-anime-list-all`

- **Auth:** Требуется токен
- **Логика:** Удаляет **все** списки текущего юзера (все 5). Прямой `DELETE WHERE user_id = ...`
- **Response:** `{"message": "All anime lists deleted successfully"}`

### 3. `GET /get-all-anime-lists/user/{user_id}`

- **Auth:** Не требуется (публичный)
- **Path param:** `user_id` (UUID)
- **Логика:** Возвращает все списки указанного юзера
- **Response:** `List[AnimeSaveListResponse]`

### 4. `GET /get-anime-list-by-name/{list_name}/user/{user_id}`

- **Auth:** Не требуется (публичный)
- **Path params:** `list_name` (из enum), `user_id` (UUID)
- **Логика:** Возвращает один конкретный список. Если не найден — `404`
- **Response:** `AnimeSaveListResponse`

### 5. `GET /get-anime-list-status/{anime_id}`

- **Auth:** Требуется токен
- **Path param:** `anime_id` (string — ID аниме из внешнего API)
- **Логика:** Перебирает **все** списки юзера в Python-коде, ищет в каком `anime_ids` содержится данный `anime_id`. Возвращает `in_list: true/false` + `list_name`
- **Response:** `AnimeSaveListStatusResponse`

### 6. `PUT /put-anime-id-in-list/{list_name}?anime_id=...`

- **Auth:** Требуется токен
- **Path param:** `list_name` (из enum)
- **Query param:** `anime_id` (string)
- **Логика (ключевая):**
  1. Загружает **все** списки юзера
  2. Удаляет `anime_id` из **всех** списков где он есть (аниме может быть только в одном списке)
  3. Добавляет `anime_id` в целевой список (`target_list.anime_ids + [anime_id]`)
  4. Если целевой список не найден — возвращает `404`
- **Response:** `AnimeSaveListResponse` (обновлённый целевой список)

### 7. `DELETE /delete-anime-id-from-list?anime_id=...`

- **Auth:** Требуется токен
- **Query param:** `anime_id` (string)
- **Логика:** Перебирает все списки юзера, находит список содержащий `anime_id`, удаляет его оттуда. Если не найден ни в одном — `404`
- **Response:** `AnimeSaveListResponse` (список из которого удалили)

---

## Pydantic-схемы (в `app/schemas/anime_schemas.py`)

```python
class AnimeShort(BaseModel):           # anime_id, english, russian, poster_url, score: Optional[float]
class AnimeSaveListResponse(BaseModel): # id, list_name, anime_ids: List[str], animes: List[AnimeShort], user_id
class AnimeSaveListStatusResponse:      # anime_id, list_name: Optional[str], in_list: bool
class AnimeSaveListUpdate:              # anime_ids: List[str]  (не используется в текущих эндпоинтах)
```

## Обогащение данных (AnimeShort)

При возврате любого списка (`AnimeSaveListResponse`) сервис автоматически подгружает данные аниме:
- `AnimeSaveListService._enrich_save_list()` берёт `anime_ids` из списка
- Делает один SQL-запрос `WHERE anime_id IN (...)` через `AnimeRepository.get_animes_by_ids()`
- Заполняет поле `animes: List[AnimeShort]` — фронту не нужно делать отдельные запросы на каждое аниме
- Поля в `AnimeShort`: `anime_id`, `english`, `russian`, `poster_url`, `score`

## Инициализация списков

`AnimeSaveListRepository.initialize_anime_save_lists(user_id)` — создаёт все 5 списков для нового юзера. Вызывается из сервиса, предположительно при регистрации.

## Важные особенности

- **Аниме может быть только в одном списке** — при добавлении в список, оно автоматически удаляется из всех остальных
- `anime_ids` хранит **строковые ID** из внешнего API (Shikimori), а **не UUID** из таблицы `anime`
- Поиск аниме в списках делается в Python-коде (итерация по всем спискам), а не SQL-запросом по массиву
- Каждый список — отдельная строка в таблице (у юзера 5 строк = 5 списков)
- **Списки возвращают полные данные аниме** (`animes: List[AnimeShort]`) — обогащение через `AnimeRepository.get_animes_by_ids()` в один SQL-запрос
