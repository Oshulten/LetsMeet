import { useQuery } from "@tanstack/react-query";
import useClientUser from "./useClientUser";
import useConnection from "./useConnection";
import { ActiveMeeting, ConfirmedMeeting, Meeting, MeetingConfirmation, MeetingState, UserIdentity, userIdentityFromUser } from "../types/types";
import { queryClient } from "../main";
import { HubClient, HubServer } from "../api/hub";
import { mean, max } from "mathjs";
import haversine from 'haversine-distance';

export default function useMeetings() {
    const connection = useConnection();
    const { clientUser } = useClientUser();

    const queryKeyMeetings = ["meetings"];
    const queryKeyLibrary = [...queryKeyMeetings, "placesLibrary"];
    const queryKeyRegisterCallbacks = [...queryKeyMeetings, "registerCallbacks"];
    const queryKeyConfirmedMeeting = [...queryKeyMeetings, "confirmedMeeting"];

    const meetingsQuery = useQuery({
        queryKey: queryKeyMeetings,
        queryFn: (): ActiveMeeting[] => {
            return [];
        },
    });

    const getMeetings = () => {
        const meetings = queryClient.getQueryData(queryKeyMeetings);

        if (!meetings) {
            queryClient.setQueryData(queryKeyMeetings, []);
        }

        return queryClient.getQueryData(queryKeyMeetings) as ActiveMeeting[];
    }

    const setMeetings = (meetings: ActiveMeeting[]) =>
        queryClient.setQueryData(queryKeyMeetings, meetings);

    useQuery({
        queryKey: queryKeyLibrary,
        queryFn: async (): Promise<google.maps.PlacesLibrary> => {
            console.log("load places library");
            return await google.maps.importLibrary("places") as google.maps.PlacesLibrary;;
        },
    });

    const getPlacesLibrary = () =>
        queryClient.getQueryData(queryKeyLibrary) as google.maps.PlacesLibrary;

    useQuery({
        queryKey: queryKeyRegisterCallbacks,
        queryFn: (): boolean => {
            if (!connection) return false;
            HubClient.registerReceiveMeetingRequest(connection, receiveMeetingRequest);
            HubClient.registerReceiveMeetingCancellation(connection, receiveMeetingCancellation);
            HubClient.registerReceiveMeetingConfirmation(connection, receiveMeetingConfirmation);
            return true;
        },
        enabled: (!!connection && !!clientUser)
    });

    useQuery({
        queryKey: queryKeyConfirmedMeeting,
        queryFn: (): ConfirmedMeeting => {
            return {};
        }
    });

    const getConfirmedMeeting = () =>
        queryClient.getQueryData(queryKeyConfirmedMeeting) as ConfirmedMeeting;

    const setConfirmedMeeting = (meeting: ConfirmedMeeting) =>
        queryClient.setQueryData(queryKeyConfirmedMeeting, meeting);

    const suggestMeetingPlace = async () => {
        const confirmedMeeting = getConfirmedMeeting();
        const placesLibrary = getPlacesLibrary();

        if (!placesLibrary || !confirmedMeeting || !confirmedMeeting.participants) return;

        const locations = confirmedMeeting.participants.map((participant) => participant.location);

        const meanLocation: google.maps.LatLngLiteral = {
            lat: mean(locations.map(location => location.lat)),
            lng: mean(locations.map(location => location.lng)),
        };

        const maxDistanceFromMeanLocation = max(locations.map(location =>
            haversine(location, meanLocation)
        ));

        const request = {
            fields: ['displayName', 'location', 'id'],
            locationRestriction: {
                center: meanLocation,
                radius: maxDistanceFromMeanLocation + 50,
            },
            includedPrimaryTypes: ['restaurant'],
            maxResultCount: 1,
            rankPreference: 'DISTANCE',
        } as google.maps.places.SearchNearbyRequest;

        try {
            const { places } = await getPlacesLibrary().Place.searchNearby(request);
            setConfirmedMeeting({ ...confirmedMeeting, place: places[0] });
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    const addMeeting = (meeting: ActiveMeeting) =>
        setMeetings([...getMeetings(), meeting]);

    const removeMeeting = (user: UserIdentity) =>
        setMeetings([...getMeetings()].filter(m => m.user.id != user.id))

    const getMeetingByUser = (user: UserIdentity) =>
        getMeetings().find(meeting => meeting.user.id == user.id);

    const confirmMeeting = async (meeting: ActiveMeeting) => {
        if (!connection || !clientUser) return;

        await HubServer.confirmMeeting(connection, {
            requestUser: userIdentityFromUser(clientUser),
            targetUser: meeting.user
        });
    }

    const setMeetingState = (user: UserIdentity, state: MeetingState): ActiveMeeting | undefined => {
        const meetings = getMeetings();

        const meeting = getMeetingByUser(user);
        if (!meeting) return;

        setMeetings(meetings.map(m =>
            m.user.id == user.id ? { ...meeting, state: state } : m))
    }

    const cancelMeeting = async (targetUser: UserIdentity) => {
        if (!connection || !clientUser) return;

        removeMeeting(targetUser);

        await HubServer.cancelMeeting(connection, {
            requestUser: userIdentityFromUser(clientUser),
            targetUser: targetUser
        });
    }

    const requestMeeting = async (targetUser: UserIdentity) => {
        if (!connection || !clientUser) return;

        const existingMeeting = getMeetingByUser(targetUser);

        if (!existingMeeting) {
            const newMeeting: ActiveMeeting = {
                user: targetUser,
                state: 'awaitingOtherUserConfirmation'
            }

            addMeeting(newMeeting);

            const meetingRequest: Meeting = {
                requestUser: userIdentityFromUser(clientUser),
                targetUser: targetUser
            }

            await HubServer.requestMeeting(connection, meetingRequest);

            return;
        }

        if (existingMeeting.state == 'awaitingUserConfirmation') {
            await confirmMeeting(existingMeeting);
            return;
        }
    }

    const receiveMeetingRequest = (meeting: Meeting) => {
        const existingMeeting = getMeetingByUser(meeting.requestUser);

        if (!existingMeeting) {
            const newMeeting: ActiveMeeting = {
                user: meeting.requestUser,
                state: 'awaitingUserConfirmation'
            }
            addMeeting(newMeeting);
            return;
        }

        if (existingMeeting.state == 'awaitingOtherUserConfirmation') {
            const meeting = setMeetingState(existingMeeting.user, 'confirmed');
            if (!meeting)
                return;

            confirmMeeting(meeting);
            return;
        }
    }

    const receiveMeetingCancellation = (meeting: Meeting) => {
        const existingMeeting = getMeetingByUser(meeting.requestUser);

        if (!existingMeeting)
            return;

        removeMeeting(meeting.requestUser);
    }

    const receiveMeetingConfirmation = async (meeting: MeetingConfirmation) => {
        setMeetings([]);
        setConfirmedMeeting({ participants: meeting.participants });
        suggestMeetingPlace();
    }

    const getFinalizedConfirmedMeeting = () => {
        const confirmedMeeting = getConfirmedMeeting();

        if (!confirmedMeeting?.participants || !confirmedMeeting?.place)
            return;

        return confirmedMeeting;
    }

    return {
        meetings: meetingsQuery.data,
        getMeetingByUser,
        requestMeeting,
        cancelMeeting,
        confirmedMeeting: getFinalizedConfirmedMeeting(),
    }
}
