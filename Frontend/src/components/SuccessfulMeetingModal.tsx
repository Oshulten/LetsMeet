/* eslint-disable react/react-in-jsx-scope */
interface SuccessfulMeetingModalProps {
    id: string
}

export default function SuccessfulMeetingModal({ id }: SuccessfulMeetingModalProps) {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export function openSuccessfulMeetingModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal.showModal()
}