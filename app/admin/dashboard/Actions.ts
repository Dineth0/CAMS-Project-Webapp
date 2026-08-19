const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

export interface CountResponse {
  code: number;
  message: string;
  data: number;
}

export interface RegistrationItem {
  enrollmentId: number;
  userId: number;
  userName: string;
  email: string;
  trainingProgramId: string;
  programName:string
  enrollmentDate: string;
  paymentStatus: string;
  skillLevel: string;
}

export interface ProgramItem {
  programId: string;
  programName: string;
  startDate: string;
  maxCapacity: number;
  enrolledCount: number;
  status: string; 
}


export async function fetchDashboardCounts() {
  try {
    const [playersRes, programsRes, registrationsRes] = await Promise.all([
      fetch(`${API_GATEWAY}/api/v1/player/count`, { cache: "no-store" }),
      fetch(`${API_GATEWAY}/api/v1/trainingProgram/count`, { cache: "no-store" }),
      fetch(`${API_GATEWAY}/api/v1/trainingRegistration/count`, { cache: "no-store" })
    ]);

    const players: CountResponse = await playersRes.json();
    const programs: CountResponse = await programsRes.json();
    const registrations: CountResponse = await registrationsRes.json();

    return {
      success: true,
      data: {
        playersCount: players.data || 0,
        programsCount: programs.data || 0,
        registrationsCount: registrations.data || 0
      }
    };
  } catch (error) {
    console.error("Error fetching counts:", error);
    return { success: false, data: { playersCount: 0, programsCount: 0, registrationsCount: 0 } };
  }
}

export async function getAllRegistrations() {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/trainingRegistration/getAllRegistrations`, { cache: "no-store" });
    const result = await response.json();
    if (result.code === 200) {
      return { success: true, data: result.data as RegistrationItem[] };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return { success: false, data: [] };
  }
}

export async function getAllPrograms() {
  try {
    const response = await fetch(`${API_GATEWAY}/api/v1/trainingProgram/getAllTrainingPrograms`, { cache: "no-store" });
    const result = await response.json();
    if (result.code === 200) {
      return { success: true, data: result.data as ProgramItem[] };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error fetching programs:", error);
    return { success: false, data: [] };
  }
}