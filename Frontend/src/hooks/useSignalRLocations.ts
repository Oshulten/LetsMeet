import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { UserLocation, User } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import useUserFromClerk from "./useLetsMeetUser";

export default function useSignalRLocations(defaultLocation: google.maps.LatLngLiteral) {
    const user = useUserFromClerk();
    const [location, setLocation] = useState<UserLocation>({ user: user, location: defaultLocation });
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<UserLocation[]>([]);
    const [meetingRequests, setMeetingRequests] = useState<User[]>([]);

    const initializeConnection = () => {
        if (connection) {
            return connection;
        }

        const localConnection =
            new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}`)
                .build();

        setConnection(localConnection);
        return localConnection;
    }

    const startConnection = async (localConnection: HubConnection) => {
        try {
            await localConnection.start();
            return localConnection;
        } catch (err) {
            console.error(err as Error);
        }
    }

    const setConnectionCallbacks = (localConnection: HubConnection) => {
        HubClient.registerRecieveGeolocations(localConnection, fetchedLocations => {
            fetchedLocations = fetchedLocations.filter(loc => loc.user.clerkId != user.clerkId);
            setLocations(fetchedLocations);
        });

        HubClient.registerReceiveMeetingRequest(localConnection, meeting => {
            setMeetingRequests([...meetingRequests, meeting.requestUser]);
            console.log(`${meeting.requestUser.username} wants to meet you!`);
        });

        HubClient.registerRecieveMeetingCancellation(localConnection, meeting => {
            setMeetingRequests(meetingRequests.filter(u => u.clerkId != meeting.requestUser.clerkId));
            console.log(`${meeting.requestUser.username} cancelled your meeting`);
        });
    }

    const registerUser = async (localConnection: HubConnection) => {
        await HubServer.registerUser(localConnection, user);
    }

    const sendInitialLocation = async (localConnection: HubConnection) => {
        await HubServer.sendLocation(localConnection, location);
    }

    const stopConnection = () => {
        if (!connection) {
            return;
        }

        connection.stop();
        setConnection(null);
    }

    const effectCallback = async () => {
        if (connection) {
            return stopConnection
        }

        let localConnection = initializeConnection();

        localConnection = (await startConnection(localConnection))!;

        if (!localConnection.connectionId) {
            return stopConnection;
        }

        setConnectionCallbacks(localConnection);
        registerUser(localConnection);
        sendInitialLocation(localConnection);
    }

    useEffect(() => {
        effectCallback();
        return stopConnection
    }, []);

    const setCurrentLocation = async (location: UserLocation) => {
        if (connection) {
            await HubServer.sendLocation(connection, location);
            setLocation(location);
        }
    }

    const requestMeeting = async (targetUser: User) => {
        if (connection) {
            await HubServer.requestMeeting(connection, {
                requestUser: user,
                targetUser: targetUser
            });
            console.log(`You request a meeting with ${targetUser.username}`);
        }
    }

    const cancelMeeting = async (targetUser: User) => {
        if (connection) {
            await HubServer.cancelMeeting(connection, {
                requestUser: user,
                targetUser: targetUser
            });
            console.log(`You cancel your meeting with ${targetUser.username}`);
        }
    }

    const signalIsInitialized = !(!connection || !user || !locations);


    return {
        otherUserLocations: locations,
        userLocation: location,
        setUserLocation: setCurrentLocation,
        user: user,
        meetingRequests: meetingRequests,
        requestMeeting: requestMeeting,
        cancelMeeting: cancelMeeting,
        signalIsInitialized: signalIsInitialized
    };
}
