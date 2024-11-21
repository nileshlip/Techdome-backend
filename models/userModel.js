const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function () {
    const secret = process.env.SECRET || "fallback_secret";
    return jwt.sign({ id: this._id }, secret, { expiresIn: "7d" });
};

const User = mongoose.model("USER", userSchema);
module.exports = User;
