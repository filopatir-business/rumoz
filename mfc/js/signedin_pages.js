const currentURL = window.location.href;

function redirectSignedOutUser() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      const encodedCurrentURL = encodeURIComponent(currentURL);
      window.location.href = `signin?directURL=${encodedCurrentURL}`;
    }
  });
}

function redirectSignedInUser() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const storageRef = firebase.storage().ref();
      const file = `profiles/${user.email}.json`
      storageRef.child(file).getMetadata()
        .then(getMetadata => {
          
          const fileInfo = `infos/${user.email}.json`
          storageRef.child(fileInfo).getMetadata()
            .then(getMetadata => {
            })
            .catch(error => {
              redirectToCompleteProfileInfo(user.email);
            });
          
         })
        .catch(error => {
          redirectToCompleteProfile(user.email);
        });
      }
    });
}


document.addEventListener("DOMContentLoaded", redirectSignedOutUser);
document.addEventListener("DOMContentLoaded", redirectSignedInUser);


async function redirectToCompleteProfileInfo(email) {
  const token = generateUserToken();
  const tokenExpiration = Date.now() + 12 * 60 * 60 * 1000;
  const storageRef = firebase.storage().ref();
  const filename = `complete_info_data/${email}.json`;
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
      window.location.href = `complete-info?email=${email}&token=${token}&directURL=${encodedCurrentURL}`;
    } else {
      curentURL = window.location.pathname.split("/").pop();
      window.location.href = `complete-info?email=${email}&token=${token}&directURL=${curentURL}`;
    }
  } catch {  
    console.error("Error setting user data:", error);
  };
}


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
      curentURL = window.location.pathname.split("/").pop();
      window.location.href = `complete-profile?email=${email}&token=${token}&directURL=${curentURL}`;
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