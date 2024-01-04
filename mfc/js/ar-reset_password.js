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
      errorMessageReset.textContent = customError(error.code, error.message);
      resetButton.classList.add("vibrate");
      setTimeout(() => {
        resetButton.classList.remove("vibrate");
      }, 650);
    });

  firebase.auth().sendPasswordResetEmail(emailInput.value)
    .then(() => {
      showNotification("تم إرسال بريد إعادة تعيين كلمة المرور!");
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
    errorMessageReset.textContent = "كلمات المرور غير متطابقة.";
    updatePasswordButton.classList.add("vibrate");
    setTimeout(() => {
      updatePasswordButton.classList.remove("vibrate");
    }, 650);
    return;
  }
  firebase.auth().confirmPasswordReset(oobCode, newPassword)
    .then(() => {
      errorMessageReset.textContent = "";
      window.location.href = "ar-forgot-password?mode=successPassword";
    })
    .catch((error) => {

      if (error.code === "auth/invalid-action-code") {
        window.location.href = "ar-error?error=Page%20expired.";
      }
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
    "auth/user-not-found": "لم يتم العثور على مستخدم بهذا البريد الإلكتروني.",
    "auth/wrong-password": "كلمة المرور التي أدخلتها غير صحيحة.",
    "auth/invalid-email": "عنوان البريد الإلكتروني الذي أدخلته غير صالح.",
    "auth/weak-password": "كلمة المرور التي قدمتها ضعيفة جدًا. يجب أن تكون على الأقل 8 أحرف وتحتوي على مزيج من الحروف الكبيرة والصغيرة والأرقام والأحرف الخاصة."
  };

  // Return the custom error message or the default message
  return customErrorMessages[errorCode] || errorMessage;
}
