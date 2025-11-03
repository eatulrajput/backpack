import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/astra_db")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key")
JWT_ACCESS_TOKEN_EXPIRES = True  # Enables token expiration
JWT_REFRESH_TOKEN_EXPIRES = True # Enables refresh token expiration
