import axios from "axios";

export interface PublicBarber {
  _id: string;
  name: string;
  photoUpdatedAt?: string;
}

const publicAPI = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 15000 });

export async function getPublicTeam(signal: AbortSignal): Promise<PublicBarber[]> {
  const { data } = await publicAPI.get("/barbers/team", { signal });
  if (!Array.isArray(data) || data.some(barber =>
    !barber || typeof barber._id !== "string" || !/^[a-f\d]{24}$/i.test(barber._id) ||
    typeof barber.name !== "string" || !barber.name.trim() || barber.name.length > 120
  )) throw new Error("No se pudo consultar el equipo");
  return data.map(({ _id, name, photoUpdatedAt }) => ({ _id, name, ...(typeof photoUpdatedAt === "string" ? { photoUpdatedAt } : {}) }));
}
