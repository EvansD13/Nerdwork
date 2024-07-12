# Imports

from flask import Blueprint, request, jsonify
from application.database.models import Thread, db

# Blueprint 

thread_bp = Blueprint("thread_bp", __name__, url_prefix='/thread')

# Formatting function

def format_thread(thread): 
    return {
        "thread_id": thread.thread_id,
        "community_id": thread.community_id,
        "title": thread.title,
        "description": thread.description,
        "email": thread.email
    }

# ? User Story: Selects community tab > Displays all communities > Selects a single community > Displays all threads > Selects a single thread 

@thread_bp.route("/<thread_id>", methods=['GET'])
def thread_id(thread_id):

    # ? Retrieve one row 

    thread = Thread.query.filter_by(thread_id=thread_id).first()

    # ? Return data for the specified id

    return jsonify(
        thread_id=thread.thread_id,
        community_id=thread.community_id, 
        title=thread.title,
        description=thread.description,
        email=thread.email
    )

# ? User Story: Selects community tab > Displays all communities > Selects a single community > Displays all threads > Create a custom thread

@thread_bp.route("/", methods=['POST'])
def create_thread():
    
    # ? Obtain the data sent by the user 
    data = request.get_json()

    # ? Check if data is present from retrieval
    if data:

        # ? Deconstruct data
        community_id, title, description, email = data["community_id"], data["title"], data["description"], data["email"]

        if community_id and title and email:
            try:
                thread_to_add = Thread(
                    community_id=community_id,
                    title=title,
                    description=description,
                    email=email
                )
                db.session.add(thread_to_add)
                db.session.commit()
                return jsonify(message='Item Successfully Added To Database'), 201
            except Exception as e:
                return jsonify(message='An error occurred during posting an item', error=str(e)), 400
        else:
            return jsonify(message='Posting item failed, possibly missing mandatory arguments'), 400
    else:
        return jsonify(message='No data passed in'), 400

# Retrieve all threads for a specific community
@thread_bp.route("/community/<community_id>", methods=['GET'])
def threads_by_community(community_id):
    # Retrieve all threads for the specified community_id
    threads = Thread.query.filter_by(community_id=community_id).all()

    # Format the threads
    thread_list = [format_thread(thread) for thread in threads]

    # Return the formatted threads as JSON
    return jsonify({"Threads": thread_list})
