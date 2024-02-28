import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";
import jwt, { decode } from "jsonwebtoken";
const secretKey = "iampiyush";
export const createtask = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login with an account first"
            });
        }
        const decoded = jwt.verify(token, secretKey);
        const { title, description, tag } = req.body;
        let task = await Task.create({
            title,
            description,
            user: decoded.userId,
            tag
        });
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const gettask = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login with an account first"
            });
        }
        const decoded = jwt.verify(token, secretKey);
        let tasks = await Task.find({ user: decoded.userId }); // Query by user ID
        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
    
export const edittask = async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        task.title = title;
        task.description = description;
        task.tag = tag;
        await task.save();
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deletetask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        await task.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
