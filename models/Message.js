import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    sendBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    sendTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

const Message = models.Message || model('Message', MessageSchema);

export default Message;