from flask import Blueprint, jsonify
from application.database.models import User, Item
from auth_middleware import token_required

user_bp = Blueprint('user', __name__, url_prefix='/user')

def format_user(user):
    return {
        'user_id': user.user_id,
        'username': user.username,
        'address': user.address,
        'email': user.email,
        'password': user.password,
    }

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_list.append(format_user(user))
    return{'User': user_list}

# @user_bp.route('/<user_id>', methods=['GET'])
# def get_user(user_id):
#     user = User.query.filter_by(user_id=user_id).first()
#     return jsonify(id=user.user_id, username=user.username, address=user.address, email=user.email, password=user.password)

##this is /user/email
@user_bp.route('/<email>', methods=['GET'])
@token_required
def get_user(user,email):
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({
            'user_id': user.user_id,
            'username': user.username,
            'address': user.address,
            'email': user.email,
        })
    else:
        return jsonify({'message': 'User not found'}), 404
    

@user_bp.route('/<email>/<category>', methods=['GET'])
def get_user_and_items(email, category):
    user = User.query.filter_by(email=email).first()
    
    if user:
        # Join User and Item tables and filter by user_id
        items = Item.query.join(User).filter(User.email == user.email, Item.category == category).all()

        # Construct the response
        user_data = {
            'user_id': user.user_id,
            'username': user.username,
            'address': user.address,
            'email': user.email,
        }

        item_data = [
            {
                'item_id': item.item_id,
                'category': item.category,
                'title': item.title,
                'genre': item.genre,
                'author': item.author,
                'issue_num': item.issue_num,
                'img': item.img,
                'rating': item.rating,
                'description': item.description
            }
            for item in items
        ]

        return jsonify({'user': user_data, 'items': item_data})
    else:
        return jsonify({'message': 'User not found'}), 404