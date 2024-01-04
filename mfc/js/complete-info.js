const userDataString = localStorage.getItem("user_data");
const userData = JSON.parse(userDataString);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const storageRef = firebase.storage().ref();
      const file = `profiles/${user.email}.json`
      storageRef.child(file).getMetadata()
        .then(getMetadata => {
          position = getMetadata.customMetadata['position'];
          if (position > 0 && position != 5) {
            document.querySelector(".complete-P-form-servants").style.display = "flex";
          } else {
            document.querySelector(".complete-P-form").style.display = "flex";
          }
        })
        .catch(error => {
          console.log(`JSON file for ${file} does not exist.${error}`);
        });
      } else {
        console.error("Authentication error: No user is signed in.");
        window.location.href = "index";
      }
});


async function completeInfoSignUp() {
  const firstnameField = document.getElementById("signup-first-name");
  const firstnameARField = document.getElementById("signup-first-name-ar");
  const secondnameField = document.getElementById("signup-second-name");
  const secondnameARField = document.getElementById("signup-second-name-ar");
  const lastnameField = document.getElementById("signup-last-name");
  const lastnameARField = document.getElementById("signup-last-name-ar");
  const schoolField = document.getElementById("signup-school");
  const schoolARField = document.getElementById("signup-school-ar");
  const schoolSectionField = document.getElementById("signup-school-section");
  const schoolYearPrimaryField = document.getElementById("signup-school-primary-year");
  const schoolYearPreparatoryField = document.getElementById("signup-school-preparatory-year");
  const schoolYearSecondaryField = document.getElementById("signup-school-secondary-year");
  const phoneNumberField = document.getElementById("signup-phone-number");
  const phoneNumberCountryCodeField = document.getElementById("country-code");
  const addressField = document.getElementById("signup-address");
  const nationalIDField = document.getElementById("signup-national-id");
  const parentField = document.getElementById("signup-parent");
  const parentEmailField = document.getElementById("signup-parent-email");
  const parentPhoneNumberField = document.getElementById("signup-parent-phone-number");
  const parentphoneNumberCountryCodeField = document.getElementById("country-code-parent");
  const errorMessageElement = document.getElementById("signup-error-message");
  const googleSignUpButton = document.getElementById("google-signup-button");

  const requiredFields = [
    { field: firstnameField, label: document.getElementById("first-name-label") },
    { field: firstnameARField, label: document.getElementById("first-name-label-ar") },
    { field: secondnameField, label: document.getElementById("second-name-label") },
    { field: secondnameARField, label: document.getElementById("second-name-label-ar") },
    { field: lastnameField, label: document.getElementById("last-name-label") },
    { field: lastnameARField, label: document.getElementById("last-name-label-ar") },
    { field: schoolField, label: document.getElementById("school-label") },
    { field: schoolARField, label: document.getElementById("school-label-ar") },
    // { field: schoolSectionField, label: document.getElementById("school-section-label"), required: true },
    // { field: schoolYearPrimaryField, label: document.getElementById("school-primary-year-label"), required: true },
    { field: schoolYearPreparatoryField, label: document.getElementById("school-preparatory-year-label"), required: true },
    // { field: schoolYearSecondaryField, label: document.getElementById("school-secondary-year-label"), required: true },
    { field: phoneNumberField, label: document.getElementById("phone-number-label") },
    { field: addressField, label: document.getElementById("address-label") },
    { field: parentField, label: document.getElementById("parent-label"), required: true },
    { field: parentEmailField, label: document.getElementById("parent-email-label") },
    { field: parentPhoneNumberField, label: document.getElementById("parent-phone-number-label") },
  ];

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
  } else if (phoneNumberField.value.length < 6 || phoneNumberField.value.length > 15) {
    document.getElementById("phone-number-label").classList.add("error-label");
    errorMessageElement.textContent = "Invalid phone number.";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    return;
  } else if (nationalIDField.value.length != 14 && nationalIDField.value.length != 0) {
    document.getElementById("national-id-label").classList.add("error-label");
    errorMessageElement.textContent = "Invalid National ID.";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    document.getElementById("phone-number-label").classList.remove("error-label");
    return;
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(parentEmailField.value)) {
    document.getElementById("parent-email-label").classList.add("error-label");
    errorMessageElement.textContent = "Invalid email format";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    document.getElementById("phone-number-label").classList.remove("error-label");
    document.getElementById("national-id-label").classList.remove("error-label");
    return;
  } else if (parentPhoneNumberField.value.length < 6 || parentPhoneNumberField.value.length > 15) {
    document.getElementById("parent-phone-number-label").classList.add("error-label");
    errorMessageElement.textContent = "Invalid parent phone number.";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    document.getElementById("phone-number-label").classList.remove("error-label");
    document.getElementById("national-id-label").classList.remove("error-label");
    document.getElementById("parent-email-label").classList.remove("error-label");
    return;
  } else {
    document.getElementById("phone-number-label").classList.remove("error-label");
    document.getElementById("national-id-label").classList.remove("error-label");
    document.getElementById("parent-email-label").classList.remove("error-label");
    document.getElementById("parent-phone-number-label").classList.remove("error-label");
    errorMessageElement.textContent = "";
  }

  const storageRef = firebase.storage().ref();

  // let shoolYear;
  // if (schoolSectionField.value === "P") {
  //   shoolYear = schoolYearPrimaryField.value;
  // } else if (schoolSectionField.value === "M") {
  //   shoolYear = schoolYearPreparatoryField.value;
  // } else if (schoolSectionField.value === "S") {
  //   shoolYear = schoolYearSecondaryField.value;
  // }
  const shoolYear = schoolYearPreparatoryField.value;

  phoneNumberFinal = phoneNumberCountryCodeField.value + phoneNumberField.value.replace(/^0+/, '').replace(/\./g, '');
  parentPhoneNumberFinal = parentphoneNumberCountryCodeField.value + parentPhoneNumberField.value.replace(/^0+/, '').replace(/\./g, '');

  const FullName = firstnameField.value + " " + secondnameField.value + " " + lastnameField.value;
  const FullNameAR = firstnameARField.value + " " + secondnameARField.value + " " + lastnameARField.value;
  
  const userData = {
    firstname: firstnameField.value,
    middlename: secondnameField.value,
    lastname: lastnameField.value,
    firstnamear: firstnameARField.value,
    middlenamear: secondnameARField.value,
    lastnamear: lastnameARField.value,
    fullname: FullName,
    fullnameAR: FullNameAR,
    school: schoolField.value,
    schoolarab: schoolARField.value,
    schoolYear: shoolYear,
    phoneNumber: phoneNumberFinal,
    address: addressField.value,
    nationalID: nationalIDField.value,
    parent: parentField.value,
    parentEmail: parentEmailField.value,
    parentPhoneNumber: parentPhoneNumberFinal,
  };

  let schoolYearFileRef;
  if (shoolYear === "1M") {
    schoolYearFileRef = storageRef.child(`details/preparatory1.json`);
  } else if (shoolYear === "2M") {
    schoolYearFileRef = storageRef.child(`details/preparatory2.json`);
  } else if (shoolYear === "3M") {
    schoolYearFileRef = storageRef.child(`details/preparatory3.json`);
  } else {
    console.log("Error happened!");
    return;
  }

  createshoolyear(savedEmail, schoolYearFileRef);
  const userDataJSON = JSON.stringify(userData);
  const userFileRef = storageRef.child(`infos/${savedEmail}.json`);
  await addEmailToFullName(FullName, savedEmail);
  await addEmailToFullARName(FullNameAR, savedEmail);
  await userFileRef.putString(userDataJSON);
  await userFileRef.updateMetadata({ customMetadata: userData });

  const userProfileData = {
    schoolYear: shoolYear,
    fullname: FullName,
    fullnameAR: FullNameAR
  };
  const userProfileFileRef = storageRef.child(`profiles/${savedEmail}.json`);
  await userProfileFileRef.updateMetadata({ customMetadata: userProfileData });

  const filename = `complete_info_data/${savedEmail}.json`;
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

async function completeInfoSignUpServants() {
  const firstnameField = document.getElementById("signup-first-name-servants");
  const firstnameARField = document.getElementById("signup-first-name-ar-servants");
  const secondnameField = document.getElementById("signup-second-name-servants");
  const secondnameARField = document.getElementById("signup-second-name-ar-servants");
  const lastnameField = document.getElementById("signup-last-name-servants");
  const lastnameARField = document.getElementById("signup-last-name-ar-servants");
  const phoneNumberField = document.getElementById("signup-phone-number-servants");
  const phoneNumberCountryCodeField = document.getElementById("country-code-servants");
  const addressField = document.getElementById("signup-address-servants");
  const nationalIDField = document.getElementById("signup-national-id-servants");
  const errorMessageElement = document.getElementById("signup-error-message-servants");
  const googleSignUpButton = document.getElementById("google-signup-button-servants");

  const requiredFields = [
    { field: firstnameField, label: document.getElementById("first-name-label-servants") },
    { field: firstnameARField, label: document.getElementById("first-name-label-ar-servants") },
    { field: secondnameField, label: document.getElementById("second-name-label-servants") },
    { field: secondnameARField, label: document.getElementById("second-name-label-ar-servants") },
    { field: lastnameField, label: document.getElementById("last-name-label-servants") },
    { field: lastnameARField, label: document.getElementById("last-name-label-ar-servants") },
    { field: phoneNumberField, label: document.getElementById("phone-number-label-servants") },
    { field: addressField, label: document.getElementById("address-label-servants") }
  ];

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
  } else if (phoneNumberField.value.length < 6 || phoneNumberField.value.length > 15) {
    document.getElementById("phone-number-label-servants").classList.add("error-label");
    errorMessageElement.textContent = "Invalid phone number.";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    return;
  } else if (nationalIDField.value.length != 14 && nationalIDField.value.length != 0) {
    document.getElementById("national-id-label-servants").classList.add("error-label");
    errorMessageElement.textContent = "Invalid National ID.";
    googleSignUpButton.classList.add("vibrate");
    setTimeout(() => {
      googleSignUpButton.classList.remove("vibrate");
    }, 650);
    document.getElementById("phone-number-label-servants").classList.remove("error-label");
    return;
  } else {
    document.getElementById("phone-number-label-servants").classList.remove("error-label");
    document.getElementById("national-id-label-servants").classList.remove("error-label");
    errorMessageElement.textContent = "";
  }

  const storageRef = firebase.storage().ref();


  phoneNumberFinal = phoneNumberCountryCodeField.value + phoneNumberField.value.replace(/^0+/, '').replace(/\./g, '');

  const FullName = firstnameField.value + " " + secondnameField.value + " " + lastnameField.value;
  const FullNameAR = firstnameARField.value + " " + secondnameARField.value + " " + lastnameARField.value;
  
  const userData = {
    firstname: firstnameField.value,
    middlename: secondnameField.value,
    lastname: lastnameField.value,
    firstnamear: firstnameARField.value,
    middlenamear: secondnameARField.value,
    lastnamear: lastnameARField.value,
    fullname: FullName,
    fullnameAR: FullNameAR,
    phoneNumber: phoneNumberFinal,
    address: addressField.value,
    nationalID: nationalIDField.value,
  };

  const userDataJSON = JSON.stringify(userData);
  const userFileRef = storageRef.child(`infos/${savedEmail}.json`);
  await addEmailToFullName(FullName, savedEmail);
  await addEmailToFullARName(FullNameAR, savedEmail);
  await userFileRef.putString(userDataJSON);
  await userFileRef.updateMetadata({ customMetadata: userData });

  const userProfileData = {
    fullname: FullName,
    fullnameAR: FullNameAR
  };
  const userProfileFileRef = storageRef.child(`profiles/${savedEmail}.json`);
  await userProfileFileRef.updateMetadata({ customMetadata: userProfileData });
    
  const filename = `complete_info_data/${savedEmail}.json`
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

function hideErrorMessage(field) {
  field.style.color = ""; // Reset text color
}

document.getElementById("signup-school-section").value = "";

// function updateSelectedSchoolSection() {
//   document.getElementById("school-section-label").classList.remove("error-label");
//   if (document.getElementById("signup-school-section").value === "0") {
//     document.getElementById("signup-school-primary-year").value = "click_to_choose";
    
//     document.getElementById("school-primary-year-line").classList.remove("hidden");

//     document.getElementById("school-preparatory-year-line").classList.add("hidden");

//     document.getElementById("school-secondary-year-line").classList.add("hidden");
    
//   } else if (document.getElementById("signup-school-section").value === "1") {
//     document.getElementById("signup-school-preparatory-year").value = "click_to_choose";

//     document.getElementById("school-primary-year-line").classList.add("hidden");

//     document.getElementById("school-preparatory-year-line").classList.remove("hidden");

//     document.getElementById("school-secondary-year-line").classList.add("hidden");
    
//   } else if (document.getElementById("signup-school-section").value === "2") {
//     document.getElementById("signup-school-secondary-year").value = "click_to_choose";

//     document.getElementById("school-primary-year-line").classList.add("hidden");

//     document.getElementById("school-preparatory-year-line").classList.add("hidden");

//     document.getElementById("school-secondary-year-line").classList.remove("hidden");
//   }
// }

document.getElementById("country-code").value = "+20";
document.getElementById("country-code-parent").value = "+20";
document.getElementById("country-code-servants").value = "+20";
updateSelectedCountry();
updateSelectedCountryParents();
updateSelectedCountryServants();

function updateSelectedCountry() {
  var selectedCountry = document.getElementById("country-code");
  var selectedCountryCode = selectedCountry.value;

  document.getElementById("selected-country").textContent = selectedCountryCode;
}

function updateSelectedCountryParents() {
  var selectedCountry = document.getElementById("country-code-parent");
  var selectedCountryCode = selectedCountry.value;

  document.getElementById("selected-country-parent").textContent = selectedCountryCode;
}


function updateSelectedCountryServants() {
  var selectedCountry = document.getElementById("country-code-servants");
  var selectedCountryCode = selectedCountry.value;

  document.getElementById("selected-country-servants").textContent = selectedCountryCode;
}



const firstnameField = document.getElementById("signup-first-name");
const secondnameField = document.getElementById("signup-second-name");
const lastnameField = document.getElementById("signup-last-name");
const schoolField = document.getElementById("signup-school");
const firstnameARField = document.getElementById("signup-first-name-ar");
const secondnameARField = document.getElementById("signup-second-name-ar");
const lastnameARField = document.getElementById("signup-last-name-ar");
const schoolARField = document.getElementById("signup-school-ar");
const firstnameServantsField = document.getElementById("signup-first-name-servants");
const secondnameServantsField = document.getElementById("signup-second-name-servants");
const lastnameServantsField = document.getElementById("signup-last-name-servants");
const firstnameARServantsField = document.getElementById("signup-first-name-ar-servants");
const secondnameARServantsField = document.getElementById("signup-second-name-ar-servants");
const lastnameARServantsField = document.getElementById("signup-last-name-ar-servants");


firstnameField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
});
secondnameField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
});
lastnameField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
});
schoolField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\d\s]/g, '');
});
firstnameARField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ]/g, '');
});

secondnameARField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ]/g, '');
});
lastnameARField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ]/g, '');
});
schoolARField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ\d\s]/g, '');
});
firstnameServantsField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
});
secondnameServantsField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
});
lastnameServantsField.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
});
firstnameARServantsField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ]/g, '');
});

secondnameARServantsField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ]/g, '');
});
lastnameARServantsField.addEventListener("input", function () {
    this.value = this.value.replace(/[^؀-ۿ]/g, '');
});




function createshoolyear(email, fileRef) {
  const servantDetails = email;
  
  fileRef.getMetadata()
    .then(metadata => {
      const customMetadata = metadata.customMetadata;

      let highestKey = -1;
      for (const key in customMetadata) {
        const numericKey = parseInt(key);
        if (!isNaN(numericKey) && numericKey > highestKey) {
          highestKey = numericKey;
        }
      }

      const newKey = highestKey + 1;
      customMetadata[newKey] = servantDetails;

      if (customMetadata['0']) {
        customMetadata['0'] = (parseInt(customMetadata['0']) + 1).toString();
      }

      return fileRef.updateMetadata({ customMetadata });
    })
    .then(() => {
      console.log('School year created and custom metadata updated.');
    })
    .catch(error => {
      console.error('Error creating servant and updating custom metadata:', error);
    });
}


async function addEmailToFullName(FullName, newEmail) {
    try {
        // Firebase Storage reference for Full name
        const FullnameRef = storage.ref("details/fullname.json");

        // Fetch existing data from Firebase Storage
        const metadata = await FullnameRef.getMetadata();
        const data = metadata.customMetadata;

        // Check if Full name already exists
        if (FullName in data) {
            // Full name exists, check if email already exists
            const existingEmails = data[FullName].split('/*/'); // Split existing emails

            if (!existingEmails.includes(newEmail)) {
                // Email doesn't exist, add it
                existingEmails.push(newEmail);
                const updatedValue = existingEmails.join('/*/'); // Join emails with '/*/'

                // Update the Full name value in metadata
                await FullnameRef.updateMetadata({
                    customMetadata: {
                        ...data,
                        [FullName]: updatedValue
                    }
                });

                console.log(`Added ${newEmail} to ${FullName}`);
            } else {
                console.log(`${newEmail} already exists for ${FullName}`);
            }
        } else {
            // Full name doesn't exist, create a new entry
            await FullnameRef.updateMetadata({
                customMetadata: {
                    ...data,
                    [FullName]: newEmail
                }
            });

            console.log(`Added ${newEmail} to ${FullName}`);
        }
    } catch (error) {
        console.error("Error updating Full name:", error);
    }
}

async function addEmailToFullARName(FullName, newEmail) {
    try {
        // Firebase Storage reference for Full name
        const FullnameRef = storage.ref("details/ar-fullname.json");

        // Fetch existing data from Firebase Storage
        const metadata = await FullnameRef.getMetadata();
        const data = metadata.customMetadata;

        // Check if Full name already exists
        if (FullName in data) {
            // Full name exists, check if email already exists
            const existingEmails = data[FullName].split('/*/'); // Split existing emails

            if (!existingEmails.includes(newEmail)) {
                // Email doesn't exist, add it
                existingEmails.push(newEmail);
                const updatedValue = existingEmails.join('/*/'); // Join emails with '/*/'

                // Update the Full name value in metadata
                await FullnameRef.updateMetadata({
                    customMetadata: {
                        ...data,
                        [FullName]: updatedValue
                    }
                });

                console.log(`Added ${newEmail} to ${FullName}`);
            } else {
                console.log(`${newEmail} already exists for ${FullName}`);
            }
        } else {
            // Full name doesn't exist, create a new entry
            await FullnameRef.updateMetadata({
                customMetadata: {
                    ...data,
                    [FullName]: newEmail
                }
            });

            console.log(`Added ${newEmail} to ${FullName}`);
        }
    } catch (error) {
        console.error("Error updating Full name:", error);
    }
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