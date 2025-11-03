from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt
from flask import jsonify

def role_required(allowed_roles):
    """
    Decorator for protecting routes by role.
    Uses role claim embedded in JWT token to avoid repeated DB queries.
    Usage: @role_required({'student', 'faculty', 'admin'})
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get("role")
            if not user_role or user_role not in allowed_roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
