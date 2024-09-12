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

        const remoteLocations = fetchedLocations.filter(location => location.user.id != clientUser.id)
        queryClient.setQueryData(queryKey, remoteLocations);
    }

    const registerCallbacks = async () => {
        if (!connection || !clientUser) return;

        HubClient.registerReceiveUserLocations(connection, receiveUserLocationsCallback);
    }

    const registrationQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<UserLocation[]> => {
            await registerCallbacks();
            return [] as UserLocation[];
        },
        enabled:
            clientUser != undefined &&
            connection != undefined
    });

    useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<UserLocation[]> => {
            return (queryClient.getQueryData(queryKey) && []) as UserLocation[];
        },
        enabled:
            registrationQuery.status == 'success'
    });

    const getRemoteUsers = () => {
        return queryClient.getQueryData(queryKey) as UserLocation[];
    }

    return {
        remoteUserLocations: getRemoteUsers()
    }
}
