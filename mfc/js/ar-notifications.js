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
          const mainElement = document.querySelector('main');
          const notificationMenu = mainElement.querySelector('#notification_menu');
          UsersNotificationsRef.getMetadata().then(async (notificationMetadata) => {
            const customMetadataNotification = notificationMetadata.customMetadata;
            const {
              "0": NotificationNum,
              "-1": unreadNotificationNum
            } = customMetadataNotification;
            let num = NotificationNum;
            let unreadNum = unreadNotificationNum;
            while (num >= 1) {
              const { [num]: DetailsNotification } = customMetadataNotification;
              const [date, goto, NotificationPic, title, description, ar_title, ar_description] = DetailsNotification.split("/*/");

              const notificationContainer = document.createElement("a");
              if (goto === "none") {
                notificationContainer.href = "#";
              } else {
                notificationContainer.href = goto;
              }
              notificationContainer.classList.add("notification");

              const notificationtitleContainer = document.createElement("div");
              notificationtitleContainer.classList.add("notification-title")
              const notificationDescriptionContainer = document.createElement("div");

              const titleElement = document.createElement("h3");
              titleElement.textContent = ar_title;
              titleElement.classList.add("title")

              const descriptionElement = document.createElement("p");
              descriptionElement.textContent = ar_description + ". ";
                descriptionElement.classList.add("description");
              if (unreadNum > 0) {
                  titleElement.classList.add("unread-title");
                  titleElement.classList.remove("title");
                  descriptionElement.classList.add("unread-description");
                descriptionElement.classList.remove("description")
                  unreadNum = unreadNum - 1;
              }
              const timeElement = document.createElement("p");
              timeElement.textContent = formatTimeAgo(date);
              timeElement.classList.add("time")

              const profilepicElement = document.createElement("img");
              profilepicElement.classList.add("notification-picture");
              
              if (NotificationPic !== "none") {
                NotificationPicParts = NotificationPic.split("/");
                if (NotificationPicParts[0] === "icons") {
                  profilepicElement.classList.add("notification-picture-Icon")
                  profilepicElement.src = `pictures/icons/${NotificationPicParts[1]}.png`;
                } else {
                    profilepicElement.classList.add("notification-picture-noIcon")
                  profilepicElement.src = NotificationPicParts[1]
                }
              }

              if (NotificationPic !== "none") {
                notificationContainer.appendChild(profilepicElement);
              } else {
                notificationtitleContainer.classList.add("notification-title-noPic")
              }
              notificationtitleContainer.appendChild(titleElement);
              notificationDescriptionContainer.appendChild(descriptionElement);
              notificationDescriptionContainer.appendChild(timeElement);
                notificationtitleContainer.appendChild(notificationDescriptionContainer);
              notificationContainer.appendChild(notificationtitleContainer);
               notificationMenu.appendChild(notificationContainer);
              num = num - 1;
            }
            if (NotificationNum === "0") {
              const mainElement = document.querySelector('main');
              const notificationMenu = mainElement.querySelector('#notification_menu');
              const EmptyElement = document.createElement("h3");

                EmptyElement.textContent = "لا توجد إشعارات متاحة.";
                EmptyElement.classList.add("empty")
                notificationMenu.appendChild(EmptyElement);
            }
          });
          ReadNotification();
          const themeLink = document.getElementById('theme-link');
          const body = document.body;
          body.classList.remove('light_mode', 'dark_mode');
          themeLink.href = `css/ar-notifications.css`;
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
            window.location.href = "notifications"
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


function ReadNotification() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const storageRef = firebase.storage().ref();
      const notificationsRef = storageRef.child(`notifications/${user.email}.json`);

      // Get the current custom metadata
      notificationsRef.getMetadata()
        .then(metadata => {
          const customMetadata = metadata.customMetadata;
        customMetadata['-1'] = "0";
        return notificationsRef.updateMetadata({ customMetadata });
        })
        .catch(error => {
          console.error('Error creating notification and updating custom metadata:', error);
        });
    }
  });
}


function formatTimeAgo(dateString) {
    const date = new Date(parseInt(dateString));
    const now = new Date();
    const timeDifference = now - date;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
        return `${seconds} ثانية`;
    } else if (minutes < 60) {
        return `${minutes} دقيقة`;
    } else if (hours < 24) {
        return `${hours} ساعة`;
    } else if (days < 30) {
        return `${days} يوم`;
    } else if (months < 12) {
        return `${months} شهر`;
    } else {
        return `${years} سنة`;
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