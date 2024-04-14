import Chat from "../db/models/chat.model.js";

export const createChat = async (req, res) => {
    const {firstId, secondId} = req.body;

    try{
        const chat = await Chat.findOne({
            numbers: {$all: [firstId, secondId]}
        });
        if(chat){
            return res.status(200).json({chat});
        }

        const newChat = new Chat({
            numbers: [firstId, secondId]
        });

        const response = await newChat.save();
        res.status(201).json({chat: response});

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
}



export const findUserChat = async (req, res) => {
    const userId = req.params.userId;

    try{
        const chats = await Chat.find({
            numbers: {$in: [userId]}
        });
        res.status(200).json({chats});

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }

}

export const findChat = async (req, res) => {
    const {firstId, secondId} = req.body;

    try{
        const chat = await Chat.findOne({
            numbers: {$all: [firstId, secondId]}
        });
        res.status(200).json({chat});

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }

}

