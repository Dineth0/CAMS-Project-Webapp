const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";


export async function addTrainingProgram(programData: any, userEmail: string) {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/trainingProgram/addTrainingProgram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": userEmail,
      },
      body: JSON.stringify(programData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add training program");
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in addTrainingProgram:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export interface TrainingProgramItem {
  trainingProgramId: string;
  programName: string;
  description: string;
  skillLevel: string;
  durationWeeks: number;
  sessionPerWeek: number;
  fee: number;
  startDate: string;
  maximumPlayers: number;
  location: string;
  status: string;
}
export interface ApiResponse {
  code: number;
  message: string;
  data: TrainingProgramItem[];
}
export async function getAllTrainingPrograms(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/trainingProgram/getAllTrainingPrograms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch Training Programs Error:", error);
    return {
      code: 500,
      message: "Failed to fetch training programs",
      data: [],
    };
  }
}

export async function updateTrainingProgram(
  trainingProgramId: string,
  payload: Omit<TrainingProgramItem, "trainingProgramId">
) {
  try {
    const response = await fetch(
      `${API_GATEWAY}/api/v1/trainingProgram/updateTrainingProgram/${trainingProgramId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const resData = await response.json();

    if (!response.ok || resData.code !== 201) {
      return {
        success: false,
        message: resData.message || "Failed to update training program",
      };
    }

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Update Training Program Error:", error);
    return { success: false, message: error.message || "Server connection error" };
  }
}
export async function deleteTrainingProgram(trainingProgramId: string) {
  try {
    const response = await fetch(
      `${API_GATEWAY}/api/v1/trainingProgram/deleteTrainingProgram/${trainingProgramId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || "Failed to delete training program",
      };
    }

    return { success: true, message: resData.message || "Program deleted successfully", data: resData };
  } catch (error: any) {
    console.error("Delete Training Program Error:", error);
    return { success: false, message: error.message || "Server connection error" };
  }
}