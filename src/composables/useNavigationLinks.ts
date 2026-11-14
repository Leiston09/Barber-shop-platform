import { computed } from "vue";
import { useUserStore } from "@/stores/user";
export interface NavigationLink {
    name: string;
    label: string;
    path: string;
    icon: string;
    disabled?: boolean;
    private?: boolean;
}
export function useNavigationLinks() {
    const user = useUserStore();
    return computed<NavigationLink[]>(() => {
        const links: NavigationLink[] = [{ name: "Home", label: "Inicio", path: "/", icon: "m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9" }];
        if (!user.isAdmin && !user.isBarber)
            links.push({ name: "Services", label: "Servicios", path: "/services", disabled: !user.isAuthenticated, icon: "m8 8 12 12M14 10l6-6M8 16 20 4M8 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" });
        links.push({ name: "History", label: "Nosotros", path: "/history", icon: "M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" }, { name: "Contact", label: "Contacto", path: "/contact", icon: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm-2 3 9 6 9-6" });
        if (user.isAdmin)
            links.push({ name: "Admin", label: "Administración", path: "/admin", private: true, icon: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z" });
        else if (user.isBarber)
            links.push({ name: "Barber-Clients", label: "Mi agenda", path: "/barber", private: true, icon: "M8 3v4m8-4v4M3 11h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" });
        return links;
    });
}
