import Message from "@models/Message";
import { connectToDB } from "@utils/database";
// import { getServerSession } from "next-auth";

export const POST = async (request, { params }) => {

    const { message, sendBy } = await request.json();
    const sendTo = params.id;

    console.log({ sendBy, sendTo, message });
    // const session= getServerSession(request);

    try {
        await connectToDB();
        const newMessage = new Message({ sendBy: sendBy, sendTo: sendTo, message: message });

        await newMessage.save();
        return new Response(JSON.stringify(newMessage), { status: 201 });

    } catch (error) {
        console.log(error);
        return new Response("Failed to send a message", { status: 500 });
    }
}
