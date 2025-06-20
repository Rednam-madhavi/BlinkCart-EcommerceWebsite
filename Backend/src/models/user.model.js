import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            requires: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            requires: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            requires: [true, 'Password is Required'],
        },
    },
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema);
