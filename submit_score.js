const URL = "https://chrischapman.cc/CodecademySurvivorsPy/";

function generateNonce() {
  return globalThis.crypto.getRandomValues(new Uint8Array(16)).join("");
}


async function score_submit(score) {

  console.log({ publicKey, sessionId });

  const serverPublicKey = await importPublicKey(publicKey);
  //const sessionId = receivedSessionId;
  const nonce = generateNonce();

  let submission = {
    sessionId: sessionId,
    score: score,
    timestamp: new Date().toISOString(),
    nonce: nonce,
  };

  // Encrypt the submission using the server's public key
  const encryptedData = await encryptWithPublicKey(
    JSON.stringify(submission),
    serverPublicKey
  );

  // Send the encrypted submission to the server
  try {
    console.log(JSON.stringify({ data: encryptedData }));
    const response = await fetch(URL + "/submit_score", {
      method: "POST",
      body: JSON.stringify({ data: encryptedData }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(response.error);
    }

    const result = await response.json();
    console.log("Submission successful:", result);
    return result
  } catch (error) {
    console.error("Error submitting score:", error);
    console.error(response);
  }
}

async function importPublicKey(publicKeyB64) {
  // Convert base64 to ArrayBuffer
  console.log(publicKeyB64)
  const binaryDer = Uint8Array.from(atob(publicKeyB64), (c) =>
    c.charCodeAt(0)
  ).buffer;

  // Import the key
  const publicKey = await globalThis.crypto.subtle.importKey(
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
      name: "RSA-OAEP",
    },
    publicKey,
    encoded
  );
  return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
}

async function check_login() {
  const response = await fetch(URL + "/check-login", {
    headers: { "Content-Type": "application/json", credentials: "include" },
    credentials: "include",
  });
  const login_response =  await response.json();
  if(login_response.logged_in){
    await get_Public_key()
    gameState.highScore = login_response.score
  }
  return login_response

}

async function get_Public_key() {
  const response = await fetch(URL + "/public-key", {
    headers: { "Content-Type": "application/json", credentials: "include" },
    credentials: "include",
  });
  try{
  const key_data = await response.json();
  publicKey = key_data.public_key;
  sessionId = key_data.session_id;
  return key_data
  } catch(e) {
    console.log(e)
    console.log(response, response.body)
  }
}

async function score_login(user, password) {
  document.getElementById("preloader").style.display = "flex";
  const content = {
    method: "POST",
    body: JSON.stringify({ user, password }),
    headers: { "Content-Type": "application/json", credentials: "include" },
    credentials: "include",
  };
  const response = await fetch(URL + "/login", content);
  if (response.ok) {
    console.log("login successful");
    await get_Public_key();
    login_name = user;
    document.getElementById("preloader").style.display = "none";
    return true;
  } else {
    document.getElementById("preloader").style.display = "none";
    return false;
    login_name = "";
  }
}

async function score_logout() {
  document.getElementById("preloader").style.display = "flex";
  const content = {
    method: "POST",
    body: JSON.stringify(),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  const response = await fetch(URL + "/logout", content);
  if (response.ok) {
    console.log("log out");
  }
  login_name = "";
  publicKey = "";
  sessionId = "";
  document.getElementById("preloader").style.display = "none";
}


async function score_register(user, password) {
  document.getElementById("preloader").style.display = "flex";
  const content = {
    method: "POST",
    body: JSON.stringify({ user, password }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  const response = await fetch(URL + "/register", content);
  if (response.ok) {
    console.log("register successful");
    await get_Public_key();
    login_name = user;
    document.getElementById("preloader").style.display = "none";
    return "true";
  } else {
    document.getElementById("preloader").style.display = "none";
    return false;
    login_name = "";
  }
}

async function get_highscore() {
  try {
    const content = {
      method: "GET",
    };
    const response = await fetch(URL + "/highscore", content);
    if (response.ok) {
      const highScore = await response.json();
      return highScore;
    } else {
      return "Problem With connection";
    }
  } catch (error) {
    return `Probem with connection \n${error}`;
  }
}
