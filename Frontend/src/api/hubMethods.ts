import { HubConnection } from "@microsoft/signalr";
import { Meeting, User } from "./types";

function checkConnection(connection: HubConnection) {
    if (!connection?.connectionId) {
        console.error("Connection is not initialized");
        return false;
    }
    return true;
}

export const HubClient = {
    registerRecieveGeolocations: function(connection: HubConnection, callback: (fetchedLocations: Geolocation[]) => void) {
        connection.on("RecieveGeolocations", callback);
    },
    registerReceiveMeetingRequest: function(connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingRequest", callback);
    },
    registerRecieveMeetingCancellation: function(connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingRequest", callback);
    }
}

export const HubServer = {
    registerUser: function(connection: HubConnection, user: User) {
        if (checkConnection(connection)) {
            connection.invoke("RegisterUser", user);
        }
    },
    requestMeeting: function(connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            connection.invoke("RequestMeeting", meeting);
        }
    },
    cancelMeeting: function(connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            connection.invoke("CancelMeeting", meeting);
        }
    },
    sendLocation: function(connection: HubConnection, location: Geolocation) {
        if (checkConnection(connection)) {
            connection.invoke("SendLocation", location);
        }
    }
}

