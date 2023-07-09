const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const { Server } = require('socket.io');
const server = require('http').createServer(app);
const Message = require('./models/Message');

require('dotenv').config();

/* establish the mongo db connection */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(error);
    }
}

connectDB();


app.use(cors());
app.use(express.json());



/* io */
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

/* hash set to store the user socket */
const userSocketMap = new Map();
const socketIds = [];


/*io usage */
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    const userId = socket.handshake.query.userId;

    /* setting the userid and socketid in the map */

    if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, socket.id);
        socketIds.push(socket.id);
    }

    /* receive message event */
    socket.on('send-message', async (msg) => {
        for (const [key, value] of userSocketMap) {
            console.log(`Key: ${key}, Value: ${value}`);
        }

        let { sendTo, sendBy, message } = msg;

        /* save the message in the database */
        const newMessage = await Message.create({
            sendTo, sendBy, message
        });

        await newMessage.save();

        /* emit the received message to the receiver */
        console.log(userSocketMap.get(sendTo.userId));

        socket.to(userSocketMap.get(sendTo.userId)).emit('receive-message', newMessage);
        console.log(newMessage);
    })

    /* remove the socket io connection when user disconnects */
    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
        const userId = socket.handshake.query.userId;
        userSocketMap.delete(userId);
        socketIds.splice(socketIds.indexOf(socket.id), 1);
    })
})

app.use('/get', (req, res) => {
    for (const [key, value] of userSocketMap) {
        console.log(`Key: ${key}, Value: ${value}`);
    }
    res.send(socketIds);
})

app.post('/api/getmessages/:id', async (req, res) => {
    const receiver = req.params.id;
    const mySelf = req.body.myself;

    console.log({ receiver, mySelf });

    const messageSent = await Message.find({ 'sendBy.userId': mySelf, 'sendTo.userId': receiver });
    const messageReceived = await Message.find({ 'sendBy.userId': receiver, 'sendTo.userId': mySelf });

    const allmessages = messageSent.concat(messageReceived);

    allmessages.sort((a, b) => {
        return a.createdAt - b.createdAt;
    });

    res.status(200).json({
        success: true,
        data: allmessages
    });
})


server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})
