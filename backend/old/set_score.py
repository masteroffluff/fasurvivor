from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import serialization
from flask import Flask, request, jsonify
import base64
import json
from datetime import datetime, timedelta
from flask_login import login_user, logout_user, LoginManager, login_required, current_user

from highscore import app

#app = Flask(__name__)

# Load the server's private key (in a real scenario, this would be securely stored)
with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None
    )

# In-memory storage for nonces (in production, use a proper database)
used_nonces = set()

@app.route('/submit_score', methods=['POST'])
@login_required
def submit_score():
    return "submit_score"
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
        timestamp = datetime.fromisoformat(submission['timestamp'])
        nonce = submission['nonce']
        
        # Verify the submission
        if not verify_submission(session_id, timestamp, nonce):
            return jsonify({"error": "Invalid submission"}), 400
        
        # Process the score (e.g., save to database)
        save_score(session_id, score)
        
        return jsonify({"message": "Score submitted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def verify_submission(session_id, timestamp, nonce):
    # Verify session ID (implement your session management logic here)
    if not is_valid_session(session_id):
        return False
    
    # Verify timestamp is within acceptable range (e.g., last 5 minutes)
    if datetime.utcnow() - timestamp > timedelta(minutes=5):
        return False
    
    # Verify nonce hasn't been used before
    if nonce in used_nonces:
        return False
    used_nonces.add(nonce)
    
    return True

def is_valid_session(session_id):
    # Implement your session validation logic here
    # For example, check against a database of active sessions
    return True  # Placeholder

def save_score(session_id, score):
    # Implement your score saving logic here
    # For example, save to a database
    print(f"Saving score {score} for session {session_id}")


print('set score')