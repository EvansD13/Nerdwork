import jwt
from functools import wraps
from flask import request, abort
from flask import current_app
import application.database.models as models

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data=jwt.decode(token, key=current_app.config["SECRET_KEY"], verify=True, algorithms=["HS256"] )
            current_user=models.User.query.filter_by(email=data["email"]).first()
            if current_user is None:
                return {
                "message": "Invalid Authentication token!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": data,
                "error": str(e)
            }, 500

        return func(current_user, *args, **kwargs)

    return decorated