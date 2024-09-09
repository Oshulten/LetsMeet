import { HubConnection } from "@microsoft/signalr";
import { DtoLocation, Meeting, meetingFromDto, UserLocation, userLocationFromDto, DtoMeeting, dtoFromMeeting, dtoFromUserLocation } from '../types/types';

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
        connection.on("ReceiveGeolocations", (fetchedLocations: DtoLocation[]) =>
            callback(fetchedLocations.map(loc => userLocationFromDto(loc))))
    },

    registerReceiveMeetingRequest: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingRequest", (meeting: DtoMeeting) => {
            callback(meetingFromDto(meeting));
        });
    },

    registerRecieveMeetingCancellation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingCancellation", (meeting: DtoMeeting) => {
            callback(meetingFromDto(meeting));
        });
    },

    registerReceiveMeetingConfirmation: function (connection: HubConnection, callback: (meeting: Meeting) => void) {
        connection.on("ReceiveMeetingConfirmation", (meeting: DtoMeeting) => {
            callback(meetingFromDto(meeting));
        });
    }
}

export const HubServer = {
    requestMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("RequestMeeting", dtoFromMeeting(meeting));
        }
    },

    cancelMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("CancelMeeting", dtoFromMeeting(meeting));
        }
    },

    sendLocation: async function (connection: HubConnection, location: UserLocation) {
        if (checkConnection(connection)) {
            console.log(dtoFromUserLocation(location));
            await connection.invoke("SendLocation", dtoFromUserLocation(location));
        }
    },

    confirmMeeting: async function (connection: HubConnection, meeting: Meeting) {
        if (checkConnection(connection)) {
            await connection.invoke("ConfirmMeeting", dtoFromMeeting(meeting));
        }
    },
}

