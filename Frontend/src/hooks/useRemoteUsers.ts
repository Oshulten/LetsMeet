import { useQuery } from "@tanstack/react-query";
import { HubClient } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import useClientUser from "./useClientUser";
import useConnection from "./useConnection";
import { queryClient } from "../main";

export default function useRemoteUsers() {
    const { clientUser, setClientUserLocation } = useClientUser();
    const connection = useConnection();

    const queryKey = ["locations"];

    const sendInitialLocation = async () => {
        if (!connection || !clientUser) return;
        console.log("sendInitialLocation");
        await setClientUserLocation(userLocationFromUser(clientUser));
    }

    const receiveGeolocationsCallback = (fetchedLocations: UserLocation[]) => {
        if (!connection || !clientUser) return;
        console.log("Receiving locations");
        console.log(fetchedLocations);
        console.log(queryClient);
        const remoteLocations = fetchedLocations.filter(location => location.clerkId != clientUser.id)
        queryClient.setQueryData(queryKey, remoteLocations);
        const queryData = queryClient.getQueryData(queryKey);
        console.log(queryData);
    }

    const registerCallbacks = async () => {
        if (!connection || !clientUser) return;
        console.log("registerCallbacks");
        HubClient.registerReceiveUserLocations(connection, receiveGeolocationsCallback);
    }

    const registrationQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<UserLocation[]> => {
            console.log(connection);
            await registerCallbacks();
            return [] as UserLocation[];
        },
        enabled:
            clientUser != undefined &&
            connection != undefined
    });

    const remoteUsersQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<UserLocation[]> => {
            await sendInitialLocation();
            return (queryClient.getQueryData(queryKey) && []) as UserLocation[];
        },
        enabled:
            registrationQuery.status == 'success'
    });

    return {
        remoteUserLocations: remoteUsersQuery.data,
    }
}
