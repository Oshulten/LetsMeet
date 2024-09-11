import { useQuery } from "@tanstack/react-query";
import { User, userLocationFromUser } from "../types/types";
import { clerk, queryClient } from "../main";
import useConnection from "./useConnection";
import { HubServer } from "../api/hub";

export default function useClientUser() {
    const defaultLocation: google.maps.LatLngLiteral = {
        lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT),
        lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG)
    }

    const queryKey = ["clientUser"];

    const connection = useConnection();

    const clientUserQuery = useQuery({
        queryKey: queryKey,
        queryFn: (): User | undefined => {
            const clerkUser = clerk.user;

            if (!clerkUser) {
                console.error("Clerk is not available")
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

    const setClientUserLocation = async (newLocation: google.maps.LatLngLiteral) => {
        if (!(connection)) return;

        const clientUser = queryClient.getQueryData(queryKey) as User;

        const newClientUser: User = {
            ...clientUser,
            location: newLocation
        }

        queryClient.setQueryData(queryKey, newClientUser);

        await HubServer.sendLocation(connection, userLocationFromUser(newClientUser));
    }

    return {
        clientUser: clientUserQuery.data,
        setClientUserLocation
    }
}