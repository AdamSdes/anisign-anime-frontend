"""anime001

Revision ID: 237ab3d42087
Revises: b67ac3437777
Create Date: 2024-11-25 02:04:07.705656

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '237ab3d42087'
down_revision: Union[str, None] = 'b67ac3437777'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('anime', sa.Column('year', sa.Integer(), nullable=True))
    op.add_column('anime', sa.Column('created_at', sa.String(), nullable=True))
    op.add_column('anime', sa.Column('last_season', sa.Integer(), nullable=True))
    op.add_column('anime', sa.Column('last_episode', sa.Integer(), nullable=True))
    op.add_column('anime', sa.Column('episodes_count', sa.Integer(), nullable=True))
    op.add_column('anime', sa.Column('imdb_id', sa.String(), nullable=True))
    op.add_column('anime', sa.Column('shikimori_id', sa.String(), nullable=True))
    op.add_column('anime', sa.Column('quality', sa.String(), nullable=True))
    op.add_column('anime', sa.Column('other_title', sa.String(), nullable=True))
    op.add_column('anime', sa.Column('link', sa.String(), nullable=True))
    op.add_column('anime', sa.Column('id_kodik', sa.String(), nullable=True))
    op.create_index(op.f('ix_anime_created_at'), 'anime', ['created_at'], unique=False)
    op.create_index(op.f('ix_anime_episodes_count'), 'anime', ['episodes_count'], unique=False)
    op.create_index(op.f('ix_anime_id_kodik'), 'anime', ['id_kodik'], unique=False)
    op.create_index(op.f('ix_anime_imdb_id'), 'anime', ['imdb_id'], unique=False)
    op.create_index(op.f('ix_anime_last_episode'), 'anime', ['last_episode'], unique=False)
    op.create_index(op.f('ix_anime_last_season'), 'anime', ['last_season'], unique=False)
    op.create_index(op.f('ix_anime_link'), 'anime', ['link'], unique=False)
    op.create_index(op.f('ix_anime_other_title'), 'anime', ['other_title'], unique=False)
    op.create_index(op.f('ix_anime_quality'), 'anime', ['quality'], unique=False)
    op.create_index(op.f('ix_anime_shikimori_id'), 'anime', ['shikimori_id'], unique=False)
    op.create_index(op.f('ix_anime_year'), 'anime', ['year'], unique=False)
    op.add_column('users', sa.Column('nickname', sa.String()))
    op.drop_index('ix_users_user_description', table_name='users')
    op.create_index(op.f('ix_users_nickname'), 'users', ['nickname'], unique=True)
    op.drop_column('users', 'user_description')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('user_description', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_index(op.f('ix_users_nickname'), table_name='users')
    op.create_index('ix_users_user_description', 'users', ['user_description'], unique=False)
    op.drop_column('users', 'nickname')
    op.drop_index(op.f('ix_anime_year'), table_name='anime')
    op.drop_index(op.f('ix_anime_shikimori_id'), table_name='anime')
    op.drop_index(op.f('ix_anime_quality'), table_name='anime')
    op.drop_index(op.f('ix_anime_other_title'), table_name='anime')
    op.drop_index(op.f('ix_anime_link'), table_name='anime')
    op.drop_index(op.f('ix_anime_last_season'), table_name='anime')
    op.drop_index(op.f('ix_anime_last_episode'), table_name='anime')
    op.drop_index(op.f('ix_anime_imdb_id'), table_name='anime')
    op.drop_index(op.f('ix_anime_id_kodik'), table_name='anime')
    op.drop_index(op.f('ix_anime_episodes_count'), table_name='anime')
    op.drop_index(op.f('ix_anime_created_at'), table_name='anime')
    op.drop_column('anime', 'id_kodik')
    op.drop_column('anime', 'link')
    op.drop_column('anime', 'other_title')
    op.drop_column('anime', 'quality')
    op.drop_column('anime', 'shikimori_id')
    op.drop_column('anime', 'imdb_id')
    op.drop_column('anime', 'episodes_count')
    op.drop_column('anime', 'last_episode')
    op.drop_column('anime', 'last_season')
    op.drop_column('anime', 'created_at')
    op.drop_column('anime', 'year')
    # ### end Alembic commands ###
