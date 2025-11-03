// Configuration for the frontend application
// Hard-coded backend base URL per request

const config = {
  // Backend base URL (no trailing /api here; getApiUrl will add it via endpoint)
  apiBaseUrl: "https://procteredmern.onrender.com",

  // Get the full API URL for a given endpoint
  getApiUrl: (endpoint) => {
    const base = config.apiBaseUrl;
    // Remove /api suffix if present since we'll add it in the endpoint
    const cleanBase = base.replace(/\/api$/, "");
    return `${cleanBase}${endpoint}`;
  },
};

export default config;
