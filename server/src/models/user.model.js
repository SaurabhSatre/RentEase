import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true
    },
    email :{
        type : String,
        required: true,
        unique: true, 
        trim: true,   
        lowercase: true, 
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address',
        ],
    },
    password :{
        type : String,
        required: [true, "Please , Enter the password!!"]
    },
    lastLogin :{
        type : String,
        default : new Date().toDateString()
    }
});

export default mongoose.model("users" , UserSchema);