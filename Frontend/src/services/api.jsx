
const API_URL = import.meta.env.VITE_API_URL;

async function sendRequest(endpoint, userData) {
  try {
    console.log("API URL:", API_URL);
    console.log("Request endpoint:", endpoint);
    console.log("Sending data:", {
      ...userData,
      password: userData.password ? "[HIDDEN]" : undefined,
    });

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
      data = { message: responseText || "Invalid server response" };
    }

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error.message);
    throw error;
  }
}

export function registerUser(userData) {
  return sendRequest("/api/users/register", userData);
}

export function loginUser(userData) {
  return sendRequest("/api/users/login", userData);
}
