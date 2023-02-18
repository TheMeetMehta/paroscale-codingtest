const express = require('express')
const app = express.Router();
const User = require('../userModel/model');

app.get('/health', async (req, res) => {
    res.status(200).json({ "status": "healthy" })
})

// Create a new user
app.post('/createuser', async (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        phone: req.body.phone,
        location: {
            type: "Point",
            coordinates: [req.body.longitude, req.body.latitude]
        }
    });
    try {
        const data = user.save()
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    };
});

// Get all users
app.get('/getallusers', async (req, res) => {
    try {
        const users = User.find()
        res.send(users);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    };
});

// Get users by location
app.get('/getnearbyuser', async (req, res) => { 
    try {
        const nearbyusers = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [req.query.longitude, req.query.latitude]
                    },
                    $maxDistance: req.query.distance // Distance in meters
                }
            }
        });
        res.send(nearbyusers); 
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        })
    }
})

// Get user By Partial Name
app.get('/getuserbypartialname/', async (req, res) => {
    const partialName = req.query.name;
    try {
        const users = await User.find({ name: { $regex: partialName, $options: 'i' } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by ID
app.get('/getuserbyid/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId)
    try {
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    } catch (err) {
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    }
})

// Update user by ID
app.patch('/updateuserbyid/:userId', async (req, res) => {
    const id = req.params.userId;
    const updates = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user by ID
app.delete('/deleteuserbyid/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({ message: "User deleted" });
    } catch (err) {
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    }
});

module.exports = app