"""your

Revision ID: 6210140c4086
Revises: abd6cf96baef
Create Date: 2024-11-25 01:49:45.736357

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6210140c4086'
down_revision: Union[str, None] = 'abd6cf96baef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
