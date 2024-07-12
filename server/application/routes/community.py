# Imports

from flask import Blueprint, request, jsonify
from application.database.models import Community, db

# Blueprint 

community_bp = Blueprint("community_bp", __name__, url_prefix='/community') 

# Format Item Functions

def format_community(community): 
    return {
        "community_id": community.community_id,
        "community_name": community.community_name,
        "description": community.description
    }

# ? USER STORY > User clicks on the community tab and can view all the communities

@community_bp.route("/", methods=['GET','POST'])
def get_all():
    if request.method == 'GET':
        communities = Community.query.all()
        community_list = []
        for community in communities:
            community_list.append(format_community(community))
        return {"Communities": community_list}
    
    if request.method == 'POST':
        data = request.json
        community_name = data.get("community_name")
        description = data.get("description")

        if not community_name or not description:
            return jsonify({"error": "Missing required fields"}), 400

        new_community = Community(community_name=community_name, description=description)

        db.session.add(new_community)
        db.session.commit()

        return jsonify(format_community(new_community)), 201

    
@community_bp.route("/<community_id>", methods=['GET'])
def community_id(community_id):
    
    community = Community.query.filter_by(community_id=community_id).first()
    return jsonify(community_id=community.community_id, community_name=community.community_name, description=community.description)

