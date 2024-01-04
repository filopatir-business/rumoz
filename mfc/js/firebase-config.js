const firebaseConfig = {
  apiKey: "AIzaSyCV4M3hr_V5fZBwvhCiHDvOyGuQiMT2Yz8",
  authDomain: "mfc-website-6a8ef.firebaseapp.com",
  databaseURL: "https://mfc-website-6a8ef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mfc-website-6a8ef",
  storageBucket: "mfc-website-6a8ef.appspot.com",
  messagingSenderId: "633942967177",
  appId: "1:633942967177:web:a86be8ca8e617882341758",
  measurementId: "G-E84G6B0J8Q"
};

  
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();



//--------------------------------More----------------------------------//

if (window.location.pathname === '/index') {
  window.location.href = '/' + window.location.search;
}


if (window.location.pathname.split("/").pop() === "forgot-password") {
  const urlParams = new URLSearchParams(window.location.search);
  const Pagemode = urlParams.get("mode");
  if (Pagemode === "resetPassword") {
    const oobCode = urlParams.get("oobCode");
    checkResetPasswordCode(oobCode);
  }
} else if (window.location.pathname.split("/").pop() === "ar-forgot-password") {
  const urlParams = new URLSearchParams(window.location.search);
  const Pagemode = urlParams.get("mode");
  if (Pagemode === "resetPassword") {
    const oobCode = urlParams.get("oobCode");
    ARcheckResetPasswordCode(oobCode);
  }
}


function checkResetPasswordCode(oobCode) {
  firebase.auth().checkActionCode(oobCode)
      .then(() => {
        //console.log("Action code is valid.");
      })
     .catch((error) => {
        console.error("Error checking action code:", error);
        window.location.href = "error?error=Page%20expired.";
     });
}

function ARcheckResetPasswordCode(oobCode) {
  firebase.auth().checkActionCode(oobCode)
      .then(() => {
        //console.log("Action code is valid.");
      })
     .catch((error) => {
        console.error("Error checking action code:", error);
        window.location.href = "ar-error?error=Page%20expired.";
     });
}