"""The base of every request and response model: camelCase in JSON, snake_case in Python.

One naming rule for all JSON, so the frontend's generated client and the API agree on
every field name without anyone choosing one. `populate_by_name` lets Python code build a
model with its own field names; `from_attributes` lets a model be read from an ORM row.
"""

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    """Inherit from this, never from `BaseModel`, for anything the API reads or returns."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
