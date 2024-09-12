import { useQuery } from "@tanstack/react-query";
import { User, userLocationFromUser } from "../types/types";
import { clerk, queryClient } from "../main";
import useConnection from "./useConnection";
import { HubServer } from "../api/hub";
import generateDefaultLocation from "../utilities/defaultLocation";

export default function useClientUser() {
    const defaultLocation = generateDefaultLocation(0.02);

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
                location: defaultLocation,
                imageUrl: clerkUser.imageUrl
            }

            return clientUser;
        },
    });

    const sendInitialLocationQuery = useQuery({
        queryKey: [...queryKey, "sendInitialLocation"],
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