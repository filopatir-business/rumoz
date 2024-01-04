let onChangeThemeDLF;
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
            id: UserID,
            gender: UserGender,
            birthday: UserBirthday,
            coins: UserCoins,
            position: UserPosition,
            profile_pic: UserProfilePic,
            theme_mode: UserThemeMode,
            language: UserLanguage
          } = customMetadata;
          var nameInput = document.getElementById("name");
          nameInput.value = UserName;
          birthday.value = UserBirthday;
          gender.value = UserGender;
          const profilePicSettings = document.getElementById("profile-pic");
          const profilePic = document.getElementById("profile-picture");
          if (UserProfilePic === "none") {
            profilePic.src = "pictures/profile_pic_unknown.png";
            profilePicSettings.src = "pictures/profile_pic_unknown.png"; 
          } else {
            const filename = `profile_picture/${user.email}.png`;
            storageRef.child(filename).getDownloadURL()
              .then(url => {
                profilePic.src = url;
                profilePicSettings.src = url;
              })
            const RemovePictureText = document.getElementById("remove-picture");
            RemovePictureText.textContent = "حذف الصورة"
          }
          QRUserUsername.textContent = `@${UserUsername}`;
          QRUserID.textContent = UserID;
          const qrfilename = `qrcode/${user.email}.png`;
          storageRef.child(qrfilename).getDownloadURL()
            .then(url => {
              qr_code.src = url;
              big_qr_code.src = url;
              qr_codeContainer.onclick = function() {
                const modal = document.getElementById("QR-modal");
                modal.style.display = "block";
                  big_qr_code.onclick = function() {
                  window.open(url, "_blank");
                };
              };
            })
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
          curantUserEmail.textContent = UserEmail;
          curantUserUsername.textContent = `@${UserUsername}`;
          curantUserID.textContent = UserID;
          const themeSelect = document.getElementById('theme-select');
          themeSelect.value = UserThemeMode;
          const themeLink = document.getElementById('theme-link');
          const body = document.body;
          const selectedTheme = themeSelect.value;
          body.classList.remove('light_mode', 'dark_mode');
          themeLink.href = `css/ar-settings.css`;
          if (UserThemeMode === "auto_theme") {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            onChangeThemeDLF = true;
            onChangeThemeDL();
            if (prefersDarkMode) {
              body.classList.add("dark_mode");
            } else {
              body.classList.add("light_mode");
            }
          } else {
            body.classList.add(UserThemeMode);
          }
          
          language_select.value = UserLanguage;
          if (UserLanguage === "ar") {
          } else if (UserLanguage === "en") {
            window.location.href = "settings"
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
    if (onChangeThemeDLF === true) {
      body.classList.remove('light_mode', 'dark_mode');
      if (prefersDarkMode.matches) {
        body.classList.add("dark_mode");
      } else {
        body.classList.add("light_mode");
      }
    } else {
      return;
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
          redirectToCompleteProfile(user.email)
        });
      }  else {
        console.error("Authentication error: No user is signed in.");
        window.location.href = "index"; // Redirect if no user is signed in
      }
});


document.addEventListener("DOMContentLoaded", redirectSignedInUser);






document.addEventListener('DOMContentLoaded', function() {
  const editButtons = document.querySelectorAll('.edit-b-username');
  const cancelButtons = document.querySelectorAll('.cancel-button-username');
  const updateButtons = document.querySelectorAll('.update-button');
  const settingContainers = document.querySelectorAll('.settings-username');

  editButtons.forEach((editButton, index) => {
    editButton.addEventListener('click', () => {
      cancel_all()
      settingContainers[index].classList.add('hidden');
      settingContainers[index + 1].classList.remove('hidden');
    });
  });

  cancelButtons.forEach((cancelButton, index) => {
    cancelButton.addEventListener('click', () => {
      settingContainers[index + 1].classList.add('hidden');
      settingContainers[index].classList.remove('hidden');
      new_username.value = "";
      change_username_error_message.textContent = "";
      change_username_done_message.textContent = "";
    });
  });
});



document.addEventListener('DOMContentLoaded', function() {
  const editButtons = document.querySelectorAll('.edit-b-email');
  const cancelButtons = document.querySelectorAll('.cancel-button-email');
  const updateButtons = document.querySelectorAll('.update-button');
  const settingContainers = document.querySelectorAll('.settings-email');

  editButtons.forEach((editButton, index) => {
    editButton.addEventListener('click', () => {
      cancel_all()
      settingContainers[index].classList.add('hidden');
      settingContainers[index + 1].classList.remove('hidden');
    });
  });

  cancelButtons.forEach((cancelButton, index) => {
    cancelButton.addEventListener('click', () => {
      settingContainers[index + 1].classList.add('hidden');
      settingContainers[index].classList.remove('hidden');
      new_email.value = "";
      password_confirmation.value = "";
      change_email_error_message.textContent = "";
    });
  });
});



document.addEventListener('DOMContentLoaded', function() {
  const editButtons = document.querySelectorAll('.edit-b-password');
  const cancelButtons = document.querySelectorAll('.cancel-button-password');
  const updateButtons = document.querySelectorAll('.update-button');
  const settingContainers = document.querySelectorAll('.settings-password');

  editButtons.forEach((editButton, index) => {
    editButton.addEventListener('click', () => {
      settingContainers[index].classList.add('hidden');
      settingContainers[index + 1].classList.remove('hidden');
    });
  });

  cancelButtons.forEach((cancelButton, index) => {
    cancelButton.addEventListener('click', () => {
      settingContainers[index + 1].classList.add('hidden');
      settingContainers[index].classList.remove('hidden');
      current_password.value = "";
      new_password.value = "";
      change_password_error_message.textContent = "";
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const nameField = document.getElementById('name');
  const birthdayField = document.getElementById('birthday');
  const genderField = document.getElementById('gender');
  const saveButton = document.querySelector('.save-profile-S');
  const cancelButton = document.querySelector('.cancel-profile-S');
  const body = document.body;

  saveButton.addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
      const RemovePictureText = document.getElementById("remove-picture");
      if (nameField.value === "") {
            firebase.auth().onAuthStateChanged(user => {
          if (user) {
            const storageRef = firebase.storage().ref();
            const filename = `profiles/${user.email}.json`;

            storageRef.child(filename).getMetadata()
              .then(metadata => {
                const customMetadata = metadata.customMetadata;

                if (customMetadata) {
                  const {
                    name: UserName
                  } = customMetadata;
                  nameField.value = UserName;
                  updateProfileSettings(nameField.value, genderField.value, birthdayField.value, user.email);
                }
              });
            }
        });
      } else {
        updateProfileSettings(nameField.value, genderField.value, birthdayField.value, user.email);
      }
    })
  });
  cancelButton.addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
      const storageRef = firebase.storage().ref();
      const filename = `profiles/${user.email}.json`;

      storageRef.child(filename).getMetadata()
        .then(metadata => {
          const customMetadata = metadata.customMetadata;

          if (customMetadata) {
            const {
              email: UserEmail,
              name: UserName,
              gender: UserGender,
              birthday: UserBirthday,
              profile_pic: UserProfilePic
            } = customMetadata;
            nameField.value = UserName;
            birthdayField.value = UserBirthday;
            genderField.value = UserGender;
            const profilePicSettings = document.getElementById("profile-pic");
            if (UserProfilePic === "none") {
              const RemovePictureText = document.getElementById("remove-picture");
              const fileInput = document.getElementById("profile-pic-input");
              profilePicSettings.src = "pictures/profile_pic_unknown.png";
              fileInput.value = "";
              RemovePictureText.textContent = ""
            } else {
              const filename = `profile_picture/${user.email}.png`;
              storageRef.child(filename).getDownloadURL()
                .then(url => {
                  profilePicSettings.src = url;
                })
              const RemovePictureText = document.getElementById("remove-picture");
              RemovePictureText.textContent = "حذف الصورة"
              profilePicSettings.src = "pictures/profile_pic_unknown.png";
            }
          }
          })
      .catch(error => {
        console.error("Error fetching metadata:", error);
        // Handle the error, such as showing an error message to the user
        window.location.href = `ar-error?error=${error}`;
      });
    });
  });
});


async function updateProfileSettings(nameField, genderField, birthdayField, email) {
  const profilePic = document.getElementById("profile-picture");
  const fileInput = document.getElementById("profile-pic-input");
  if (fileInput.files.length > 0) {
    const customMetadata = {
      name: nameField,
      gender: genderField,
      birthday: birthdayField,
      profile_pic: `${email}.png`
    };
    const storageRef = firebase.storage().ref();
    const userFileRef = storageRef.child(`profiles/${email}.json`);
    try {
      await updateEmailInDisplayName();
      await addEmailToDisplayName(nameField, email);
      await userFileRef.updateMetadata({ customMetadata });
      const fileInput = document.getElementById("profile-pic-input");
      const img = fileInput.files[0];
      const profilePicRef = storageRef.child(`/profile_picture/${email}.png`);
      await profilePicRef.put(img);
      profilePicRef.getDownloadURL()
      .then(url => {
          profilePic.src = url;
      })
      showNotification("تم تحديث الملف الشخصي!");
    } catch (error) {
      console.error('Error updating theme mode:', error);
    }
  } else {
    const customMetadata = {
      name: nameField,
      gender: genderField,
      birthday: birthdayField,
      profile_pic: "none"
    };
    const storageRef = firebase.storage().ref();
    const userFileRef = storageRef.child(`profiles/${email}.json`);
    try {
      await updateEmailInDisplayName();
      await addEmailToDisplayName(nameField, email);
      await userFileRef.updateMetadata({ customMetadata });
      const updatedMetadata = await userFileRef.getMetadata();
      profilePic.src = "pictures/profile_pic_unknown.png";
      showNotification("تم تحديث الملف الشخصي!");
    } catch (error) {
      console.error('Error updating theme mode:', error);
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const themeSelect = document.getElementById('theme-select');
  const themeLink = document.getElementById('theme-link');
  const languageSelect = document.getElementById('language_select');
  const saveButton = document.querySelector('.save-general-S');
  const body = document.body;

  saveButton.addEventListener('click', function() {
    firebase.auth().onAuthStateChanged(user => {
      updateGeneralSettings(themeSelect.value, languageSelect.value, user.email);
    });

    const UserLanguage = languageSelect.value;
    if (UserLanguage === "ar") {
    } else if (UserLanguage === "en") {
      window.location.href = "settings"
    } else {
      window.location.href = "error"
    }
    showNotification("تم تحديث الإعدادات العامة!");
  });
});

async function updateGeneralSettings(themeSelect, languageSelect, email) {
  const customMetadata = {
    theme_mode: themeSelect,
    language: languageSelect
  };

  const body = document.body;
  body.classList.remove('light_mode', 'dark_mode');

  if (themeSelect === "auto_theme") {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    onChangeThemeDLF = true;
    onChangeThemeDL();
    if (prefersDarkMode) {
      body.classList.add("dark_mode");
    } else {
      body.classList.add("light_mode");
    }
  } else {
    onChangeThemeDLF = false;
    body.classList.add(themeSelect);
  }
  
  const storageRef = firebase.storage().ref();
  const userFileRef = storageRef.child(`profiles/${email}.json`);

  try {
    // Update the specific metadata fields
    await userFileRef.updateMetadata({ customMetadata });

    // Retrieve the updated metadata
    const updatedMetadata = await userFileRef.getMetadata();
  } catch (error) {
    console.error('Error updating theme mode:', error);
  }
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
    RemovePictureText.textContent = "حذف الصورة";
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


const sidebarLinks = document.querySelectorAll('.sidebar a');
const formSections = document.querySelectorAll('.form');
const sections = document.querySelectorAll('.section');
const formContainer = document.querySelector('.form-container');

formContainer.addEventListener('scroll', () => {
    const formContainerHeight = formContainer.clientHeight;
    const scrollPosition = formContainer.scrollTop;

    let selectedFormSection = null;
    formSections.forEach(section => {
        if (section.offsetTop <= scrollPosition + formContainerHeight / 2) {
            selectedFormSection = section;
        }
    });

    if (selectedFormSection) {
        sidebarLinks.forEach(link => {
            const targetSectionId = link.getAttribute('href');
            if (targetSectionId === `#${selectedFormSection.id}`) {
                sidebarLinks.forEach(sidebarLink => {
                    sidebarLink.parentElement.classList.remove('selected');
                });
                link.parentElement.classList.add('selected');
            }
        });
    }
});

sidebarLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();

        sidebarLinks.forEach(sidebarLink => {
            sidebarLink.parentElement.classList.remove('selected');
        });
        link.parentElement.classList.add('selected');

        const targetSectionId = link.getAttribute('href');
        const targetFormSection = document.querySelector(targetSectionId);

        if (targetFormSection) {
            // Scroll the .form-container to the top of the target form section,
            // adjusted by a desired offset (in this case, 20 pixels)
            const offset = 20; // Adjust this value as needed
            formContainer.scrollTop = targetFormSection.offsetTop - formContainer.offsetTop - offset;
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");

    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });
});



firebase.auth().onAuthStateChanged(user => {
  const updateUsernameButton = document.getElementById("update_B_username");

  updateUsernameButton.addEventListener('click', async function() {
    const storageRef = firebase.storage().ref();
    const UsersIDRef = storageRef.child('details/username.json');
    const usernametakenTF = await userIDimrtadata(new_username.value, UsersIDRef);
    const userFileRef = storageRef.child(`profiles/${user.email}.json`);
    const oldUserMetadata = await userFileRef.getMetadata();
    const customMetadata = oldUserMetadata.customMetadata;

    const {
      username: UserUsername
    } = customMetadata;

    const new_usernameNEWValue = new_username.value.replace(/[^!@#$%^&*()_+{}[\]:;<>,.?~\\\-/1234567890^a-zA-Z]/g, '');
    new_username.value = new_usernameNEWValue.toLowerCase();
    if (/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(new_username.value)) {
      updateUsernameButton.classList.add("vibrate");
      setTimeout(() => {
        updateUsernameButton.classList.remove("vibrate");
      }, 650);
      change_username_error_message.textContent = "لا يمكن لاسم المستخدم أن يحتوي على هذه الرموز: ! @ # $ % ^ & * ( ) - + { } [ ] :  ; < > , ? ~ /.";
      change_username_done_message.textContent = "";
    } else if (new_username.value.includes(" ")) {
      updateUsernameButton.classList.add("vibrate");
      setTimeout(() => {
        updateUsernameButton.classList.remove("vibrate");
      }, 650);
       change_username_error_message.textContent = "لا يمكن لاسم المستخدم أن يحتوي على مسافات.";
      change_username_done_message.textContent = "";
    } else if (new_username.value.length < 4) {
      updateUsernameButton.classList.add("vibrate");
      setTimeout(() => {
        updateUsernameButton.classList.remove("vibrate");
      }, 650);
      updateUsernameButton.classList.add("vibrate");
      setTimeout(() => {
        updateUsernameButton.classList.remove("vibrate");
      }, 650);
      change_username_error_message.textContent = "يجب أن يحتوي اسم المستخدم على الأقل على 4 أحرف.";
      change_username_done_message.textContent = "";
    } else if (new_username.value.length > 25) {
      updateUsernameButton.classList.add("vibrate");
      setTimeout(() => {
        updateUsernameButton.classList.remove("vibrate");
      }, 650);
      change_username_error_message.textContent = "لا يمكن لاسم المستخدم أن يزيد عن 25 حرفًا.";
      change_username_done_message.textContent = "";
    } else if (usernametakenTF) {
        updateUsernameButton.classList.add("vibrate");
      setTimeout(() => {
        updateUsernameButton.classList.remove("vibrate");
      }, 650);
      change_username_error_message.textContent = "اسم المستخدم مأخوذ بالفعل.";
      change_username_done_message.textContent = "";
    } else {
      change_username_error_message.textContent = "";
      change_username_done_message.textContent = "اسم المستخدم متاح.";
      try {
        const UserIDMetadata = {
          username: new_username.value
        };

        try {
          await userFileRef.updateMetadata({ customMetadata: UserIDMetadata });

        } catch (error) {
          updateUsernameButton.classList.add("vibrate");
          setTimeout(() => {
            updateUsernameButton.classList.remove("vibrate");
          }, 650);
          console.error('Error:', error);
        }

        const UserUsernameMetadata = {
          [new_username.value]: user.email,
          [UserUsername]: ""
        };

        try {

          await UsersIDRef.updateMetadata({ customMetadata: UserUsernameMetadata });
        } catch (error) {
          updateUsernameButton.classList.add("vibrate");
          setTimeout(() => {
            updateUsernameButton.classList.remove("vibrate");
          }, 650);
          console.error('Error:', error);
        }
        showNotification("Username updated!");
        location.reload();
      } catch (error) {
        updateUsernameButton.classList.add("vibrate");
        setTimeout(() => {
          updateUsernameButton.classList.remove("vibrate");
        }, 650);
        console.error('Error:', error);
      }
    }
  });
});


firebase.auth().onAuthStateChanged(user => {
if (user) {
    if (user.providerData.some(provider => provider.providerId === "google.com")) {
        const updateEmailButton = document.getElementById("update_B_email");
        updateEmailButton.addEventListener('click', function() {
          change_email_error_message.textContent = "أنت تستخدم حساب جوجل للتسجيل، لا يمكنك تغيير البريد الإلكتروني.";
          updateEmailButton.classList.add("vibrate");
          setTimeout(() => {
            updateEmailButton.classList.remove("vibrate");
          }, 650);
        });
    } else {

        const updateEmailButton = document.getElementById("update_B_email");
        updateEmailButton.addEventListener('click', function() {
          updateEmail()
        });
    }
} else {
    // User is not authenticated, handle accordingly
}
});




function updateEmail() {
    const RemovePictureText = document.getElementById("remove-picture");
    const updateEmailButton = document.getElementById("update_B_email");
    const user = firebase.auth().currentUser;
    const newEmail = document.getElementById("new_email").value;
    const passwordConfirmation = document.getElementById("password_confirmation").value;
    if (user.email !== newEmail) {
            const credentials = firebase.auth.EmailAuthProvider.credential(user.email, passwordConfirmation);

            user.reauthenticateWithCredential(credentials).then(() => {
                    const oldProfilePath = `profiles/${user.email}.json`;
                    const newProfilePath = `profiles/${newEmail}.json`;



                    if (RemovePictureText.textContent !== "") {
                      const oldProfilePicPath = `profile_picture/${user.email}.png`;
                      const newProfilePicPath = `profile_picture/${newEmail}.png`;
                      renamePic(oldProfilePicPath, newProfilePicPath, newEmail);
                    }

                    renameFile(oldProfilePath, newProfilePath, newEmail);
                    user.updateEmail(newEmail).then(() => {
                      showNotification("تم تحديث البريد الإلكتروني!");
                      console.log("Email updated successfully");
                      change_email_error_message.textContent = "";
                      location.reload();
                }).catch(error => {
                    const errorMessage = customError(error.code);
                    change_email_error_message.textContent = errorMessage;
                    console.error("Error updating email:", error);
                    updateEmailButton.classList.add("vibrate");
                    setTimeout(() => {
                      updateEmailButton.classList.remove("vibrate");
                    }, 650);
                });
            }).catch(error => {
                const errorMessage = customError(error.code);
                change_email_error_message.textContent = errorMessage;
                console.error("Error reauthenticating user:", error);
                updateEmailButton.classList.add("vibrate");
                setTimeout(() => {
                  updateEmailButton.classList.remove("vibrate");
                }, 650);
            });
        } else {
            change_email_error_message.textContent = "البريد الإلكتروني الجديد هو نفس البريد الإلكتروني الحالي";
            updateEmailButton.classList.add("vibrate");
            setTimeout(() => {
              updateEmailButton.classList.remove("vibrate");
            }, 650);
        }
    }


firebase.auth().onAuthStateChanged(user => {
if (user) {
    const updateEmailButton = document.getElementById("update_B_password");
    if (user.providerData.some(provider => provider.providerId === "google.com")) {
        updateEmailButton.addEventListener('click', function() {
          change_password_error_message.textContent = "أنت تستخدم حساب جوجل للتسجيل، لا يمكنك تغيير كلمة المرور.";
          updateEmailButton.classList.add("vibrate");
          setTimeout(() => {
            updateEmailButton.classList.remove("vibrate");
          }, 650);
        });
    } else {
        document.getElementById("update_B_password").addEventListener("click", async () => {
            const currentPassword = document.getElementById("current_password").value;
            const newPassword = document.getElementById("new_password").value;
            try {
                const user = firebase.auth().currentUser;
                const credential = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    currentPassword
                );

                // Reauthenticate user with current password
                await user.reauthenticateWithCredential(credential);
                if (currentPassword === newPassword) {
                  change_password_error_message.textContent = "كلمة المرور الجديدة هي نفس كلمة المرور الحالية";
                  updateEmailButton.classList.add("vibrate");
                  setTimeout(() => {
                    updateEmailButton.classList.remove("vibrate");
                  }, 650);
                } else if (newPassword.length < 8) {
                  change_password_error_message.textContent = "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل";
                  updateEmailButton.classList.add("vibrate");
                  setTimeout(() => {
                    updateEmailButton.classList.remove("vibrate");
                  }, 650);
                } else if (!/[A-Z]/g.test(newPassword)) {
                  change_password_error_message.textContent = "يجب أن تحتوي كلمة المرور الجديدة على حرف كبير واحد على الأقل";
                  updateEmailButton.classList.add("vibrate");
                  setTimeout(() => {
                    updateEmailButton.classList.remove("vibrate");
                  }, 650);
                } else if (!/[1234567890]/.test(newPassword)) {
                  change_password_error_message.textContent = "يجب أن تحتوي كلمة المرور الجديدة على رقم واحد على الأقل";
                  updateEmailButton.classList.add("vibrate");
                  setTimeout(() => {
                    updateEmailButton.classList.remove("vibrate");
                  }, 650);
                } else if (!/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(newPassword)) {
                  change_password_error_message.textContent = "يجب أن تحتوي كلمة المرور الجديدة على حرف خاص واحد على الأقل";
                  updateEmailButton.classList.add("vibrate");
                  setTimeout(() => {
                    updateEmailButton.classList.remove("vibrate");
                  }, 650);
                } else {
                  try {
                    // Change the password
                    await user.updatePassword(newPassword);
                    showNotification("تم تغيير كلمة المرور!");

                    console.log("Password updated successfully.");
                    change_password_error_message.textContent = "";
                    location.reload();
                  } catch (error) {
                    const errorMessage = customError(error.code);
                    change_password_error_message.textContent = errorMessage;
                    updateEmailButton.classList.add("vibrate");
                    setTimeout(() => {
                      updateEmailButton.classList.remove("vibrate");
                    }, 650);
                  }
                }
              } catch (error) {
                  const errorMessage = customError(error.code);
                  change_password_error_message.textContent = errorMessage;
                  updateEmailButton.classList.add("vibrate");
                  setTimeout(() => {
                    updateEmailButton.classList.remove("vibrate");
                  }, 650);
            }

        });
    }
} else {
    // User is not authenticated, handle accordingly
}
});




async function renameFile(oldPath, newPath, newEmail) {
    const storageRef = firebase.storage().ref();
    const RemovePictureText = document.getElementById("remove-picture");
    const newFileRef = storageRef.child(newPath);
    const oldFileRef = storageRef.child(oldPath);

    try {
        const metadata = await storageRef.child(oldPath).getMetadata();
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
            const {
                email: UserEmail,
                name: UserName,
                gender: UserGender,
                birthday: UserBirthday,
                coins: UserCoins,
                position: UserPosition,
                profile_pic: UserProfilePic,
                theme_mode: UserThemeMode,
                language: UserLanguage
            } = customMetadata;

            const userDataJSON = JSON.stringify(customMetadata);
            await newFileRef.putString(userDataJSON);
            oldFileRef.delete()
            await newFileRef.updateMetadata({ customMetadata });
        }
        if (RemovePictureText.textContent === "") {
        const customMetadata = {
          email: newEmail
        };
        await newFileRef.updateMetadata({ customMetadata });
        } else {
          const customMetadata = {
          email: newEmail,
            profile_pic: /*`${newEmail}.png`*/"none"
        };
        await newFileRef.updateMetadata({ customMetadata });
        }
    } catch (error) {
        console.error("Error getting metadata:", error);
    }
}



async function renamePic(oldPath, newPath, newEmail) {
    const storageRef = firebase.storage().ref();
    const RemovePictureText = document.getElementById("remove-picture");
    const newFileRef = storageRef.child(newPath);
    const oldFileRef = storageRef.child(oldPath);
    const profilePic = document.getElementById("profile-pic");

    storageRef.child(oldPath).getDownloadURL()
      .then(async url => {

        const metadata = {
          contentType: 'image/png'
        };
        await newFileRef.put(url, metadata);
      })
}



async function cancel_all() {
  firebase.auth().onAuthStateChanged(user => {
      const themeSelect = document.getElementById('theme-select');
      const languageSelect = document.getElementById('language_select');
      const storageRef = firebase.storage().ref();
      const filename = `profiles/${user.email}.json`;

      storageRef.child(filename).getMetadata()
        .then(metadata => {
          const customMetadata = metadata.customMetadata;

          if (customMetadata) {
            const {
              language: UserLanguage,
              theme_mode: UserThemeMode
            } = customMetadata;
            languageSelect.value = UserLanguage;
            themeSelect.value = UserThemeMode;
          }
          })
      .catch(error => {
        console.error("Error fetching metadata:", error);
        window.location.href = `ar-error?error=${error}`;
      });
    });
    firebase.auth().onAuthStateChanged(user => {
      const nameField = document.getElementById('name');
      const birthdayField = document.getElementById('birthday');
      const genderField = document.getElementById('gender');
      const storageRef = firebase.storage().ref();
      const filename = `profiles/${user.email}.json`;

      storageRef.child(filename).getMetadata()
        .then(metadata => {
          const customMetadata = metadata.customMetadata;

          if (customMetadata) {
            const {
              email: UserEmail,
              name: UserName,
              gender: UserGender,
              birthday: UserBirthday,
              profile_pic: UserProfilePic
            } = customMetadata;
            nameField.value = UserName;
            birthdayField.value = UserBirthday;
            genderField.value = UserGender;
            const profilePicSettings = document.getElementById("profile-pic");
            if (UserProfilePic === "none") {
              const RemovePictureText = document.getElementById("remove-picture");
              const fileInput = document.getElementById("profile-pic-input");
              profilePicSettings.src = "pictures/profile_pic_unknown.png";
              fileInput.value = "";
              RemovePictureText.textContent = ""
            } else {
              const filename = `profile_picture/${user.email}.png`;
              storageRef.child(filename).getDownloadURL()
                .then(url => {
                  profilePicSettings.src = url;
                })
              const RemovePictureText = document.getElementById("remove-picture");
              RemovePictureText.textContent = "Remove Picture"
              profilePicSettings.src = "pictures/profile_pic_unknown.png";
            }
          }
          })
      .catch(error => {
        console.error("Error fetching metadata:", error);
        // Handle the error, such as showing an error message to the user
        window.location.href = `ar-error?error=${error}`;
      });
    });

}


const deleteButton = document.getElementById("delete_B_account");

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        if (user.providerData.some(provider => provider.providerId === "google.com")) {
            // الحصول على النافذة النموذجية والأزرار
            const modal = document.getElementById("delete-modalG");
            const cancelButton = document.getElementById("cancel_B_deleteG");
            const confirmButton = document.getElementById("update_B_deleteG");
            const deleteErrorMessage = document.getElementById("delete_error_messageG");

            // عند النقر على زر الحذف، قم بإظهار النافذة النموذجية
            deleteButton.addEventListener("click", () => {
                modal.style.display = "block";
                deleteErrorMessage.textContent = "";
            });

            // إخفاء النافذة النموذجية عند النقر على زر الإلغاء
            cancelButton.addEventListener("click", () => {
                modal.style.display = "none";
            });

            // معالجة إجراء الحذف عند النقر على زر التأكيد
            confirmButton.addEventListener("click", async () => {
                const user = firebase.auth().currentUser;
                if (user) {
                    try {
                        // إعادة التوثيق باستخدام مزود جوجل
                        await user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider());

                        // المستخدم تم التوثيق له، قم بمعالجة حذف الحساب
                        try {
                          updateEmailInDisplayName().then(() => {
                            updateEmailInIDUsername().then(() => {
                                user.delete().then(() => {
                                    console.log("تم حذف الحساب بنجاح.");
                                    modal.style.display = "none";
                                    const storageRef = firebase.storage().ref();
                                          const filename = `complete_profile_data/${user.email}.json`;
                                          const filename2 = `profiles/${user.email}.json`;
                                          const filename3 = `servants/${user.email}.json`;
                                          const filename4 = `wallet/${user.email}.json`;
                                          const filename5 = `infos/${user.email}.json`;
                                          const filename6 = `notifications/${user.email}.json`;
                                          storageRef.child(filename).delete()
                                          storageRef.child(filename2).delete()
                                          storageRef.child(filename3).delete()
                                          storageRef.child(filename4).delete()
                                          storageRef.child(filename5).delete()
                                          storageRef.child(filename6).delete()
                                        .then(() => {
                                          console.log(`${filename} has been deleted.`);
                                          console.log(`${filename2} has been deleted.`);
                                          console.log(`${filename3} has been deleted.`);
                                          console.log(`${filename4} has been deleted.`);
                                          console.log(`${filename5} has been deleted.`);
                                          console.log(`${filename6} has been deleted.`);
                                        })
                                        .catch(error => {
                                            console.error("خطأ في حذف الملف:", error);
                                        });
                                }).catch((error) => {
                                    console.error("خطأ في حذف الملف:", error);
                                });
                            });
                          });

                        } catch (error) {
                            console.error("خطأ في حذف الحساب:", error.message);
                            deleteErrorMessage.textContent = "حدث خطأ أثناء حذف الحساب.";
                        }
                    } catch (error) {
                        console.error("خطأ في إعادة التوثيق للمستخدم:", error.message);
                        deleteErrorMessage.textContent = "حدث خطأ أثناء إعادة التوثيق. الرجاء تسجيل الدخول مرة أخرى.";
                    }
                } else {
                    deleteErrorMessage.textContent = "لا يوجد مستخدم مسجل حالياً.";
                }
            });
        } else {
            // الحصول على النافذة النموذجية والأزرار
            const modal = document.getElementById("delete-modal");
            const cancelButton = document.getElementById("cancel_B_delete");
            const confirmButton = document.getElementById("update_B_delete");
            const deleteErrorMessage = document.getElementById("delete_error_message");

            // عند النقر على زر الحذف، قم بإظهار النافذة النموذجية
            deleteButton.addEventListener("click", () => {
                modal.style.display = "block";
                deleteErrorMessage.textContent = "";
            });

            // إخفاء النافذة النموذجية عند النقر على زر الإلغاء
            cancelButton.addEventListener("click", () => {
                modal.style.display = "none";
            });

            // معالجة إجراء الحذف عند النقر على زر التأكيد
            confirmButton.addEventListener("click", async () => {
                const user = firebase.auth().currentUser;
                if (user) {
                    const passwordConfirmation = document.getElementById("password_confirmation_D").value;
                    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, passwordConfirmation);
                    user.reauthenticateWithCredential(credentials).then(() => {
                      try {
                        updateEmailInDisplayName().then(() => {
                          updateEmailInIDUsername().then(() => {
                              user.delete().then(() => {
                                  console.log("تم حذف الحساب بنجاح.");
                                  modal.style.display = "none";
                                  const storageRef = firebase.storage().ref();
                                        const filename = `complete_profile_data/${user.email}.json`;
                                        const filename2 = `profiles/${user.email}.json`;
                                        const filename3 = `servants/${user.email}.json`;
                                        const filename4 = `wallet/${user.email}.json`;
                                        const filename5 = `infos/${user.email}.json`;
                                        const filename6 = `notifications/${user.email}.json`;
                                        storageRef.child(filename).delete()
                                        storageRef.child(filename2).delete()
                                        storageRef.child(filename3).delete()
                                        storageRef.child(filename4).delete()
                                        storageRef.child(filename5).delete()
                                        storageRef.child(filename6).delete()
                                      .then(() => {
                                        console.log(`${filename} has been deleted.`);
                                        console.log(`${filename2} has been deleted.`);
                                        console.log(`${filename3} has been deleted.`);
                                        console.log(`${filename4} has been deleted.`);
                                        console.log(`${filename5} has been deleted.`);
                                        console.log(`${filename6} has been deleted.`);
                                      })
                                      .catch(error => {
                                          console.error("خطأ في حذف الملف:", error);
                                      });
                              }).catch((error) => {
                                  console.error("خطأ في حذف الملف:", error);
                              });
                          });
                        });

                      } catch (error) {
                          console.error("خطأ في حذف الحساب:", error.message);
                          deleteErrorMessage.textContent = "حدث خطأ أثناء حذف الحساب.";
                      }
                    }).catch(error => {
                        const errorMessage = customError(error.code);
                        deleteErrorMessage.textContent = errorMessage;
                        console.error("خطأ في إعادة التوثيق للمستخدم:", error);
                    });
                } else {
                    deleteErrorMessage.textContent = "لا يوجد مستخدم مسجل حالياً.";
                }
            });
        }
    } else {
        // المستخدم غير موثق، قم بمعالجة الأمر وفقًا لذلك
    }
});


const newUsernameInput = document.getElementById("new_username");

newUsernameInput.addEventListener("input", async function() {
  const storageRef = firebase.storage().ref();
  const UsersIDRef = storageRef.child('details/username.json');
  const usernametakenTF = await userIDimrtadata(new_username.value, UsersIDRef)
  const new_usernameNEWValue = new_username.value.replace(/[^!@#$%^&*()_+{}[\]:;<>,.?~\\\-/1234567890^a-zA-Z]/g, '');
  new_username.value = new_usernameNEWValue.toLowerCase();
  if (/[!@#$%^&*()+{}\[\]:;<>,?~\\\-/]/.test(new_username.value)) {
      change_username_error_message.textContent = "لا يمكن لاسم المستخدم أن يحتوي على هذه الرموز: ! @ # $ % ^ & * ( ) - + { } [ ] :  ; < > , ? ~ /.";
    change_username_done_message.textContent = "";
  } else if (new_username.value.includes(" ")) {
                change_username_error_message.textContent = "لا يمكن لاسم المستخدم أن يحتوي على مسافات.";
    change_username_done_message.textContent = "";
  } else if (new_username.value.length < 4) {
                change_username_error_message.textContent = "يجب أن يحتوي اسم المستخدم على الأقل على 4 أحرف.";
    change_username_done_message.textContent = "";
  } else if (new_username.value.length > 25) {
                change_username_error_message.textContent = "لا يمكن لاسم المستخدم أن يزيد عن 25 حرفًا.";
    change_username_done_message.textContent = "";
  } else if (usernametakenTF) {
    change_username_error_message.textContent = "اسم المستخدم مأخوذ بالفعل.";
    change_username_done_message.textContent = "";
  } else {
    change_username_error_message.textContent = "";
    change_username_done_message.textContent = "اسم المستخدم متاح.";
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




function signOut() {
  firebase.auth().signOut()
    .then(() => {
      showNotification("لقد قمت بتسجيل الخروج!");
      window.location.href = "index";
    })
    .catch((error) => {
      console.error("Sign Out Error", error);
    });
}



const birthdayInput = document.getElementById("birthday");
const minDate = new Date("1900-01-01").toISOString().split("T")[0];
birthdayInput.setAttribute("min", minDate);
const currentDate = new Date().toISOString().split("T")[0];
birthdayInput.setAttribute("max", currentDate);
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const storageRef = firebase.storage().ref();
    const filename = `profiles/${user.email}.json`;

    birthdayInput.addEventListener("input", function() {
      storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
            birthday: Userbirthday
          } = customMetadata;
          if (birthdayInput.value === '') {
              birthdayInput.value = Userbirthday;
          }
        }
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
    });
  }
});

async function updateEmailInDisplayName() {
  firebase.auth().onAuthStateChanged(user => {
    const storageRef = firebase.storage().ref();
    const UserFileRef = `profiles/${user.email}.json`;
    storageRef.child(UserFileRef).getMetadata()
    .then(metadata => {
      const customMetadata = metadata.customMetadata;
      if (customMetadata) {
        const {
          name: UserName
        } = customMetadata;
          removeEmailToDisplayName(user.email, UserName);
      }
    });
  });
}



async function removeEmailToDisplayName(newEmail, displayName) {
  try {
    const displaynameRef = storage.ref("details/displayname.json");

    const metadata = await displaynameRef.getMetadata();
    const data = metadata.customMetadata;
    console.log(data[displayName]);
    console.log(displayName);

    if (displayName in data) {
        let existingEmails = data[displayName].split('/*/');

        if (existingEmails.includes(newEmail)) {
            console.log(existingEmails);
            existingEmails = existingEmails.filter(email => email !== newEmail);
            console.log(existingEmails);
            const updatedValue = existingEmails.join('/*/');

            await displaynameRef.updateMetadata({
                customMetadata: {
                    ...data,
                    [displayName]: updatedValue
                }
            });
        }
    }
  } catch (error) {
      console.error("Error updating display name:", error);
  }
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

async function updateEmailInIDUsername() {
  firebase.auth().onAuthStateChanged(user => {
    const storageRef = firebase.storage().ref();
    const UserFileRef = `profiles/${user.email}.json`;
    storageRef.child(UserFileRef).getMetadata()
    .then(metadata => {
      const customMetadata = metadata.customMetadata;
      if (customMetadata) {
        const {
          id: UserID,
          username: UserUsername
        } = customMetadata;
            removeEmailInIDUsername(user.email, UserID, UserUsername);
      }
    });
  });
}



async function removeEmailInIDUsername(newEmail, UserID, UserUsername) {
  try {
    const UserIDRef = storage.ref("details/userid.json");
    const UsernameRef = storage.ref("details/username.json");

    const metadataID = await UserIDRef.getMetadata();
    const metadataUsername = await UsernameRef.getMetadata();
    const dataID = metadataID.customMetadata;
    const dataUsername = metadataUsername.customMetadata;

    if (UserID in data) {
      await UserIDRef.updateMetadata({
          customMetadata: {
              ...data,
              [UserID]: ""
          }
      }); 
    }

    if (UserUsername in data) {
      await UsernameRef.updateMetadata({
          customMetadata: {
              ...data,
              [UserUsername]: ""
          }
      }); 
    }
  } catch (error) {
      console.error("Error updating display name:", error);
  }
}


function customError(errorCode) {
    const errorMessages = {
        "auth/user-mismatch": "البيانات المقدمة لا تتطابق مع المستخدم الذي قام بتسجيل الدخول مسبقاً.",
        "auth/wrong-password": "كلمة المرور التي أدخلتها غير صحيحة.",
        "auth/user-not-found": "لا يوجد مستخدم مسجل حالياً.",
        "auth/requires-recent-login": "من أجل أمانك، يجب عليك تسجيل الدخول مرة أخرى قبل إجراء التغييرات.",
        "auth/email-already-in-use": "عنوان البريد الإلكتروني هذا مرتبط بحساب آخر. الرجاء استخدام عنوان بريد إلكتروني مختلف.",
        "auth/invalid-email": "عنوان البريد الإلكتروني الذي أدخلته غير صالح.",
        "auth/weak-password": "كلمة المرور التي قدمتها ضعيفة للغاية."
    };
    return errorMessages[errorCode] || "حدث خطأ غير معروف.";
}

//const errorMessage = customError(error.code);


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