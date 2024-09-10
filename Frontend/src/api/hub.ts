import { HubConnection } from "@microsoft/signalr";
import { UserLocation, Meeting } from '../types/types';

function checkConnection(connection: HubConnection) {
    if (!connection) {
        console.log("Connection is not initialized");
        return false;
    }

    if (connection.state != 'Connected') {
        console.log("Connection is not connected");
        return false;
    }

    return true;
}

export const HubClient = {
    registerRecieveGeolocations: function (connection: HubConnection, callback: (fetchedLocations: UserLocation[]) => void) {
        connection.on("ReceiveGeolocations", callback);
    },

    registerReceiveMeetingRequest: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingRequest", callback);
    },

    registerRecieveMeetingCancellation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingCancellation", callback);
    },

    registerReceiveMeetingConfirmation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingConfirmation", callback);
    }
}

export const HubServer = {
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

    sendLocation: async function (connection: HubConnection, location: UserLocation) {
        if (checkConnection(connection)) {
            const loc = {
                ClerkId: "-1",
                Username: "fjdslk",
                Lat: 0,
                Lng: 0
            }
            console.log(loc);
            await connection.invoke("SendLocation", location);
        }
    },

    confirmMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("ConfirmMeeting", meeting);
        }
    },
}

