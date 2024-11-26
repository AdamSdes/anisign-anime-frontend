"""merge heads

Revision ID: 17d288c55dd4
Revises: 609e9ca570f8, 6210140c4086
Create Date: 2024-11-25 01:58:55.624311

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17d288c55dd4'
down_revision: Union[str, None] = ('609e9ca570f8', '6210140c4086')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
