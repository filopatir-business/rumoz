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
          themeLink.href = `css/ar-coming-soon.css`;
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
            window.location.href = "news"
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