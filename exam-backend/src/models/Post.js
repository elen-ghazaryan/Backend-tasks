import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  media: String,
  description: { type: String, default: ""},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment' 
  }],
  createdAt: {type: Date, default: new Date()}
})

export default mongoose.model('Post', postSchema)