# app/schemas/auth.py

from marshmallow import Schema, fields, validate, ValidationError

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Regexp(
        r'^\w{3,30}$',
        error="Invalid username: must be 3-30 characters (letters, numbers, underscores)"
    ))
    password = fields.Str(required=True, validate=validate.Regexp(
        r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
        error="Password must be minimum eight characters, include at least one letter and one number"
    ))
    role = fields.Str(required=False, validate=validate.OneOf(["student", "faculty", "admin"]))
