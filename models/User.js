const mongoose = require("mongoose")
const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 25,
        unique: true
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    movies: [
        {
            name: {
                type: String,
                max: 40,
            },
            rating: {
                type: Number,
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
    
},
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;