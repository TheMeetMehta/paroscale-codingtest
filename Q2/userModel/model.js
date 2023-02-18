const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true 
    },
    location:{
        type: {
            type: String,
            enum: ['Point'],
            reuired: true
        },
        coordinates: {
            type: [Number],
            reuired: true
        }
    }   
})

userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema)

module.exports = User;