from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, LoginManager, login_required, current_user

from model import session, User, HighScore



app = Flask(__name__)
app.secret_key = b'shhhSuperSecret'

#SqlAlchemy Database Configuration With Mysql
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/highscore'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


login_manager = LoginManager()

login_manager.init_app(app)


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
    return jsonify({"sucess": f"Logged in {user_name}"}), 500
    

@app.route('/submit_score')
@login_required
def submit_score():
    pass

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
        login_user(user_name, remember = True)
        return jsonify({"sucess": "Created user {user_name}."}), 200
    except:
        return jsonify({"error": "Failed to create user"}), 500
    

@app.route('/holla')
@login_required
def holla():
    return "holla"

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

if __name__ == "__main__":
    app.run(debug=True)