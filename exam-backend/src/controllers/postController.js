import { Post, Comment } from "../models/index.js";

class PostController {
  async addPost(req, res) {
    const userId = req.user._id;
    const media = req.file?.filename;
    const { description } = req.body || {};

    if(!media) {
      return res.status(400).send({ message: "Missing fields"})
    }

    try {
      const post = await Post.create({
        media,
        description,
        userId
      })
      return res.status(201).send({ message: "Successfully created.", payload: {post} })
    } catch(err) {
      return res.status(500).send({ message: "Internal server error" })
    }
  }

  async addComment (req, res) {
    const userId = req.user._id;
    const postId = req.params.id
    
    const { text } = req.body || {}
    if(!text) return res.status(400).send({ message: "Write comment text please." })

    try {
      const comment = await Comment.create({
        text,
        userId,
        postId
      })

      await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

      return res.send({ message: "Ok",payload: {comment} })
    } catch(err) {
      return res.status(500).send({ message: "Internal server error"})
    }
  }

  async getPost (req, res) {
    const postId = req.params.id
    const post = await Post.findById(postId)
      .populate("comments", "_id text userId")
    
    if(!post) return res.status(404).send({ message: "Post not found." })
    
    res.send({ payload: {post} })
  }

  async deleteComment(req, res) {
    const userId = req.user._id;
    const commentId = req.params.id;

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).send({ message: "Comment not found." });
      }

      if (!comment.userId.equals(userId)) {
        return res.status(403).send({ message: "You can't delete other user's comment." });
      }

      await comment.deleteOne();
      await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: comment._id } });

      return res.send({ message: "Comment deleted successfully." });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

}

export default new PostController