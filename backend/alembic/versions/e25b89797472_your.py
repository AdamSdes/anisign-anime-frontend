"""your

Revision ID: e25b89797472
Revises: fe3a251f5bfa
Create Date: 2024-11-25 01:45:34.482551

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e25b89797472'
down_revision: Union[str, None] = 'fe3a251f5bfa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
