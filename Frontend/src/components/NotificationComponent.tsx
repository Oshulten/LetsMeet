/* eslint-disable react/react-in-jsx-scope */
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';

export default function NotificationComponent() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5055/notifications")
            .build();

        connection.start();
        connection.on("ReceiveNotification", data => {
            console.log(data);
            setMessage(data);
        });
    }, [])

    return (
        <div className="App">
            {message}
        </div>
    );
}