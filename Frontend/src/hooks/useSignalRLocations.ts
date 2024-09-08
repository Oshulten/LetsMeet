import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Geolocation, User } from '../api/types';
import { useUser } from "@clerk/clerk-react";
import { ClerkUserToUser, latLngLiteralToGeolocation } from "../utilities/conversations";
import { HubClient, HubServer } from "../api/hubMethods";

export default function useSignalRLocations(defaultLocation: google.maps.LatLngLiteral) {
    const user = useUser().user!;
    const [currentLocation, setCurrentLocationLocal] = useState<Geolocation>(latLngLiteralToGeolocation(defaultLocation, user.id, user.username!));
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<Geolocation[]>([]);
    const [userWantsToMeet, setUserWantsToMeet] = useState<User[]>([]);

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
            fetchedLocations = fetchedLocations.filter(loc => loc.clerkId != user.id);
            setLocations(fetchedLocations);
        });

        HubClient.registerReceiveMeetingRequest(localConnection, meeting => {
            setUserWantsToMeet([...userWantsToMeet, meeting.requestUser]);
        });

        HubClient.registerRecieveMeetingCancellation(localConnection, meeting => {
            setUserWantsToMeet(userWantsToMeet.filter(u => u.clerkId != meeting.requestUser.clerkId));
        });
    }

    const registerUser = async (localConnection: HubConnection) => {
        await HubServer.registerUser(localConnection, { username: user.username, clerkId: user.id } as User);
    }

    const sendInitialLocation = async (localConnection: HubConnection) => {
        await HubServer.sendLocation(localConnection, latLngLiteralToGeolocation(defaultLocation, user.id, user.username!));
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

    const setCurrentLocation = async (location: Geolocation) => {
        if (connection) {
            await HubServer.sendLocation(connection, location);
            setCurrentLocationLocal(location);
        }
    }

    const wantsMeeting = async (targetUser: User) => {
        if (connection) {
            await HubServer.requestMeeting(connection, {
                requestUser: ClerkUserToUser(user.id, user.username!),
                targetUser: targetUser
            });
            console.log(`You request a meeting with ${targetUser.username}`);
        }
    }

    const cancelMeeting = async (targetUser: User) => {
        if (connection) {
            await HubServer.cancelMeeting(connection, {
                requestUser: ClerkUserToUser(user.id, user.username!),
                targetUser: targetUser
            });
            console.log(`You cancel your meeting with ${targetUser.username}`);
        }
    }

    const signalIsInitialized = !(!connection || !user || !user.username || !locations);

    return {
        otherUserLocations: locations,
        userLocation: currentLocation,
        setUserLocation: setCurrentLocation,
        user: user,
        userWantsToMeet: userWantsToMeet,
        wantsMeeting: wantsMeeting,
        cancelMeeting: cancelMeeting,
        signalIsInitialized: signalIsInitialized
    };
}