
const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginRequest) => {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    throw new Error("Failed to connect to the server");
  }
};