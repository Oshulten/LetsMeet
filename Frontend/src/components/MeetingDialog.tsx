/* eslint-disable react/react-in-jsx-scope */
import { UserIdentity } from "../types/types";
import useMeetings from "../hooks/useMeetings";
import capitalize from "capitalize";

interface Props {
    remoteUser: UserIdentity
}

export default function MeetingDialog({ remoteUser }: Props) {
    const { getMeetingByUser, requestMeeting, cancelMeeting } = useMeetings();

    const meeting = getMeetingByUser(remoteUser);

    const btnClassNames = 'btn border-none text-white font-normal w-full'

    if (!meeting)
        return (
            <button
                onClick={() => {
                    requestMeeting(remoteUser);
                }}
                className={btnClassNames + " btn-success"}>
                <p>{`Let's meet!`}</p>
            </button>)

    switch (meeting.state) {
        case 'awaitingOtherUserConfirmation':
            return (
                <button
                    onClick={() => {
                        cancelMeeting(remoteUser);
                    }}
                    className={btnClassNames + " btn-info"}>
                    Waiting for response
                    <span className="loading loading-spinner text-white"></span>
                </button>)

        case 'awaitingUserConfirmation':
            return (<>
                <button
                    onClick={() => {
                        requestMeeting(remoteUser);
                    }}
                    className={btnClassNames + " btn-success"}>
                    {`Meet with ${capitalize.words(remoteUser.username)}`}
                </button>
                <button
                    onClick={() => {
                        cancelMeeting(remoteUser);
                    }}
                    className={btnClassNames + " bg-rose-700"}>
                    {`Not a good time...`}
                </button>
            </>)
    }
}