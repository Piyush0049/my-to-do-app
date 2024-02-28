import mongoose from "mongoose";
const mongoURI = process.env.MONGO_URI;
const connecttodb = ()=>{
    try {
        mongoose.connect(mongoURI,{
            dbName : "todoapp"
        })
        console.log("Database connected successfully") 
    } catch (error) {
        console.log(error);
    }
    
}
export default connecttodb;