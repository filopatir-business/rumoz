const profilePic = document.getElementById("profile-pic");
const userDataString = localStorage.getItem("user_data");
const userData = JSON.parse(userDataString);

  

async function completeProfileSignUp() {
  const nameField = document.getElementById("signup-name");
  const UsernameField = document.getElementById("new_username");
  const genderField = document.getElementById("signup-gender");
  const birthdayField = document.getElementById("signup-birthday");
  const positionField = document.getElementById("signup-position");
  const UsernameLable = document.getElementById("username-label");
  const errorMessageElement = document.getElementById("signup-error-message");
  const googleSignUpButton = document.getElementById("google-signup-button");

  const requiredFields = [
    { field: nameField, label: document.getElementById("name-label") },
    { field: UsernameField, label: document.getElementById("username-label") },
    { field: genderField, label: document.getElementById("gender-label"), required: true },
    { field: birthdayField, label: document.getElementById("birthday-label") },
    { field: positionField, label: document.getElementById("position-label"), required: true }
  ];
  const googleSignUpEmailField = document.getElementById("google-signup-email");

  const urlParams = new URLSearchParams(window.location.search);
  const savedEmail = urlParams.get('email');

  let hasMissingInfo = false;

  requiredFields.forEach(({ field, label, required }) => {
    if (!field.value || (required && field.value === "click_to_choose")) {
      label.classList.add("error-label");
      hasMissingInfo = true;
    } else {
      label.classList.remove("error-label");
      googleSignUpButton.classList.remove("vibrate");
    }
  });

  if (hasMissingInfo) {
    errorMessageElement.textContent = "Please fill in all required fields.";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    return;
  } else {
    errorMessageElement.textContent = "";
  }

  const storageRef = firebase.storage().ref();
  const UsersUsernmaeRef = storageRef.child('details/username.json');
  const usernametakenTF = await userIDimrtadata(new_username.value, UsersUsernmaeRef);
  const userFileRef = storageRef.child(`profiles/${savedEmail}.json`);
  const new_usernameNEWValue = new_username.value.replace(/[^!@#$%^&*()_+{}[\]:;<>,.?~\\\ -/1234567890^a-zA-Z]/g, '');
  new_username.value = new_usernameNEWValue.toLowerCase();
  if (/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(new_username.value)) {
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
      UsernameLable.classList.add("error-label");
    change_username_error_message.textContent = "Username cannot contain these characters: ! @ # $ % ^ & * ( ) - + { } [ ] :  ; < > , ? ~ /.";
    change_username_done_message.textContent = "";
    return;
  } else if (new_username.value.includes(" ")) {
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    UsernameLable.classList.add("error-label")
     change_username_error_message.textContent = "Username cannot contain spaces.";
    change_username_done_message.textContent = "";
    return;
  } else if (new_username.value.length < 4) {
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    UsernameLable.classList.add("error-label")
    change_username_error_message.textContent = "Username must be at least 4 characters long.";
    change_username_done_message.textContent = "";
    return;
  } else if (new_username.value.length > 25) {
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    UsernameLable.classList.add("error-label")
    change_username_error_message.textContent = "Username cannot exceed 25 characters.";
    change_username_done_message.textContent = "";
    return;
  } else if (usernametakenTF) {
      googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    UsernameLable.classList.add("error-label")
    change_username_error_message.textContent = "Username is already taken.";
    change_username_done_message.textContent = "";
    return;
  } else {
    UsernameLable.classList.remove("error-label")
    change_username_error_message.textContent = "";
    change_username_done_message.textContent = "Username is available.";
  }

  let languageUsedNow = "en";
  const deviceLanguage = navigator.language || navigator.userLanguage;
  if (deviceLanguage.startsWith("ar")) {
    languageUsedNow = "ar";
  } else {
    languageUsedNow = "en";
  }
  const fileInput = document.getElementById("profile-pic-input");
  const img = fileInput.files[0];
  const UsersIDRef = storageRef.child('details/userid.json');
  let savedUserID;
  do {
    savedUserID = makeUserID(birthdayField.value, genderField.value);
  } while (await userIDimrtadata(savedUserID, UsersIDRef))
  const UserIDMetadata = {
    [savedUserID]: savedEmail
  };
  await UsersIDRef.updateMetadata({ customMetadata: UserIDMetadata });
  const UserUsernameMetadata = {
    [new_username.value]: savedEmail
  };
  await UsersUsernmaeRef.updateMetadata({ customMetadata: UserUsernameMetadata });

  if (img) {
    const userData = {
      id: savedUserID,
      email: savedEmail,
      name: nameField.value,
      username: UsernameField.value,
      gender: genderField.value,
      birthday: birthdayField.value,
      position: positionField.value,
      coins: 0,
      servants: 0,
      profile_pic: `${savedEmail}.png`,
      theme_mode: "auto_theme",
      language: languageUsedNow
    };
    const userDataJSON = JSON.stringify(userData);
    const profilePicRef = storageRef.child(`/profile_picture/${savedEmail}.png`);
    const userFileRef = storageRef.child(`profiles/${savedEmail}.json`);
    await profilePicRef.put(img);
    await userFileRef.putString(userDataJSON);
    const customMetadata = {
      id: savedUserID,
      email: savedEmail,
      name: nameField.value,
      username: UsernameField.value,
      gender: genderField.value,
      birthday: birthdayField.value,
      position: positionField.value,
      coins: 0,
      servants: 0,
      profile_pic: `${savedEmail}.png`,
      theme_mode: "auto_theme",
      language: languageUsedNow
    };
    await userFileRef.updateMetadata({ customMetadata });
    addEmailToDisplayName(nameField.value, savedEmail);
  } else {
    const userData = {
      id: savedUserID,
      email: savedEmail,
      name: nameField.value,
      username: UsernameField.value,
      gender: genderField.value,
      birthday: birthdayField.value,
      position: positionField.value,
      coins: 0,
      servants: 0,
      profile_pic: "none",
      theme_mode: "auto_theme",
      language: languageUsedNow
    };
    const userDataJSON = JSON.stringify(userData);
    const userFileRef = storageRef.child(`profiles/${savedEmail}.json`);
    await userFileRef.putString(userDataJSON);
    const customMetadata = {
      id: savedUserID,
      email: savedEmail,
      name: nameField.value,
      username: UsernameField.value,
      gender: genderField.value,
      birthday: birthdayField.value,
      position: positionField.value,
      coins: 0,
      servants: 0,
      profile_pic: `none`,
      theme_mode: "auto_theme",
      language: languageUsedNow
    };
    await userFileRef.updateMetadata({ customMetadata });
    addEmailToDisplayName(nameField.value, savedEmail);
  }

  downloadQRCode(savedUserID, savedEmail);

  if (savedEmail) {
    const notificationFile = storageRef.child(`notifications/${savedEmail}.json`);
    const userData = {};
    const userDataJSON = JSON.stringify(userData);
    await notificationFile.putString(userDataJSON);
    const customMetadata = {
      '-1': '0',
      '0': '0'
    };
      notificationFile.updateMetadata({ customMetadata })
  }

  if (savedEmail) {
    const servantsFile = storageRef.child(`servants/${savedEmail}.json`);
    const userData = {};
    const userDataJSON = JSON.stringify(userData);
    await servantsFile.putString(userDataJSON);
    const customMetadata = {
      '0': '0'
    };
        servantsFile.updateMetadata({ customMetadata })
  }

  if (savedEmail) {
    const walletFile = storageRef.child(`wallet/${savedEmail}.json`);
    const userData = {};
    const userDataJSON = JSON.stringify(userData);
    await walletFile.putString(userDataJSON);
    const customMetadata = {
      '0': '0'
    };
        walletFile.updateMetadata({ customMetadata })
  }
  
  const filename = `complete_profile_data/${savedEmail}.json`;
  storageRef.child(filename).delete()
              .then(() => {
                console.log(`${filename} has been deleted.`);
              })
              .catch(error => {
                console.error("Error deleting file:", error);
              });
  const directURL = urlParams.get("directURL");

  // Use directURL if present, e.g., redirect after sign-up
  if (directURL) {
    const decodedDirectURL = decodeURIComponent(directURL);
    window.location.href = decodedDirectURL;
  } else {
    window.location.href = "home";
  }
}


const birthdayInput = document.getElementById("signup-birthday");
const minDate = new Date("1900-01-01").toISOString().split("T")[0];
birthdayInput.setAttribute("min", minDate);
const currentDate = new Date().toISOString().split("T")[0];
birthdayInput.setAttribute("max", currentDate);
birthdayInput.addEventListener("input", function() {
  birthdayInput.addEventListener("blur", function() {
    const nowyear = birthdayInput.value.split("-");
    if (birthdayInput.value < minDate) {
      const newyear = minDate.split("-");
      if (nowyear.length === 3) {
        nowyear[0] = newyear[0];
        birthdayInput.value = nowyear.join("-");
      }
    } else if (birthdayInput.value > currentDate) {
      const newyear = currentDate.split("-");
      if (nowyear.length === 3) {
        nowyear[0] = newyear[0];
        birthdayInput.value = nowyear.join("-");
        if (birthdayInput.value > currentDate) {
          birthdayInput.value = currentDate;
        }
      }
    }
  });
});


function hideErrorMessage(field) {
  field.style.color = ""; // Reset text color
}



function handleProfilePicChange() {
  const RemovePictureText = document.getElementById("remove-picture");
  const fileInput = document.getElementById("profile-pic-input");
  const profilePic = document.getElementById("profile-pic");

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      profilePic.src = event.target.result;
    };
    reader.readAsDataURL(file);
    RemovePictureText.textContent = "Remove Picture";
  }
}


function handleProfilePicRemove() {
    const RemovePictureText = document.getElementById("remove-picture");
    const profilePic = document.getElementById("profile-pic");
    const fileInput = document.getElementById("profile-pic-input");
    profilePic.src = "pictures/profile_pic_unknown.png";
    fileInput.value = "";
    RemovePictureText.textContent = "";
}


const newUsernameInput = document.getElementById("new_username");

newUsernameInput.addEventListener("input", async function() {
  const storageRef = firebase.storage().ref();
  const UsersIDRef = storageRef.child('details/username.json');
  const UsernameLable = document.getElementById("username-label");
  const usernametakenTF = await userIDimrtadata(new_username.value, UsersIDRef)
  const new_usernameNEWValue = new_username.value.replace(/[^!@#$%^&*()_+{}[\]:;<>,.?~\\\ -/1234567890^a-zA-Z]/g, '');
  new_username.value = new_usernameNEWValue.toLowerCase();
  if (/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(new_username.value)) {
      change_username_error_message.textContent = "Username cannot contain these characters: ! @ # $ % ^ & * ( ) - + { } [ ] :  ; < > , ? ~ /.";
    change_username_done_message.textContent = "";
    UsernameLable.classList.add("error-label")
  } else if (new_username.value.includes(" ")) {
                change_username_error_message.textContent = "Username cannot contain spaces.";
    change_username_done_message.textContent = "";
    UsernameLable.classList.add("error-label")
  } else if (new_username.value.length < 4) {
                change_username_error_message.textContent = "Username must be at least 4 characters long.";
    change_username_done_message.textContent = "";
    UsernameLable.classList.add("error-label")
  } else if (new_username.value.length > 25) {
                change_username_error_message.textContent = "Username cannot exceed 25 characters.";
    change_username_done_message.textContent = "";
    UsernameLable.classList.add("error-label")
  } else if (usernametakenTF) {
    change_username_error_message.textContent = "Username is already taken.";
    change_username_done_message.textContent = "";
    UsernameLable.classList.add("error-label")
  } else {
    UsernameLable.classList.remove("error-label")
    change_username_error_message.textContent = "";
    change_username_done_message.textContent = "Username is available.";
  }
});



async function userIDimrtadata(userID, fileRef) {
  try {
    const metadata = await fileRef.getMetadata();
    const customMetadata = metadata.customMetadata;
    return customMetadata.hasOwnProperty(userID);
  } catch (error) {
    return false;
  }
}


function makeUserID(birthday, gender) {
  const characters = '0123456789';
  const idCodeLength = 4;
  let idCode = '';
  for (let i = 0; i < idCodeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    idCode += characters.charAt(randomIndex);
  }

  let idgender = '';
  if (gender= "male") {
    const gendercharacters = '02468';
    const randomIndex = Math.floor(Math.random() * gendercharacters.length);
    idgender = gendercharacters.charAt(randomIndex);
  } else {
    const gendercharacters = '13579';
    const randomIndex = Math.floor(Math.random() * gendercharacters.length);
    idgender = gendercharacters.charAt(randomIndex);
  }

  let idbirthday = '';
  const Userbirthday = birthday.split("-");
  if (parseInt(Userbirthday[0]) > 2000) {
    const birthdaycharacters = '01234';
    const randomIndex = Math.floor(Math.random() * birthdaycharacters.length);
    idbirthday = birthdaycharacters.charAt(randomIndex);
  } else {
    const birthdaycharacters = '56789';
    const randomIndex = Math.floor(Math.random() * birthdaycharacters.length);
    idbirthday = birthdaycharacters.charAt(randomIndex);
  }

  let birthyearid = parseInt(Userbirthday[0]) % 100;
  if (birthyearid < 10) {
    birthyearid = '0' + birthyearid;
  }


  let id = idCode + Userbirthday[2] + Userbirthday[1] + birthyearid + idbirthday + idgender;
  return id;
}


async function addEmailToDisplayName(displayName, newEmail) {
    try {
        const displaynameRef = storage.ref("details/displayname.json");

        const metadata = await displaynameRef.getMetadata();
        const data = metadata.customMetadata;

        if (displayName in data) {
            const existingEmails = data[displayName].split('/*/');

            if (!existingEmails.includes(newEmail)) {
                existingEmails.push(newEmail);
                const updatedValue = existingEmails.join('/*/');

                await displaynameRef.updateMetadata({
                    customMetadata: {
                        ...data,
                        [displayName]: updatedValue
                    }
                });
            }
        } else {
            await displaynameRef.updateMetadata({
                customMetadata: {
                    ...data,
                    [displayName]: newEmail
                }
            });
        }
    } catch (error) {
        console.error("Error updating display name:", error);
    }
}


async function downloadQRCode(text, email) {
  const typeNumber = 3; // Adjust as needed
  const errorCorrectionLevel = 'L';
  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(text);
  qr.make();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = qr.getModuleCount();
  const cellSize = 6;
  canvas.width = canvas.height = size * cellSize;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      ctx.fillStyle = qr.isDark(row, col) ? '#000000' : '#ffffff';
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }

  const borderSize = 10;
  const newSize = size * cellSize + 2 * borderSize;
  
  const borderedCanvas = document.createElement('canvas');
  const borderedCtx = borderedCanvas.getContext('2d');
  borderedCanvas.width = borderedCanvas.height = newSize;
  
  borderedCtx.fillStyle = '#ffffff';
  borderedCtx.fillRect(0, 0, newSize, newSize);
  
  borderedCtx.drawImage(canvas, borderSize, borderSize, size * cellSize, size * cellSize);
  
  borderedCtx.drawImage(canvas, borderSize, borderSize, size * cellSize, size * cellSize);

  const storageRef = firebase.storage().ref();
  const dataURL = borderedCanvas.toDataURL('image/png');
  const blob = await fetch(dataURL).then((res) => res.blob());

  const qrFileRef = storageRef.child(`qrcode/${email}.png`);
  await qrFileRef.put(blob);
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
    "auth/weak-password": "The password you provided is too weak. It should be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters."
  };

  // Return the custom error message or the default message
  return customErrorMessages[errorCode] || errorMessage;
}