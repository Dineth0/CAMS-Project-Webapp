const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";


export interface RegistrationItem {
  enrollmentId: number;
  userId: number;
  userName: string;
  email: string;
  trainingProgramId: string;
  programName: string
  enrollmentDate: string;
  paymentTime: string;
  paymentMethod: string;
  paymentStatus: string;
  emergencyContact: number;
  preferredSlot: string | null;
  medicalConditions: string | null;
  skillLevel: string | null;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: RegistrationItem[];
}

export async function getAllRegistrations(): Promise<{
  success: boolean;
  data: RegistrationItem[];
  message: string;
}> {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/trainingRegistration/getAllRegistrations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });

    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: `HTTP Error: ${response.status}`,
      };
    }

    const result: ApiResponse = await response.json();

    if (result.code === 200 && Array.isArray(result.data)) {
      return {
        success: true,
        data: result.data,
        message: result.message || "Success",
      };
    }

    return {
      success: false,
      data: [],
      message: result.message || "Failed to fetch registrations",
    };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return {
      success: false,
      data: [],
      message: "Network error or backend server is unreachable",
    };
  }
}