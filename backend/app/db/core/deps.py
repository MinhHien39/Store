# app/db/deps.py
from fastapi import Depends
from sqlmodel import Session
from .session import get_read_session, get_write_session, get_worker_session

ReadDbSessionDep: Session = Depends(get_read_session)

WriteDbSessionDep: Session = Depends(get_write_session)

WorkeDbSessionDep: Session = Depends(get_worker_session)