"use server";
const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

export interface PlayerItem {
  id: number;
  email: string;
  role: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  playingRole: string;
  battingStyle: string;
  bowlingStyle: string;
  experienceLevel: string;
  image: string | null;
}

export interface PlayerApiResponse {
  code: number;
  message: string;
  data: PlayerItem[];
}

export async function getAllPlayers(): Promise<PlayerApiResponse> {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/player/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Players Error:", error);
    return { code: 500, message: "Failed to fetch players", data: [] };
  }
}

export async function deletePlayer(playerId: number | string) {
  try {
    const response = await fetch(
      `${API_GATEWAY}/api/v1/player/delete/${playerId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || "Failed to delete player",
      };
    }

    return { success: true, message: resData.message || "Player deleted successfully" };
  } catch (error: any) {
    console.error("Delete Player Error:", error);
    return { success: false, message: error.message || "Server connection error" };
  }
}