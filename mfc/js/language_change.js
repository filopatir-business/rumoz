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
  // Determine the current page's filename
  const currentPageFilename = window.location.pathname.split("/").pop();

  // Define the list of pages to redirect to Arabic versions
  const pagesToRedirect = ["signin", "signup", "forgot-password"];

  // Check if the current page should be redirected
  if (pagesToRedirect.includes(currentPageFilename)) {
    // Get the existing query parameters
    const queryParams = getQueryParameters();

    // Redirect to the Arabic version of the page with query parameters
    if (JSON.stringify(queryParams) === JSON.stringify({"": undefined})) {
      window.location.href = `ar-${currentPageFilename}`;
    } else {
      window.location.href = `ar-${currentPageFilename}?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }
  } else if (currentPageFilename === "") {
    // Get the existing query parameters
    const queryParams = getQueryParameters();

    // Redirect to the Arabic version of the homepage with query parameters
    if (JSON.stringify(queryParams) === JSON.stringify({"": undefined})) {
      window.location.href = `ar`;
    } else {
      window.location.href = `ar?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }   
  }
}
