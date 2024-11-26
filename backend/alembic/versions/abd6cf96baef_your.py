"""your

Revision ID: abd6cf96baef
Revises: 908f2d6e077d
Create Date: 2024-11-25 01:48:17.499949

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abd6cf96baef'
down_revision: Union[str, None] = '908f2d6e077d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
