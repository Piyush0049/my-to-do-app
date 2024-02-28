import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken";
const secretKey = "iampiyush";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            email,
            password : hashedPassword
        });
        const token = jwt.sign({ userId: user._id }, secretKey);
        return res.status(201).cookie("token", token, {maxAge : 60*60*1000, httpOnly : true, sameSite : "none", secure : true}).json({
            success: true,
            message: "Registered successfully",
            user,
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ userId: user._id }, secretKey);
        return res.status(201).cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true }).json({
            success: true,
            message: "Logged in successfully",
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const logout = async (req, res) => { 
    const { token } = req.cookies;
    if(!token){
        return res.status(400).json({
            success: false,
            message: "first login with an account"
        });    
    }
    return res.status(200).clearCookie("token").json({
        success: true,
        message: "Logged out successfully"
    });
}


export const getprofile =  async(req, res)=>{
    const { token } = req.cookies;
    if(!token){
        return res.status(400).json({
            success: false,
            message:"Login with your account first"
        })
    }
    const decoded = jwt.verify(token, secretKey)
 
    let user = await User.findById(decoded.userId)
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        });    
    }
    return res.status(201).json({
        success: true,
        user
    });
}

export const deleteuser = async(req, res)=>{
    try {
        const {token} = req.cookies;
        if(!token){
        return res.status(400).json({
            success: false,
            message:"Login into you account first"
        })
    }
    const decoded = jwt.verify(token, secretKey)
 
    let user = await User.findById(decoded.userId)
    if(!user){
        return res.status(400).json({
            success: false,
            message: "Login into you account first"
        });    
    }
    await user.deleteOne();
    return res.status(200).cookie("token",token,{
        maxAge : 60*60*1000, sameSite : "none", secure : true
    }).json({
        success: true,
        message: "The userId has been deleted"
    }); 
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:"Login into you account first"
        })
    }
    
    
}
