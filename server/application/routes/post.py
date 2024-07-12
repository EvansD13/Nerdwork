from flask import Blueprint, request, jsonify
from application.database.models import Post, db
import json

# Blueprint 
post_bp = Blueprint("post_bp", __name__, url_prefix='/post') 

# Format Item Functions

def format_post(post): 
    return {
        "post_id": post.post_id,
        "email": post.email,
        "thread_id": post.thread_id,
        "post_title": post.post_title,
        "body": post.body,
        "votes": post.votes
    }

# ? USER STORY > User selects community 

@post_bp.route("/", methods=['GET', 'POST'])
def get_all():
    if request.method == 'GET':
        posts = Post.query.all()
        post_list = []
        for post in posts:
            post_list.append(format_post(post))
        return {"Posts": post_list}
    
    if request.method == "POST":
        data = request.get_json()
        if data:
            email, thread_id, post_title, body, votes = data["email"], data["thread_id"], data["post_title"], data["body"], data["votes"]

            if email and thread_id and post_title and body:
                try:
                    post_to_add = Post(
                        email = email,
                        thread_id = thread_id,
                        post_title = post_title,
                        body = body,
                        votes = votes
                    )
                    db.session.add(post_to_add)
                    db.session.commit()
                    return jsonify(message='Item Successfully Added To Database'), 201
                except Exception as e:
                        return jsonify(message='An error occurred during posting an item', error=str(e)), 400
            else:
                return jsonify(message='Posting item failed, possibly missing mandatory arguments'), 400
        else:
            return jsonify(message='No data passed in'), 400

# ? USER STORY > User wants to retrieve votes for a post. User wants to delete a post. User wants to update the votes (vote for or vote against)

@post_bp.route("/<post_id>", methods=["GET",'DELETE', "PATCH"])
def post_by_id(post_id):

     # ? Retrieving the post we want the votes for 
    post = Post.query.filter_by(post_id=post_id).first()

    # ? The outer if loop will check if a post is found and the will proceed to process the request. If it isn't found it will notify the user
    if post:
    
        if request.method == "GET": 
            
            # ? Return the number of votes for the specified user
            return jsonify(votes=post.votes), 200
        
        elif request.method == "DELETE":

            # ? Catch any exceptions that might occur during DB interactions
            try :
                # ? Delete the specified post
                db.session.delete(post)

                # ? Commit the changes to the database
                db.session.commit()

                # ? Return message to user
                return jsonify(message=f"Post with ID {post_id} has been successfully deleted"), 200
            
            except Exception as e:
                return jsonify(message=f"Error deleting post: {str(e)}"), 500
            
        elif request.method == "PATCH":

            # ? Try block to ensure that the json file is parsed correctly
            try :
                
                # ? Receive the data from the user 
                data = request.get_json()

                # ? Assign the new value to the post id specified 
                post.votes = data["votes"]

            except (json.decoder.JSONDecoderError, KeyError) as e:
                return jsonify(message=f"Error parsing JSON: {str(e)}"), 400


            # ? Commit the changes to the database
            db.session.commit()

            # ? Return a message to the user
            return jsonify(message=f"Post with ID {post_id} has been successfully updated"), 200
 
    else:

        # ? If no post is found for the id notify the user
        return jsonify(message=f'No post found with id {post_id}'), 400