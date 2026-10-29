
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function sendRequest(endpoint, userData) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseText = await response.text();
  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      "Invalid server response. Please check your backend URL."
    );
  }

  if (!response.ok || data.success === false) {
    const error = new Error(
      data.message || `Request failed: ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export function registerUser(userData) {
  return sendRequest("/api/users/register", userData);
}

export function loginUser(userData) {
  return sendRequest("/api/users/login", userData);
}

export { API_URL };
