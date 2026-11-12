"""Initial identity, revisions, settings, media and audit models.

Revision ID: 0001
Revises:
"""
from alembic import op
from app.db import Base
from app import models  # noqa: F401
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    Base.metadata.create_all(bind=op.get_bind())

def downgrade():
    # Reversible only for disposable development data. Never downgrade production automatically.
    Base.metadata.drop_all(bind=op.get_bind())
