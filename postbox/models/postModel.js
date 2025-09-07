import { writeFile } from "fs/promises";
import { readAll } from "../lib/db.js";

class PostModel {
  async getPost(id) {
    const posts = await readAll();
    const found = posts.find((post) => post.id == id);
    return found;
  }

  async addCommentToPost(id, comment) {
    const posts = await readAll();
    const edited = posts.map((post) => {
      if (post.id == id) {
        const updatedPost = {
          ...post,
          comments: [...post.comments.map((c) => ({ ...c })), { ...comment }],
        };
        return updatedPost;
      }
      return post;
    });

    await writeFile("./lib/posts.json", JSON.stringify(edited));
  }

  async delete(id) {
    const posts = await readAll()
    const newPosts = posts.filter(post => post.id != id)

    await writeFile("./lib/posts.json", JSON.stringify(newPosts));
  }

  async edit(id, newPost) {
    const posts = await readAll();
    const edited = posts.map((post) => {
      if (post.id == id) {
        return {...post, title: newPost.title, content:newPost.content}
      }
      return post;
    });

    await writeFile("./lib/posts.json", JSON.stringify(edited));
  }
}

export default PostModel;
