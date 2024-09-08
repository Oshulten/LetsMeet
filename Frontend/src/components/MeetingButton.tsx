/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { User } from "../api/types";

interface Props {
    state?: MeetButtonState,
    handleRequestMeeting: () => Promise<void>,
    handleCancelMeeting: () => Promise<void>,
    otherUser: User
}

type MeetButtonState = "neutral" | "awaitingOtherUserConfirmation" | "awaitingUserConfirmation";

export default function MeetingButton({ state, handleRequestMeeting, handleCancelMeeting, otherUser }: Props) {
    const [meetButtonState, setMeetButtonState] = useState<MeetButtonState>(state ?? 'neutral');

    switch (meetButtonState) {
        case 'neutral':
            return (
                <button
                    onClick={() => {
                        setMeetButtonState('awaitingOtherUserConfirmation');
                        handleRequestMeeting();
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    {`Let's Meet!`}
                </button>)

        case 'awaitingOtherUserConfirmation':
            return (
                <button
                    onClick={() => {
                        setMeetButtonState('neutral');
                        handleCancelMeeting();
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    Waiting for response
                    <span className="loading loading-spinner text-white"></span>
                </button>)

        case 'awaitingUserConfirmation':
            return (<>
                <p>{`${otherUser.username} wants to meet you!`}</p>
                <button className="btn btn-info text-white font-normal w-full">
                    {`Let's meet!`}
                </button>)
                <button className="btn btn-info text-white font-normal w-full" >
                    {`Not a good time...`}
                </button>
            </ >)
    }
}