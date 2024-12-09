from jose import jwe
import base64

def decrypt_jwe(token, secret_key_base64):
    try:
        # Decode the base64 secret key
        secret_key = base64.b64decode(secret_key_base64)
        
        # Decrypt the JWE
        decrypted_payload = jwe.decrypt(token, secret_key)
        return decrypted_payload
    except Exception as e:
        return f"Error decrypting token: {str(e)}"

# Usage
encrypted_token = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..acFC_7lRgoWfFAqu.L9U9tAtFuJYx1OcDxK2kMK8CMAGXGBaGdMjEXzgqVeLX6YalZk7Qda6rZ3O_O2PimKx6.-kQVbaKS6fExolyU2PwS6A"  # Copy this from JavaScript output
secret_key_base64 = "2k0FJ2c5Ixvvx0WiRUMHvNxJfoiyPnuhrhY1Hl7XHnA="  # Copy this from JavaScript output

decrypted_payload = decrypt_jwe(encrypted_token, secret_key_base64)
print("Decrypted Payload:", decrypted_payload)