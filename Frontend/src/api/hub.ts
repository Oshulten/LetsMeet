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

const hubRegistrations: string[] = [];

export const HubClient = {
    registerRecieveGeolocations: function (connection: HubConnection, callback: (fetchedLocations: UserLocation[]) => void) {
        const serverMethodName = 'ReceiveGeolocations';

        if (hubRegistrations.includes(serverMethodName)) {
            console.error(`${serverMethodName} has already been registered`);
            return;
        }

        connection.on(serverMethodName, callback);
        hubRegistrations.push(serverMethodName);
    },

    registerReceiveMeetingRequest: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        const serverMethodName = 'ReceiveMeetingRequest';

        if (hubRegistrations.includes(serverMethodName)) {
            console.error(`${serverMethodName} has already been registered`);
            return;
        }

        connection.on(serverMethodName, callback);
        hubRegistrations.push(serverMethodName);
    },

    registerRecieveMeetingCancellation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        const serverMethodName = 'RecieveMeetingCancellation';

        if (hubRegistrations.includes(serverMethodName)) {
            console.error(`${serverMethodName} has already been registered`);
            return;
        }

        connection.on(serverMethodName, callback);
        hubRegistrations.push(serverMethodName);
    },

    registerReceiveMeetingConfirmation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        const serverMethodName = 'ReceiveMeetingConfirmation';

        if (hubRegistrations.includes(serverMethodName)) {
            console.error(`${serverMethodName} has already been registered`);
            return;
        }

        connection.on(serverMethodName, callback);
        hubRegistrations.push(serverMethodName);
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
            await connection.invoke("SendLocation", location);
        }
    },

    confirmMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("ConfirmMeeting", meeting);
        }
    },
}

