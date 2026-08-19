
const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

export const getAllTrainingPrograms = async () => {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/trainingProgram/getAllTrainingPrograms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Error fetching training programs:", error);
    throw new Error("Failed to fetch training programs");
  }
};



export async function upgradePlayerProfile(formData: FormData, email: string) {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/player/upgrade`, {
      method: "POST",
      headers: {
        "X-User-Email": email, 
      },
      body: formData, 
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to upgrade player profile");
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in upgradePlayerProfile:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function registerForTraining(userId: number, trainingProgramId: string, registrationData: any) {
  try {
    const response = await fetch(
      `${API_GATEWAY}/api/v1/trainingRegistration/trainingRegister/${userId}/${trainingProgramId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to register for training");
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in registerForTraining:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
export const getPlayerProfile = async (playerId: number | string) => {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/player/${playerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return null;
  }
};

export async function updatePlayerProfile(formData: FormData, email: string) {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/player/update`, {
      method: "PUT",
      headers: {
        "X-User-Email": email,
      },
      body: formData, 
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update player profile");
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error in updatePlayerProfile:", error);
    return {
      success: false,
      message: error.message || "Something went wrong while updating profile",
    };
  }
}