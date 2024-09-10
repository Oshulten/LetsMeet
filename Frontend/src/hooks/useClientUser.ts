import { useQuery } from "@tanstack/react-query";
import { User } from "../types/types";
import { clerk } from "../main";


const defaultLocation: google.maps.LatLngLiteral = {
    lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT),
    lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG)
}

export default function useClientUser() {
    const clientUserQuery = useQuery({
        queryKey: [ClientUser.queryKey],
        queryFn: (): User | undefined => {
            const clerkUser = clerk.user;
            if (!clerkUser) {
                console.log("Clerk is not available")
                return;
            }

            const clientUser: User = {
                username: clerkUser.username!,
                clerkId: clerkUser.id,
                location: defaultLocation
            }
            return clientUser;
        },
    });
    return clientUserQuery.data;
}

export const ClientUser = {
    queryKey: "clientUser"
}