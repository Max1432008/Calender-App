from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash, check_password_hash

from models import engine, User
from add_user import create_user
#from auth import benutzer_abfragen


auth = Blueprint("auth", __name__)
Session = sessionmaker(bind=engine)

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    result = create_user(username=name, email=email, password=password)

    if not result["ok"]:
        return jsonify(success=False, error=result["error"]), 400
    
    session["user_id"] = result["user"]["id"]
    return jsonify(success=True, user=result["user"])

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    result = benutzer_abfragen(name, password, None)
    
    if not result["ok"]:
        return jsonify(success=False, error=result["error"]), 400
    
    session["user_id"] = result["id"]
    return jsonify(success=True)




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
