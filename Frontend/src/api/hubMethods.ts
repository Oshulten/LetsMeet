import { HubConnection } from "@microsoft/signalr";
import { Meeting, User, Geolocation } from "./types";

function checkConnection(connection: HubConnection) {
    if (!connection?.connectionId) {
        console.error("Connection is not initialized");
        return false;
    }
    return true;
}

export const HubClient = {
    registerRecieveGeolocations: function (connection: HubConnection, callback: (fetchedLocations: Geolocation[]) => void) {
        connection.on("RecieveGeolocations", callback);
    },
    registerReceiveMeetingRequest: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingRequest", callback);
    },
    registerRecieveMeetingCancellation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingRequest", callback);
    }
}

export const HubServer = {
    registerUser: async function (connection: HubConnection, user: User) {
        if (checkConnection(connection)) {
            await connection.invoke("RegisterUser", user);
        }
    },
    requestMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("RequestMeeting", meeting);
        }
    },
    cancelMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("CancelMeeting", meeting);
        }
    },
    sendLocation: async function (connection: HubConnection, location: Geolocation) {
        if (checkConnection(connection)) {
            await connection.invoke("SendLocation", location);
        }
    }
}

