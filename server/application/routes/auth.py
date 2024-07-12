from flask import Flask, Blueprint, session, make_response, request, current_app
import jwt
from flask import request, jsonify
from datetime import datetime, timedelta
from  werkzeug.security import generate_password_hash, check_password_hash
import application.database.models as models

from application.database.models import db
from auth_middleware import token_required


auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

def validate_email_password(useremail_entered, password_entered):
    user_matched=  models.User.query.filter_by(email=useremail_entered).first()
    if user_matched and check_password_hash(user_matched.password, password_entered):
        return True
    else:
        return False


@auth_bp.route('/')
def home(): 
    if not session.get('logged_in'):
        return "Not logged in according to python auth.py"
    else:
        return 'Logged in'
    
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    data = request.get_json()
    if request.method == 'POST':
        # gets name, email and password from request
        username, email, address = data['username'], data['email'], data['address']
        password = data['password']

        #check if user exists
        user = models.User.query.filter_by(email=email).first()

        if not user:
            user = models.User(
                username= username,
                email= email,
                address= address,
                password= generate_password_hash(password)
            )
            # add to db
            db.session.add(user)
            db.session.commit()
            return jsonify(message='Registered'), 201
        else:
            return jsonify(message='already existing user'), 202
        

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        token = None
        if not data:
            return jsonify(message='user details not reached the function'), 400
        
        ## validate user that should return true:
        is_valid = validate_email_password(data['email'], data['password'])
        if is_valid:
            try:
                print(current_app.config['SECRET_KEY'])
                token = jwt.encode({
                'email': data['email'], 
                'expiration': str(datetime.utcnow() + timedelta(seconds=14400))
                }, 
                current_app.config['SECRET_KEY'], algorithm="HS256")
                print(token)
                print(str(datetime.utcnow() + timedelta(seconds=14400)))
                return jsonify({'token': token})
            except jwt.exceptions.ExpiredSignatureError:
                return jsonify(error='Token has expired', message=str(e)), 401
            except jwt.exceptions.InvalidTokenError:
                return jsonify(error='Invalid token', message=str(e)), 401
            except Exception as e:
                return jsonify(error='Something went wrong with tokens', message=str(e), token=token), 500
        else:
            return jsonify(message='User not found, not authorized'), 405
    except Exception as e:
        return jsonify(message='login function failed', error=str(e)), 500


@auth_bp.route('/test', methods=['GET'])
@token_required
def test_function(user):
    return "hi"
