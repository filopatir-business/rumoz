function updateUserData(user) {
  if (user) {
    const storageRef = firebase.storage().ref();
    const filename = `profiles/${user.email}.json`;

    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const {
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
          const UserswalletRef = storageRef.child(`wallet/${user.email}.json`);
          const mainElement = document.querySelector('main');
          const walletMenu = mainElement.querySelector('#wallet_menu');
          UserswalletRef.getMetadata().then(async (walletMetadata) => {
            const customMetadatawallet = walletMetadata.customMetadata;
            const {
              "0": walletNum
            } = customMetadatawallet;
            let num = walletNum;
            while (num >= 1) {
              const { [num]: DetailsWallet } = customMetadatawallet;
              const [date, time, ammount, coinsBefore, walletProfilePic, title, description, ar_title, ar_description] = DetailsWallet.split("/*/");
              const coinsAfter = parseInt(coinsBefore) + parseInt(ammount);

              const walletContainer = document.createElement("a");
              walletContainer.classList.add("wallet");
              const wallettitleContainer = document.createElement("div");
              wallettitleContainer.classList.add("wallet-title")
              const walletCoins_container = document.createElement("div");
              walletCoins_container.classList.add("coins-wallet-container")

              const titleElement = document.createElement("h3");
              titleElement.textContent = title;
              titleElement.classList.add("title")

              const descriptionElement = document.createElement("p");
              descriptionElement.textContent = description;
              descriptionElement.classList.add("description");

              const dateElement = document.createElement("p");
              dateElement.textContent = date;
              dateElement.classList.add("time")
              
              const timeElement = document.createElement("p");
              timeElement.textContent = time;
              timeElement.classList.add("time")

              const CoinsBeforeElement = document.createElement("p");
                CoinsBeforeElement.textContent = `${coinsBefore} Coins`;
                CoinsBeforeElement.classList.add("payment")

              const ammountElement = document.createElement("p");
              if (ammount < 0) {
                ammountElement.textContent = ammount;
                ammountElement.classList.add("paying")
              } else if (ammount > 0) {
                ammountElement.textContent = "+" + ammount;
                ammountElement.classList.add("earning")
              }

              const CoinsAfterElement = document.createElement("p");
              CoinsAfterElement.textContent = `${coinsAfter}`;
              CoinsAfterElement.classList.add("payment-after")

              const CoinsIconWallet = document.createElement("img");
              CoinsIconWallet.classList.add("coins-wallet-icon");
              CoinsIconWallet.src = "pictures/coins_icon.png";
              
              const CoinsAfter_lableElement = document.createElement("span");
               CoinsAfter_lableElement.textContent = `Coins`;
                CoinsAfter_lableElement.classList.add("payment-after")

              const profilepicElement = document.createElement("img");
              profilepicElement.classList.add("wallet-picture");
              if (walletProfilePic === "none") {
                  profilepicElement.src = `pictures/icons/payment.png`; 
              } else {
                profilepicElement.src = `pictures/icons/${walletProfilePic}.png`;
              }

                walletContainer.appendChild(profilepicElement);
                wallettitleContainer.appendChild(titleElement);
                if (descriptionElement.textContent !== "none") {
                  wallettitleContainer.appendChild(descriptionElement);
                }
              wallettitleContainer.appendChild(dateElement);
                wallettitleContainer.appendChild(timeElement);
                wallettitleContainer.appendChild(CoinsBeforeElement);
                 wallettitleContainer.appendChild(ammountElement);
                walletCoins_container.appendChild(CoinsAfterElement);
                walletCoins_container.appendChild(CoinsIconWallet);
                walletCoins_container.appendChild(CoinsAfter_lableElement);
                wallettitleContainer.appendChild(walletCoins_container);
                walletContainer.appendChild(wallettitleContainer);
                walletMenu.appendChild(walletContainer);
              num = num - 1;
              }
            if (walletNum === "0") {
              const mainElement = document.querySelector('main');
              const notificationMenu = mainElement.querySelector('#wallet_menu');
              const EmptyElement = document.createElement("h3");

                EmptyElement.textContent = "The wallet is empty. No transactions available.";
                EmptyElement.classList.add("empty")
                notificationMenu.appendChild(EmptyElement);
            }
          });
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
          const UsersnotificationsRef = storageRef.child(`notifications/${user.email}.json`);
          const notification_dotS = document.getElementById("notification_dotS");
          const notification_dotM = document.getElementById("notification_dotM");
          UsersnotificationsRef.getMetadata().then(async (notificationMetadata) => {
            const customMetadatanotification = notificationMetadata.customMetadata;
            const {
              "-1": unreadnotificationNum
            } = customMetadatanotification;
            let unreadNum = unreadnotificationNum;
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
          themeLink.href = `css/wallet.css`;
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
            window.location.href = "ar-wallet"
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