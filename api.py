from flask_restful import Resource, Api, fields, marshal_with, reqparse
from model import *
from werkzeug.exceptions import HTTPException
from flask_cors import CORS
import json
from flask import make_response
from flask_security import auth_required, roles_required
import os
from functools import wraps
from flask import abort
from flask_security import roles_accepted

api = Api()

def any_role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if not roles_accepted(*roles):
                abort(403, description="Insufficient permissions")
            return fn(*args, **kwargs)
        return decorator
    return wrapper


#==============================output fields========================================
scheme_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String
}

vote_filelds = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'scheme_id': fields.Integer,
    'vote_value': fields.Integer
}


scheme_parser = reqparse.RequestParser()
scheme_parser.add_argument('name', type=str, required=True, help='Name is required')
scheme_parser.add_argument('description', type=str, required=True, help='Description is required')



vote_parser = reqparse.RequestParser()
vote_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
vote_parser.add_argument('scheme_id', type=int, required=True, help='Scheme ID is required')
vote_parser.add_argument('vote_value', type=int, required=True, help='Vote value is required')


