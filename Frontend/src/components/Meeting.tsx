/* eslint-disable react/react-in-jsx-scope */
import { UserIdentity } from "../types/types";
import useMeetings from "../hooks/useMeetings";

interface Props {
    remoteUser: UserIdentity
}

export default function Meeting({ remoteUser }: Props) {
    const { getMeetingByUser, requestMeeting, cancelMeeting } = useMeetings();

    const meeting = getMeetingByUser(remoteUser);

    if (!meeting)
        return (
            <button
                onClick={() => {
                    requestMeeting(remoteUser);
                }}
                className="btn btn-info text-white font-normal w-full">
                {`Let's Meet!`}
            </button>)

    switch (meeting.state) {
        case 'awaitingOtherUserConfirmation':
            return (
                <button
                    onClick={() => {
                        requestMeeting(remoteUser);
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    Waiting for response
                    <span className="loading loading-spinner text-white"></span>
                </button>)

        case 'awaitingUserConfirmation':
            return (<>
                <p>{`${remoteUser.username} wants to meet you!`}</p>
                <button
                    onClick={() => {
                        requestMeeting(remoteUser);
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    {`Someone wants to meet you`}
                </button>
                <button
                    onClick={() => {
                        cancelMeeting(remoteUser);
                    }}
                    className="btn btn-info text-white font-normal w-full" >
                    {`Not a good time...`}
                </button>
            </>)
    }
}