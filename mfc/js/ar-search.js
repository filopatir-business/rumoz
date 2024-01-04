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
          CoinsText.textContent = `النقود: ${UserCoins}`;
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
          const themeLink = document.getElementById('theme-link');
          const body = document.body;
          body.classList.remove('light_mode', 'dark_mode');
          themeLink.href = `css/ar-search.css`;
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
          
          if (UserLanguage === "ar") {
          } else if (UserLanguage === "en") {
            window.location.href = "search"
          } else {
            window.location.href = "error"
          }
        }
      })
      .catch(error => {
        console.error("Error fetching metadata:", error);
        // Handle the error, such as showing an error message to the user
        window.location.href = `ar-error?error=${error}`;
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



function signOut() {
  firebase.auth().signOut()
    .then(() => {
      window.location.href = "index";
    })
    .catch((error) => {
      console.error("Sign Out Error", error);
    });
}


let SearchSteps = 0;
let EmailsForSearch = [];
let uniqueEmailsArray = [];
let EmailsForSearchSet = new Set();
const SearchBarInput = document.getElementById("searchInput");

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
          searchedContainer.href = `ar-profile?username=${SearchedUsername}`;
          searchedContainer.id = SearchedID;
          searchedContainer.classList.add("searched");
          const searchedNameContainer = document.createElement("div");
            searchedNameContainer.classList.add("searched-name")

          const nameElement = document.createElement("h3");
          nameElement.textContent = SearchedName;
          nameElement.classList.add("name")

          const usernameElement = document.createElement("p");
          usernameElement.textContent = `@${SearchedUsername}`;
          usernameElement.dir = "ltr";
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

        EmptyElement.textContent = "لا توجد نتائج لبحثك.";
        EmptyElement.classList.add("empty")
      searchMenu.appendChild(EmptyElement);
    }
  } else {
    const EmptyElement = document.createElement("h3");

    EmptyElement.textContent = "يجب أن يكون طول كلمة البحث على الأقل 3 أحرف.";
    EmptyElement.classList.add("empty")
     searchMenu.appendChild(EmptyElement);
  }
}



function sidebarLittleSize() {
  const mainMenu = document.querySelector('.main-menu');

  if (mainMenu.style.width === '250px') {
    mainMenu.style.width = '0px';
    mainMenu.style.borderLeft = 'none';
} else {
  const computedStyle = getComputedStyle(document.body);
    const borderColor = computedStyle.getPropertyValue('--dcdcdc-333');
    mainMenu.style.width = '250px';
    mainMenu.style.borderLeft = `2px solid ${borderColor}`;
  }
}