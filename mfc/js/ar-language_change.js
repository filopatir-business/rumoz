const deviceLanguage = navigator.language || navigator.userLanguage;

// Function to get query parameters as an object
function getQueryParameters() {
  const query = window.location.search.substring(1);
  const pairs = query.split('&');
  const params = {};

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[key] = value;
  }

  return params;
}

// Check if the detected language is Arabic
if (deviceLanguage.startsWith("ar")) {
} else {
  // Determine the current page's filename
  const currentPageFilename = window.location.pathname.split("/").pop();

  // Define the list of pages to redirect to Arabic versions
  const pagesToRedirect = ["ar-signin", "ar-signup"];
  const currentPageENFilename = currentPageFilename.split("-");

  // Check if the current page should be redirected
  if (pagesToRedirect.includes(currentPageFilename)) {
    // Get the existing query parameters
    const queryParams = getQueryParameters();

    // Redirect to the Arabic version of the page with query parameters
    if (JSON.stringify(queryParams) === JSON.stringify({"": undefined})) {
      window.location.href = `${currentPageENFilename[1]}`;
    } else {
      window.location.href = `${currentPageENFilename[1]}?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }
  } else if (currentPageFilename === "ar-forgot-password"){
    const queryParams = getQueryParameters();
    if (JSON.stringify(queryParams) === JSON.stringify({"": undefined})) {
      window.location.href = "forgot-password";
    } else {
      window.location.href = `forgot-password?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }
  } else if (currentPageFilename === "ar") {
    // Get the existing query parameters
    const queryParams = getQueryParameters();

    // Redirect to the Arabic version of the homepage with query parameters
    if (JSON.stringify(queryParams) === JSON.stringify({"": undefined})) {
      window.location.href = `index`;
    } else {
      window.location.href = `index?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }   
  }
}
