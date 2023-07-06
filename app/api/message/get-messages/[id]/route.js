import Message from "@models/Message";
import { connectToDB } from "@utils/database";

export const POST = async (request, { params }) => {

    const { myself } = await request.json();
    const otheruser = params.id;

    try {
        await connectToDB();

        const messageSent = await Message.find({ sendBy: myself, sendTo: otheruser }).populate('sendBy sendTo');

        const messageReceived = await Message.find({ sendBy: otheruser, sendTo: myself }).populate('sendBy sendTo');

        const TotalMessages = messageSent.concat(messageReceived);

        TotalMessages.sort((a, b) => {
            return a.createdAt - b.createdAt;
        });

        console.log({TotalMessages});

        return new Response(JSON.stringify(TotalMessages), { status: 200 });

    } catch (error) {

        return new Response("Failed to fetch all prompts", { status: 500 });
    }
}