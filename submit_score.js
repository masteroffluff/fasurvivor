
const URL = "http://127.0.0.1:5000"

var public_key, sessionId

function generateNonce() {
    return crypto.getRandomValues(new Uint8Array(16)).join('');
}



// When the exam black box produces a score
async function score_submit(score) {

    const response = await fetch(URL + '/public-key');
    const keyData = await response.json();
    const publicKeyB64 = keyData.public_key;
    const sessionId = keyData.session_id // remove
    console.log({publicKeyB64, sessionId})

    const serverPublicKey = await importPublicKey(publicKeyB64);
    //const sessionId = receivedSessionId;
    const nonce = generateNonce();

    let submission = {
        sessionId: sessionId,
        score: score,
        timestamp: new Date().toISOString(),
        nonce: nonce
    };

    // Encrypt the submission using the server's public key
    const encryptedData = await encryptWithPublicKey(JSON.stringify(submission), serverPublicKey);

    // Send the encrypted submission to the server
    try {
        console.log(JSON.stringify({ data: encryptedData }))
        const response = await fetch(URL + '/submit_score', {
            method: 'POST',
            body: JSON.stringify({ data: encryptedData }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            
            throw new Error('Submission failed');
        }
        
        const result = await response.json();
        console.log('Submission successful:', result);
    } catch (error) {
        console.error('Error submitting score:', error);
        console.error(response)
    }
}

async function importPublicKey(publicKeyB64) {

    // Convert base64 to ArrayBuffer
    const binaryDer = Uint8Array.from(atob(publicKeyB64), c => c.charCodeAt(0)).buffer;

    // Import the key
    const publicKey = await crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
    return publicKey;
}



// Helper function to encrypt data with the public key
async function encryptWithPublicKey(data, publicKey) {
    const encoded = new TextEncoder().encode(data);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        encoded
    );
    return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
}

async function get_Public_key(){
    const response = await fetch(URL + '/public-key');
    const key_data = await response.json();
   public_key = key_data.public_key
   sessionId = key_data.session_id

}

async function score_login(user, password){
    constent = {
        method: 'POST',
        body: JSON.stringify({ user, password }),
        headers: { 'Content-Type': 'application/json' }
    }
    const response = await fetch(URL + '/login');
    if(response.ok){
        console.log("login successful")
        await get_Public_key()
        return true
    } else {
        return false
    }
}