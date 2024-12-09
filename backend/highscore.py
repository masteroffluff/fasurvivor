from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, LoginManager, login_required, current_user
import jwt
import datetime
import json

from cryptography.hazmat.primitives import serialization

from model import session, User, HighScore


with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None
    )

with open("public_key.pem", "rb") as key_file:
    public_key = serialization.load_pem_public_key(
        key_file.read()
    )




SECRET_KEY = b'b6M4CyDFtvXYFbQyHs7BT85ryH@NEQ9W'

app = Flask(__name__)
app.secret_key  = SECRET_KEY

#SqlAlchemy Database Configuration With Mysqlpip list

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/highscore'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


login_manager = LoginManager()

login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return session.query(User).get(user_id)

@app.route('/holla')
@login_required
def holla():
    return str(current_user.id)

# testing
@app.route("/highscore", methods=['GET'])
def highscore():
    try:
        high_scores=session.query(HighScore).order_by(HighScore.score.desc()).all()
        output = []
        for high_score in high_scores:
            user = session.query(User).get(high_score.user)
            output.append({"Name":user.name, "Score":high_score.score, "Date":high_score.date})

        return output
    except Exception as e:
        print("Error while connecting to MySQL", e)
        return jsonify({"error": "Failed to connect to the database."}), 500


    # finally:
    #     pass
    # return "<p>no data</p>"


@app.route('/login', methods=['POST'])
def login():
    data = request.form
    user_name = data['user']
    user_password = data['password']
    user = session.query(User).filter_by(name=user_name).first()
    if user == None :
        return jsonify({"error": "User name not found."}), 400
    if(not check_password_hash(password=user_password, pwhash = user.password_hash)):
        return jsonify({"error": "Login Failed"}), 400
    login_user(user, remember = True)
    return jsonify({"sucess": f"Logged in {user_name}"}), 500
    
# def decrypt_jwe(encrypted_jwt):
#     try:
#         # Parse the received token
#         token = jwt.JWT(key=SECRET_KEY, jwt=encrypted_jwt)
#         # Decrypt and verify claims
#         payload = token.claims
#         return jsonify({"status": "success", "data": payload}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 400


def decrypt_and_decode(token, secret_key, algorithm='HS256'):
    try:
        # Decode and verify the JWT
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        return "Token has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"



# @app.route('/submit_score', methods=['POST'])
# @login_required
# def submit_score():
#     # try:
#         # Extract the encrypted JWT from the request
#     data = request.form
#     encrypted_jwt = data['token']

#     if not encrypted_jwt:
#         return jsonify({"error": "Missing token"}), 400

#     # Decrypt and validate the JWT
    
#     return decrypt_and_decode(encrypted_jwt, SECRET_KEY)

#     # except Exception as e:
#     #     return jsonify({"error": str(e)}), 500


#     highscore = HighScore(user = user_id,score = score)
#     session.add(highscore)
#     session.commit()

@app.route('/register', methods=['POST'])
def register():
    # body is username, email and password
    data = request.form
    user_name = data['user']
    #user_email = data['email']
    user_password = data['password']
    try:
        user_exists = session.query(User).filter_by(name=user_name).first() != None
        if(user_exists):
            return jsonify({"error": "User name already exists."}), 400
        hashed_password = generate_password_hash(user_password)
        user = User(name=user_name, password_hash=hashed_password)
        session.add(user)
        session.commit()
        login_user(user, remember = True)
        return jsonify({"sucess": "Created user {user_name}."}), 200
    except:
        return jsonify({"error": "Failed to create user"}), 500
    



@app.route('/logout')
@login_required
def logout():
    logout_user()
    return 'Logged out'

@app.route('/reset')
def reset():
    users = session.query(User).all()
    for user in users:
        user.password_hash = generate_password_hash(user.name + "1")
    session.commit()
    return "ok"

import set_score 

for rule in app.url_map.iter_rules():
    print (rule)

if __name__ == "__main__":
    app.run(debug=True)

    