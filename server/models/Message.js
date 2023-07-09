const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    sendBy: {
        userId: String,
        userName: String,
        image: String
    },
    sendTo: {
        userId: String,
        userName: String,
        image: String
    },
    message: {
        type: String,
        required: [true, 'Please enter a message'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Messages', MessageSchema);