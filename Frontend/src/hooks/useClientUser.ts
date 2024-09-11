import { useQuery } from "@tanstack/react-query";
import { User, userLocationFromUser } from "../types/types";
import { clerk, queryClient } from "../main";
import useConnection from "./useConnection";
import { HubServer } from "../api/hub";

export default function useClientUser() {
    const defaultLocation: google.maps.LatLngLiteral = {
        lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT) + Math.random() * 0.01,
        lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG) + Math.random() * 0.01
    }

    const queryKey = ["clientUser"];

    const connection = useConnection();

    const clientUserQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<User | undefined> => {
            const clerkUser = clerk.user;

            if (!clerkUser) {
                console.error("Clerk is not available")
                return;
            }

            const clientUser: User = {
                username: clerkUser.username!,
                id: clerkUser.id,
                location: defaultLocation
            }

            return clientUser;
        },
    });

    const sendInitialLocationQuery = useQuery({
        queryKey: ["sendInitialLocation"],
        queryFn: async (): Promise<boolean> => {
            if (!connection) return false;
            if (sendInitialLocationQuery.data) return true;

            console.log("Sending initial location");
            const clientUser = clientUserQuery.data as User;
            connection.onreconnected(() => {
                console.log("Reconnection from client user");
            });
            await HubServer.updateLocation(connection, userLocationFromUser(clientUser));

            return true;
        },
        enabled: connection != undefined && clientUserQuery.isSuccess
    });

    const setClientUserLocation = async (newLocation: google.maps.LatLngLiteral) => {
        if (!(connection)) return;

        const clientUser = queryClient.getQueryData(queryKey) as User;

        const newClientUser: User = {
            ...clientUser,
            location: newLocation
        }

        queryClient.setQueryData(queryKey, newClientUser);

        await HubServer.updateLocation(connection, userLocationFromUser(newClientUser));
    }

    return {
        clientUser: clientUserQuery.data,
        setClientUserLocation,
    }
}