Generic single-database configuration.

# migration db
alembic revision --autogenerate -m "init"
alembic upgrade head

# downgrade
alembic downgrade -1
alembic downgrade 01547ba567cf

# reset
alembic downgrade base

# common
alembic current
alembic history --verbose
