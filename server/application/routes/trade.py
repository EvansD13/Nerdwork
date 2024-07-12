from flask import Blueprint, request, jsonify
from application.database.models import Item, Request, Swap, User, db


trade_bp = Blueprint("trade_bp", __name__, url_prefix='/trade') 

def format_request(request_obj):
    return {
        'user_email_request': request_obj.user_email_request,
        'user_email_requestie': request_obj.user_email_requestie,
        'wanted_item_id': request_obj.wanted_item_id,
        'rejected_by_requestie': request_obj.rejected_by_requestie
    }

def format_request_get(request_obj):
    return {
        'request_id': request_obj.request_id,
        'user_email_request': request_obj.user_email_request,
        'user_email_requestie': request_obj.user_email_requestie,
        'wanted_item_id': request_obj.wanted_item_id,
        'rejected_by_requestie': request_obj.rejected_by_requestie
    }

def format_swap(request_obj):
    return {
        'user_email_requester': request_obj.user_email_requester,
        'user_email_requestie': request_obj.user_email_requestie,
        'wanted_item_id': request_obj.wanted_item_id,
        'requestie_item_id': request_obj.requestie_item_id,
        'date': request_obj.date,
        'accepted': request_obj.accepted,
        'rejected_by_requester': request_obj.rejected_by_requester
    }


#get all requests 
@trade_bp.route('/', methods =['GET'])
def get_all_requests():
    requests_obj = Request.query.all()

    requests =[]
    for r in requests_obj:
        requests.append(format_request_get(r))

    return jsonify(requests= requests)

#get requests or delete requests based on item_id
@trade_bp.route('/<item_id>', methods = ['GET', 'DELETE'])
def getreq_by_item_id(item_id):

    #returns all request with that item_id
    if request.method == 'GET':
        requests_per_item_id = Request.query.filter(Request.wanted_item_id == int(item_id)).all()
        requests =[]
        for r in requests_per_item_id:
            requests.append(format_request(r))
        return jsonify(request = requests)
    
    #delete all request based on item id --- this is used when other requests might have completed the item so the requests are no longer needed
    elif request.method == 'DELETE':
        requests_per_item_id = Request.query.filter(Request.wanted_item_id == int(item_id)).all()

        #find if there is any
        if not requests_per_item_id:
            return jsonify(message='No requests were found for that item!')
        
        #if there are requests then delete all occurances from db with that item_id
        else:
            try:
                for r in requests_per_item_id:
                    db.session.delete(r)
                db.session.commit()
                return jsonify(message=f'Deleted all occurances of item_id {item_id}')
            except Exception as e:
                # If an error occurs during deletion, rollback changes and return an error response
                db.session.rollback()
                return jsonify(message='Deletion did not go through: ', error=str(e)), 400

#add new request to the db, edit existing entries
@trade_bp.route('/', methods = ['POST', 'PATCH'])
def add_request():
    #add a request to db
    if request.method == 'POST':
        data = request.get_json()
        
        if data:
            #if we have data passed in  try
            try:
                #user_email_request is from local storage, the person who is logged in
                user_email_request, user_email_requestie, wanted_item_id, rejected_by_requestie = data['user_email_request'], data['user_email_requestie'], data['wanted_item_id'], data['rejected_by_requestie']
                
                #create request instance
                request_to_add = Request(
                     user_email_request=user_email_request,
                     user_email_requestie=user_email_requestie,
                     wanted_item_id=wanted_item_id,
                     rejected_by_requestie=rejected_by_requestie                     
                )
                db.session.add(request_to_add)
                db.session.commit()
                request_data = format_request(request_to_add)
                return jsonify(message='Request added', request=request_data), 201
            
            #if post unsuccessful, including missing data, it will drop here 
            except Exception as e:
                    return jsonify(message='An error occurred during posting a request: ', error=str(e)), 400
        #if data is not passed in at all
        else:
            return jsonify(message='No data passed in'), 400
    
    #this should be used when the person requested from rejects directly the request
    elif request.method == 'PATCH':

        data = request.get_json()
        
        if data:
            user_email_request, user_email_requestie, wanted_item_id = data['user_email_request'], data['user_email_requestie'], data['wanted_item_id']
            #find row in db

            try:
                request_to_patch = Request.query.filter(Request.user_email_request==user_email_request, Request.user_email_requestie == user_email_requestie, Request.wanted_item_id==wanted_item_id).first()

                #if there is no such row in the db
                if not request_to_patch:
                    return jsonify(message='No request found to update')
                
                #patch row found
                
                else:
                    rejected_by_requestie = True
                    request_to_patch.rejected_by_requestie = rejected_by_requestie
                    db.session.commit()
                    return jsonify(message='Request updated')
            
            #error during patch, including missing data
            except Exception as e:
                    return jsonify(message='An error occurred during updating a request: ', error=str(e)), 400
        
        #if data is not passed in at all
        else:
            return jsonify(message='No data passed in'), 400
        


################# SWAP ROUTES #####################

@trade_bp.route('/swap')
def get_all_swaps():
    swaps_obj = Swap.query.all()
    swaps =[]
    for s in swaps_obj:
        swaps.append(format_swap(s))

    return jsonify(swaps= swaps)

#get swaps or delete swops based on item_id
@trade_bp.route('/swap/<item_id>', methods = ['GET', 'DELETE'])
def getswap_by_item_id(item_id):

    #returns all request with that item_id
    if request.method == 'GET':
        swaps_per_item_id = Swap.query.filter(Swap.wanted_item_id == int(item_id)).all()
        return jsonify(swap = swaps_per_item_id)
    
    #delete all swop based on item id --not sure if we need
    elif request.method == 'DELETE':
        swaps_per_item_id = Swap.query.filter(Swap.wanted_item_id == int(item_id)).all()

        #find if there is any
        if not swaps_per_item_id:
            return jsonify(message='No swops were found for that item!')
        
        #if there are swops then delete all occurances from db with that item_id
        else:
            try:
                for s in swaps_per_item_id:
                    db.session.delete(s)
                db.session.commit()
                return jsonify(message=f'Deleted all occurances of item_id {item_id} from the swap table')
            except Exception as e:
                # If an error occurs during deletion, rollback changes and return an error response
                db.session.rollback()
                return jsonify(message='Deletion did not go through: ', error=str(e)), 400

@trade_bp.route('/swap', methods = ['POST', 'PATCH'])
def add_swap():
    #add a swap to db
    if request.method == 'POST':
        data = request.get_json()
        
        if data:
            #if we have data passed in  try
            try:
                user_email_requester, user_email_requestie,wanted_item_id, requestie_item_id, date, accepted, rejected_by_requester = data['user_email_requester'], data['user_email_requestie'],data['wanted_item_id'], data['requestie_item_id'],data['date'], data['accepted'], data['rejected_by_requester']
                
                #create Swap instance
                swap_to_add = Swap(
                     user_email_requester=user_email_requester,
                     user_email_requestie=user_email_requestie,
                     wanted_item_id=wanted_item_id,
                     requestie_item_id=requestie_item_id,
                     date= date,
                     accepted=accepted,
                     rejected_by_requester=rejected_by_requester                    
                )
                db.session.add(swap_to_add)
                db.session.commit()
                swap_data = format_swap(swap_to_add)
                return jsonify(message='Swap added', swap=swap_data), 201
            
            #if post unsuccessful, including missing data, it drops here 
            except Exception as e:
                    return jsonify(message='An error occurred during posting a swop: ', error=str(e)), 400
        #if data is not passed in at all
        else:
            return jsonify(message='No data passed in'), 400
    
    #possible swap patches: accepted or rejected_by_requester
    elif request.method == 'PATCH':

        data = request.get_json()
        
        if data:
            #data to identify correct row
            user_email_requester, user_email_requestie, wanted_item_id, requestie_item_id = data['user_email_requester'], data['user_email_requestie'], data['wanted_item_id'], data['requestie_item_id']

            #data used to patch:
            accepted, rejected_by_requester = data['accepted'], data['rejected_by_requester']
            try:
                #find row in db
                swap_to_patch = Swap.query.filter(Swap.user_email_requester==user_email_requester, Swap.user_email_requestie == user_email_requestie, Swap.wanted_item_id==wanted_item_id, Swap.requestie_item_id==requestie_item_id).first()


                #if there is no such row in the db
                if not swap_to_patch:
                    return jsonify(message='No swap found to update')
                
                #patch row found
                else:
                    swap_to_patch.accepted = accepted
                    swap_to_patch.rejected_by_requester = rejected_by_requester
                    db.session.commit()
                    return jsonify(message='Swap updated')
            
            #error during patch, including missing data
            except Exception as e:
                    return jsonify(message='An error occurred during updating a swap: ', error=str(e)), 400
        
        #if data is not passed in at all
        else:
            return jsonify(message='No data passed in'), 400
        