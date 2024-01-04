const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
const email = urlParams.get("email");

if (!token || !email) {
  // Token or email missing, redirect to error page
  window.location.href = "error";
} else {
  try {
    const storageRef = firebase.storage().ref();
    const filename = `complete_info_data/${email}.json`;
    your_email.textContent = email;
    your_email_servants.textContent = email

    storageRef.child(filename).getMetadata()
      .then(metadata => {
        const customMetadata = metadata.customMetadata;

        if (customMetadata) {
          const { token: cloudToken, email: cloudEmail, tokenExpiration } = customMetadata;

          if (cloudToken === token && cloudEmail === email && tokenExpiration > Date.now()) {
            // Token is valid and matches, grant access
            // Now you can render the complete profile page
          } else {
            window.location.href = "error?error=Page%20expired.";
          }
        } else {
          window.location.href = "error?error=User%20data%20not%20found.";
        }
      })
      .catch(error => {
        console.error("Error fetching metadata:", error);
        // Handle the error, such as showing an error message to the user
        window.location.href = `home`;
      });
  } catch (error) {
    console.error("Authentication error:", error);
    // Handle authentication error, such as redirecting to an error page
    window.location.href = `error?error=${error}`;
  }
}