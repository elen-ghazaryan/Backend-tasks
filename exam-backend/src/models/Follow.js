import { Schema, model, Types } from 'mongoose'

const followSchema = new Schema({
    from: { type: Types.ObjectId, ref: "User" },
    to: { type: Types.ObjectId, ref: "User" },
    approved: { type: Boolean, default: true },
})


export default model("Follow", followSchema)