from flask import Blueprint

main_bp = Blueprint('main', __name__)

from . import routes  # Import routes so they register on main_bp
