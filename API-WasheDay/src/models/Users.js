import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        ref: 'Role',
        type: Schema.Types.ObjectId,
        required: true
    }]
}, {
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async(password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
};

export default model('User', userSchema);
