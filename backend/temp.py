from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import serialization
from flask import Flask, request, jsonify, session as flask_session
import base64, uuid
import json
from datetime import datetime, timedelta, timezone


SECRET_KEY = b'b6M4CyDFtvXYFbQyHs7BT85ryH@NEQ9W'

app = Flask(__name__)
app.secret_key  = SECRET_KEY

print("temp")
# Load the server's private key (in a real scenario, this would be securely stored)
with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None
    )

# In-memory storage for nonces (in production, use a proper database)
used_nonces = set()

@app.route('/public-key', methods=['GET'])
def get_public_key():
    with open("public_key.pem", "rb") as key_file:
        pem_data = key_file.read()
    
    # Remove PEM headers and newlines
    pem_lines = pem_data.decode('utf-8').splitlines()
    key_base64 = ''.join(pem_lines[1:-1])  # Remove first and last lines
    
    session_id = str(uuid.uuid4())  # Generate a unique flask_session ID
    flask_session['session_id'] = session_id


    return jsonify({"public_key": key_base64, "session_id":session_id})


@app.route('/submit_score', methods=['POST'])
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

def save_score(session_id, score):
    print(f"Saving score {score} for flask_session {session_id}")

if __name__ == '__main__':
    app.run()  # Use 'adhoc' for development HTTPS