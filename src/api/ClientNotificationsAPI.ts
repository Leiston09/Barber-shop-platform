import api from "@/lib/axios";
export interface ClientNotice {
  _id: string; date: string; time: string; read: boolean; score: number | null; canRate: boolean;
  barber: { _id?: string; name: string; photoUpdatedAt?: string };
}
export interface ClientNoticePage { items: ClientNotice[]; unreadCount: number; total: number; page: number; pageSize: number }
export default {
  list: (page = 1) => api.get<ClientNoticePage>("/users/me/notifications", { params: { page } }),
  read: (id: string) => api.patch("/users/me/notifications/" + id + "/read", {}),
  rate: (id: string, score: number) => api.put("/users/me/notifications/" + id + "/rating", { score }),
};
