// Utility function to get API base URL
// Ensures we always have a proper relative URL starting with /
export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  // Remove trailing slash from baseUrl if present
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Combine: if baseUrl is empty, just return the endpoint
  // Otherwise, return baseUrl + endpoint
  return cleanBase ? `${cleanBase}${cleanEndpoint}` : cleanEndpoint;
};



