import uuid
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.types import TypeDecorator

class GUID(TypeDecorator):
    """Platform-independent GUID type for use with UUIDs."""

    impl = CHAR(36)

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return str(value)
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(value)
