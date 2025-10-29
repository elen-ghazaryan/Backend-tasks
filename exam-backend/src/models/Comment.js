import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  createdAt: {type: Date, default: new Date()}
})

export default mongoose.model('Comment', CommentSchema)