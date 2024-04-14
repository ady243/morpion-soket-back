import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    validateToken: String,
    passwordHash: String,
    passwordSalt: String
}, { timestamps: true });

userSchema.methods.isActive = function() {
    return this.validateToken === null;
}

userSchema.methods.$formatJson = function(json) {
    json = this.toObject(json);
    delete json.passwordHash;
    delete json.passwordSalt;
    return json;
}

const User = mongoose.model('User', userSchema);

export default User;