import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        numbers: Array,
    },
    {
        timestamps: true
    }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;