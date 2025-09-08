import { getAllUsers, getUserByLogin } from "../lib/db.js";
import { writeFile } from "fs/promises"
import bcrypt from "bcrypt"
 
class userAuthModel {
  async signup(user) {
    const users = await getAllUsers();
    users.push({ ...user, id: Date.now() });

    await writeFile("./lib/data.json", JSON.stringify(users));
  }

  async login(user) {
    const found = await getUserByLogin(user.login)
    if(!found || !await bcrypt.compare(user.password, found.password)) {
        throw new Error("wrong user credentials")
    }
  }
}

export default userAuthModel;
