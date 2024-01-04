const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get("userid");
const username = urlParams.get("username");


if (userid) {
  firebase.auth().onAuthStateChanged(async (user) => {
    const storageRef = firebase.storage().ref();
    const filename = `details/userid.json`;

    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            [userid]: UserEmail
          } = customMetadata;
          if (user) {
            if (user.email === UserEmail) {
              
              const storageRef = firebase.storage().ref();
              const filename = `profiles/${user.email}.json`;

              storageRef.child(filename).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
                      email: UserEmail,
                      name: UserName,
                      id: UserID,
                      username: UserUsername,
                      gender: UserGender,
                      birthday: UserBirthday,
                      schoolYear: UserSchoolYear,
                      coins: UserCoins,
                      position: UserPosition,
                      servants: UserServants,
                      profile_pic: UserProfilePic,
                      theme_mode: UserThemeMode,
                      language: UserLanguage
                    } = customMetadata;
                    CoinsText_profile.textContent = `Coins: ${UserCoins}`;
                    fullname_profile.textContent = UserName;
                    usernamme_profile.textContent = `@${UserUsername}`;
                    servants_profile.textContent = `Servants: ${UserServants}`;
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      servants_profile.textContent = `Students: ${UserServants}`;
                    }

                    if (parseInt(UserPosition) == 0) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student";
                    } else if (parseInt(UserPosition) == 1) {
                      const ServantsNum = document.querySelector('.numbers-profile');
                      ServantsNum.style.display = "none";
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 2) {
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 3) {
                      position_profile.textContent = "Canteen Servant";
                    } else if (parseInt(UserPosition) == 4) {
                      position_profile.textContent = "Service Secretary";
                    } else if (parseInt(UserPosition) == 5) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student/Developer";
                    } else if (parseInt(UserPosition) == 6) {
                      position_profile.textContent = "Servant/Developer";
                    }

                    if (UserProfilePic === "none") {
                      profile_pic.src = "pictures/profile_pic_unknown.png"; 
                    } else {
                      const fileuserPic = `profile_picture/${user.email}.png`;
                      storageRef.child(fileuserPic).getDownloadURL()
                      .then(url => {
                         profile_pic.src = url;
                      })
                        profile_pic.src = "pictures/profile_pic_unknown.png";
                    }
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "profile";
                  }
                });
        
            } else {
              const storageRef = firebase.storage().ref();
              const userfile = `profiles/${UserEmail}.json`;

              storageRef.child(userfile).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
                      email: UserEmail,
                      name: UserName,
                      id: UserID,
                      username: UserUsername,
                      gender: UserGender,
                      birthday: UserBirthday,
                      schoolYear: UserSchoolYear,
                      coins: UserCoins,
                      position: UserPosition,
                      servants: UserServants,
                      profile_pic: UserProfilePic,
                    } = customMetadata;
                    CoinsText_profile.textContent = `Coins: ${UserCoins}`;
                    fullname_profile.textContent = UserName;
                    usernamme_profile.textContent = `@${UserUsername}`;
                    servants_profile.textContent = `Servants: ${UserServants}`;
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      servants_profile.textContent = `Students: ${UserServants}`;
                    }

                    if (parseInt(UserPosition) == 0) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student";
                    } else if (parseInt(UserPosition) == 1) {
                      const ServantsNum = document.querySelector('.numbers-profile');
                      ServantsNum.style.display = "none";
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 2) {
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 3) {
                      position_profile.textContent = "Canteen Servant";
                    } else if (parseInt(UserPosition) == 4) {
                      position_profile.textContent = "Service Secretary";
                    } else if (parseInt(UserPosition) == 5) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student/Developer";
                    } else if (parseInt(UserPosition) == 6) {
                      position_profile.textContent = "Servant/Developer";
                    }
                    
                    if (UserProfilePic === "none") {
                      profile_pic.src = "pictures/profile_pic_unknown.png"; 
                    } else {
                      const fileuserPic = `profile_picture/${UserEmail}.png`;
                      storageRef.child(fileuserPic).getDownloadURL()
                      .then(url => {
                         profile_pic.src = url;
                      })
                        profile_pic.src = "pictures/profile_pic_unknown.png";
                    }
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "profile";
                  }
                });
            }
          }
        }
      });
  });
} else if (username) {
  firebase.auth().onAuthStateChanged(async (user) => {
    const storageRef = firebase.storage().ref();
    const filename = `details/username.json`;

    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            [username]: UserEmail
          } = customMetadata;
          if (user) {
            if (user.email === UserEmail) {

              const storageRef = firebase.storage().ref();
              const filename = `profiles/${user.email}.json`;

              storageRef.child(filename).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
                      email: UserEmail,
                      name: UserName,
                      id: UserID,
                      username: UserUsername,
                      gender: UserGender,
                      birthday: UserBirthday,
                      schoolYear: UserSchoolYear,
                      coins: UserCoins,
                      position: UserPosition,
                      servants: UserServants,
                      profile_pic: UserProfilePic,
                      theme_mode: UserThemeMode,
                      language: UserLanguage
                    } = customMetadata;
                    CoinsText_profile.textContent = `Coins: ${UserCoins}`;
                    fullname_profile.textContent = UserName;
                    usernamme_profile.textContent = `@${UserUsername}`;
                    servants_profile.textContent = `Servants: ${UserServants}`;
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      servants_profile.textContent = `Students: ${UserServants}`;
                    }

                    if (parseInt(UserPosition) == 0) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student";
                    } else if (parseInt(UserPosition) == 1) {
                      const ServantsNum = document.querySelector('.numbers-profile');
                      ServantsNum.style.display = "none";
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 2) {
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 3) {
                      position_profile.textContent = "Canteen Servant";
                    } else if (parseInt(UserPosition) == 4) {
                      position_profile.textContent = "Service Secretary";
                    } else if (parseInt(UserPosition) == 5) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student/Developer";
                    } else if (parseInt(UserPosition) == 6) {
                      position_profile.textContent = "Servant/Developer";
                    }

                    if (UserProfilePic === "none") {
                      profile_pic.src = "pictures/profile_pic_unknown.png"; 
                    } else {
                      const fileuserPic = `profile_picture/${user.email}.png`;
                      storageRef.child(fileuserPic).getDownloadURL()
                      .then(url => {
                         profile_pic.src = url;
                      })
                        profile_pic.src = "pictures/profile_pic_unknown.png";
                    }
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "profile";
                  }
                });

            } else {
              const storageRef = firebase.storage().ref();
              const userfile = `profiles/${UserEmail}.json`;
              storageRef.child(userfile).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
                      email: UserEmail,
                      name: UserName,
                      id: UserID,
                      username: UserUsername,
                      gender: UserGender,
                      birthday: UserBirthday,
                      schoolYear: UserSchoolYear,
                      coins: UserCoins,
                      position: UserPosition,
                      servants: UserServants,
                      profile_pic: UserProfilePic,
                    } = customMetadata;
                    CoinsText_profile.textContent = `Coins: ${UserCoins}`;
                    fullname_profile.textContent = UserName;
                    usernamme_profile.textContent = `@${UserUsername}`;
                    servants_profile.textContent = `Servants: ${UserServants}`;
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      servants_profile.textContent = `Students: ${UserServants}`;
                    }

                    if (parseInt(UserPosition) == 0) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student";
                    } else if (parseInt(UserPosition) == 1) {
                      const ServantsNum = document.querySelector('.numbers-profile');
                      ServantsNum.style.display = "none";
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 2) {
                      position_profile.textContent = "Servant";
                    } else if (parseInt(UserPosition) == 3) {
                      position_profile.textContent = "Canteen Servant";
                    } else if (parseInt(UserPosition) == 4) {
                      position_profile.textContent = "Service Secretary";
                    } else if (parseInt(UserPosition) == 5) {
                      StudentDetsilsShow();
                      position_profile.textContent = "Student/Developer";
                    } else if (parseInt(UserPosition) == 6) {
                      position_profile.textContent = "Servant/Developer";
                    }

                    if (UserProfilePic === "none") {
                      profile_pic.src = "pictures/profile_pic_unknown.png"; 
                    } else {
                      const fileuserPic = `profile_picture/${UserEmail}.png`;
                      storageRef.child(fileuserPic).getDownloadURL()
                      .then(url => {
                         profile_pic.src = url;
                      })
                        profile_pic.src = "pictures/profile_pic_unknown.png";
                    }
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "profile";
                  }
                });
            }
          }
        }
      });
  });
} else {
  firebase.auth().onAuthStateChanged(async (user) => {
    const storageRef = firebase.storage().ref();
    const filename = `profiles/${user.email}.json`;

    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            email: UserEmail,
            name: UserName,
            id: UserID,
            username: UserUsername,
            gender: UserGender,
            birthday: UserBirthday,
            schoolYear: UserSchoolYear,
            coins: UserCoins,
            position: UserPosition,
            servants: UserServants,
            profile_pic: UserProfilePic,
            theme_mode: UserThemeMode,
            language: UserLanguage
          } = customMetadata;
          CoinsText_profile.textContent = `Coins: ${UserCoins}`;
          fullname_profile.textContent = UserName;
          usernamme_profile.textContent = `@${UserUsername}`;
          servants_profile.textContent = `Servants: ${UserServants}`;
          if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
            servants_profile.textContent = `Students: ${UserServants}`;
          }

          if (parseInt(UserPosition) == 0) {
            StudentDetsilsShow();
            position_profile.textContent = "Student";
          } else if (parseInt(UserPosition) == 1) {
            const ServantsNum = document.querySelector('.numbers-profile');
            ServantsNum.style.display = "none";
            position_profile.textContent = "Servant";
          } else if (parseInt(UserPosition) == 2) {
            position_profile.textContent = "Servant";
          } else if (parseInt(UserPosition) == 3) {
            position_profile.textContent = "Canteen Servant";
          } else if (parseInt(UserPosition) == 4) {
            position_profile.textContent = "Service Secretary";
          } else if (parseInt(UserPosition) == 5) {
            StudentDetsilsShow();
            position_profile.textContent = "Student/Developer";
          } else if (parseInt(UserPosition) == 6) {
            position_profile.textContent = "Servant/Developer";
          }

          if (UserProfilePic === "none") {
            profile_pic.src = "pictures/profile_pic_unknown.png"; 
          } else {
            const fileuserPic = `profile_picture/${user.email}.png`;
            storageRef.child(fileuserPic).getDownloadURL()
            .then(url => {
               profile_pic.src = url;
            })
              profile_pic.src = "pictures/profile_pic_unknown.png";
          }
        }
      }).catch(error => {
        if (error.code === "storage/object-not-found") {
          window.location.href = "profile";
        }
      });
  });
}

function ServantPageGo() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (userid) {
        window.location.href = `servants?userid=${userid}`;
      } else if (username) {
        window.location.href = `servants?username=${username}`
      } else {
          window.location.href = `servants`;
      }
    }
  });
}


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
            id: UserID,
            username: UserUsername,
            gender: UserGender,
            birthday: UserBirthday,
            schoolYear: UserSchoolYear,
            coins: UserCoins,
            position: UserPosition,
            servants: UserServants,
            profile_pic: UserProfilePic,
            theme_mode: UserThemeMode,
            language: UserLanguage
          } = customMetadata;
          //if (!userid) {
            //window.location.href = `profile?userid=${UserID}`;
          //}
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
          CoinsText.textContent = `Coins: ${UserCoins}`;
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
          themeLink.href = `css/profile.css`;
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
            if (userid || username) {
              window.location.href = "ar-profile" + window.location.search;
            } else {
              window.location.href = "ar-profile";
              }
          } else {
            window.location.href = "error";
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


function StudentDetsilsShow() {
  const CoinsContainer = document.querySelector('.coins-container-profile');
  CoinsContainer.style.display = "flex";
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