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
    errorMessageElement.textContent = "يرجى ملء جميع الحقول المطلوبة.";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
    return;
  } else {
    errorMessageElement.textContent = "";
  }

  if (newPassword.length < 8) {
    errorMessageElement.textContent = "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else if (!/[A-Z]/g.test(newPassword)) {
    errorMessageElement.textContent = "يجب أن تحتوي كلمة المرور الجديدة على حرف كبير واحد على الأقل";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else if (!/[1234567890]/.test(newPassword)) {
    errorMessageElement.textContent = "يجب أن تحتوي كلمة المرور الجديدة على رقم واحد على الأقل";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else if (!/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(newPassword)) {
    errorMessageElement.textContent = "يجب أن تحتوي كلمة المرور الجديدة على حرف خاص واحد على الأقل";
    signUpButton.classList.add("vibrate");
    setTimeout(() => {
      signUpButton.classList.remove("vibrate");
    }, 650);
  } else {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(emailField.value, passwordField.value);
      redirectToCompleteProfile(emailField.value);
    } catch (error) {
      console.error("خطأ في تسجيل المستخدم:", error.message);
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
      console.log(`الملف JSON لبريد ${user.email} موجود.`);
      const urlParams = new URLSearchParams(window.location.search);
      const directURL = urlParams.get("directURL");
      if (directURL) {
        const decodedDirectURL = decodeURIComponent(directURL);
        window.location.href = decodedDirectURL;
      } else {
        window.location.href = "ar-home";
      }
    } else {
      console.log(`الملف JSON لبريد ${user.email} غير موجود.`);
      redirectToCompleteProfile(user.email);
    }
  });
}

// إضافة الكود لحدث زر تسجيل الدخول بواسطة Google هنا
document.addEventListener("DOMContentLoaded", () => {
  const googleSignInButton = document.getElementById("google-signin-button");
  googleSignInButton.addEventListener("click", async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      console.log("تسجيل دخول Google ناجح:", user);

      // معالجة تسجيل الدخول بواسطة Google
      handleGoogleSignIn(user);
    } catch (error) {
      console.error("خطأ في تسجيل الدخول بواسطة Google:", error);
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
    errorMessageElement.textContent = "يرجى ملء جميع الحقول المطلوبة.";
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
    console.error("خطأ في تسجيل الدخول:", error.message);
    errorMessageElement.textContent = customError(error.code, error.message);
    signInButton.classList.add("vibrate");
    setTimeout(() => {
      signInButton.classList.remove("vibrate");
    }, 650);
  }
}

function hideErrorMessage(field) {
  field.style.color = ""; // إعادة تعيين لون النص
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
            window.location.href = "ar-home";
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

  // نفترض أنك ترغب في حفظ البيانات المخصصة للملف
  const customMetadata = {
    token: token,
    email: email,
    tokenExpiration: tokenExpiration
  };
  await CompleteUserDataRef.updateMetadata({ customMetadata });

  // إعادة التوجيه أو القيام بإجراءات أخرى
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const directURL = urlParams.get("directURL");
    if (directURL) {
      const encodedCurrentURL = encodeURIComponent(directURL);
      window.location.href = `ar-complete-profile?email=${email}&token=${token}&directURL=${encodedCurrentURL}`;
    } else {
      window.location.href = `ar-complete-profile?email=${email}&token=${token}`;
    }
  } catch {  
    console.error("خطأ في تعيين بيانات المستخدم:", error);
  }
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
      window.location.href = "ar";
    })
    .catch((error) => {
      console.error("خطأ في تسجيل الخروج", error);
    });
}

function customError(errorCode, errorMessage) {
  // تعريف رسائل الخطأ المخصصة استنادًا إلى رموز الأخطاء
  const customErrorMessages = {
    "auth/user-not-found": "لم يتم العثور على مستخدم بهذا البريد الإلكتروني.",
    "auth/wrong-password": "كلمة المرور التي أدخلتها غير صحيحة.",
    "auth/internal-error": "البريد الالكتروني لمة المرور التي أدخلتها غير صحيحة",
    "auth/invalid-email": "عنوان البريد الإلكتروني الذي أدخلته غير صالح.",
    "auth/weak-password": "كلمة المرور التي قدمتها ضعيفة جدًا."
  };

  // إرجاع رسالة الخطأ المخصصة أو الرسالة الافتراضية
  return customErrorMessages[errorCode] || errorMessage;
}
