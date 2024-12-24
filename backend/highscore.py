import sys, logging

# # Configure logging
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

# # File handler for logs
# open('./app.log', 'w').close()
# file_handler = logging.FileHandler('./app.log')
# file_handler.setLevel(logging.INFO)
# file_formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s')
# file_handler.setFormatter(file_formatter)
# logger.addHandler(file_handler)

# # Console handler for logs
# console_handler = logging.StreamHandler(sys.stdout)
# console_handler.setLevel(logging.INFO)
# console_formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s')
# console_handler.setFormatter(console_formatter)
# logger.addHandler(console_handler)

# # Redirect stdout and stderr to logs
# stdout_logger = logging.getLogger('STDOUT')
# stderr_logger = logging.getLogger('STDERR')

# class StreamToLogger:
#     def __init__(self, logger, level):
#         self.logger = logger
#         self.level = level

#     def write(self, message):
#         if message.strip():  # Ignore empty messages
#             self.logger.log(self.level, message.strip())

#     def flush(self):
#         pass  # Required for compatibility with sys.stdout and sys.stderr

# sys.stdout = StreamToLogger(stdout_logger, logging.INFO)
# sys.stderr = StreamToLogger(stderr_logger, logging.ERROR)

try:
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.asymmetric import padding, rsa
    from cryptography.hazmat.primitives import serialization

    from flask import Flask, jsonify, request, session as flask_session
    from werkzeug.security import generate_password_hash, check_password_hash
    from flask_login import login_user, logout_user, LoginManager, login_required, current_user
    from flask_cors import CORS, cross_origin

    import base64, uuid, jwt, datetime, json
    from datetime import datetime, timedelta, timezone
    import os
    from dotenv import load_dotenv

    load_dotenv()

    from cryptography.hazmat.primitives import serialization

    from flask import Flask

    app = Flask(__name__)

    # Configure logging

    open('./app.log', 'w').close()
    logging.basicConfig(
        filename='./app.log',  # Path to log file
        level=logging.INFO,  # Set logging level to INFO
        format='%(asctime)s %(levelname)s: %(message)s'  # Log format
    )

    # Log a startup message
    app.logger.info("Flask application has started.")


except Exception as e:
    # app.logger.error(f"An error occurred: {e}")
    # sys.stderr.write(e)
    logging.error('Error at %s', 'division', exc_info=e)
    exit(1)
# app.logger.addHandler(console_handler)



try:
    from model import session, User, HighScore
    if session == None:
        raise Exception("Model failed to load")
except Exception as e:
    app.logger.error(f"Error while connecting to MySQL: {e}")
    print("Error while connecting to MySQL", e)
    print("is the database switched on")
    exit(1)

app.logger.info(f"Database connected")

try:
    ORIGIN = os.getenv('ORIGIN')
    SECRET_KEY = os.environb[b'SECRET_KEY']
    app = Flask(__name__)
    app.secret_key  = SECRET_KEY
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    used_nonces = set()

    #SqlAlchemy Database Configuration With Mysqlpip list
    HOST = os.getenv('HOST')
    USER = os.getenv('USER_NAME')
    PASSWORD = os.getenv('PASSWORD')
    DATABASE = os.getenv('DATABASE')
    PORT = os.getenv('PORT')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    login_manager = LoginManager()
    login_manager.init_app(app)

    with open("private_key.pem", "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )

    with open("public_key.pem", "rb") as key_file:
        public_key = serialization.load_pem_public_key(
            key_file.read()
        )
except Exception as e:
    app.logger.error(f"Error while setting up: {e}")
    print("Error while connecting to MySQL", e)
    exit(1)


@app.route('/')
def home():
    return 'Welcome to Codecademy Survivors!'


@app.route('/check-login')
@cross_origin(origins=ORIGIN, supports_credentials=True)
def check_login():
    try:
        if current_user.is_authenticated:
            user_id = current_user.id
            current_record = session.query(HighScore).filter_by(user=user_id).first()
            score = 100
            if(current_record  != None):
                score = current_record.score
            return jsonify({'logged_in':True,'login_name':current_user.name, 'score':score})
        else:
            return jsonify({'logged_in':False})
    except Exception as e:
        app.logger.error(f"Error /check-login: {e}")
        print("Error /check-login", e)
        exit(1)


@app.route('/public-key', methods=['GET'])
@login_required
@cross_origin(origins=ORIGIN, supports_credentials=True)
def get_public_key():
    with open("public_key.pem", "rb") as key_file:
        pem_data = key_file.read()
    
    # Remove PEM headers and newlines
    pem_lines = pem_data.decode('utf-8').splitlines()
    key_base64 = ''.join(pem_lines[1:-1])  # Remove first and last lines
    if(not 'session_id' in flask_session):
        session_id = str(uuid.uuid4())  # Generate a unique session ID
        flask_session['session_id'] = session_id

    
    return jsonify({"public_key": key_base64, "session_id":(flask_session['session_id'])})



@login_manager.user_loader
def load_user(user_id):
    return session.query(User).get(user_id)

@app.route('/holla')
def holla():
    return "Holla!"

@app.route("/highscore", methods=['GET'])
@cross_origin(origins=ORIGIN, supports_credentials=True)
def highscore():
    try:
        # high_scores=session.query(HighScore).order_by(HighScore.score.desc()).all()
        # output = []
        # for high_score in high_scores:
        #     user = session.query(User).get(high_score.user)
        #     output.append({"Name":user.name, "Score":high_score.score, "Date":high_score.date})
        high_scores = (
            session.query(HighScore, User)
            .join(User, HighScore.user == User.id)
            .order_by(HighScore.score.desc()).all()
            )
        output = [
        {"Name": user.name, "Score": high_score.score, "Date": high_score.date} 
        for high_score, user in high_scores
        ]
        return output
    except Exception as e:
        print("Error get /highscore", e)
        app.logger.error(f"Error /highscore: {e}")
        return jsonify({"error": "Failed to connect to the database."}), 500



@app.route('/login', methods=['POST'])
@cross_origin(origins=ORIGIN, supports_credentials=True)
def login():
    try:
        data = request.json
        user_name = data['user']
        user_password = data['password']
        user = session.query(User).filter_by(name=user_name).first()
        if user == None :
            return jsonify({"error": "User name not found."}), 400
        if(not check_password_hash(password=user_password, pwhash = user.password_hash)):
            app.logger.error(f"Login error no password \n {user.password_hash} vs {generate_password_hash(user_password)}")
            return jsonify({"error": "Login Failed, no password match"}), 400
        login_user(user, remember = True)
        user_id = user.id
        current_record = session.query(HighScore).filter_by(user=user_id).first()
        score = 100
        if(current_record  != None):
            score = current_record.score
        return jsonify({"sucess": f"Logged in {user_name}", "score": score}), 200
    except Exception as e:
        print("Error get /login", e)
        app.logger.error(f"Error /login: {e}")
        return "error /login", 500   
    

@app.route('/register', methods=['POST'])
@cross_origin(origins=ORIGIN, supports_credentials=True)
def register():
    # body is username, email and password
    try:
        data = request.json
        
        user_name = data['user']
        #user_email = data['email']
        user_password = data['password']
    except Exception as e:
        # return jsonify({"error": e}), 500
        return "error /register", 500
    try:
        user_exists = session.query(User).filter_by(name=user_name).first() != None
        if(user_exists):
            return jsonify({"error": "User name already exists."}), 400
        hashed_password = generate_password_hash(user_password)
        app.logger.info({hash:hashed_password})
        user = User(name=user_name, password_hash=hashed_password)
        session.add(user)
        session.commit()
        login_user(user, remember = True)
        return jsonify({"sucess": f"Created user {user_name}."}), 200
    except Exception as e:
        app.logger.error(f"Error /register: {e}")
        return jsonify({"error": "Failed to create user"}), 500
    



@app.route('/logout', methods=['POST'])
@cross_origin(origins=ORIGIN, supports_credentials=True)
@login_required
def logout():
    logout_user()
    return 'Logged out'

@app.route('/submit_score', methods=['POST'])
@cross_origin(origins=ORIGIN, supports_credentials=True)
def submit_score():
    try:
        # Get the encrypted data from the request
        encrypted_data = request.json['data']
        
        # Decode the base64 encrypted data
        encrypted_bytes = base64.b64decode(encrypted_data)
        
        # Decrypt the data using the private key
        decrypted_bytes = private_key.decrypt(
            encrypted_bytes,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        # Parse the decrypted JSON data
        submission = json.loads(decrypted_bytes.decode('utf-8'))
        
        # Extract submission details
        session_id = submission['sessionId']
        score = submission['score']
        
        parsed_time = datetime.strptime(submission['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')

        # Make parsed_time timezone-aware
        timestamp = parsed_time.replace(tzinfo=timezone.utc)
        nonce = submission['nonce']
        
        # Verify the submission
        if not verify_submission(session_id, timestamp, nonce):
            return jsonify({"error": "Invalid submission"}), 400
        
        # Process the score (e.g., save to database)
        high_score_table = save_score(session_id, score, timestamp)
        return highscore()
        
        #return jsonify(high_score_table), 200
    
    except Exception as e:
        app.logger.error(f"Error /submit_score: {e}", exc_info=True)
        #print({"error /submit_score": str(e)})
        return jsonify({"error": "Error in submit score"} ), 500

def verify_submission(session_id, timestamp, nonce):
    # Verify flask_session ID (implement your flask_session management logic here)
    if not is_valid_session(session_id):
        return False
    
    # Verify timestamp is within acceptable range (e.g., last 5 minutes)
    if datetime.now(timezone.utc) - timestamp > timedelta(minutes=5):
        return False
    
    # Verify nonce hasn't been used before
    if nonce in used_nonces:
        return False
    used_nonces.add(nonce)
    
    return True

def is_valid_session(session_id):
    return flask_session['session_id'] == session_id

def save_score(session_id, score, time_stamp):
    # get username
    try:
        user_id = current_user.id
        # find old record
        current_record = session.query(HighScore).filter_by(user=user_id).first()
        # delete onld recors
        if(current_record  != None):
            session.delete(current_record)
        # create new record
        new_record = HighScore(
            user = user_id,
            date = time_stamp,
            score = score
        )
        # append new record
        session.add(new_record)
        # commit
        session.commit()

    except Exception as e:
        app.logger.error(f"Error in save_score: {e}")
        print({'error in save_score':e})
        session.rollback()


print("Active routes:")
for rule in app.url_map.iter_rules():
    print (rule)

if __name__ == "__main__":
    app.run(debug=True)

    