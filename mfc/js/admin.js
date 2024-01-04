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
          if (UserPosition < 3) {
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
          const themeLink = document.getElementById('theme-link');
          const body = document.body;
          body.classList.remove('light_mode/', 'dark_mode/', "auto_theme/");
          body.classList.add(UserThemeMode);
          themeLink.href = `${UserThemeMode}/console.css`;
          if (UserThemeMode === "auto_theme") {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkMode) {
              sidebar_icon_home.src = `pictures/icons/dark_mode/home.png`
              sidebar_icon_search.src = `pictures/icons/dark_mode/search.png`
              sidebar_icon_profile.src = `pictures/icons/dark_mode/person.png`
              sidebar_icon_settings.src = `pictures/icons/dark_mode/settings.png`
              sidebar_icon_notifications.src = `pictures/icons/dark_mode/notifications.png`
              sidebar_icon_activities.src = `pictures/icons/dark_mode/activities.png`
              sidebar_icon_news.src = `pictures/icons/dark_mode/news.png`
              sidebar_icon_events.src = `pictures/icons/dark_mode/events.png`
              sidebar_icon_store.src = `pictures/icons/dark_mode/store.png`
              sidebar_icon_wallet.src = `pictures/icons/dark_mode/wallet.png`
              sidebar_icon_support.src = `pictures/icons/dark_mode/support.png`
              sidebar_icon_signout.src = `pictures/icons/dark_mode/signout.png`
              sidebar_icon_close.src = `pictures/icons/dark_mode/close.png`
              mobilebar_icon_menu.src = `pictures/icons/dark_mode/menu.png`
              mobilebar_icon_notifications.src = `pictures/icons/dark_mode/notifications.png`
              mobilebar_icon_search.src = `pictures/icons/dark_mode/search.png`
              mobilebar_icon_home.src = `pictures/icons/dark_mode/home.png`
            } else {
              sidebar_icon_home.src = `pictures/icons/light_mode/home.png`
              sidebar_icon_search.src = `pictures/icons/light_mode/search.png`
              sidebar_icon_profile.src = `pictures/icons/light_mode/person.png`
              sidebar_icon_settings.src = `pictures/icons/light_mode/settings.png`
              sidebar_icon_notifications.src = `pictures/icons/light_mode/notifications.png`
              sidebar_icon_activities.src = `pictures/icons/light_mode/activities.png`
              sidebar_icon_news.src = `pictures/icons/light_mode/news.png`
              sidebar_icon_events.src = `pictures/icons/light_mode/events.png`
              sidebar_icon_store.src = `pictures/icons/light_mode/store.png`
              sidebar_icon_wallet.src = `pictures/icons/light_mode/wallet.png`
              sidebar_icon_support.src = `pictures/icons/light_mode/support.png`
              sidebar_icon_signout.src = `pictures/icons/light_mode/signout.png`
              sidebar_icon_close.src = `pictures/icons/light_mode/close.png`
              mobilebar_icon_menu.src = `pictures/icons/light_mode/menu.png`
              mobilebar_icon_notifications.src = `pictures/icons/light_mode/notifications.png`
              mobilebar_icon_search.src = `pictures/icons/light_mode/search.png`
              mobilebar_icon_home.src = `pictures/icons/light_mode/home.png`
            }
          } else {
            sidebar_icon_home.src = `pictures/icons/${UserThemeMode}/home.png`
            sidebar_icon_search.src = `pictures/icons/${UserThemeMode}/search.png`
            sidebar_icon_profile.src = `pictures/icons/${UserThemeMode}/person.png`
            sidebar_icon_settings.src = `pictures/icons/${UserThemeMode}/settings.png`
            sidebar_icon_notifications.src = `pictures/icons/${UserThemeMode}/notifications.png`
            sidebar_icon_activities.src = `pictures/icons/${UserThemeMode}/activities.png`
            sidebar_icon_news.src = `pictures/icons/${UserThemeMode}/news.png`
            sidebar_icon_events.src = `pictures/icons/${UserThemeMode}/events.png`
            sidebar_icon_store.src = `pictures/icons/${UserThemeMode}/store.png`
            sidebar_icon_wallet.src = `pictures/icons/${UserThemeMode}/wallet.png`
            sidebar_icon_support.src = `pictures/icons/${UserThemeMode}/support.png`
            sidebar_icon_signout.src = `pictures/icons/${UserThemeMode}/signout.png`
            sidebar_icon_close.src = `pictures/icons/${UserThemeMode}/close.png`
            mobilebar_icon_menu.src = `pictures/icons/${UserThemeMode}/menu.png`
            mobilebar_icon_notifications.src = `pictures/icons/${UserThemeMode}/notifications.png`
            mobilebar_icon_search.src = `pictures/icons/${UserThemeMode}/search.png`
            mobilebar_icon_home.src = `pictures/icons/${UserThemeMode}/home.png`
          }
          if (UserLanguage === "en") {
          } else if (UserLanguage === "ar") {
            window.location.href = "ar-admin"
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
    mainMenu.style.borderRight = 'none';
} else {
  const computedStyle = getComputedStyle(document.documentElement);
    const borderColor = computedStyle.getPropertyValue('--menu-border-color');
    mainMenu.style.width = '250px';
    mainMenu.style.borderRight = `2px solid ${borderColor}`;
  }
}