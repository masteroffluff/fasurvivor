// mocked submit_score
// const URL = "https://chrischapman.cc/CodecademySurvivorsPy/";

// function generateNonce() {
//   return globalThis.crypto.getRandomValues(new Uint8Array(16)).join("");
// }
const highScore =  [{ Date: "Wed, 15 Jan 2025 00:00:00 GMT", Name: "fluffy", Score: 150 }, { Date: "Wed, 22 Jan 2025 00:00:00 GMT", Name: "dancey", Score: 4000 }]

async function score_submit(score) {

  // console.log({ publicKey, sessionId });

  // const serverPublicKey = await importPublicKey(publicKey);
  // //const sessionId = receivedSessionId;
  // const nonce = generateNonce();

  // let submission = {
  //   sessionId: sessionId,
  //   score: score,
  //   timestamp: new Date().toISOString(),
  //   nonce: nonce,
  // };

  // // Encrypt the submission using the server's public key
  // const encryptedData = await encryptWithPublicKey(
  //   JSON.stringify(submission),
  //   serverPublicKey
  // );

  // // Send the encrypted submission to the server
  // try {
  //   console.log(JSON.stringify({ data: encryptedData }));
  //   const response = await fetch(URL + "/submit_score", {
  //     method: "POST",
  //     body: JSON.stringify({ data: encryptedData }),
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //   });

  //   if (!response.ok) {
  //     throw new Error(response.error);
  //   }

  //   const result = await response.json();
  //   console.log("Submission successful:", result);
  //   return result
  // } catch (error) {
  //   console.error("Error submitting score:", error);
  //   console.error(response);
  // }
  const userHighScore = highScore.find((score=> score.name = login_name))
  userHighScore.Score = score
  userHighScore.Date = Date.now()
  return highScore;
}

async function check_login() {
  // const response = await fetch(URL + "/check-login", {
  //   headers: { "Content-Type": "application/json", credentials: "include" },
  //   credentials: "include",
  // });
  // const login_response =  await response.json();
  // if(login_response.logged_in){
    await get_Public_key()
    //gameState.highScore = highScore
  // }

  return !login_name==""

}

async function get_Public_key() {
  // const response = await fetch(URL + "/public-key", {
  //   headers: { "Content-Type": "application/json", credentials: "include" },
  //   credentials: "include",
  // });
  // try{
  // const key_data = await response.json();
  // publicKey = key_data.public_key;
  // sessionId = key_data.session_id;
  // return key_data
  // } catch(e) {
  //   console.log(e)
  //   console.log(response, response.body)
  // }
  publicKey = "public key";
  sessionId = "session id";
}

async function doLogin(user, password) {
  
    login_name = user;
    
    return true;

}

async function doLogout() {
  
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
  
}


async function score_register(user, password) {
  document.getElementById("preloader").style.display = "flex";
  // const content = {
  //   method: "POST",
  //   body: JSON.stringify({ user, password }),
  //   headers: { "Content-Type": "application/json" },
  //   credentials: "include",
  // };
  // const response = await fetch(URL + "/register", content);
  // if (response.ok) {
  //   console.log("register successful");

  // } else {
  //   document.getElementById("preloader").style.display = "none";
  //   return false;
  //   login_name = "";
  // }
  await get_Public_key();
  login_name = user;
  document.getElementById("preloader").style.display = "none";
  return "true";
}

async function get_highscore() {
  try {
    return await setInterval(()=>highScore,10000)
     
  } catch (error) {
    return `Probem with connection \n${error}`;
  }
}
