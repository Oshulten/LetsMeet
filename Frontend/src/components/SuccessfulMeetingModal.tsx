/* eslint-disable react/react-in-jsx-scope */

export default function SuccessfulMeetingModal() {
    return (
        <dialog id={import.meta.env.VITE_SUCCESSFUL_MEETING_MODAL_ID} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Congratulations, you talked to a stranger!</h3>
                <p className="py-4">We hope you and <b id="displayName"></b> stay in touch in the future.</p>
                <p className="py-4">So far you have meet <b id="numberOfMeetings"></b> people out and about. Keep going!</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export function openSuccessfulMeetingModal(displayName?: string, numberOfMeetings?: string) {
    const modal = document.getElementById(import.meta.env.VITE_SUCCESSFUL_MEETING_MODAL_ID) as HTMLDialogElement;

    const displayNameElement = modal.querySelector("#displayName");
    if (displayNameElement)
        displayNameElement.innerHTML = displayName ?? "Stranger";

    const numberOfMeetingsElement = modal.querySelector("#numberOfMeetings");
    if (numberOfMeetingsElement)
        numberOfMeetingsElement.innerHTML = numberOfMeetings ?? "some number of";

    console.log(`showing modal with displayName ${displayName} and numberOfMeetings ${numberOfMeetings}`);

    modal.showModal()
}