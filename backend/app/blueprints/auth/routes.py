# app/blueprints/auth/routes.py

from . import auth_bp
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token,create_refresh_token, jwt_required, get_jwt_identity
from app.extensions import mongo
from app.services.auth_utils import role_required
from marshmallow import ValidationError
from app.schemas.auth import RegisterSchema
from app.services.db_error_handler import catch_db_errors
import datetime



# Example user collection setup
users_col = mongo.db.users

register_schema = RegisterSchema()


VALID_ROLES = {"student", "faculty", "admin"}


# Register endpoint
@auth_bp.route('/register', methods=['POST'])
@catch_db_errors
def register():
    data = request.get_json()
    try:
        data = register_schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Proceed with validated data
    username = data.get('username', '').lower()
    password = data.get('password')
    role = data.get('role', 'student') # Default role is 'student'


    existing_user = users_col.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)
    users_col.insert_one({
        "username": username,
        "password": hashed_password,
        "role": role,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "User registered successfully"}), 201

    

# Login endpoint
@auth_bp.route('/login', methods=['POST'])
@catch_db_errors
def login():
    data = request.get_json()
    username = data.get('username', '').lower()
    password = data.get('password')

    user = users_col.find_one({"username": username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    
    access_token = create_access_token(
        identity=str(user['_id']),
        additional_claims={"role": user.get("role", "student")},
        expires_delta = datetime.timedelta(minutes=15))
    
    refresh_token = create_refresh_token(identity=str(user['_id']))
    return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200

# Refresh Access Token
@auth_bp.route('/refresh', methods=['POST'])
@catch_db_errors
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    user = users_col.find_one({"_id": mongo.db.ObjectId(current_user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    access_token = create_access_token(
        identity=current_user_id,
        additional_claims={"role": user.get("role", "student")},
        expires_delta=datetime.timedelta(minutes=15)
    )
    return jsonify({"access_token": access_token}), 200

# A protected test route
@auth_bp.route('/profile', methods=['GET'])
@catch_db_errors
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = users_col.find_one({"_id": mongo.db.ObjectId(current_user_id)}, {"password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user['id'] = str(user['_id'])
    user.pop('_id', None)
    return jsonify(user)


@auth_bp.route('/admin-only', methods=['GET'])
@catch_db_errors
@role_required({"admin"})
def admin_endpoint():
    return jsonify({"message": "Welcome, admin"})

