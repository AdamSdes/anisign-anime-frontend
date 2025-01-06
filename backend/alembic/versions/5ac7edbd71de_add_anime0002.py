"""add anime0002

Revision ID: 5ac7edbd71de
Revises: 
Create Date: 2025-01-06 02:43:34.315943

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5ac7edbd71de'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('anime',
    sa.Column('anime_id', sa.String(), nullable=False),
    sa.Column('english', sa.String(), nullable=False),
    sa.Column('russian', sa.String(), nullable=False),
    sa.Column('kind', sa.String(), nullable=False),
    sa.Column('rating', sa.String(), nullable=True),
    sa.Column('score', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('episodes', sa.Integer(), nullable=False),
    sa.Column('episodesAired', sa.Integer(), nullable=True),
    sa.Column('duration', sa.Integer(), nullable=True),
    sa.Column('aired_on', sa.Date(), nullable=True),
    sa.Column('released_on', sa.Date(), nullable=True),
    sa.Column('season', sa.String(), nullable=True),
    sa.Column('poster_url', sa.String(), nullable=False),
    sa.Column('createdAt', sa.Date(), nullable=True),
    sa.Column('updatedAt', sa.Date(), nullable=True),
    sa.Column('nextEpisodeAt', sa.Date(), nullable=True),
    sa.Column('isCensored', sa.Boolean(), nullable=True),
    sa.Column('screenshots', sa.ARRAY(sa.Text()), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('genre_ids', sa.ARRAY(sa.Text()), nullable=True),
    sa.Column('related_anime_ids', sa.ARRAY(sa.Text()), nullable=True),
    sa.Column('character_ids', sa.ARRAY(sa.Text()), nullable=True),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_anime_aired_on'), 'anime', ['aired_on'], unique=False)
    op.create_index(op.f('ix_anime_anime_id'), 'anime', ['anime_id'], unique=True)
    op.create_index(op.f('ix_anime_createdAt'), 'anime', ['createdAt'], unique=False)
    op.create_index(op.f('ix_anime_description'), 'anime', ['description'], unique=False)
    op.create_index(op.f('ix_anime_duration'), 'anime', ['duration'], unique=False)
    op.create_index(op.f('ix_anime_english'), 'anime', ['english'], unique=True)
    op.create_index(op.f('ix_anime_episodes'), 'anime', ['episodes'], unique=False)
    op.create_index(op.f('ix_anime_episodesAired'), 'anime', ['episodesAired'], unique=False)
    op.create_index(op.f('ix_anime_isCensored'), 'anime', ['isCensored'], unique=False)
    op.create_index(op.f('ix_anime_kind'), 'anime', ['kind'], unique=False)
    op.create_index(op.f('ix_anime_nextEpisodeAt'), 'anime', ['nextEpisodeAt'], unique=False)
    op.create_index(op.f('ix_anime_poster_url'), 'anime', ['poster_url'], unique=False)
    op.create_index(op.f('ix_anime_rating'), 'anime', ['rating'], unique=False)
    op.create_index(op.f('ix_anime_released_on'), 'anime', ['released_on'], unique=False)
    op.create_index(op.f('ix_anime_russian'), 'anime', ['russian'], unique=True)
    op.create_index(op.f('ix_anime_score'), 'anime', ['score'], unique=False)
    op.create_index(op.f('ix_anime_season'), 'anime', ['season'], unique=False)
    op.create_index(op.f('ix_anime_status'), 'anime', ['status'], unique=False)
    op.create_index(op.f('ix_anime_updatedAt'), 'anime', ['updatedAt'], unique=False)
    op.create_table('character',
    sa.Column('character_id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('russian', sa.String(), nullable=False),
    sa.Column('japanese', sa.String(), nullable=True),
    sa.Column('poster_url', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_character_character_id'), 'character', ['character_id'], unique=True)
    op.create_index(op.f('ix_character_description'), 'character', ['description'], unique=False)
    op.create_index(op.f('ix_character_japanese'), 'character', ['japanese'], unique=False)
    op.create_index(op.f('ix_character_name'), 'character', ['name'], unique=True)
    op.create_index(op.f('ix_character_poster_url'), 'character', ['poster_url'], unique=False)
    op.create_index(op.f('ix_character_russian'), 'character', ['russian'], unique=True)
    op.create_table('genre',
    sa.Column('genre_id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('russian', sa.String(), nullable=True),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_genre_genre_id'), 'genre', ['genre_id'], unique=True)
    op.create_index(op.f('ix_genre_name'), 'genre', ['name'], unique=True)
    op.create_index(op.f('ix_genre_russian'), 'genre', ['russian'], unique=True)
    op.create_table('users',
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('nickname', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('user_avatar', sa.String(), nullable=True),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_nickname'), 'users', ['nickname'], unique=True)
    op.create_index(op.f('ix_users_password'), 'users', ['password'], unique=False)
    op.create_index(op.f('ix_users_user_avatar'), 'users', ['user_avatar'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_user_avatar'), table_name='users')
    op.drop_index(op.f('ix_users_password'), table_name='users')
    op.drop_index(op.f('ix_users_nickname'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_genre_russian'), table_name='genre')
    op.drop_index(op.f('ix_genre_name'), table_name='genre')
    op.drop_index(op.f('ix_genre_genre_id'), table_name='genre')
    op.drop_table('genre')
    op.drop_index(op.f('ix_character_russian'), table_name='character')
    op.drop_index(op.f('ix_character_poster_url'), table_name='character')
    op.drop_index(op.f('ix_character_name'), table_name='character')
    op.drop_index(op.f('ix_character_japanese'), table_name='character')
    op.drop_index(op.f('ix_character_description'), table_name='character')
    op.drop_index(op.f('ix_character_character_id'), table_name='character')
    op.drop_table('character')
    op.drop_index(op.f('ix_anime_updatedAt'), table_name='anime')
    op.drop_index(op.f('ix_anime_status'), table_name='anime')
    op.drop_index(op.f('ix_anime_season'), table_name='anime')
    op.drop_index(op.f('ix_anime_score'), table_name='anime')
    op.drop_index(op.f('ix_anime_russian'), table_name='anime')
    op.drop_index(op.f('ix_anime_released_on'), table_name='anime')
    op.drop_index(op.f('ix_anime_rating'), table_name='anime')
    op.drop_index(op.f('ix_anime_poster_url'), table_name='anime')
    op.drop_index(op.f('ix_anime_nextEpisodeAt'), table_name='anime')
    op.drop_index(op.f('ix_anime_kind'), table_name='anime')
    op.drop_index(op.f('ix_anime_isCensored'), table_name='anime')
    op.drop_index(op.f('ix_anime_episodesAired'), table_name='anime')
    op.drop_index(op.f('ix_anime_episodes'), table_name='anime')
    op.drop_index(op.f('ix_anime_english'), table_name='anime')
    op.drop_index(op.f('ix_anime_duration'), table_name='anime')
    op.drop_index(op.f('ix_anime_description'), table_name='anime')
    op.drop_index(op.f('ix_anime_createdAt'), table_name='anime')
    op.drop_index(op.f('ix_anime_anime_id'), table_name='anime')
    op.drop_index(op.f('ix_anime_aired_on'), table_name='anime')
    op.drop_table('anime')
    # ### end Alembic commands ###
