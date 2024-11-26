"""your

Revision ID: 908f2d6e077d
Revises: e25b89797472
Create Date: 2024-11-25 01:47:22.212291

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '908f2d6e077d'
down_revision: Union[str, None] = 'e25b89797472'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
