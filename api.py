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

#====================Create Scheme and Votes request pares=======================================


create_scheme_parser = reqparse.RequestParser()
create_scheme_parser.add_argument('name', type=str, required=True, help='Name is required')
create_scheme_parser.add_argument('description', type=str, required=True, help='Description is required')



create_vote_parser = reqparse.RequestParser()
create_vote_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
create_vote_parser.add_argument('scheme_id', type=int, required=True, help='Scheme ID is required')
create_vote_parser.add_argument('vote_value', type=int, required=True, help='Vote value is required')


#====================Update Scheme and Votes request pares=======================================

update_scheme_parser = reqparse.RequestParser()
update_scheme_parser.add_argument('name', type=str, required=True, help='Name is required')
update_scheme_parser.add_argument('description', type=str, required=True, help='Description is required')


update_vote_parser = reqparse.RequestParser()
update_vote_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
update_vote_parser.add_argument('scheme_id', type=int, required=True, help='Scheme ID is required')
update_vote_parser.add_argument('vote_value', type=int, required=True, help='Vote value is required')


#=================================Scheme api======================================================

class SchemeApi(Resource):
    @marshal_with(scheme_fields)
    #get all schemes
    def get(self):
        data = []
        schemes = Scheme.query.all()
        for scheme in schemes:
            data.append({'id': scheme.id, 'name': scheme.name, 'description': scheme.description})
        return data

    @marshal_with(scheme_fields)
    def post(self):
        args = create_scheme_parser.parse_args()
        scheme = Scheme(name=args['name'], description=args['description'])
        db.session.add(scheme)
        db.session.commit()
        return scheme

    @marshal_with(scheme_fields)
    def put(self, id):
        args = update_scheme_parser.parse_args()
        scheme = Scheme.query.filter(Scheme.id == id).one()
        scheme.name = args['name']
        scheme.description = args['description']
        db.session.commit()
        return scheme

    
    def delete(self, id):
        scheme = Scheme.query.filter(Scheme.id == id).one()
        db.session.delete(scheme)
        db.session.commit()
        return make_response(json.dumps({'Success': 'Scheme deleted'}), 200)
    
#=================================Vote api======================================================
    
class VoteApi(Resource):
    @marshal_with(vote_filelds)
    def get(self):
        data = []
        votes = Vote.query.all()
        for vote in votes:
            data.append({'id': vote.id, 'user_id': vote.user_id, 'scheme_id': vote.scheme_id, 'vote_value': vote.vote_value})
        return data
    
    @marshal_with(vote_filelds)
    def post(self):
        args = create_vote_parser.parse_args()
        vote = Vote(user_id=args['user_id'], scheme_id=args['scheme_id'], vote_value=args['vote_value'])
        db.session.add(vote)
        db.session.commit()
        return vote
    
    @marshal_with(vote_filelds)
    def put(self, id):
        args = update_vote_parser.parse_args()
        vote = Vote.query.filter(Vote.id == id).one()
        vote.user_id = args['user_id']
        vote.scheme_id = args['scheme_id']
        vote.vote_value = args['vote_value']
        db.session.commit()
        return vote
    
    def delete(self, id):
        vote = Vote.query.filter(Vote.id == id).one()
        db.session.delete(vote)
        db.session.commit()
        return make_response(json.dumps({'Success': 'Vote deleted'}), 200)








