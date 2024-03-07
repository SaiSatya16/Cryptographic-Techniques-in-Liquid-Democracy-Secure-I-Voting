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

#==========================Validation========================================================
class NotFoundError(HTTPException):
    def __init__(self,status_code):
        message = {"error_code":"BE1009","error_message":"Not Found"}
        self.response = make_response(json.dumps(message), status_code)

class BusinessValidationError(HTTPException):
    def __init__(self, status_code, error_code, error_message):
        message = {"error_code":error_code,"error_message":error_message}
        self.response = make_response(json.dumps(message), status_code)


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
    'vote': fields.Boolean
}

#====================Create Scheme and Votes request pares=======================================


create_scheme_parser = reqparse.RequestParser()
create_scheme_parser.add_argument('name')
create_scheme_parser.add_argument('description')



create_vote_parser = reqparse.RequestParser()
create_vote_parser.add_argument('user_id')
create_vote_parser.add_argument('scheme_id')
create_vote_parser.add_argument('vote')


#====================Update Scheme and Votes request pares=======================================

update_scheme_parser = reqparse.RequestParser()
update_scheme_parser.add_argument('name')
update_scheme_parser.add_argument('description')


update_vote_parser = reqparse.RequestParser()
update_vote_parser.add_argument('user_id')
update_vote_parser.add_argument('scheme_id')
update_vote_parser.add_argument('vote')




#=================================Scheme api======================================================

class SchemeApi(Resource):
    def get(self, uid):
        data = []
        schemes = Scheme.query.all()
        if not schemes:
            raise NotFoundError(404)
        
        for scheme in schemes:
            allowed_to_vote = False
            #check if there is entry in usercurrentvote table with user_id and scheme_id
            usercurrentvote = usercurrentvote.query.filter_by(user_id=uid, scheme_id=scheme.id).first()
            if usercurrentvote:
                allowed_to_vote = True
                votes = []
                for vote in scheme.votes:
                    votes.append({'id': vote.id, 'user_id': vote.user_id, 'scheme_id': vote.scheme_id, 'vote': vote.vote})
                data.append({'id': scheme.id, 'name': scheme.name, 'description': scheme.description, 'allowed_to_vote': allowed_to_vote, 'votes': votes})
            else:
                votes = []
                for vote in scheme.votes:
                    votes.append({'id': vote.id, 'user_id': vote.user_id, 'scheme_id': vote.scheme_id, 'vote': vote.vote})
                data.append({'id': scheme.id, 'name': scheme.name, 'description': scheme.description, 'votes': votes, 'allowed_to_vote': allowed_to_vote})
        return data
    
    @marshal_with(scheme_fields)
    def post(self):
        args = create_scheme_parser.parse_args()
        name = args.get('name', None)
        description = args.get('description', None)
        if not name:
            raise BusinessValidationError(400, "BE1001", "Name is required")
        if not description:
            raise BusinessValidationError(400, "BE1002", "Description is required")
        scheme = Scheme(name=name, description=description)
        db.session.add(scheme)
        db.session.commit()
        scheme = Scheme.query.filter_by(name=name).first()
        s_id = scheme.id
        users = User.query.all()
        for user in users:
            usercurrentvote = usercurrentvote(user_id=user.id, scheme_id=s_id, vote=None)
            db.session.add(usercurrentvote)
        db.session.commit()
        return scheme   
    
    @marshal_with(scheme_fields)
    def put(self, id):
        args = update_scheme_parser.parse_args()
        name = args.get('name', None)
        description = args.get('description', None)
        scheme = Scheme.query.filter_by(id=id).first()
        if not scheme:
            raise NotFoundError(404)
        if name:
            scheme.name = name
        if description:
            scheme.description = description
        db.session.commit()
        return scheme
    
    def delete(self, id):
        scheme = Scheme.query.filter_by(id=id).first()
        if not scheme:
            raise NotFoundError(404)
        db.session.query(Vote).filter(Vote.scheme_id == id).delete()
        db.session.query(usercurrentvote).filter(usercurrentvote.scheme_id == id).delete()
        db.session.delete(scheme)
        db.session.commit()
        return {'message': 'Scheme deleted successfully'}

#=================================Vote api======================================================
    
class VoteApi(Resource):
    
    @marshal_with(vote_filelds)
    def post(self):
        args = create_vote_parser.parse_args()
        user_id = args.get('user_id', None)
        scheme_id = args.get('scheme_id', None)
        vote = args.get('vote', None)
        if not user_id:
            raise BusinessValidationError(400, "BE1003", "User id is required")
        if not scheme_id:
            raise BusinessValidationError(400, "BE1004", "Scheme id is required")
        if vote is None:
            raise BusinessValidationError(400, "BE1005", "Vote is required")
        vote = Vote(user_id=user_id, scheme_id=scheme_id, vote=vote)
        #delete the entry from usercurrentvote table and add the vote to vote table
        usercurrentvote = usercurrentvote.query.filter_by(user_id=user_id, scheme_id=scheme_id).first()
        if usercurrentvote:
            db.session.delete(usercurrentvote)
            db.session.add(vote)
            db.session.commit()
        else:
            raise BusinessValidationError(400, "BE1006", "User is not allowed to vote")
        return vote
    

#==============================API Endpoints========================================
api.add_resource(SchemeApi, '/scheme', '/scheme/<int:uid>')
api.add_resource(VoteApi, '/vote')

    
    
