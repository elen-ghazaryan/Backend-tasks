import PostModel from "../models/postModel.js";

class PostController {
  model = new PostModel();

  async findPost(req, res) {
    const id = req.params.id;
    const found = await this.model.getPost(id);

    if (!found) {
      return res.status(404).send({ message: "not found" });
    }
    res.render("post", { post: found });
  }

  addComment(req, res) {
    const id = req.params.id;
    try {
      this.model.addCommentToPost(id, req.body);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
    res.redirect(`/post/${id}`);
  }

  async deletePost(req, res) {
    const id = req.params.id
    try {
        await this.model.delete(id)
    } catch(err) {
        return res.status(500).send({message: err.message})
    }

    res.redirect("/");
  }

  async showEditPage(req, res) {
    const id = req.params.id
    const found = await this.model.getPost(id);

    res.render("edit", {post: found})
  }

  async editPost(req, res) {
    const id = req.params.id;
    try {
      await this.model.edit(id, req.body)
    } catch(err) {
      return res.status(err.status).send({message: err.message})
    }

    res.redirect(`/post/${id}`);
  }

}

export default new PostController();
