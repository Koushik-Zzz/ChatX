import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const getUserSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId } }).select('-password');

        res.status(200).json(filteredUsers)
    } catch(error) {
        console.log("Error in getting UserSidebar", error.message);
        res.status(500).json({ msg: "internal Server Error" });
    }
} 

const  getMessages = async (req, res) => {
    try{
        const userChatId = req.params.id;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                { senderId: myId, receiverId: userChatId },
                { senderId: receiverId, receiverId: myId}
            ]
        })

        res.status(200).json(messages)
    } catch(error) {
        console.log("Error in getting Messages", error.message);
        res.status(500).json({ msg: "internal Server Error" });
    }
}

const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        
        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save()

        // todo socket.io functionality goes here

        res.status(201).json(newMessage)

    } catch(error) {
        console.log("Error in Sending Messages", error.message);
        res.status(500).json({ msg: "internal Server Error" });
    }
}

export {
    getUserSidebar,
    getMessages,
    sendMessage
}