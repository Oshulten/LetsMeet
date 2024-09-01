import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5055/hub")
    .build();

connection.on("messageReceived", (username: string, message: string) => {
    console.log(`messageRecieved\n\tusername: ${username}\n\tmessage: ${message}`)
});

connection.start().catch((err) => console.error(err));

export async function sendMessage(username: string, message: string) {
    await connection.send("newMessage", username, message);
}