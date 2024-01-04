const urlParams = new URLSearchParams(window.location.search);
const Pagemode = urlParams.get("mode");
const oobCode = urlParams.get("oobCode");
const apiKey = urlParams.get("apiKey");
const lang = urlParams.get("lang");
const editforget = document.querySelectorAll('.forget');
const editreset = document.querySelectorAll('.reset');
const editsuccess = document.querySelectorAll('.success');
const resetButton = document.getElementById("resetButton");
const updatePasswordButton = document.getElementById("updatePasswordButton");


if (Pagemode === "resetPassword") {
  editforget[0].classList.add('hidden');
  editreset[0].classList.remove('hidden');
} else if (Pagemode === "successPassword") {
  editforget[0].classList.add('hidden');
  editsuccess[0].classList.remove('hidden');
}

const emailInput = document.getElementById("signup-email");
const errorMessageElement = document.getElementById("password_error_message");

// Add click event listener to the reset button
resetButton.addEventListener("click", () => {
    firebase.auth().fetchSignInMethodsForEmail(emailInput.value)
      .then(function(signInMethods) {
        // If signInMethods is empty, there are no accounts with this email.
        
      })
      .catch(function(error) {
        console.error("Error checking for user:", error);
        errorMessageElement.textContent = customError(error.code, error.message);
        resetButton.classList.add("vibrate");
        setTimeout(() => {
          resetButton.classList.remove("vibrate");
        }, 650);
      });

  
    firebase.auth().sendPasswordResetEmail(emailInput.value)
        .then(() => {
            showNotification("Password reset email sent!");
            errorMessageElement.textContent = "";
        })
        .catch(error => {
            console.error("Error sending password reset email:", error);
            errorMessageElement.textContent = customError(error.code, error.message);
            resetButton.classList.add("vibrate");
            setTimeout(() => {
              resetButton.classList.remove("vibrate");
            }, 650);
        });
});



let popuptimeoutId;
function showNotification(message) {
  const notificationPopup = document.getElementById("notification-popup");
  const closeNotificationButton = document.getElementById("close-button");
  const notificationContent = notificationPopup.querySelector(".notification-content");

  // Set the notification message
  notificationContent.querySelector("p").textContent = message;

  // Show the notification
  notificationPopup.style.display = "block";
  clearTimeout(popuptimeoutId);
  
  popuptimeoutId = setTimeout(() => {
      notificationPopup.style.display = "none";
    }, 4000);

  // Close the notification when the close button is clicked
  closeNotificationButton.addEventListener("click", function() {
    notificationPopup.style.display = "none";
    clearTimeout(popuptimeoutId);
  });
}





// Elements
const newPasswordInput = document.getElementById("new-password-change");
const confirmPasswordInput = document.getElementById("confirm-password-change");
const errorMessageReset = document.getElementById("password_reset_error_message");

// Add an event listener to the update password button
updatePasswordButton.addEventListener("click", () => {
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    // Check if passwords match
    if (newPassword !== confirmPassword) {
        errorMessageReset.textContent = "Passwords do not match.";
        updatePasswordButton.classList.add("vibrate");
        setTimeout(() => {
          updatePasswordButton.classList.remove("vibrate");
        }, 650);
        return;
    }
    firebase.auth().confirmPasswordReset(oobCode, newPassword)
        .then(() => {
            errorMessageReset.textContent = "";
            window.location.href = "forgot-password?mode=successPassword";
        })
        .catch((error) => {
            errorMessageReset.textContent = customError(error.code, error.message);
            updatePasswordButton.classList.add("vibrate");
            setTimeout(() => {
              updatePasswordButton.classList.remove("vibrate");
            }, 650);
        });
});



function customError(errorCode, errorMessage) {
  // Define custom error messages based on error codes
  const customErrorMessages = {
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "The password you entered is incorrect.",
    "auth/invalid-email": "The email address you entered is not valid.",
    "auth/weak-password": "The password you provided is too weak. It should be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters."
  };

  // Return the custom error message or the default message
  return customErrorMessages[errorCode] || errorCode;
}


