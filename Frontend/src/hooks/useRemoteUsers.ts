import { useQuery } from "@tanstack/react-query";
import { HubClient } from "../api/hub";
import { UserLocation } from "../types/types";
import useClientUser from "./useClientUser";
import useConnection from "./useConnection";
import { queryClient } from "../main";

export default function useRemoteUsers() {
    const { clientUser } = useClientUser();
    const connection = useConnection();

    const queryKey = ["remoteUserLocations"];

    const receiveUserLocationsCallback = (fetchedLocations: UserLocation[]) => {
        if (!connection || !clientUser) return;
        console.log("Receiving locations");
        console.log(fetchedLocations);
        const remoteLocations = fetchedLocations.filter(location => location.user.id != clientUser.id)
        queryClient.setQueryData(queryKey, remoteLocations);
        const queryData = queryClient.getQueryData(queryKey);
        console.log(queryData);
    }

    const registerCallbacks = async () => {
        if (!connection || !clientUser) return;
        console.log("registerCallbacks");
        HubClient.registerReceiveUserLocations(connection, receiveUserLocationsCallback);
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
            return (queryClient.getQueryData(queryKey) && []) as UserLocation[];
        },
        enabled:
            registrationQuery.status == 'success'
    });

    return {
        remoteUserLocations: remoteUsersQuery.data,
    }
}
