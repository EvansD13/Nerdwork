from flask import Blueprint, request, jsonify
import json
import urllib.parse
import urllib.request
from application.database.models import Item, db
import os
import requests
from dotenv import load_dotenv
load_dotenv()

api_key = os.environ.get("GOOGLE_API_KEY")
google_bp = Blueprint("google_bp", __name__, url_prefix='/google')

# Function that takes a name of a book and returns an object of the book
@google_bp.route('/', methods=['GET', 'PATCH'])
# set default book
def get_book_info(title="Harry Potter and the Prisoner of Azkaban"):
    if request.method == 'PATCH':

        data = request.get_json()
        title, user_email = data['title'], data['email']

        payload = {
            'q': f'intitle:{title}',
            'key': api_key,
        }
        query = urllib.parse.urlencode(payload)
        url = f'https://www.googleapis.com/books/v1/volumes?{query}'

        try:
            response = urllib.request.urlopen(url)
            text = response.read()
            data = json.loads(text)

            # Extract image URL from the API response
            if 'items' in data and len(data['items']) > 0:
                first_book = data['items'][0]
                image_url = first_book['volumeInfo'].get('imageLinks', {}).get('thumbnail', '')
                description = first_book['volumeInfo'].get('description', '')

                if user_email:
                    user_email = str(user_email)
                    item_to_patch = Item.query.filter(Item.email == user_email, Item.title== title ).first()
                    
                    if item_to_patch:
                        item_to_patch.img = image_url
                        item_to_patch.description = description
                        db.session.commit()
                        return jsonify({'message': 'User image URL updated successfully'})
                    else:
                        return jsonify({'error': 'User or book not found'})
                
                else:
                    return jsonify({'error': 'Email is required for update'})
            else:
                return jsonify({'error': 'No results found for the given title'})

        except urllib.error.URLError as e:
            return jsonify({'error': str(e)})

    elif request.method == 'GET':
        # Handle GET request to fetch book information
        data = request.get_json()
        title = data['title']

        payload = {
            'q': f'intitle:{title}',
            'key': api_key,
        }

        query = urllib.parse.urlencode(payload)
        url = f'https://www.googleapis.com/books/v1/volumes?{query}'

        try:
            response = urllib.request.urlopen(url)
            text = response.read()
            data = json.loads(text)

            # return only the first result
            if 'items' in data and len(data['items']) > 0:
                first_book = data['items'][0]
                return jsonify(first_book)
            # this should never be reached as I have default book set
            else:
                return jsonify({'error': 'No results found for the given title'})

        except urllib.error.URLError as e:
            return jsonify({'error': str(e)})
        
        
    # elif request.method == 'GET':
    #     # Handle GET request to fetch book information
    #     title = request.json.get('title', title)

    #     payload = {
    #         'q': f'intitle:{title}',
    #         'key': api_key,
    #     }
    #     headers = {'Content-Type': 'application/json'}
    #     url = f'https://www.googleapis.com/books/v1/volumes?'

    #     try:
    #         response = requests.get(url=url, params=payload, headers=headers)
    #         response.raise_for_status()
    #         # text = response.read()
    #         # data = json.loads(text)
    #         data = response.json()

    #         # return only the first result
    #         if 'items' in data and len(data['items']) > 0:
    #             first_book = data['items'][0]
    #             return jsonify(first_book)
    #         # this should never be reached as I have default book set
    #         else:
    #             return jsonify({'error': 'No results found for the given title'})

    #     except urllib.error.URLError as e:
    #         return jsonify({'error': str(e)})
        
