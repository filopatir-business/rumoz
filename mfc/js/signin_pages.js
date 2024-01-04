async function signUp() {
  const emailField = document.getElementById("signup-email");
  const passwordField = document.getElementById("signup-password");
  const errorMessageElement = document.getElementById("signup-error-message");
  const signUpButton = document.getElementById("signup-button");
  const newPassword = passwordField.value;

  const requiredFields = [
    { field: emailField, label: document.getElementById("email-label") },
    { field: passwordField, label: document.getElementById("password-label") }
  ];

  let hasMissingInfo = false;

  requiredFields.forEach(({ field, label, required }) => {
    if (!field.value) {
      label.classList.add("error-label");
      hasMissingInfo = true;
    } else {
      label.classList.remove("error-label");
      signUpButton.classList.remove("vibrate");
    }
  });

  if (hasMissingInfo) {
    errorMessageElement.textContent = "Please fill in all required fields.";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
    return;
  } else {
    errorMessageElement.textContent = "";
  }

  if (newPassword.length < 8) {
    errorMessageElement.textContent = "New password must be at least 8 characters long";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else if (!/[A-Z]/g.test(newPassword)) {
    errorMessageElement.textContent = "New password must contain at least one uppercase letter";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else if (!/[1234567890]/.test(newPassword)) {
    errorMessageElement.textContent = "New password must contain at least one digit";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else if (!/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(newPassword)) {
    errorMessageElement.textContent = "New password must contain at least one special character";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(emailField.value, passwordField.value);
      redirectToCompleteProfile(emailField.value)
    } catch (error) {
      console.error("Error registering user:", error.message);
      errorMessageElement.textContent = customError(error.code);
      signUpButton.classList.add("vibrate");
      setTimeout(() => {
        signUpButton.classList.remove("vibrate");
      }, 650);
    }
  }
}





async function handleGoogleSignIn(user) {
  checkIfJsonFileExists(user.email).then(fileExists => {
    if (fileExists) {
      console.log(`JSON file for ${user.email} exists.`);
      const urlParams = new URLSearchParams(window.location.search);
      const directURL = urlParams.get("directURL");
      if (directURL) {
        const decodedDirectURL = decodeURIComponent(directURL);
        window.location.href = decodedDirectURL;
      } else {
        window.location.href = "home";
      }
      
    } else {
      console.log(`JSON file for ${user.email} does not exist.`);
      redirectToCompleteProfile(user.email)
    }
  });
}




// Add the code for Google sign-in button event listener here
const googleSignInButton = document.addEventListener("DOMContentLoaded", () => {
  const googleSignInButton = document.getElementById("google-signin-button");
  googleSignInButton.addEventListener("click", async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      console.log("Google sign-in success:", user);

      // Handle Google sign-in
      handleGoogleSignIn(user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  });
});




async function signIn() {
  const emailField = document.getElementById("signup-email");
  const passwordField = document.getElementById("signup-password");
  const errorMessageElement = document.getElementById("signup-error-message");
  const signInButton = document.getElementById("signup-button");

  const requiredFields = [
    { field: emailField, label: document.getElementById("email-label") },
    { field: passwordField, label: document.getElementById("password-label") }
  ];

  let hasMissingInfo = false;

  requiredFields.forEach(({ field, label, required }) => {
    if (!field.value) {
      label.classList.add("error-label");
      hasMissingInfo = true;
    } else {
      label.classList.remove("error-label");
      signInButton.classList.remove("vibrate");
    }
  });

  if (hasMissingInfo) {
    errorMessageElement.textContent = "Please fill in all required fields.";
    signInButton.classList.add("vibrate");
    setTimeout(() => {
      signInButton.classList.remove("vibrate");
    }, 650);
    return;
  } else {
    errorMessageElement.textContent = "";
  }

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(emailField.value, passwordField.value);
  } catch (error) {
    console.error("Error signing in:", error.message);
    errorMessageElement.textContent = customError(error.code, error.message);
    signInButton.classList.add("vibrate");
    setTimeout(() => {
      signInButton.classList.remove("vibrate");
    }, 650);
  }
}



function hideErrorMessage(field) {
  field.style.color = ""; // Reset text color
}


function redirectSignedInUser() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const storageRef = firebase.storage().ref();
      const file = `profiles/${user.email}.json`
      storageRef.child(file).getMetadata()
        .then(getMetadata => {
          console.log(`JSON file for ${file} exists.`);
          const urlParams = new URLSearchParams(window.location.search);
          const directURL = urlParams.get("directURL");
          if (directURL) {
            const decodedDirectURL = decodeURIComponent(directURL);
            window.location.href = decodedDirectURL;
          } else {
            window.location.href = "home";
          }
        })
        .catch(error => {
          console.log(`JSON file for ${file} does not exist.`);
          redirectToCompleteProfile(user.email);
        });
      }
    });
}


document.addEventListener("DOMContentLoaded", redirectSignedInUser);



async function redirectToCompleteProfile(email) {
  const token = generateUserToken();
  const tokenExpiration = Date.now() + 12 * 60 * 60 * 1000;
  const storageRef = firebase.storage().ref();
  const filename = `complete_profile_data/${email}.json`;
  const CompleteUserData = {
    token: token,
    email: email,
    tokenExpiration: tokenExpiration
  };
  const CompleteUserDataJSON = JSON.stringify(CompleteUserData);
  const CompleteUserDataRef = storageRef.child(filename);

  await CompleteUserDataRef.putString(CompleteUserDataJSON);

  // Assuming you want to save the custom metadata for the file
  const customMetadata = {
    token: token,
    email: email,
    tokenExpiration: tokenExpiration
  };
  await CompleteUserDataRef.updateMetadata({ customMetadata });

  // Redirect or do other actions
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const directURL = urlParams.get("directURL");
    if (directURL) {
      const encodedCurrentURL = encodeURIComponent(directURL);
      window.location.href = `complete-profile?email=${email}&token=${token}&directURL=${encodedCurrentURL}`;
    } else {
      window.location.href = `complete-profile?email=${email}&token=${token}`;
    }
  } catch {  
    console.error("Error setting user data:", error);
  };
}

function generateUserToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 64;
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}


function signOut() {
  firebase.auth().signOut()
    .then(() => {
      window.location.href = "index";
    })
    .catch((error) => {
      console.error("Sign Out Error", error);
    });
}


function customError(errorCode, errorMessage) {
  // Define custom error messages based on error codes
  const customErrorMessages = {
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "The password you entered is incorrect.",
    "auth/invalid-email": "The email address you entered is not valid.",
    "auth/internal-error": "The email or the password you entered is incorrect.",
    "auth/weak-password": "The password you provided is too weak."
  };

  // Return the custom error message or the default message
  return customErrorMessages[errorCode] || errorMessage;
}