# app/services/db_error_handler.py

from functools import wraps
from flask import jsonify
from pymongo.errors import PyMongoError

def catch_db_errors(fn):
    """
    Decorator to catch PyMongo exceptions and return JSON error response.
    Use on route functions performing DB operations.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except PyMongoError as e:
            # Optionally, log error here
            return jsonify({"error": f"Database error: {str(e)}"}), 500
    return wrapper
