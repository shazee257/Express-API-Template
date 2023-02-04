const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const { sign } = require('jsonwebtoken');

const userSchema = new Schema({
    username: { type: String, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
},
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    if (!this._update.password) {
        next();
    }

    this._update.password = await bcrypt.hash(this._update.password, 10);
    next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateToken = function () {
    return sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        role: this.role
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

const UserModel = mongoose.model('User', userSchema);


// create new user
exports.createUser = (obj) => {
    const user = UserModel.create(obj);
    return user;
}

// find user
exports.findUser = (query) => {
    const user = UserModel.findOne(query);
    return user;
}

// update user
exports.updateUserById = (_id, obj) => {
    const user = UserModel.findByIdAndUpdate(_id, obj, { new: true });
    return user;
}

// get all users
exports.getUsers = () => {
    const users = UserModel.find();
    return users;
}



