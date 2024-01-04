function updateUserData(user) {
  if (user) {
    const storageRef = firebase.storage().ref();
    const filename = `profiles/${user.email}.json`;

    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            email: UserEmail,
            name: UserName,
            username: UserUsername,
            gender: UserGender,
            birthday: UserBirthday,
            schoolYear: UserSchoolYear,
            coins: UserCoins,
            position: UserPosition,
            profile_pic: UserProfilePic,
            theme_mode: UserThemeMode,
            language: UserLanguage
          } = customMetadata;
          if (UserPosition < 1) {
            window.location.href = "error?error=You%20don't%20have20permission%20for%20this%20page.";
          }
          const profilePic = document.getElementById("profile-picture");
          if (UserProfilePic === "none") {
            profilePic.src = "pictures/profile_pic_unknown.png"; 
          } else {
            const filename = `profile_picture/${user.email}.png`;
            storageRef.child(filename).getDownloadURL()
              .then(url => {
                profilePic.src = url;
              })
            profilePic.src = "pictures/profile_pic_unknown.png";
          }
          const UsersNotificationsRef = storageRef.child(`notifications/${user.email}.json`);
          const notification_dotS = document.getElementById("notification_dotS");
          const notification_dotM = document.getElementById("notification_dotM");
          UsersNotificationsRef.getMetadata().then(async (notificationMetadata) => {
            const customMetadataNotification = notificationMetadata.customMetadata;
            const {
              "-1": unreadNotificationNum
            } = customMetadataNotification;
            let unreadNum = unreadNotificationNum;
            if (unreadNum > 0) {
              notification_dotS.classList.remove("hidden");
              notification_dotM.classList.remove("hidden");
            } else {
              notification_dotS.classList.add("hidden");
              notification_dotM.classList.add("hidden");
            }
          });
          coins_console.style.display = "flex";
          messages_console.style.display = "none";
          tools_console.style.display = "none";
          search_console.style.display = "none";
          
          const themeLink = document.getElementById('theme-link');
          const body = document.body;
          body.classList.remove('light_mode', 'dark_mode');
          themeLink.href = `css/console.css`;
          if (UserThemeMode === "auto_theme") {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            onChangeThemeDL();
            if (prefersDarkMode) {
              body.classList.add("dark_mode");
            } else {
              body.classList.add("light_mode");
            }
          } else {
            body.classList.add(UserThemeMode);
          }
          
          if (UserLanguage === "en") {
          } else if (UserLanguage === "ar") {
            window.location.href = "ar-console"
          } else {
            window.location.href = "error"
          }
        }
      })
      .catch(error => {
        console.error("Error fetching metadata:", error);
        // Handle the error, such as showing an error message to the user
        window.location.href = `error?error=${error}`;
      });
  }
}

function onChangeThemeDL() {
  const body = document.body;
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDarkMode.addEventListener('change', (e) => {
    body.classList.remove('light_mode', 'dark_mode');
    if (prefersDarkMode.matches) {
      body.classList.add("dark_mode");
    } else {
      body.classList.add("light_mode");
    }
  });
}


firebase.auth().onAuthStateChanged(user => {
if (user) {
  const storageRef = firebase.storage().ref();
  const file = `profiles/${user.email}.json`
  storageRef.child(file).getMetadata()
    .then(getMetadata => {
      console.log(`JSON file for ${file} exists.`);
      updateUserData(user);
    })
    .catch(error => {
      console.log(`JSON file for ${file} does not exist.`);
    });
   } else {
    console.error("Authentication error: No user is signed in.");
    window.location.href = "index";
  }
});


function coinsSend() {
  if (emailInputC.value !== "") {
    paymentMake(emailInputC.value);
  } else if (idInputC.value !== "") {
    const storageRef = firebase.storage().ref();
    const filename = `details/userid.json`;
    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            [idInputC.value]: UserEmail
          } = customMetadata;
          paymentMake(UserEmail);
        }
      })
      .catch(error => {
        coins_error_message.textContent = "User not found!";
        sendCoinsButton.classList.add("vibrate");
        setTimeout(() => {
            sendCoinsButton.classList.remove("vibrate");
        }, 650);
      });
  } else if (usernameInputC.value !== "") {
    const storageRef = firebase.storage().ref();
    const filename = `details/username.json`;
    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            [usernameInputC.value]: UserEmail
          } = customMetadata;
          paymentMake(UserEmail);
        }
      })
      .catch(error => {
        coins_error_message.textContent = "User not found!";
        sendCoinsButton.classList.add("vibrate");
        setTimeout(() => {
            sendCoinsButton.classList.remove("vibrate");
        }, 650);
      });
  } else {
    coins_error_message.textContent = "You have to enter a username, email or id!";
    sendCoinsButton.classList.add("vibrate");
    setTimeout(() => {
        sendCoinsButton.classList.remove("vibrate");
    }, 650);
  }
}

function messagesSend() {
  if (emailInputM.value !== "") {
    paymentMake(emailInputC.value);
  } else if (idInputM.value !== "") {
    const storageRef = firebase.storage().ref();
    const filename = `details/userid.json`;
    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            [idInputM.value]: UserEmail
          } = customMetadata;
          messageMake(UserEmail);
        }
      })
      .catch(error => {
        messages_error_message.textContent = "User not found!";
        sendMessageButton.classList.add("vibrate");
        setTimeout(() => {
            sendMessageButton.classList.remove("vibrate");
        }, 650);
      });
  } else if (usernameInputM.value !== "") {
    const storageRef = firebase.storage().ref();
    const filename = `details/username.json`;
    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            [usernameInputM.value]: UserEmail
          } = customMetadata;
          messageMake(UserEmail);
        }
      })
      .catch(error => {
        messages_error_message.textContent = "User not found!";
        sendMessageButton.classList.add("vibrate");
        setTimeout(() => {
            sendMessageButton.classList.remove("vibrate");
        }, 650);
      });
  } else {
    messages_error_message.textContent = "You have to enter a username, email or id!";
    sendMessageButton.classList.add("vibrate");
    setTimeout(() => {
        sendMessageButton.classList.remove("vibrate");
    }, 650);
  }
}


let selectionINprogress = false;
const SearchBarInput = document.getElementById("searchInput");

function runCoinsPage() {
  coins_console.style.display = "flex";
  messages_console.style.display = "none";
  tools_console.style.display = "none";
  search_console.style.display = "none";
}
function runNotificationsPage() {
  coins_console.style.display = "none";
  messages_console.style.display = "flex";
  tools_console.style.display = "none";
  search_console.style.display = "none";
}
function runToolsPage() {
  coins_console.style.display = "none";
  messages_console.style.display = "none";
  tools_console.style.display = "flex";
  search_console.style.display = "none";
}
function runSearchPage() {
  coins_console.style.display = "none";
  messages_console.style.display = "none";
  tools_console.style.display = "none";
  search_console.style.display = "flex";
  const searchMenu = document.getElementById('searchResults');
  searchMenu.innerHTML = "";
  SearchBarInput.value = "";
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

emailInputC.addEventListener("input", function(event) {
  idInputC.value = "";
  usernameInputC.value = "";
});
idInputC.addEventListener("input", function(event) {
  emailInputC.value = "";
  usernameInputC.value = "";
});
usernameInputC.addEventListener("input", function(event) {
  emailInputC.value = "";
  idInputC.value = "";
});

emailInputM.addEventListener("input", function(event) {
  idInputM.value = "";
  usernameInputM.value = "";
});
idInputM.addEventListener("input", function(event) {
  emailInputM.value = "";
  usernameInputM.value = "";
});
usernameInputM.addEventListener("input", function(event) {
  emailInputM.value = "";
  idInputM.value = "";
});


function CoinsUserSelected(SearchedID) {
  emailInputC.value = "";
  idInputC.value = SearchedID;
  usernameInputC.value = "";
  runCoinsPage();
}

function NotificationsSelected(SearchedID) {
  emailInputM.value = "";
  idInputM.value = SearchedID;
  usernameInputM.value = "";
  runNotificationsPage();
}


let SearchSteps = 0;
let EmailsForSearch = [];
let uniqueEmailsArray = [];
let EmailsForSearchSet = new Set();

function search() {
  SearchSteps = 0;
  EmailsForSearch = [];
  EmailsForSearchSet = new Set();
  const searchMenu = document.getElementById('searchResults');
  searchMenu.innerHTML = "";
  const searchTerm = SearchBarInput.value.toLowerCase();

  // Fetch the user details from Firebase Storage
  const userIdRef = storage.ref("details/userid.json");
  const usernameRef = storage.ref("details/username.json");
  const userDisplayNameRef = storage.ref("details/displayname.json");
  const userFullNameRef = storage.ref("details/fullname.json");
  const userFullNameARRef = storage.ref("details/ar-fullname.json");

  userIdRef.getMetadata()
    .then(metadata => {
      const data = metadata.customMetadata;
      const matchingUserIds = Object.keys(data).filter(id => id.includes(searchTerm));
      const matchingEmails = matchingUserIds.map(id => data[id]);
      displayResults(matchingEmails);
    })
    .catch(error => console.error("Error fetching user ID metadata:", error));

  usernameRef.getMetadata()
    .then(metadata => {
      const data = metadata.customMetadata;
      const matchingUsernames = Object.keys(data).filter(username => username.toLowerCase().includes(searchTerm));
      const matchingEmails = matchingUsernames.map(username => data[username]);
      displayResults(matchingEmails);
    })
    .catch(error => console.error("Error fetching username metadata:", error));

  userDisplayNameRef.getMetadata()
    .then(metadata => {
      const data = metadata.customMetadata;
      const matchingUserDisplayName = Object.keys(data).filter(id => id.toLowerCase().includes(searchTerm));

      const matchingEmailParts = matchingUserDisplayName.map(id => {
        return data[id]
      });

      const matchingEmails = [];
      for (let i = 0; i < matchingEmailParts.length; i++) {
        const key = matchingEmailParts[i];
        const parts = key.split('/*/');

        for (let j = 0; j < parts.length; j++) {
          matchingEmails.push(parts[j]);
        }
      }
      displayResults(matchingEmails);
    })
    .catch(error => console.error("Error fetching user ID metadata:", error));

  userFullNameARRef.getMetadata()
    .then(metadata => {
      const data = metadata.customMetadata;
      const matchingUserDisplayName = Object.keys(data).filter(id => id.toLowerCase().includes(searchTerm));

      const matchingEmailParts = matchingUserDisplayName.map(id => {
        return data[id]
      });

      const matchingEmails = [];
      for (let i = 0; i < matchingEmailParts.length; i++) {
        const key = matchingEmailParts[i];
        const parts = key.split('/*/');

        for (let j = 0; j < parts.length; j++) {
          matchingEmails.push(parts[j]);
        }
      }
      displayResults(matchingEmails);
    })
    .catch(error => console.error("Error fetching user ID metadata:", error));
  userFullNameRef.getMetadata()
  .then(metadata => {
    const data = metadata.customMetadata;
    const matchingUserDisplayName = Object.keys(data).filter(id => id.toLowerCase().includes(searchTerm));

    const matchingEmailParts = matchingUserDisplayName.map(id => {
      return data[id]
    });

    const matchingEmails = [];
    for (let i = 0; i < matchingEmailParts.length; i++) {
      const key = matchingEmailParts[i];
      const parts = key.split('/*/');

      for (let j = 0; j < parts.length; j++) {
        matchingEmails.push(parts[j]);
      }
    }
    displayResults(matchingEmails);
  })
  .catch(error => console.error("Error fetching user ID metadata:", error));
}

SearchBarInput.addEventListener("input", async function() {
  search();
});

function displayResults(emails) {
  emails.forEach(email => {
    if (email !== "") {
      EmailsForSearchSet.add(email);
    }
  });

  uniqueEmailsArray = Array.from(EmailsForSearchSet);
  SearchSteps = SearchSteps + 1;
  if (SearchSteps === 5) {
    ShowdisplayResults();
  }
}


function ShowdisplayResults() {
  const mainElement = document.querySelector('main');
  const searchMenu = document.getElementById('searchResults');
  if (SearchBarInput.value.length > 2) {
    const storageRef = firebase.storage().ref();
    let num = uniqueEmailsArray.length - 1;
    while (num >= 0) {
      email = uniqueEmailsArray[num];
      const UserProfileRef = storageRef.child(`profiles/${email}.json`);

      UserProfileRef.getMetadata().then(async (searchedPerMetadata) => {

        const customMetadatapersearched = searchedPerMetadata.customMetadata;
        const {
          email: SearchedEmail,
          name: SearchedName,
          id: SearchedID,
          username: SearchedUsername,
          position: SearchedPosition,
          servants: SearchedServants,
          profile_pic: SearchedProfilePic
        } = customMetadatapersearched;

        const searchedContainer = document.createElement("a");
          if (selectionINprogress === "coins") {
            searchedContainer.onclick = () => CoinsUserSelected(SearchedID);
          } else if (selectionINprogress === "notification s") {
            searchedContainer.onclick = () => NotificationsSelected(SearchedID);
          } else {
            searchedContainer.href = `profile?username=${SearchedUsername}`;
          }
          searchedContainer.id = SearchedID;
          searchedContainer.classList.add("searched");
          const searchedNameContainer = document.createElement("div");
            searchedNameContainer.classList.add("searched-name")

          const nameElement = document.createElement("h3");
          nameElement.textContent = SearchedName;
          nameElement.classList.add("name")

          const usernameElement = document.createElement("p");
          usernameElement.textContent = `@${SearchedUsername}`;
          usernameElement.classList.add("username");

          const profilepicElement = document.createElement("img");
          profilepicElement.classList.add("profile-picture");
          if (SearchedProfilePic === "none") {
              profilepicElement.src = "pictures/profile_pic_unknown.png"; 
          } else {
            const fileuserPic = `profile_picture/${SearchedEmail}.png`;
            storageRef.child(fileuserPic).getDownloadURL()
            .then(url => {
                profilepicElement.src = url;
            })
                profilepicElement.src = "pictures/profile_pic_unknown.png";
          }

            searchedContainer.appendChild(profilepicElement);
            searchedNameContainer.appendChild(nameElement);
            searchedNameContainer.appendChild(usernameElement);
            searchedContainer.appendChild(searchedNameContainer);
            if (!document.getElementById(SearchedID)) {
            searchMenu.appendChild(searchedContainer);
            }
        });
      num = num - 1;
    }
    if (uniqueEmailsArray.length === 0) {
      const EmptyElement = document.createElement("h3");

        EmptyElement.textContent = "No results found for your search.";
        EmptyElement.classList.add("empty")
      searchMenu.appendChild(EmptyElement);
    }
  } else {
    const EmptyElement = document.createElement("h3");

    EmptyElement.textContent = "Search term must be at least 3 letters long.";
    EmptyElement.classList.add("empty")
     searchMenu.appendChild(EmptyElement);
  }
}

let AmmountSymbole = "+";
function changeAmmountSymbole() {
   if (AmmountSymbole === "-") {
     AmmountSymbole = "+";
     AmountSign.textContent = "+";
   } else if (AmmountSymbole === "+") {
     AmmountSymbole = "-";
     AmountSign.textContent = "-";
   }
}

function paymentMake(email) {
  let walletProfilePic;
  let description;
  let ar_description;
  if (PicInputC.value === "") {
    walletProfilePic = "none";
  } else {
    walletProfilePic = PicInputC.value;
  }
  if (DescriptionInputC.value === "") {
    description = "none";
  } else {
    description = DescriptionInputC.value;
  }
  if (DescriptionARInputC.value === "") {
    ar_description = "none";
  } else {
    ar_description = DescriptionARInputC.value;
  }
  const coins = AmmountSymbole + AmmountInput.value;
  const title = TitleInputC.value;
  const ar_title = TitleARInputC.value;
  const storageRef = firebase.storage().ref();
  const coinsBeforeRef = storageRef.child(`profiles/${email}.json`);
  coinsBeforeRef.getMetadata()
  .then(metadata => {
    const coinsBeforeMetadata = metadata.customMetadata;
    const coinsBefore = coinsBeforeMetadata['coins'];
    if (AmmountInput.value.length == 0) {
      coins_error_message.textContent = "Please enter a coin amount.";
      sendCoinsButton.classList.add("vibrate");
      setTimeout(() => {
          sendCoinsButton.classList.remove("vibrate");
      }, 650);
    } else if (title.length == 0) {
      coins_error_message.textContent = "Please enter a title.";
      sendCoinsButton.classList.add("vibrate");
      setTimeout(() => {
          sendCoinsButton.classList.remove("vibrate");
      }, 650);
    } else if (ar_title.length == 0) {
      coins_error_message.textContent = "Please enter an arabic title.";
      sendCoinsButton.classList.add("vibrate");
      setTimeout(() => {
          sendCoinsButton.classList.remove("vibrate");
      }, 650);
    } else {
      coins_error_message.textContent = "";
      createWalletPayment(email, parseInt(coins), coinsBefore, walletProfilePic, title, description, ar_title, ar_description)
    }
  })
  .catch(error => {
    coins_error_message.textContent = "User not found!"
    sendCoinsButton.classList.add("vibrate");
    setTimeout(() => {
        sendCoinsButton.classList.remove("vibrate");
    }, 650);
  });
}

function messageMake(email) {
  let NotificationProfilePic;
  let goto;
  if (GotoInputM.value === "") {
      goto = "none";
  } else {
      goto = GotoInputM.value;
  }
  if (PicInputM.value === "") {
    NotificationProfilePic = "none";
  } else {
    NotificationProfilePic = PicInputM.value;
  }
  const title = TitleInputM.value;
  const ar_title = TitleARInputM.value;
  const description = DescriptionInputM.value;
  const ar_description = DescriptionARInputM.value;
  const storageRef = firebase.storage().ref();
  const UsereRef = storageRef.child(`profiles/${email}.json`);
  UsereRef.getMetadata()
  .then(metadata => {
    if (title.length == 0) {
      messages_error_message.textContent = "Please enter a title.";
      sendMessageButton.classList.add("vibrate");
      setTimeout(() => {
          sendMessageButton.classList.remove("vibrate");
      }, 650);
    } else if (ar_title.length == 0) {
      messages_error_message.textContent = "Please enter an arabic title.";
      sendMessageButton.classList.add("vibrate");
      setTimeout(() => {
          sendMessageButton.classList.remove("vibrate");
      }, 650);
    } else if (description.length == 0) {
      messages_error_message.textContent = "Please enter a description.";
      sendMessageButton.classList.add("vibrate");
      setTimeout(() => {
          sendMessageButton.classList.remove("vibrate");
      }, 650);
    } else if (ar_description.length == 0) {
      messages_error_message.textContent = "Please enter an arabic description.";
      sendMessageButton.classList.add("vibrate");
      setTimeout(() => {
          sendMessageButton.classList.remove("vibrate");
      }, 650);
    } else {
      messages_error_message.textContent = "";
      createNotification(email, goto, NotificationProfilePic, title, description, ar_title, ar_description);
    }
  })
  .catch(error => {
    messages_error_message.textContent = "User not found!"
    sendMessageButton.classList.add("vibrate");
    setTimeout(() => {
        sendMessageButton.classList.remove("vibrate");
    }, 650);
  });
}

function createWalletPayment(user, ammount, coinsBefore, walletProfilePic, title, description, ar_title, ar_description) {
  const currentTime = Date.now();
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  date = `${day}/${month}/${year}`;
  time = `${hours}:${minutes}:${seconds}`;
  const walletDetails = `${date}/*/${time}/*/${ammount}/*/${coinsBefore}/*/${walletProfilePic}/*/${title}/*/${description}/*/${ar_title}/*/${ar_description}`;
  const storageRef = firebase.storage().ref();
  const walletRef = storageRef.child(`wallet/${user}.json`);
  const walletProfileRef = storageRef.child(`profiles/${user}.json`);

  // Get the current custom metadata
  walletRef.getMetadata()
    .then(metadata => {
      const customMetadata = metadata.customMetadata;

      // Find the highest key (number) and increment it
      let highestKey = -1;
      for (const key in customMetadata) {
        const numericKey = parseInt(key);
        if (!isNaN(numericKey) && numericKey > highestKey) {
          highestKey = numericKey;
        }
      }

      // Add a new wallet with the incremented key
      const newKey = highestKey + 1;
      customMetadata[newKey] = walletDetails;

      // If there's an existing wallet with key "0," increment it
      if (customMetadata['0']) {
        customMetadata['0'] = (parseInt(customMetadata['0']) + 1).toString();
      }

      // Update the custom metadata in the storage
      return walletRef.updateMetadata({ customMetadata });
    })
    walletProfileRef.getMetadata()
    .then(metadata => {
      const customMetadata = metadata.customMetadata;

      // If there's an existing coins with key "0," increment it
      if (customMetadata['coins']) {
        customMetadata['coins'] = (parseInt(customMetadata['coins']) + ammount).toString();
      }

      // Update the custom metadata in the storage
      return walletProfileRef.updateMetadata({ customMetadata });
    })
    .then(() => {
      showNotification("Payment sent!");
      console.log('wallet created and custom metadata updated.');
    })
    .catch(error => {
      console.error('Error creating wallet and updating custom metadata:', error);
    });
}

function createNotification(user, link, NotificationPic, title, description, ar_title, ar_description) {
  // Your existing code to generate notification details
  const currentTime = Date.now();
  const notificationDetails = `${currentTime}/*/${link}/*/${NotificationPic}/*/${title}/*/${description}/*/${ar_title}/*/${ar_description}`;

  const storageRef = firebase.storage().ref();
  const notificationsRef = storageRef.child(`notifications/${user}.json`);

  // Get the current custom metadata
  notificationsRef.getMetadata()
    .then(metadata => {
      const customMetadata = metadata.customMetadata;

      // Find the highest key (number) and increment it
      let highestKey = -1;
      for (const key in customMetadata) {
        const numericKey = parseInt(key);
        if (!isNaN(numericKey) && numericKey > highestKey) {
          highestKey = numericKey;
        }
      }

      // Add a new notification with the incremented key
      const newKey = highestKey + 1;
      customMetadata[newKey] = notificationDetails;

      // If there's an existing notification with key "0," increment it
      if (customMetadata['0']) {
        customMetadata['0'] = (parseInt(customMetadata['0']) + 1).toString();
      }

      // Set key "-1" to "true"
      if (customMetadata['-1']) {
        customMetadata['-1'] = (parseInt(customMetadata['-1']) + 1).toString();
      }

      // Update the custom metadata in the storage
      return notificationsRef.updateMetadata({ customMetadata });
    })
    .then(() => {
      showNotification("Message sent!");
      console.log('Notification created and custom metadata updated.');
    })
    .catch(error => {
      console.error('Error creating notification and updating custom metadata:', error);
    });
}

function downloadProfilesXLSX() {
  const userIdRef = storage.ref("details/userid.json");
  installingUsersXLSX.onclick = "";
  let UsersObj = {};
  userIdRef.getMetadata()
    .then(metadata => {
      const data = metadata.customMetadata;
      for (const i in data) {
        const ThisUserEmail = data[i]
        const userProfileRef = storage.ref(`profiles/${ThisUserEmail}.json`);
        const userinfosRef = storage.ref(`infos/${ThisUserEmail}.json`);
        userProfileRef.getMetadata()
        .then(metadata => {
          const ProfileData = metadata.customMetadata;
          const {
            email: userEmail,
            name: userName,
            username: userUsername,
            id: userId,
            birthday: userBirthday,
            coins: userCoins,
            position: userPosition,
            gender: userGender,
            servants: userServants,
            language: userLanguage,
            theme_mode: userThemeMode
          } = ProfileData;

          let newuserPosition;
          if (parseInt(userPosition) == 0) {
            newuserPosition = "-Student";
          } else if (parseInt(userPosition) == 1) {
            newuserPosition = "+Not confirmed";
          } else if (parseInt(userPosition) == 2) {
            newuserPosition = "=Servant";
          } else if (parseInt(userPosition) == 3) {
            newuserPosition = "=Canteen Servant";
          } else if (parseInt(userPosition) == 4) {
            newuserPosition = "=Service Secretary";
          } else if (parseInt(userPosition) == 5) {
            newuserPosition = "-Student/Developer";
          } else if (parseInt(userPosition) == 6) {
            newuserPosition = "=Servant/Developer";
          }
          
          UsersObj[i] = {
            email: userEmail,
            name: userName,
            username: userUsername,
            id: userId,
            birthday: userBirthday,
            coins: userCoins,
            position: newuserPosition,
            gender: userGender,
            servants: userServants,
            language: userLanguage,
            theme_mode: userThemeMode
            }
          
          userinfosRef.getMetadata()
          .then(metadata => {
            const InfoData = metadata.customMetadata;
            const {
              fullname: userFullname,
              fullnameAR: userFullnameAR,
              address: userAdress,
              phoneNumber: userPhoneNumber,
              schoolYear: userSchoolYear,
              school: userSchool,
              schoolarab: userSchoolAR,
              firstname: userFirstname,
              middlename: userMiddlename,
              lastname: userLastname,
              firstnamear: userFirstnameAR,
              middlenamear: userMiddlenameAR,
              lastnamear: userLastnameAR,
              nationalID: userNationalID,
              parent: userParent,
              parentPhoneNumber: userParentPhoneNumber,
              parentEmail: ParentEmail
            } = InfoData
            
            UsersObj[i] = {
              email: userEmail,
              fullname: userFullname,
              fullnameAR: userFullnameAR,
              name: userName,
              username: userUsername,
              id: userId,
              birthday: userBirthday,
              address: userAdress,
              phoneNumber: userPhoneNumber,
              schoolYear: userSchoolYear,
              school: userSchool,
              schoolarab: userSchoolAR,
              coins: userCoins,
              firstname: userFirstname,
              middlename: userMiddlename,
              lastname: userLastname,
              firstnamear: userFirstnameAR,
              middlenamear: userMiddlenameAR,
              lastnamear: userLastnameAR,
              nationalID: userNationalID,
              parent: userParent,
              parentPhoneNumber: userParentPhoneNumber,
              parentEmail: ParentEmail,
              position: newuserPosition,
              gender: userGender,
              servants: userServants,
              language: userLanguage,
              theme_mode: userThemeMode
            }
          })
          .catch(error => {
            console.log(`${ThisUserEmail} didnt finish his profile yet.`)
          });
        });
      }
    })
  installingUsersXLSX.textContent = "10s";
  setTimeout(() => {
    installingUsersXLSX.textContent = "9s";
    setTimeout(() => {
      installingUsersXLSX.textContent = "8s";
      setTimeout(() => {
        installingUsersXLSX.textContent = "7s";
        setTimeout(() => {
          installingUsersXLSX.textContent = "6s";
          setTimeout(() => {
            installingUsersXLSX.textContent = "5s";
            setTimeout(() => {
              installingUsersXLSX.textContent = "4s";
              setTimeout(() => {
                installingUsersXLSX.textContent = "3s";
                setTimeout(() => {
                  installingUsersXLSX.textContent = "2s";
                  setTimeout(() => {
                    installingUsersXLSX.textContent = "1s";
                    setTimeout(() => {
                      var data = UsersObj;
                      var worksheet = XLSX.utils.json_to_sheet(Object.values(data));
                      console.log(worksheet);
                      var workbook = XLSX.utils.book_new();

                      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users List');

                      XLSX.writeFile(workbook, 'Users List.xlsx');
                      installingUsersXLSX.textContent = "Done!";
                      setTimeout(() => {
                        installingUsersXLSX.textContent = "Download";
                        installingUsersXLSX.onclick = function() {
                          downloadProfilesXLSX();
                        };
                        }, 3000);
                      }, 1000);
                    }, 1000);
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
  }, 1000);
}



async function downloadQRzip() {
  const zip = new JSZip();
  const folderPath = "qrcode/";
  console.log(folderPath);
  const storageRef = firebase.storage().ref();

  try {
    const result = await storageRef.child(folderPath).listAll();
    console.log(result);
    await Promise.all(result.items.map(async (itemRef) => {
      const url = await itemRef.getDownloadURL();
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(itemRef.name, blob);
    }));

    const blob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'qrcodes.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  }
}


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



function sidebarLittleSize() {
  const mainMenu = document.querySelector('.main-menu');

  if (mainMenu.style.width === '250px') {
    mainMenu.style.width = '0px';
    mainMenu.style.borderRight = 'none';
} else {
  const computedStyle = getComputedStyle(document.body);
    const borderColor = computedStyle.getPropertyValue('--dcdcdc-333');
    mainMenu.style.width = '250px';
    mainMenu.style.borderRight = `2px solid ${borderColor}`;
  }
}