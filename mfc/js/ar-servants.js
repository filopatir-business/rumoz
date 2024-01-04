const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get("userid");
const username = urlParams.get("username");


if (userid) {
  firebase.auth().onAuthStateChanged(async (user) => {
    const storageRef = firebase.storage().ref();
    const filename = `details/userid.json`;

    storageRef.child(filename).getMetadata()
      .then(metadataloadUser => {
        const custommetadataloadUser = metadataloadUser.customMetadata;

        if (custommetadataloadUser) {
          const {
            [userid]: UserEmail
          } = custommetadataloadUser;
          if (user) {
            if (user.email === UserEmail) {

              const storageRef = firebase.storage().ref();
              const filename = `profiles/${user.email}.json`;

              storageRef.child(filename).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
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
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      Servant_Title.textContent = "المخدومين";
                    }
                    const UsersservantsRef = storageRef.child(`servants/${user.email}.json`);
                    const mainElement = document.querySelector('main');
                    const servantMenu = mainElement.querySelector('#servant_menu');
                    UsersservantsRef.getMetadata().then(async (servantMetadata) => {
                      const customMetadataservant = servantMetadata.customMetadata;
                      const {
                        "0": servantNum
                      } = customMetadataservant;
                      let num = servantNum;
                      while (num >= 1) {
                        const { [num]: email } = customMetadataservant;

                        const UserProfileRef = storageRef.child(`profiles/${email}.json`);

                        UserProfileRef.getMetadata().then(async (servantPerMetadata) => {

                          const customMetadataperservant = servantPerMetadata.customMetadata;
                          const {
                            email: ServantEmail,
                            name: ServantName,
                            id: ServantID,
                            username: ServantUsername,
                            position: ServantPosition,
                            servants: ServantServants,
                            profile_pic: ServantProfilePic
                          } = customMetadataperservant;

                          const servantContainer = document.createElement("a");
                            servantContainer.href = `profile?username=${ServantUsername}`;
                            servantContainer.classList.add("servant");
                            const servantNameContainer = document.createElement("div");
                              servantNameContainer.classList.add("servant-name")

                            const nameElement = document.createElement("h3");
                            nameElement.textContent = ServantName;
                            nameElement.classList.add("name")

                            const usernameElement = document.createElement("p");
                            usernameElement.textContent = `@${ServantUsername}`;
                          usernameElement.dir = "ltr";
                            usernameElement.classList.add("username");

                            const profilepicElement = document.createElement("img");
                            profilepicElement.classList.add("profile-picture");
                            if (ServantProfilePic === "none") {
                                profilepicElement.src = "pictures/profile_pic_unknown.png"; 
                            } else {
                              const fileuserPic = `profile_picture/${ServantEmail}.png`;
                              storageRef.child(fileuserPic).getDownloadURL()
                              .then(url => {
                                  profilepicElement.src = url;
                              })
                                  profilepicElement.src = "pictures/profile_pic_unknown.png";
                            }

                                servantContainer.appendChild(profilepicElement);
                              servantNameContainer.appendChild(nameElement);
                              servantNameContainer.appendChild(usernameElement);
                          servantContainer.appendChild(servantNameContainer);
                            servantMenu.appendChild(servantContainer);

                          });
                        num = num - 1;
                        }
                      if (servantNum === "0") {
                        const mainElement = document.querySelector('main');
                        const servantMenu = mainElement.querySelector('#servant_menu');
                        const EmptyElement = document.createElement("h3");

                          EmptyElement.textContent = "لم يتم إضافة خدام حتى الآن.";
                        if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                          EmptyElement.textContent = "لم يتم إضافة مخدومين حتى الآن.";
                        }
                          EmptyElement.classList.add("empty")
                            servantMenu.appendChild(EmptyElement);
                      }
                    });
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "servants";
                  }
                });

            } else {
              const storageRef = firebase.storage().ref();
              const filename = `profiles/${UserEmail}.json`;

              storageRef.child(filename).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
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
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      Servant_Title.textContent = "المخدومين";
                    }
                    const UsersservantsRef = storageRef.child(`servants/${UserEmail}.json`);
                    const mainElement = document.querySelector('main');
                    const servantMenu = mainElement.querySelector('#servant_menu');
                    UsersservantsRef.getMetadata().then(async (servantMetadata) => {
                      const customMetadataservant = servantMetadata.customMetadata;
                      const {
                        "0": servantNum
                      } = customMetadataservant;
                      let num = servantNum;
                      while (num >= 1) {
                        const { [num]: email } = customMetadataservant;

                        const UserProfileRef = storageRef.child(`profiles/${email}.json`);

                        UserProfileRef.getMetadata().then(async (servantPerMetadata) => {

                          const customMetadataperservant = servantPerMetadata.customMetadata;
                          const {
                            email: ServantEmail,
                            name: ServantName,
                            id: ServantID,
                            username: ServantUsername,
                            position: ServantPosition,
                            servants: ServantServants,
                            profile_pic: ServantProfilePic
                          } = customMetadataperservant;

                          const servantContainer = document.createElement("a");
                            servantContainer.href = `profile?username=${ServantUsername}`;
                            servantContainer.classList.add("servant");
                            const servantNameContainer = document.createElement("div");
                              servantNameContainer.classList.add("servant-name")

                            const nameElement = document.createElement("h3");
                            nameElement.textContent = ServantName;
                            nameElement.classList.add("name")

                            const usernameElement = document.createElement("p");
                            usernameElement.textContent = `@${ServantUsername}`;
                          usernameElement.dir = "ltr";
                            usernameElement.classList.add("username");

                            const profilepicElement = document.createElement("img");
                            profilepicElement.classList.add("profile-picture");
                            if (ServantProfilePic === "none") {
                                profilepicElement.src = "pictures/profile_pic_unknown.png"; 
                            } else {
                              const fileuserPic = `profile_picture/${ServantEmail}.png`;
                              storageRef.child(fileuserPic).getDownloadURL()
                              .then(url => {
                                  profilepicElement.src = url;
                              })
                                  profilepicElement.src = "pictures/profile_pic_unknown.png";
                            }

                                servantContainer.appendChild(profilepicElement);
                              servantNameContainer.appendChild(nameElement);
                              servantNameContainer.appendChild(usernameElement);
                          servantContainer.appendChild(servantNameContainer);
                            servantMenu.appendChild(servantContainer);

                          });
                        num = num - 1;
                        }
                      if (servantNum === "0") {
                        const mainElement = document.querySelector('main');
                        const servantMenu = mainElement.querySelector('#servant_menu');
                        const EmptyElement = document.createElement("h3");

                          EmptyElement.textContent = "لم يتم إضافة خدام حتى الآن.";
                        if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                          EmptyElement.textContent = "لم يتم إضافة مخدومين حتى الآن.";
                        }
                          EmptyElement.classList.add("empty")
                            servantMenu.appendChild(EmptyElement);
                      }
                    });
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "servants";
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
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      Servant_Title.textContent = "المخدومين";
                    }
                    const UsersservantsRef = storageRef.child(`servants/${user.email}.json`);
                    const mainElement = document.querySelector('main');
                    const servantMenu = mainElement.querySelector('#servant_menu');
                    UsersservantsRef.getMetadata().then(async (servantMetadata) => {
                      const customMetadataservant = servantMetadata.customMetadata;
                      const {
                        "0": servantNum
                      } = customMetadataservant;
                      let num = servantNum;
                      while (num >= 1) {
                        const { [num]: email } = customMetadataservant;

                        const UserProfileRef = storageRef.child(`profiles/${email}.json`);

                        UserProfileRef.getMetadata().then(async (servantPerMetadata) => {

                          const customMetadataperservant = servantPerMetadata.customMetadata;
                          const {
                            email: ServantEmail,
                            name: ServantName,
                            id: ServantID,
                            username: ServantUsername,
                            position: ServantPosition,
                            servants: ServantServants,
                            profile_pic: ServantProfilePic
                          } = customMetadataperservant;

                          const servantContainer = document.createElement("a");
                            servantContainer.href = `profile?username=${ServantUsername}`;
                            servantContainer.classList.add("servant");
                            const servantNameContainer = document.createElement("div");
                              servantNameContainer.classList.add("servant-name")

                            const nameElement = document.createElement("h3");
                            nameElement.textContent = ServantName;
                            nameElement.classList.add("name")

                            const usernameElement = document.createElement("p");
                            usernameElement.textContent = `@${ServantUsername}`;
                          usernameElement.dir = "ltr";
                            usernameElement.classList.add("username");

                            const profilepicElement = document.createElement("img");
                            profilepicElement.classList.add("profile-picture");
                            if (ServantProfilePic === "none") {
                                profilepicElement.src = "pictures/profile_pic_unknown.png"; 
                            } else {
                              const fileuserPic = `profile_picture/${ServantEmail}.png`;
                              storageRef.child(fileuserPic).getDownloadURL()
                              .then(url => {
                                  profilepicElement.src = url;
                              })
                                  profilepicElement.src = "pictures/profile_pic_unknown.png";
                            }

                                servantContainer.appendChild(profilepicElement);
                              servantNameContainer.appendChild(nameElement);
                              servantNameContainer.appendChild(usernameElement);
                          servantContainer.appendChild(servantNameContainer);
                            servantMenu.appendChild(servantContainer);

                          });
                        num = num - 1;
                        }
                      if (servantNum === "0") {
                        const mainElement = document.querySelector('main');
                        const servantMenu = mainElement.querySelector('#servant_menu');
                        const EmptyElement = document.createElement("h3");

                          EmptyElement.textContent = "لم يتم إضافة خدام حتى الآن.";
                        if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                          EmptyElement.textContent = "لم يتم إضافة مخدومين حتى الآن.";
                        }
                          EmptyElement.classList.add("empty")
                            servantMenu.appendChild(EmptyElement);
                      }
                    });
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "servants";
                  }
                });

            } else {
              const storageRef = firebase.storage().ref();
              const filename = `profiles/${UserEmail}.json`;


              storageRef.child(filename).getMetadata()
                .then(metadata => {
                  const customMetadata = metadata.customMetadata;

                  if (customMetadata) {
                    const {
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
                    if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                      Servant_Title.textContent = "المخدومين";
                    }
                    const UsersservantsRef = storageRef.child(`servants/${UserEmail}.json`);
                    const mainElement = document.querySelector('main');
                    const servantMenu = mainElement.querySelector('#servant_menu');
                    UsersservantsRef.getMetadata().then(async (servantMetadata) => {
                      const customMetadataservant = servantMetadata.customMetadata;
                      const {
                        "0": servantNum
                      } = customMetadataservant;
                      let num = servantNum;
                      while (num >= 1) {
                        const { [num]: email } = customMetadataservant;

                        const UserProfileRef = storageRef.child(`profiles/${email}.json`);

                        UserProfileRef.getMetadata().then(async (servantPerMetadata) => {

                          const customMetadataperservant = servantPerMetadata.customMetadata;
                          const {
                            email: ServantEmail,
                            name: ServantName,
                            id: ServantID,
                            username: ServantUsername,
                            position: ServantPosition,
                            servants: ServantServants,
                            profile_pic: ServantProfilePic
                          } = customMetadataperservant;

                          const servantContainer = document.createElement("a");
                            servantContainer.href = `profile?username=${ServantUsername}`;
                            servantContainer.classList.add("servant");
                            const servantNameContainer = document.createElement("div");
                              servantNameContainer.classList.add("servant-name")

                            const nameElement = document.createElement("h3");
                            nameElement.textContent = ServantName;
                            nameElement.classList.add("name")

                            const usernameElement = document.createElement("p");
                            usernameElement.textContent = `@${ServantUsername}`;
                          usernameElement.dir = "ltr";
                            usernameElement.classList.add("username");

                            const profilepicElement = document.createElement("img");
                            profilepicElement.classList.add("profile-picture");
                            if (ServantProfilePic === "none") {
                                profilepicElement.src = "pictures/profile_pic_unknown.png"; 
                            } else {
                              const fileuserPic = `profile_picture/${ServantEmail}.png`;
                              storageRef.child(fileuserPic).getDownloadURL()
                              .then(url => {
                                  profilepicElement.src = url;
                              })
                                  profilepicElement.src = "pictures/profile_pic_unknown.png";
                            }

                                servantContainer.appendChild(profilepicElement);
                              servantNameContainer.appendChild(nameElement);
                              servantNameContainer.appendChild(usernameElement);
                          servantContainer.appendChild(servantNameContainer);
                            servantMenu.appendChild(servantContainer);

                          });
                        num = num - 1;
                        }
                      if (servantNum === "0") {
                        const mainElement = document.querySelector('main');
                        const servantMenu = mainElement.querySelector('#servant_menu');
                        const EmptyElement = document.createElement("h3");

                          EmptyElement.textContent = "لم يتم إضافة خدام حتى الآن.";
                        if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                          EmptyElement.textContent = "لم يتم إضافة مخدومين حتى الآن.";
                        }
                          EmptyElement.classList.add("empty")
                            servantMenu.appendChild(EmptyElement);
                      }
                    });
                  }
                }).catch(error => {
                  if (error.code === "storage/object-not-found") {
                    window.location.href = "servants";
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
          if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
            Servant_Title.textContent = "المخدومين";
          }
          const UsersservantsRef = storageRef.child(`servants/${user.email}.json`);
          const mainElement = document.querySelector('main');
          const servantMenu = mainElement.querySelector('#servant_menu');
          UsersservantsRef.getMetadata().then(async (servantMetadata) => {
            const customMetadataservant = servantMetadata.customMetadata;
            const {
              "0": servantNum
            } = customMetadataservant;
            let num = servantNum;
            while (num >= 1) {
              const { [num]: email } = customMetadataservant;

              const UserProfileRef = storageRef.child(`profiles/${email}.json`);

              UserProfileRef.getMetadata().then(async (servantPerMetadata) => {

                const customMetadataperservant = servantPerMetadata.customMetadata;
                const {
                  email: ServantEmail,
                  name: ServantName,
                  id: ServantID,
                  username: ServantUsername,
                  position: ServantPosition,
                  servants: ServantServants,
                  profile_pic: ServantProfilePic
                } = customMetadataperservant;

                const servantContainer = document.createElement("a");
                  servantContainer.href = `profile?username=${ServantUsername}`;
                  servantContainer.classList.add("servant");
                  const servantNameContainer = document.createElement("div");
                    servantNameContainer.classList.add("servant-name")

                  const nameElement = document.createElement("h3");
                  nameElement.textContent = ServantName;
                  nameElement.classList.add("name")

                  const usernameElement = document.createElement("p");
                  usernameElement.textContent = `@${ServantUsername}`;
                usernameElement.dir = "ltr";
                  usernameElement.classList.add("username");

                  const profilepicElement = document.createElement("img");
                  profilepicElement.classList.add("profile-picture");
                  if (ServantProfilePic === "none") {
                      profilepicElement.src = "pictures/profile_pic_unknown.png"; 
                  } else {
                    const fileuserPic = `profile_picture/${ServantEmail}.png`;
                    storageRef.child(fileuserPic).getDownloadURL()
                    .then(url => {
                        profilepicElement.src = url;
                    })
                        profilepicElement.src = "pictures/profile_pic_unknown.png";
                  }

                      servantContainer.appendChild(profilepicElement);
                    servantNameContainer.appendChild(nameElement);
                    servantNameContainer.appendChild(usernameElement);
                servantContainer.appendChild(servantNameContainer);
                  servantMenu.appendChild(servantContainer);

                });
              num = num - 1;
              }
            if (servantNum === "0") {
              const mainElement = document.querySelector('main');
              const servantMenu = mainElement.querySelector('#servant_menu');
              const EmptyElement = document.createElement("h3");

                EmptyElement.textContent = "لم يتم إضافة خدام حتى الآن.";
              if (parseInt(UserPosition) > 0 && parseInt(UserPosition) != 5) {
                EmptyElement.textContent = "لم يتم إضافة مخدومين حتى الآن.";
              }
                EmptyElement.classList.add("empty")
                  servantMenu.appendChild(EmptyElement);
            }
          });
        }
      }).catch(error => {
        if (error.code === "storage/object-not-found") {
          window.location.href = "ar-servants";
        }
      });
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
          themeLink.href = `css/ar-servants.css`;
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
            if (userid || username) {
              window.location.href = "servants" + window.location.search;
            } else {
              window.location.href = "servants";
              }
          } else {
            window.location.href = "error";
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