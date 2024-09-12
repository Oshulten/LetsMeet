import { HubConnection } from "@microsoft/signalr";
import { UserLocation, Meeting, MeetingConfirmation } from '../types/types';

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
    registerReceiveUserLocations: function (connection: HubConnection, callback: (fetchedLocations: UserLocation[]) => void) {
        const serverMethodName = 'ReceiveUserLocations';

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

    registerReceiveMeetingCancellation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        const serverMethodName = 'ReceiveMeetingCancellation';

        if (hubRegistrations.includes(serverMethodName)) {
            console.error(`${serverMethodName} has already been registered`);
            return;
        }

        connection.on(serverMethodName, callback);

        hubRegistrations.push(serverMethodName);
    },

    registerReceiveMeetingConfirmation: function (connection: HubConnection, callback: (meeting: MeetingConfirmation) => void) {
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

    updateLocation: async function (connection: HubConnection, location: UserLocation) {
        if (checkConnection(connection)) {
            await connection.invoke("UpdateLocation", location);
        }
    },

    confirmMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("ConfirmMeeting", meeting);
        }
    },
}

