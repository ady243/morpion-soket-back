import Message from "../db/models/message.model.js";


export const createMessage = async (req, res) => {
    const {chatId, senderId, text} = req.body;

    try{
        const newMessage = new Message({
            chatId,
            senderId,
            text
        });

        const response = await newMessage.save();
        res.status(201).json({message: response});

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
}


export const getChatMessages = async (req, res) => {
    const {chatId} = req.params;

    try{
        const messages = await Message.find({
            chatId
        });
        res.status(200).json({messages});

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }

}