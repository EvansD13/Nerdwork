from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

#User Table
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    address = db.Column(db.String(255))
    password = db.Column(db.String(255), nullable=False)
    def __init__(self, username, email, address, password):
        self.username = username
        self.email = email
        self.address = address
        self.password = password

#Item Table
class Item(db.Model):
    item_id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), db.ForeignKey('user.email'), nullable=False)  # Keep email as a foreign key
    genre = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    issue_num = db.Column(db.Integer)
    img = db.Column(db.String(255), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(5000), nullable=True)
    tradeable = db.Column(db.Boolean, default=True)

    # Foreign Keys
    user = db.relationship('User', foreign_keys=[email]) 


    def __init__(self, genre, title, email, category, author, issue_num, img, rating, description, tradeable):
        self.category = category
        self.title = title
        self.email = email
        self.genre = genre
        self.author = author
        self.issue_num = issue_num
        self.rating = rating
        self.img = img
        self.description = description
        self.tradeable = tradeable

#request Table
class Request(db.Model):
    request_id = db.Column(db.Integer, primary_key=True)
    user_email_request = db.Column(db.String(255), db.ForeignKey('user.email'),  nullable=False)
    user_email_requestie = db.Column(db.String(255), db.ForeignKey('user.email'), nullable=False)
    wanted_item_id = db.Column(db.Integer, db.ForeignKey('item.item_id'), nullable=False)
    rejected_by_requestie = db.Column(db.Boolean, default=False)

    requester = db.relationship('User', foreign_keys=[user_email_request])
    requestie = db.relationship('User', foreign_keys=[user_email_requestie])
    wanted_item = db.relationship('Item', foreign_keys=[wanted_item_id])
    

    def __init__(self, user_email_request, user_email_requestie, wanted_item_id, rejected_by_requestie):
        self.user_email_request = user_email_request
        self.user_email_requestie = user_email_requestie
        self.wanted_item_id = wanted_item_id
        self.rejected_by_requestie = rejected_by_requestie

#Swap Table
class Swap(db.Model):
    swap_id = db.Column(db.Integer, primary_key=True)
    user_email_requester = db.Column(db.String(255), db.ForeignKey('user.email'), nullable=False)
    user_email_requestie = db.Column(db.String(255), db.ForeignKey('user.email'), nullable=False)
    wanted_item_id = db.Column(db.Integer, db.ForeignKey('item.item_id'), nullable=False)
    requestie_item_id = db.Column(db.Integer, db.ForeignKey('item.item_id'), nullable=False)
    accepted = db.Column(db.Boolean, default=False)
    rejected_by_requester = db.Column(db.Boolean, default=False)
    date = db.Column(db.Date, nullable=True, default=datetime.utcnow)


    #Foreign Keys
    requester = db.relationship('User', foreign_keys=[user_email_requester])
    requestie = db.relationship('User', foreign_keys=[user_email_requestie])
    wanted_item = db.relationship('Item', foreign_keys=[wanted_item_id])
    requestie_item = db.relationship('Item', foreign_keys=[requestie_item_id])

    def __init__(self, user_email_requester, user_email_requestie, wanted_item_id, requestie_item_id, date, accepted, rejected_by_requester):
        self.user_email_requester = user_email_requester
        self.user_email_requestie = user_email_requestie
        self.wanted_item_id = wanted_item_id
        self.requestie_item_id = requestie_item_id
        self.date = date
        self.accepted = accepted
        self.rejected_by_requester = rejected_by_requester

# Community Table 
class Community(db.Model):
    community_id = db.Column(db.Integer, primary_key=True)
    community_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    # Initialization
    def __init__(self, community_name, description):
        self.community_name = community_name
        self.description = description

# Thread table
class Thread(db.Model):
    thread_id = db.Column(db.Integer, primary_key=True)
    community_id = db.Column(db.Integer, db.ForeignKey('community.community_id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    email = db.Column(db.String(255), db.ForeignKey('user.email'), nullable=False)

    # Foreign Key Constraints
    community_id_FK = db.relationship('Community', foreign_keys=[community_id])
    email_FK = db.relationship('User', foreign_keys=[email])

    # Initialization
    def __init__(self, community_id, title, description, email):
        self.community_id = community_id
        self.title = title
        self.description = description
        self.email = email

# Post table 
class Post(db.Model):
    post_id = db.Column(db.Integer, primary_key=True)
    post_title = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), db.ForeignKey('user.email'), nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.thread_id'),nullable=False)
    body = db.Column(db.String(255), nullable=False)
    votes = db.Column(db.Integer, nullable=True, default=0)

    # Foreign Key Constraints
    email_FK = db.relationship('User', foreign_keys=[email])
    thread_id_FK = db.relationship('Thread', foreign_keys=[thread_id])

    # Initialization 
    def __init__(self, post_title, email, thread_id, body, votes=0):
        self.post_title = post_title
        self.email = email
        self.thread_id = thread_id
        self.body = body
        self.votes = votes

    