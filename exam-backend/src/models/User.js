import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: [true, "username is busy"] },
    password: { type: String, required: true, minLength: [6, "password is too short"] },
    avatar: { type: String, default: "" },
    isPrivate: { type: Boolean, default: false },

    // DENORMALIZED VALUES
    followers: { type: Number, default: 0 },
    followings: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
})

userSchema.post('save', async (doc) => {
    console.log("OK")

})

export default model("User", userSchema)