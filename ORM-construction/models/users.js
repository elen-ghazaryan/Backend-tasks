import { BaseModel } from "./base.js"

class UserModel extends BaseModel {
  table = "users"
}

export default new UserModel()