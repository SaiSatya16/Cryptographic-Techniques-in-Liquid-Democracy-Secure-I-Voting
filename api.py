from flask_restful import Resource, Api, fields, marshal_with, reqparse
from model import *
from werkzeug.exceptions import HTTPException
from flask_cors import CORS
import json
from flask import make_response, request
from flask_security import auth_required, roles_required
import os
from functools import wraps
from flask import abort
from flask_security import roles_accepted
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64
import boto3 
from Crypto.Util.Padding import unpad


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


from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64

kms = boto3.client('kms', region_name='ap-south-1')
ENCRYPTION_KEY_ID = 'd7026871-8686-436e-9f80-e285c6a7370d' 

# Define a test plaintext
plaintext = "This is a test plaintext."

def get_encryption_key():
    response = kms.generate_data_key(
        KeyId=ENCRYPTION_KEY_ID,  # The ID of the KMS key
        KeySpec='AES_128'  # The desired key specification
    )
    return response['Plaintext']

# Generate a test encryption key
# Generate or retrieve the encryption key
encryption_key = get_encryption_key() # 16-byte key for AES-128

# Encryption function
def encrypt_data(data, key):
    cipher = AES.new(key, AES.MODE_CBC)
    padded_data = pad(data.encode(), AES.block_size, style='x923')
    ciphertext = cipher.encrypt(padded_data)
    iv = base64.b64encode(cipher.iv).decode('utf-8')
    ciphertext = base64.b64encode(ciphertext).decode('utf-8')
    return iv, ciphertext

# Decryption function
def decrypt_data(encrypted_data, iv, key):
    try:
        cipher = AES.new(key, AES.MODE_CBC, base64.b64decode(iv))
        decrypted_data = cipher.decrypt(base64.b64decode(encrypted_data))
        try:
            unpadded_data = unpad(decrypted_data, AES.block_size, style='x923')
            decrypted_string = unpadded_data.decode('utf-8')
            return decrypted_string
        except ValueError as e:
            print(f"Error unpadding decrypted data: {e}")
            return None
    except Exception as e:
        print(f"Error decrypting data: {e}")
        return None

# Encrypt the plaintext
iv, ciphertext = encrypt_data(plaintext, encryption_key)
print(f"Encrypted data: {ciphertext}")

# Decrypt the ciphertext
decrypted_text = decrypt_data(ciphertext, iv, encryption_key)
print(f"Decrypted text: {decrypted_text}")







class SchemeApi(Resource):
    def __init__(self, encryption_key):
        self.encryption_key = encryption_key
    @auth_required('token')
    @any_role_required('admin', 'voter')
    def get(self, id):
        data = []
        schemes = Scheme.query.all()

        for scheme in schemes:
            allowed_to_vote = False
            usercurrentvote_count = 0
            usercurrentvote = Usercurrentvote.query.filter_by(user_id=id, scheme_id=scheme.id).first()
            #calculate number of usercurrentvote
            usercurrentvote_count = Usercurrentvote.query.filter_by(user_id=id, scheme_id=scheme.id).count()

            if usercurrentvote:
                allowed_to_vote = True

            true_vote_count = 0
            false_vote_count = 0

            # Calculate true and false vote count
            for vote in scheme.votes:
                decrypted_vote = decrypt_data(vote.vote, vote.iv, encryption_key)
                if decrypted_vote == 'true':
                    true_vote_count += 1
                elif decrypted_vote == 'false':
                    false_vote_count += 1

            # Count delegated votes
            user = User.query.get(id)
            for delegatee in user.delegates:
                delegatee_votes = Vote.query.filter_by(user_id=delegatee.delegatee_id, scheme_id=scheme.id).all()
                for delegatee_vote in delegatee_votes:
                    decrypted_vote = decrypt_data(delegatee_vote.vote, delegatee_vote.iv, encryption_key)
                    if decrypted_vote == 'true':
                        true_vote_count += 1
                    elif decrypted_vote == 'false':
                        false_vote_count += 1

            total_votes = true_vote_count + false_vote_count

            # Handle potential division by zero
            if total_votes > 0:
                true_vote_percentage = round((true_vote_count / total_votes) * 100, 2)
                false_vote_percentage = round((false_vote_count / total_votes) * 100, 2)
            else:
                true_vote_percentage = 0
                false_vote_percentage = 0
            
            delegation = Delegation.query.filter_by(delegator_id=id, scheme_id=scheme.id).first()
            delegated_to = None
            if delegation:
                delegated_to = User.query.get(delegation.delegatee_id)
            
            #filter the users who did not delegated vote to the scheme
            total_users = User.query.filter(User.roles.any(Role.name == 'Voter')).all()
            not_delegated_users = []
            for user in total_users:
                delegation = Delegation.query.filter_by(delegator_id=user.id, scheme_id=scheme.id).first()
                already_voted = Vote.query.filter_by(user_id=user.id, scheme_id=scheme.id).first()

                if not delegation and not already_voted:
                    not_delegated_users.append(user)
            
            if not_delegated_users != []:
                #filter with user id if his role is voter
                filtered_present_voter = User.query.filter(User.roles.any(Role.name == 'Voter')).filter(User.id == id).first()
                if filtered_present_voter:
                    if filtered_present_voter in not_delegated_users:
                        not_delegated_users.remove(filtered_present_voter)


                
            


            data.append({
                'id': scheme.id,
                'name': scheme.name,
                'description': scheme.description,
                'allowed_to_vote': allowed_to_vote,
                'true_vote_percentage': true_vote_percentage,
                'false_vote_percentage': false_vote_percentage,
                'usercurrentvote_count': usercurrentvote_count,
                'not_delegated_users': [{'id': user.id, 'username': user.username} for user in not_delegated_users],
                'delegated_to': {
                    'id': delegated_to.id,
                    'username': delegated_to.username
                } if delegated_to else None
            })

        return data
    
    @marshal_with(scheme_fields)
    @auth_required('token')
    @any_role_required('admin')
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

        #query only users with role voter
        users = User.query.filter(User.roles.any(Role.name == 'Voter')).all()
        for user in users:
            usercurrentvote = Usercurrentvote(user_id=user.id, scheme_id=s_id, vote=None)
            db.session.add(usercurrentvote)
        db.session.commit()
        return scheme   
    
    @marshal_with(scheme_fields)
    @auth_required('token')
    @any_role_required('admin')
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
    
    @auth_required('token')
    @any_role_required('admin')
    def delete(self, id):
        scheme = Scheme.query.filter_by(id=id).first()
        if not scheme:
            raise NotFoundError(404)
        db.session.query(Vote).filter(Vote.scheme_id == id).delete()
        db.session.query(Usercurrentvote).filter(Usercurrentvote.scheme_id == id).delete()
        db.session.delete(scheme)
        db.session.commit()
        return {'message': 'Scheme deleted successfully'}

#=================================Vote api======================================================
    
class VoteApi(Resource):
    def __init__(self, encryption_key):
        self.encryption_key = encryption_key

    @marshal_with(vote_filelds)
    @auth_required('token')
    @any_role_required('voter')
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
        
        user_current_votes_count = Usercurrentvote.query.filter_by(user_id=user_id, scheme_id=scheme_id).count()
        for i in range(user_current_votes_count):
            key = encryption_key
            iv, encrypted_vote = encrypt_data(vote, key)
            vote_ = Vote(user_id=user_id, scheme_id=scheme_id, vote=encrypted_vote, iv=iv)
            db.session.add(vote_)
        #delete all the entries from usercurrentvote table
        user_current_votes = Usercurrentvote.query.filter_by(user_id=user_id, scheme_id=scheme_id).all()
        for user_current_vote in user_current_votes:
            db.session.delete(user_current_vote)
        db.session.commit()

        return vote_
    

class DelegationApi(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('delegator_id', type=int, required=True, help='Delegator user ID is required')
        self.parser.add_argument('delegatee_id', type=int, required=True, help='Delegatee user ID is required')
        self.parser.add_argument('scheme_id', type=int, required=True, help='Scheme ID is required')

    @auth_required('token')
    def post(self):
        args = self.parser.parse_args()
        delegator_id = args['delegator_id']
        delegatee_id = args['delegatee_id']
        scheme_id = args['scheme_id']

        delegator = User.query.get(delegator_id)
        delegatee = User.query.get(delegatee_id)
        scheme = Scheme.query.get(scheme_id)

        if not delegator or not delegatee or not scheme:
            return {'error_message': 'Invalid user ID(s) or scheme ID'}, 400

        if delegator.is_delegating_to(delegatee, scheme_id):
            return {'error_message': 'Delegation already exists for this scheme'}, 400
        
        existing_delegation = Delegation.query.filter_by(delegator_id=delegatee_id, delegatee_id=delegator_id, scheme_id=scheme_id).first()
        if existing_delegation:
            return {'error_message': 'Cannot delegate to a user who has already delegated to you for this scheme'}, 400

        # Transfer all delegator's current vote to delegatee's current vote
        delegator_current_votes = Usercurrentvote.query.filter_by(user_id=delegator_id, scheme_id=scheme.id).all()
        for vote in delegator_current_votes:
            delegatee_current_vote = Usercurrentvote(user_id=delegatee_id, scheme_id=scheme.id, vote=vote.vote)
            db.session.add(delegatee_current_vote)
            db.session.delete(vote)
        db.session.commit()

        delegator.delegate_to(delegatee, scheme_id)
        return {'message': 'Delegation added successfully'}, 201

    @auth_required('token')
    def delete(self):
        args = self.parser.parse_args()
        delegator_id = args['delegator_id']
        delegatee_id = args['delegatee_id']
        scheme_id = args['scheme_id']

        delegator = User.query.get(delegator_id)
        delegatee = User.query.get(delegatee_id)
        scheme = Scheme.query.get(scheme_id)

        if not delegator or not delegatee or not scheme:
            return {'message': 'Invalid user ID(s) or scheme ID'}, 400

        if not delegator.is_delegating_to(delegatee, scheme_id):
            return {'message': 'No delegation found for this scheme'}, 400

        delegator.undelegate_to(delegatee, scheme_id)
        return {'message': 'Delegation removed successfully'}

    @auth_required('token')
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'Invalid user ID'}, 400

        delegations = {}
        for scheme in Scheme.query.all():
            delegated_to = user.delegates.filter_by(scheme_id=scheme.id).first()
            if delegated_to:
                delegatee = User.query.get(delegated_to.delegatee_id)
                delegations[scheme.id] = {
                    'delegatee_id': delegatee.id,
                    'delegatee_username': delegatee.username
                }
            else:
                delegations[scheme.id] = {}

        return delegations

#==============================API Endpoints========================================
api.add_resource(SchemeApi, '/scheme', '/scheme/<int:id>', resource_class_kwargs={'encryption_key': encryption_key})
api.add_resource(VoteApi, '/vote', resource_class_kwargs={'encryption_key': encryption_key})
api.add_resource(DelegationApi, '/delegation', '/delegation/<int:user_id>')


    
    
