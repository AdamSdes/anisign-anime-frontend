"""your

Revision ID: 609e9ca570f8
Revises: 3e66182de96a
Create Date: 2024-11-25 01:54:48.032100

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '609e9ca570f8'
down_revision: Union[str, None] = '3e66182de96a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
