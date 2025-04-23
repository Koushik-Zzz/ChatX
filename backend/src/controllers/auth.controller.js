import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { signupSchema, signinSchema } from '../lib/userValidation.js'
import cloudinary from '../lib/cloudinary.js'

const signup = async (req, res) => {
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({error: result.error.errors})
    }
    const { email, fullName, password } = result.data

    try {

        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({msg: "Email already exists"}) 
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            await newUser.save()
            generateToken(newUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ msg: "Internal Server Error"})
    }

}

const signin = async (req, res) => {
    const result = signinSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({error: result.error.errors})
    }
    const { email, password } = result.data
    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({msg: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({msg: "Invalid credentials"})
        }

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ msg: "Internal Server Error"})
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('jwt','',{ maxAge: 0 })
        res.status(200).json({msg: "Logged out successfully"})
    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ msg: "Internal Server Error"})
    }
}

const updateProfile = async (req, res) => {

    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({msg: "Profile ic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ msg: "Internal Server Error"})
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch(error) {
        console.log("Error in verifying Auth", error.message);
        res.status(500).json({ msg: "internal Server Error" });
    }
}

export {
    signup, 
    signin,
    logout,
    updateProfile,
    checkAuth
}